function map() {
  //Proj4js.defs["EPSG:31370"] = "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1 +units=m +no_defs";

  var maxExtent = new OpenLayers.Bounds(42000, 20000, 296000, 168000);
  var mapOptions = {
    maxExtent: maxExtent,
    //maxResolution: 0.25,
    projection: "EPSG:31370"
  };
  var map = new OpenLayers.Map( 'map', mapOptions );


  var base = new OpenLayers.Layer.WMS("Othor2010",
                                   "http://hackathon01.cblue.be:9053/geoserver/hackathon/wms",
                                   {
                                       layers: "hackathon:0",
                                       transparent: true
                                   }, {
                                       opacity: 1,
                                       singleTile: false,
                                      isBaseLayer: true
                                   });
  map.addLayer(base);

  var format = 'image/png';

  var communes = new OpenLayers.Layer.Vector("Communes", {
                minScale: 15000000,
                strategies: [new OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS({
                    url: "/geoserver/hackathon/wfs",
                    //url: "http://hackathon01.cblue.be:9053/geoserver/hackathon/wfs",
                    featureType: "communes_72",
                    featureNS: "http://opendata.awt.be"
                }),
                styleMap: new OpenLayers.StyleMap({
                    strokeWidth: 1,
                    opacity: 0.1,
                    strokeColor: "#EEEEEE",
                    fillColor: "transparent",
                    label : "${Name1}",
                    fontColor: "#EE0000"
                })
            });
  //map.addLayer(communes);

  var cantons = new OpenLayers.Layer.Vector("cantons", {
                minScale: 15000000,
                strategies: [new OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS({
                    url: "/geoserver/hackathon/wfs",
                    //url: "http://hackathon01.cblue.be:9053/geoserver/hackathon/wfs",
                    featureType: "cantons_72",
                    featureNS: "http://opendata.awt.be"
                }),
                styleMap: new OpenLayers.StyleMap({
                    strokeWidth: 1,
                    opacity: 0.1,
                    strokeColor: "#EEEEEE",
                    fillColor: "transparent",
                    label : "${Canton}",
                    fontSize: "10px",
                    fontColor: "#981309",
                    labelOutlineColor: "white",
                    labelOutlineWidth: 3
                })
            });
  map.addLayer(cantons);

  var routes = new OpenLayers.Layer.Vector("Routes", {
                minScale: 15000000,
                strategies: [new OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS({
                    url: "/geoserver/hackathon/wfs",
                    //url: "http://hackathon01.cblue.be:9053/geoserver/hackathon/wfs",
                    featureType: "routeswal",
                    featureNS: "http://opendata.awt.be"
                }),
                styleMap: new OpenLayers.StyleMap({
                    strokeWidth: 1,
                    strokeColor: "#99AA44"
                })
            });
  map.addLayer(routes);

  function addM(url, icon, label, zi, getData) {
    var markers = new OpenLayers.Layer.Markers( "Markers"+label );
    map.addLayer(markers);
    var size = new OpenLayers.Size(21,25);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    var icon = new OpenLayers.Icon(icon, size, offset);

    $.get(url).done(function(data) {
      var points = _.map(data, function(d) {
        var ll = lonlat(d.lon, d.lat);
        //var ll = new OpenLayers.LonLat(d.lon, d.lat);
        return {id:d.id, ll: ll.ll, t: ll.t, data: getData(d)};
      });
      _.each(points, function(p) {
        var marker = new OpenLayers.Marker(p.t,icon.clone());
        var popup = new OpenLayers.Popup(label,
                          p.t,
                          new OpenLayers.Size(200,200),
                          label+"<br/>",
                          true
                        );
        popup.data = p.data;
        map.addPopup(popup);
        popup.hide();
        marker.events.register('click', marker, function(evt) {
          if (popup.data) {
            $(popup.div).find(".olPopupContent").append($(popup.data));
            delete popup.data;
          }
          popup.show();
        });
        markers.addMarker(marker);
      });
    });
    markers.setZIndex(zi);
  };
  addM("/cams", 'http://www.openlayers.org/dev/img/marker.png', "Caméra", 701, function(d) {return "<img src='"+d.image+"'>";});
  addM("/panels", 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png', "Panneau", 702, function(d) {return "<strong>"+d.label+"</strong>";});

  map.addControl( new OpenLayers.Control.MousePosition());

  map.setCenter(maxExtent.getCenterLonLat(), 2);
  return map;
}