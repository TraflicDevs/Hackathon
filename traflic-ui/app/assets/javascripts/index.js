$(function() {
  var map = window.map();


  OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
    defaultHandlerOptions: {
      'single': true,
      'double': false,
      'pixelTolerance': 0,
      'stopSingle': false,
      'stopDouble': false
    },

    initialize: function(options) {
      this.handlerOptions = OpenLayers.Util.extend(
        {}, this.defaultHandlerOptions
      );
      OpenLayers.Control.prototype.initialize.apply(
        this, arguments
      );
      this.handler = new OpenLayers.Handler.Click(
        this, {
          'click': this.trigger
        }, this.handlerOptions
      );
    },

    trigger: function(e) {
      var lonlat = map.getLonLatFromPixel(e.xy);
      $("#lat").val(lonlat.lat);
      $("#lon").val(lonlat.lon);
    }

  });

  var click = new OpenLayers.Control.Click();
  map.addControl(click);
  click.activate();

  var closestRoute = new OpenLayers.Layer.Vector();
  map.addLayer(closestRoute);

  $("#position").on("submit", function(e) {
    jsRoutes.controllers.MainController.position()
                                        .ajax({
                                          data:$("#position").serialize(),
                                          success: function(data) {
                                            if (data) {
                                              var geojson_format = new OpenLayers.Format.GeoJSON();
                                              closestRoute.removeAllFeatures()
                                              closestRoute.addFeatures(geojson_format.read(data));
                                            }
                                          }
                                        });
    e.preventDefault();
    e.stopImmediatePropagation();
  })

});