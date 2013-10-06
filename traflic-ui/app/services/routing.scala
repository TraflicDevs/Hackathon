package services

import java.util.{Map=>JMap, HashMap}

import org.geotools.data._

import org.geotools.factory.{CommonFactoryFinder, GeoTools}
import org.geotools.feature.{FeatureCollection, FeatureIterator}
import org.geotools.geometry.jts.JTS
import org.geotools.geometry.jts.Geometries
import org.geotools.geometry.jts.Geometries._
import org.geotools.geometry.jts.ReferencedEnvelope

import org.opengis.feature.Feature
import org.opengis.feature.simple._
import org.opengis.filter.{Filter,FilterFactory,FilterFactory2}
import org.opengis.filter.identity.Identifier
import org.opengis.filter.spatial.Intersects


import com.vividsolutions.jts.geom.{Envelope, MultiLineString, Coordinate, Geometry}
import com.vividsolutions.jts.linearref.{LocationIndexedLine, LinearLocation}

import models.Position
import services.CRS._


object Routing {

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


  def closestRoute(position:Position):Option[(SimpleFeature, Geometry, Double)] = {
    //wfs to the routes layer to get all route around (like 50m)
    val source =  connect(
                    "http://hackathon01.cblue.be:9053/geoserver/hackathon/wfs?request=GetCapabilities&service=WFS&version=1.1.0",
                    xs => xs.find(_ == "hackathon:routeswal")
                  )

    source.flatMap { case (typeName, source) =>
      val geomName = source.getSchema().getGeometryDescriptor().getLocalName()

      val center = position.toDirectPosition(EPSG_31370)
      val centerCoordinate = position.coordinate

      val buffer:ReferencedEnvelope = position.buffer(1000)(EPSG_31370)

      val ff:FilterFactory2 = CommonFactoryFinder.getFilterFactory2( GeoTools.getDefaultHints() )
      val polygon:Object = JTS.toGeometry( buffer )
      val filter:Intersects = ff.intersects( ff.property( geomName ), ff.literal( polygon ) )

      val query:Query = new Query( typeName, filter, Array[String](geomName) )
      val features:FeatureCollection[SimpleFeatureType, SimpleFeature] = source.getFeatures( query )

      val iterator:FeatureIterator[SimpleFeature] = features.features()
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

        fs.sortBy {
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