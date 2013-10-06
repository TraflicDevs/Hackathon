window.println = function(o) {
  console.dir(o);
};

Proj4js.defs["EPSG:31370"] = "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1 +units=m +no_defs";

//appeler /cams => json object
var fromProjection = new OpenLayers.Projection("EPSG:4326");
var toProjection   = new OpenLayers.Projection("EPSG:31370");

function lonlat(L, l) {
  var ll = new OpenLayers.LonLat(L, l);
  return {ll:ll, t:ll.clone().transform(fromProjection, toProjection)};
}