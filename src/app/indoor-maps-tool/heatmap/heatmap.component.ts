import { Component, OnInit,Input,ElementRef,EventEmitter,ViewChild,Output } from '@angular/core';

declare var L : any;
declare var jQuery: any;
@Component({
  selector: 'insuide-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit {
map:any;
@ViewChild('map') el:ElementRef;
@Input()
zoom:number=18;
@Input()
minZoom:number=16;
@Input()
maxZoom:number=22;
@Input()
tilesUrl:string="http://mapwarper.net/maps/tile/21921/{z}/{x}/{y}.png"
@Input()
heatPoints:any[] = [
	
[19.167758842328578,  72.85310078412296,0.2],
 [19.167758842328578, 72.85310078412296,0.3],
 [19.167758208950882,  72.85313565284015,1]
//  L.latLng( 19.167758208950882,  72.85313565284015),
//  L.latLng( 19.167756308817786,  72.85316884517671),
//  L.latLng( 19.167756308817786,  72.85316884517671),
//  L.latLng( 19.16771260575042,  72.85316817462446),
//  L.latLng( 19.16771260575042,  72.85316817462446),
//  L.latLng( 19.167662885579976,  72.85316716879608),
//  L.latLng( 19.167662885579976,  72.85316716879608),
//  L.latLng( 19.167614432151044,  72.8531661629677),
//  L.latLng( 19.167614432151044,  72.8531661629677),
//  L.latLng( 19.16758117978961,  72.85316549241543),
// L.latLng( 19.16758117978961,  72.85316549241543),
//  L.latLng( 19.16758054641123,  72.85313162952663),
// L.latLng(19.16758054641123,  72.85313162952663),
//  L.latLng( 19.167615065529287,  72.85313095897438),
//  L.latLng( 19.167615065529287,  72.85313095897438),
// L.latLng(19.16766510240318,  72.85313196480274),
//  L.latLng(19.16766510240318,  72.85313196480274),
//  L.latLng(19.167714505884025,  72.85313464701176),
//  L.latLng(19.167714505884025,  72.85313464701176)
]
@Input()
center:number[]= [19.167651, 72.853086];



  constructor() { }

  ngOnInit() {
  	if(!this.map){
  		this.map = L.map('map');
  }
  	this.mapInit();
  }
  mapInit(){
  	this.map.setView(this.center, this.zoom);
   //console.log("map set again");
 }
 setTileLayer(){
 	L.tileLayer(this.tilesUrl, {
         minZoom: this.minZoom, maxZoom: this.maxZoom,
         attribution: 'Insuide Tiles from mapwarper'
   }).addTo(this.map);
 }

setHeatMap(){
	// console.log("sss");
	// L.heatLayer(this.heatPoints, {radius: 6}).addTo(this.map);
  var heat = L.heatLayer(this.heatPoints, {radius: 25}).addTo(this.map);
}
	
  

  
  ngOnChanges(changes:any) {
    console.log("changes");
      if(!this.map){
          this.map = L.map('map');
      }
      if( changes['tilesUrl'] && changes['tilesUrl'].previousValue != changes['tilesUrl'].currentValue ) {
        this.setTileLayer();
      }
      if( changes['center'] && changes['center'].previousValue != changes['center'].currentValue ) {
        // tilesUrl prop changed
        this.mapInit();
        
      }
      if( changes['heatPoints'] && changes['heatPoints'].previousValue != changes['heatPoints'].currentValue ) {
        // tilesUrl prop changed
        this.setHeatMap();
        
      }

      if( changes['minZoom'] && changes['minZoom'].previousValue != changes['minZoom'].currentValue ) {
        // tilesUrl prop changed
        this.setTileLayer();
        
      }
      if( changes['maxZoom'] && changes['maxZoom'].previousValue != changes['maxZoom'].currentValue ) {
        // tilesUrl prop changed
        this.setTileLayer();
        
      }
      if( changes['zoom'] && changes['zoom'].previousValue != changes['zoom'].currentValue ) {
        // tilesUrl prop changed
        this.setTileLayer();
        
      }
      
  
    
 }

}
