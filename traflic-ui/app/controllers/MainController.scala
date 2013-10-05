package controllers

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

  def position() = Action { implicit request =>
    positionForm.bindFromRequest.fold(
      withErrors => BadRequest("missing data"),
      {
        case Position(lat, lon, crs) =>  Ok(Json.obj(
                                        ("lat", lat),
                                        ("lon", lon),
                                        ("crs", crs)
                                      ))
      }
    )
  }

}

case class Position(lat:BigDecimal, lon:BigDecimal, crs:String)
