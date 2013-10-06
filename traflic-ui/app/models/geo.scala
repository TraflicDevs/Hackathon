package models

import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.libs.json.util._
import play.api.libs.json.Writes._
import play.api.libs.json.Reads._
import play.api.libs.json.Format._

import org.geotools.factory.Hints
import org.geotools.geometry.GeometryFactoryFinder
import org.geotools.geometry.jts.{JTS, ReferencedEnvelope}
import org.geotools.referencing.{CRS=>C}
import org.geotools.referencing.crs.DefaultGeographicCRS


import org.opengis.geometry.DirectPosition
import org.opengis.referencing.operation.MathTransform
import org.opengis.referencing.crs.CoordinateReferenceSystem

import com.vividsolutions.jts.geom.{Coordinate, Point}

trait ReferencedPoint {
  def lat:BigDecimal
  def lon:BigDecimal
  def crs:CoordinateReferenceSystem

  private[this] val hints:Hints = new Hints(Hints.CRS, this.crs)
  private[this] val positionFactory = GeometryFactoryFinder.getPositionFactory(hints)
  private[this] val arrayPoint = Array[Double](lon.toDouble, lat.toDouble)
  private[this] val direct = positionFactory.createDirectPosition(arrayPoint)

  def toDirectPosition(target:CoordinateReferenceSystem):DirectPosition = {
    if (!crs.equals(target)) {
      val transform:MathTransform = C.findMathTransform(crs, target);
      val p = JTS.transform(JTS.toGeometry(direct), transform);
      JTS.toDirectPosition(p.asInstanceOf[Point].getCoordinate() , target)
    } else {
      direct
    }
  }

  val point:Point = JTS.toGeometry(direct)
  val coordinate = new Coordinate(arrayPoint(0), arrayPoint(1))

  def buffer(delta:Double)(target:CoordinateReferenceSystem) = {
    val buffer:ReferencedEnvelope = new ReferencedEnvelope(target)
    buffer.expandToInclude(this.toDirectPosition(target))
    buffer.expandBy(delta)
    buffer
  }
}

case class Position(lat:BigDecimal, lon:BigDecimal, crs:CoordinateReferenceSystem) extends ReferencedPoint

case class Congestion(
  id:String,
  lat:BigDecimal,
  lon:BigDecimal,
  _type:String,
  distance:Double,
  desc:String,
  icon:String,
  duKm:Double,
  auKM:Double,
  crs:CoordinateReferenceSystem
) extends ReferencedPoint

object Congestion {
  val toD = (x:String) => x.toDouble
  val toS = (x:Double) => x.toString

  implicit val congFormat:Format[Congestion] = (
      (__ \ "Id").format[String] and
      (__ \ "Lat").format[BigDecimal] and
      (__ \ "Lon").format[BigDecimal] and
      (__ \ "Type").format[String] and
      (__ \ "Distance").format[String].inmap(toD, toS) and
      (__ \ "Desc").format[String] and
      (__ \ "Icon").format[String] and
      (__ \ "DuKm").format[String].inmap(toD, toS) and
      (__ \ "AuKM").format[String].inmap(toD, toS) and
      (__ \ "CRS").formatNullable[String].inmap(
                    (x:Option[String]) => x.map(c=>C.decode(c)).getOrElse(DefaultGeographicCRS.WGS84),
                    (x:CoordinateReferenceSystem)=>Some(x.getName.toString)
                  )
    )(Congestion.apply, unlift(Congestion.unapply))
}