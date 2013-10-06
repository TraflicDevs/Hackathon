$(function() {
  var map = window.map();

  var me = new OpenLayers.Layer.Markers( "Me" );
  map.addLayer(me);
  var meSize = new OpenLayers.Size(20, 34);
  var meOffset = new OpenLayers.Pixel(-(meSize.w/2), -meSize.h);
  var meIcon = new OpenLayers.Icon('http://maps.google.com/mapfiles/marker_blackV.png', meSize, meOffset);

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
      var p = map.getLonLatFromPixel(e.xy);
      $("#lat").val(p.lat);
      $("#lon").val(p.lon);
      var ll = lonlat(p.lon, p.lat);
      me.clearMarkers();
      var marker = new OpenLayers.Marker(ll.ll,meIcon.clone());
      me.addMarker(marker);
      return true;
    }

  });

  var click = new OpenLayers.Control.Click();
  map.addControl(click);
  click.activate();

  var closestRoute = new OpenLayers.Layer.Vector("Closest",{
    styleMap: new OpenLayers.StyleMap({
        strokeWidth: 3,
        strokeColor: "#110000"
    })
  });

  map.addLayer(closestRoute);

  var markers = new OpenLayers.Layer.Markers( "Congestions" );
  map.addLayer(markers);
  var size = new OpenLayers.Size(32, 32);
  var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
  var icon = new OpenLayers.Icon('http://maps.google.com/intl/en_us/mapfiles/ms/micons/orange-dot.png', size, offset);

  $("#position").on("submit", function(e) {
    jsRoutes.controllers.MainController.position()
                                        .ajax({
                                          data:$("#position").serialize(),
                                          success: function(data) {
                                            if (data) {
                                              var geojson_format = new OpenLayers.Format.GeoJSON();
                                              closestRoute.removeAllFeatures()
                                              closestRoute.addFeatures(geojson_format.read(data.road));
                                              var cs = _.map(data.congestions, function(c) {
                                                return lonlat(c.Lon, c.Lat);
                                              });
                                              markers.clearMarkers();
                                              _.each(cs, function(ll) {
                                                var marker = new OpenLayers.Marker(ll.t,icon.clone());
                                                markers.addMarker(marker);
                                              });

                                              $("#msg").html("Il y a "+_.size(data.congestions)+" congestion(s) sur votre trajectoire et dans votre voisinage!")
                                            }
                                          }
                                        });
    e.preventDefault();
    e.stopImmediatePropagation();
  });
});