import { Component, OnInit, ViewEncapsulation, ElementRef ,ViewChild, NgModule, ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, Injector, NgZone, EventEmitter, Input} from '@angular/core';
import {} from '@types/leaflet';
import { layerStyles } from '../layerStyles';
import { geojson } from '../geojson';
//import { MarkerComponentComponent } from '../geojson-layer/marker-component/marker-component.component';



declare var L : any;
declare var jQuery: any;
declare var draw:any;
declare var geojsonvt:any;
// declare var tileIndex:any;


@Component({
  selector: 'app-geojson-layer',
  templateUrl: './geojson-layer.component.html',
  styleUrls: ['./geojson-layer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GeojsonLayerComponent implements OnInit {
map:any;
data:any;
layer:any;
lat:any;
lng:any;
myURL:any;


editing: boolean;
removing: boolean;
airportLayerAdded: boolean;
markerCount: number;


mapboxUrl:any;

mapboxAttribution:any;

littleton:any;
denver:any;
aurora:any;
golden:any;
features:any[];
slices:any[];




x:any;
y:any;
z:any;


@Input()
indexMaxZoom:number=5;






@Input()
zoom:number=14;


@Input()
minZoom:number=10;

@Input()
maxZoom:number=20;

@Input()
vectorTileStyling:any=layerStyles;

@Input()
vectortileUrl:string="https://free-{s}.tilehosting.com/data/v3/{z}/{x}/{y}.pbf.pict?key={key}";

@Input()
vectortileOptions:any={
			rendererFactory: L.canvas.tile,
			attribution: '<a href="https://openmaptiles.org/">&copy; OpenMapTiles</a>, <a href="http://www.openstreetmap.org/copyright">&copy; OpenStreetMap</a> contributors',
			vectorTileLayerStyles: this.vectorTileStyling,
			subdomains: '0123',
			key: 'UmmATPUongHdDmIicgs7'
};

@Input()
tilesUrl:string="http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"



center:number[]= [47.4384587,19.2501018];

		
		



@ViewChild('map') el:ElementRef;

  constructor() {}

  ngOnInit(){
  	//this.addStyles();
 	this.map = L.map(this.el.nativeElement).setView(this.center, this.zoom);
  this.map.options.minZoom = this.minZoom;
 	this.map.options.maxZoom = this.maxZoom;
 


	

	//L.vectorGrid.protobuf(this.tileUrl, this.tileOptions).addTo(this.map);

	var mapLayer = L.tileLayer(this.tilesUrl, {
		maxZoom: 18,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});
	mapLayer.addTo(this.map);
	
    var myLayer = L.geoJSON().addTo(this.map);
	myLayer.addData(geojson);


  let div = document.createElement('div');
  let marker = L.marker( [47.4384587,19.2501018] )
      .bindPopup('div.appendChild(markerRef.location.nativeElement)')
      .addTo( this.map );

  





var geoJsonDocument = {
    type: 'FeatureCollection',
    features: []
};
L.vectorGrid.slicer(geoJsonDocument, {
    vectorTileLayerStyles: {
        sliced: {}
    }
}).addTo(this.map);


   // build an initial index of tiles
   var tileIndex = geojsonvt(geojson);

   // request a particular tile
   var features = tileIndex.getTile(this.z, this.x, this.y).features;

   // show an array of tile coordinates created so far
   console.log(tileIndex.tileCoords); // [{z: 0, x: 0, y: 0}, ...]  


  var tileIndex = geojsonvt(this.data, {
  maxZoom: 18,  // max zoom to preserve detail on; can't be higher than 24
  tolerance: 3, // simplification tolerance (higher means simpler)
  extent: 4096, // tile extent (both width and height)
  buffer: 64,    // tile buffer on each side
  debug: 0,     // logging level (0 to disable, 1 or 2)
  indexMaxZoom: 5,       // max zoom in the initial tile index
  indexMaxPoints: 100000 // max number of points per tile in the index
});




//let markerRef:ComponentRef<MarkerComponentComponent>;
//var map = L.map('this.map').setView([47.4384587,19.2501018 ], 18);


//var myIcon = L.divIcon({className: 'marker-blk'});
// you can set .my-div-icon styles in CSS
//L.marker([47.4384587,19.2501018], {icon: myIcon}).addTo(this.map);



//var cities = L.layerGroup([this.littleton, this.denver, this.aurora, this.golden]);

//var grayscale = L.tileLayer(this.mapboxUrl, {id: 'MapID', attribution: this.mapboxAttribution}),
    //streets   = L.tileLayer(this.mapboxUrl, {id: 'MapID', attribution: this.mapboxAttribution});

//var map = L.map('this.map', {
    //center: [47.4384587,19.2501018],
   // zoom: 10,
    //layers: [grayscale, cities]
//});


//var baseMaps = {
    //"Grayscale": grayscale,
    //"Streets": streets
//};

//var overlayMaps = {
    //"Cities": cities
//};

//L.control.layers(baseMaps, overlayMaps).addTo(map);




}







}














