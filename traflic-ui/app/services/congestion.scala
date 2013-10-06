package services

import java.util.{Map=>JMap, HashMap}

import play.api.libs.ws.WS

import scala.concurrent.ExecutionContext.Implicits.global

import org.geotools.data._

import org.geotools.factory.{Hints, CommonFactoryFinder, GeoTools}
import org.geotools.feature.{FeatureCollection, FeatureIterator}
import org.geotools.geometry.{GeometryFactoryFinder}
import org.geotools.geometry.jts.JTS
import org.geotools.geometry.jts.Geometries
import org.geotools.geometry.jts.Geometries._
import org.geotools.geometry.jts.ReferencedEnvelope
import org.geotools.referencing.{CRS=>C}

import org.opengis.feature.Feature
import org.opengis.feature.simple._
import org.opengis.filter.{Filter,FilterFactory,FilterFactory2}
import org.opengis.filter.identity.Identifier
import org.opengis.filter.spatial.Intersects
import org.opengis.referencing.crs.CoordinateReferenceSystem

import com.vividsolutions.jts.geom.{Envelope, MultiLineString, Coordinate, Geometry}
import com.vividsolutions.jts.linearref.{LocationIndexedLine, LinearLocation}

import models.{Position, Congestion}
import models.Congestion._
import services.CRS._


object Congestions {

  def find(geometry:Geometry) = {
    all.map {
      case None => Nil
      case Some(congestions) =>
        val matched = congestions.filter { congestion =>
          val buffer = JTS.toGeometry(congestion.buffer(1000)(EPSG_31370))
          geometry.intersects(buffer)
        }
        matched
    }
  }

  def all = {
    WS.url("http://hackathon01.cblue.be:8088/traflic-api/congestion").get()
      .map{
        _.json.validate[Seq[Congestion]].fold(
          valid = xs => Some(xs),
          invalid= e => {
            println(e)
            None
          }
        )
      }

  }

}