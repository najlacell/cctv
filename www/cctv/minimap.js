/*
	minimap.js
	-----------
	use Openlayers to display surveillance cctv camera on a OpenStreetMap map
	the data (cctv location) are stored in a text file (cctv.txt, utf-8)
	and are extracted from OSM raw data using a python script and XAPI interface
	
	OpenStreetMap : <http://openstreetmap.org/>
	OpenLayers : <http://openlayers.org/>
*/

// complex map object
var map;
 
// Start position for the map (get from URL params)
// or start zooming on France
var theArgs = getArgs();
var lat = theArgs.lat ? theArgs.lat : 46.88;
var lon = theArgs.lon ? theArgs.lon : 2.76;
var zoom = theArgs.zoom ? theArgs.zoom : 6;
		
function init(){
	// the map
    map = new OpenLayers.Map('map',
		{ 	maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
			numZoomLevels: 19,
			maxResolution: 156543.0399,
			units: 'm',
			projection: new OpenLayers.Projection("EPSG:900913"),
			displayProjection: new OpenLayers.Projection("EPSG:4326"),
		  	controls:[
					new OpenLayers.Control.Navigation(), // navigation option (enable mouse dragging)
					new OpenLayers.Control.PanZoom() // panzoom option (enable zooming)
				  ]
		});
 			
	// get map rendered layers (from OSM data : mapnik and tiles@Home)
	var layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
	map.addLayers([layerMapnik]);
 
	var lonLat = new OpenLayers.LonLat(lon, lat).transform(map.displayProjection,  map.projection);
	if (!map.getCenter()) map.setCenter (lonLat, zoom);
}

function setPosition(ll,lo,zo) {
	lat=ll;
	lon=lo;
	zoom=zo;
	var lonLat = new OpenLayers.LonLat(lon, lat).transform(map.displayProjection,  map.projection);
	if (!map.getCenter()) map.setCenter (lonLat, zoom);	
}
		
function getArgs() {
	var args = new Object();
	var query = location.search.substring(1);  // Get query string.
	var pairs = query.split("&");              // Break at ampersand. //+pjl

	for(var i = 0; i < pairs.length; i++) {
		var pos = pairs[i].indexOf('=');       // Look for "name=value".
		if (pos == -1) continue;               // If not found, skip.
		var argname = pairs[i].substring(0,pos);  // Extract the name.
		var value = pairs[i].substring(pos+1); // Extract the value.
		args[argname] = unescape(value);          // Store as a property.
	}
	return args;                               // Return the object.
}
