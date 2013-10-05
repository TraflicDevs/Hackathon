package controllers

import java.io.StringWriter

import play.api.mvc.{Action, Controller}
import play.api.libs.json.Json
import play.api.Routes
import play.api.libs.json.{JsValue, Json, JsObject, JsArray}
import play.api.libs.ws.WS
import play.api.data.format.Formats._
import play.api.data.{Form, Mapping}
import play.api.data.Forms._

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

import org.geotools.geojson.feature.FeatureJSON

import models.Position

object MainController extends Controller {

  val bdNumber: Mapping[BigDecimal] = of[BigDecimal]

  val positionForm = Form(
    mapping(
      "lat" -> bdNumber,
      "lon" -> bdNumber,
      "crs" -> default(text, "EPSG:31370")
    )(Position.apply)(Position.unapply)
  )

  def index = Action {
    Ok(views.html.index("Traflic app", positionForm))
  }

  def cams = Action.async {
    for {
      list  <-  WS.url("http://trafiroutes.wallonie.be/trafiroutes/Rest/Resources/Cameras/").get()
                  .map(_.json.as[Seq[JsValue]])
      os    <-  Future.sequence(list.map(x => {
                      val lat = (x \ "lat").as[Double]
                      val lon = (x \ "lon").as[Double]
                      val id = (x \ "id").as[Int]
                      WS.url("http://trafiroutes.wallonie.be/trafiroutes/Rest/Resources/Cameras/"+id).get()
                        .map(i => Json.obj(("id", id), ("lat", lat), ("lon", lon), ("image",i.json.as[JsObject] \ "url")))
                    }
                  ))
    } yield {
      Ok(JsArray(os))
    }
  }

  val fjson:FeatureJSON = new FeatureJSON()
  def position() = Action { implicit request =>
    positionForm.bindFromRequest.fold(
      withErrors => BadRequest("missing data"),
      {
        case p@Position(lat, lon, crs) =>  {
          val c = services.Routing.closestRoute(p)
          c.map { case (feature, g, dist) =>
            val writer:StringWriter = new StringWriter()
            fjson.writeFeature(feature, writer)
            val json:String = writer.toString()
            val jsJson = Json.parse(json).as[JsObject]

            Ok(jsJson)
          }
          .getOrElse(
            BadRequest("Cannot find a route...")
          )

        }
      }
    )
  }
}