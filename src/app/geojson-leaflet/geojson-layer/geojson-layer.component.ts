import { Component, OnInit, ViewEncapsulation, ElementRef ,ViewChild, NgModule, ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, Injector, NgZone, EventEmitter, Input} from '@angular/core';
import {} from '@types/leaflet';
import { layerStyles } from '../layerStyles';
declare var L : any;
@Component({
  selector: 'app-geojson-layer',
  templateUrl: './geojson-layer.component.html',
  styleUrls: ['./geojson-layer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GeojsonLayerComponent implements OnInit {
map:any;

@Input()
zoom:number=14;


@Input()
minZoom:number=10;

@Input()
maxZoom:number=20;

@Input()
vectorTileStyling:any=layerStyles;

@Input()
tileUrl:string="https://free-{s}.tilehosting.com/data/v3/{z}/{x}/{y}.pbf.pict?key={key}";

@Input()
tileOptions:any={
			rendererFactory: L.canvas.tile,
			attribution: '<a href="https://openmaptiles.org/">&copy; OpenMapTiles</a>, <a href="http://www.openstreetmap.org/copyright">&copy; OpenStreetMap</a> contributors',
			vectorTileLayerStyles: this.vectorTileStyling,
			subdomains: '0123',
			key: 'UmmATPUongHdDmIicgs7'
};


esriStyle:any;
center:number[]= [19.1803053,72.8557949];

		// Monkey-patch some properties for mapzen layer names, because
		// instead of "building" the data layer is called "buildings" and so on
		



@ViewChild('map') el:ElementRef;

  constructor() { }

  ngOnInit(){
  	//this.addStyles();
 	this.map = L.map(this.el.nativeElement).setView(this.center, this.zoom);
 	this.map.options.minZoom = this.minZoom;
 	this.map.options.maxZoom = this.maxZoom;


	

	L.vectorGrid.protobuf(this.tileUrl, this.tileOptions).addTo(this.map);

	

	
}





}
