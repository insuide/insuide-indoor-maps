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




x:any=0;
y:any=0;
z:any=1;


@Input()
indexMaxZoom:number=5;






@Input()
zoom:number=18;


@Input()
minZoom:number=16;

@Input()
maxZoom:number=22;

@Input()
vectorTileStyling:any=layerStyles;

// @Input()
// vectortileUrl:string="http://{s}.tile.osm.org/{z}/{x}/{y}.png";

@Input()
vectortileOptions:any={
			rendererFactory: L.canvas.tile,
			attribution: '<a href="https://openmaptiles.org/">&copy; OpenMapTiles</a>, <a href="http://www.openstreetmap.org/copyright">&copy; OpenStreetMap</a> contributors',
			vectorTileLayerStyles: this.vectorTileStyling,
			subdomains: '0123',
			key: 'UmmATPUongHdDmIicgs7'
};

@Input()
tilesUrl:string="http://mapwarper.net/maps/tile/21937/{z}/{x}/{y}.png"


@Input()
center:number[]= [47.4330331,19.261177];

drawnItems:any;		
		



@ViewChild('map') el:ElementRef;

  constructor() {}

  ngOnInit(){
  	
  	
   this.map = L.map('map').setView(this.center, this.zoom);

   L.tileLayer(this.tilesUrl, {
         minZoom: this.minZoom, maxZoom: this.maxZoom,
         attribution: 'Insuide Tiles from mapwarper'
     }).addTo(this.map);
  

      






}







}














