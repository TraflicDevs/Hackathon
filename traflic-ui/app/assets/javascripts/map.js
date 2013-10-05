function map() {
  Proj4js.defs["EPSG:31370"] = "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1 +units=m +no_defs";

  var maxExtent = new OpenLayers.Bounds(42000, 20000, 296000, 168000);
  var mapOptions = {
    maxExtent: maxExtent,
    //maxResolution: 0.25,
    projection: "EPSG:31370"
  };
  var map = new OpenLayers.Map( 'map', mapOptions );

  var format = 'image/png';

  var untiled = new OpenLayers.Layer.WMS(
              "routes",
              "http://hackathon01.cblue.be:9053/geoserver/hackathon/wfs",
              {
                  LAYERS: 'hackathon:routeswal',
                  STYLES: '',
                  format: format
              },
              {
                 singleTile: true,
                 ratio: 1,
                 isBaseLayer: true,
                 yx : {'EPSG:31370' : false}
              }
          );

  map.addLayer(untiled);

  //appeler /cams => json object
  var fromProjection = new OpenLayers.Projection("EPSG:4326");
  var toProjection   = new OpenLayers.Projection("EPSG:31370");
  //var position       = new OpenLayers.LonLat(5.80786845689777,49.5515447102412).transform( fromProjection, toProjection);

  var markers = new OpenLayers.Layer.Markers( "Markers" );
  map.addLayer(markers);
  var size = new OpenLayers.Size(21,25);
  var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
  var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);

  $.get("/cams").done(function(data) {
    var points = _.map(data, function(d) {
      var ll = new OpenLayers.LonLat(d.lon, d.lat);
      return {id:d.id, ll: ll, t: ll.clone().transform(fromProjection, toProjection), image: d.image};
    });
    var a;
    _.each(points, function(p) {
      var marker = new OpenLayers.Marker(p.t,icon.clone());
      var popup = new OpenLayers.Popup("Caméra",
                        p.t,
                        new OpenLayers.Size(200,200),
                        "Caméra<br><img src='"+p.image+"'/>",
                        true
                      );
      map.addPopup(popup);
      popup.hide();
      marker.events.register('click', marker, function(evt) {
        popup.show();
        //OpenLayers.Event.stop(evt);
      });
      markers.addMarker(marker);

      if (!a && p.id == 255) {
        map.setCenter(p.t, 5);
        a=true;
      }
    });

  });

  map.addControl( new OpenLayers.Control.MousePosition() );

  map.setCenter(maxExtent.getCenterLonLat(), 0);
  return map;
}