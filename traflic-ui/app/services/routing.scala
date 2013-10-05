package services

import java.util.{Map=>JMap, HashMap}

import org.geotools.data._

import org.geotools.factory.{Hints, CommonFactoryFinder, GeoTools}
import org.geotools.feature.{FeatureCollection, FeatureIterator}
import org.geotools.geometry.{GeometryFactoryFinder}
import org.geotools.geometry.jts.JTS
import org.geotools.geometry.jts.Geometries
import org.geotools.geometry.jts.Geometries._
import org.geotools.geometry.jts.ReferencedEnvelope
import org.geotools.referencing.{CRS, ReferencingFactoryFinder}

import org.opengis.feature.Feature
import org.opengis.feature.simple._
import org.opengis.filter.{Filter,FilterFactory,FilterFactory2}
import org.opengis.filter.identity.Identifier
import org.opengis.filter.spatial.Intersects


import com.vividsolutions.jts.geom.{Envelope, MultiLineString, Coordinate, Geometry}
import com.vividsolutions.jts.linearref.{LocationIndexedLine, LinearLocation}

import models.Position

object Routing {
  val EPSG_31370 = CRS.parseWKT("""
      PROJCS["Belge 1972 / Belgian Lambert 72",GEOGCS["Belge 1972",DATUM["Reseau_National_Belge_1972",SPHEROID["International 1924",6378388,297,AUTHORITY["EPSG","7022"]],TOWGS84[106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1],AUTHORITY["EPSG","6313"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4313"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",51.16666723333333],PARAMETER["standard_parallel_2",49.8333339],PARAMETER["latitude_of_origin",90],PARAMETER["central_meridian",4.367486666666666],PARAMETER["false_easting",150000.013],PARAMETER["false_northing",5400088.438],AUTHORITY["EPSG","31370"],AXIS["X",EAST],AXIS["Y",NORTH]]
    """.trim);

  def connect(capa:String, findTypeName:Seq[String]=>Option[String]):Option[(String, FeatureSource[SimpleFeatureType, SimpleFeature])] = {
    val connectionParameters  = new HashMap[String, String]()
    connectionParameters.put("WFSDataStoreFactory:GET_CAPABILITIES_URL", capa )

    val data = DataStoreFinder.getDataStore( connectionParameters )

    val typeNames = data.getTypeNames()
    val typeName = findTypeName(typeNames)
    typeName.map { typeName =>
        val schema:SimpleFeatureType = data.getSchema( typeName )
        val source:FeatureSource[SimpleFeatureType, SimpleFeature] = data.getFeatureSource( typeName )
        (typeName, source)
    }
  }

  def fiToStream[T<:Feature](i:FeatureIterator[T]):Stream[T] = i.hasNext match {
    case true => Stream.cons(i.next, fiToStream(i))
    case false => Stream.empty
  }


  def closestRoute(position:Position) = {
    //wfs to the routes layer to get all route around (like 50m)
    val source =  connect(
                    "http://hackathon01.cblue.be:9053/geoserver/hackathon/wfs?request=GetCapabilities&service=WFS&version=1.1.0",
                    xs => xs.find(_ == "hackathon:routeswal")
                  )

    source.flatMap { case (typeName, source) =>
      val geomName = source.getSchema().getGeometryDescriptor().getLocalName()

      val hints:Hints = new Hints( Hints.CRS, EPSG_31370 )
      val positionFactory = GeometryFactoryFinder.getPositionFactory( hints )

      val arrayPoint = Array[Double](position.lon.toDouble, position.lat.toDouble)
      val center = positionFactory.createDirectPosition(arrayPoint)
      val centerCoordinate = new Coordinate(arrayPoint(0), arrayPoint(1))

      val delta = 500

      val upperLeft = positionFactory.createDirectPosition( Array(arrayPoint(0)-delta, arrayPoint(1)-delta))
      val bottomRight = positionFactory.createDirectPosition( Array(arrayPoint(0)+delta, arrayPoint(1)+delta))

      val buffer:ReferencedEnvelope = new ReferencedEnvelope(EPSG_31370)
      buffer.expandToInclude(center)
      buffer.expandBy(delta)

      val ff:FilterFactory2 = CommonFactoryFinder.getFilterFactory2( GeoTools.getDefaultHints() )
      val polygon:Object = JTS.toGeometry( buffer )
      val filter:Intersects = ff.intersects( ff.property( geomName ), ff.literal( polygon ) )

      val query:Query = new Query( typeName, filter, Array[String](geomName) )
      val features:FeatureCollection[SimpleFeatureType, SimpleFeature] = source.getFeatures( query )

      val iterator:FeatureIterator[SimpleFeature] = features.features()
      //val bounds:ReferencedEnvelope = new ReferencedEnvelope()
      try {
        val fs = fiToStream(iterator).map { feature =>
          val geom = feature.getAttribute(geomName).asInstanceOf[Geometry]
          val geomType = Geometries.get(geom);
          geomType match {
            case x if x == POLYGON || x== MULTIPOLYGON => None
            case x if x == LINESTRING || x== MULTILINESTRING => {
              val multi = geom.asInstanceOf[MultiLineString]
              val env = multi.getEnvelopeInternal()
              if (!env.isNull()) {
                val indexed = new LocationIndexedLine(geom)
                val here:LinearLocation = indexed.project(centerCoordinate)
                val point:Coordinate = indexed.extractPoint(here)
                val dist:Double = point.distance(centerCoordinate)
                Some((feature, geom, dist))
              } else {
                None
              }

            }
            case x if x == POINT || x== MULTIPOINT => None
            case x => None
           }
        }
        .collect {
          case Some(x) => x
        }

        fs
          .sortBy {
            case x => x._3
          }
          .headOption
      }
      finally {
        iterator.close()
      }
    }
  }

}