import { Component, OnInit, ViewEncapsulation, ElementRef ,ViewChild, HostListener,NgModule, ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, Injector, NgZone, EventEmitter, Input , Output} from '@angular/core';
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


editing: boolean=true;
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
MouseEffect:boolean;

@Input()
center:number[]= [47.4330331,19.261177];

@Output()
polylineclicked:EventEmitter<any> = new EventEmitter<any>(); 

@Output()
onsave:EventEmitter<any>          = new EventEmitter<any>(); 

drawnItems:any;		
		
polyline:any;

markers:any[]=[];
polyIndexMap:any={};
drawPolyLine:any;


// @HostListener('mousemove', ['$event'])
//     onMousemove(event: MouseEvent) {
        
//               console.log(event.clientX); 
//               console.log(event.clientY); 
           
//     }
   
@ViewChild('map') el:ElementRef;

  constructor() {}

  ngOnInit(){
  	
    
   this.map = L.map('map').setView(this.center, this.zoom);
   
   L.tileLayer(this.tilesUrl, {
         minZoom: this.minZoom, maxZoom: this.maxZoom,
         attribution: 'Insuide Tiles from mapwarper'
     }).addTo(this.map);
  
    this.polyline = L.polyline([], {
      color: '#BB6BD9',
      clickable: 'true'
    }).addTo(this.map);

    this.drawPolyLine = L.polyline([], {
      color: 'blue',
      dashArray: '20,15',
      opacity:.7,
      clickable: 'true'
    }).addTo(this.map);

    this.initiateDrawing();
    this.listenPolyLineClick();

    this.map.on('mousemove',(e)=>{
      if(this.drawPolyLine.getLatLngs().length > 0 && this.editing){
        //console.log(e.latlng);
        this.drawPolyLine.getLatLngs().splice(1, 1, e.latlng);
        this.drawPolyLine.redraw();
      }
    })



}




listenPolyLineClick(){
  this.polyline.on('click',e=>{
      L.DomEvent.stopPropagation(e);
      this.polylineclicked.emit(this.polyline);
      
  })
}

initiateDrawing(){
  this.polyIndexMap = {};
  this.map.on('click', (e)=> {
      var marker = this.addMarkerAndDraw(e);
  });

}

addMarkerAndDraw(e){
    if(!this.editing){
      return
    }
    console.log("adding");
    var markerIcon = L.icon({
            iconUrl: '/assets/waypoints_marker.png',
            iconSize: [12, 12], // size of the icon
            iconAnchor: [6, 6], // point of the icon which will correspond to marker's location
            
    });
    var marker = new L.Marker(e.latlng,{
          clickable: true,
          draggable: true,
          icon: markerIcon,
         
    });
    this.map.addLayer(marker);
    this.markers.push(marker);



    
    var subIndex = this.polyline.getLatLngs().length;
    
    //add latlng to end of the polyline and redraw polyline
    this.polyline.addLatLng(marker.getLatLng())
    
    this.drawPolyLine.getLatLngs().splice(0, 2);
    

    this.drawPolyLine.addLatLng(marker.getLatLng())
    
    this.drawPolyLine.redraw();
    marker._polylineIndex = subIndex;
    this.polyline.redraw();
    let self = this;
    marker.on('dragend', function(e) {
        //change position of current marker and redraw polyline
        self.polyline.getLatLngs().splice(this._polylineIndex, 1, this.getLatLng());
        
        //change positions of markers where markers were clicked to add a polyline
        if(self.polyIndexMap[this._polylineIndex]){
          self.polyIndexMap[this._polylineIndex].forEach(index=>{
              self.polyline.getLatLngs().splice(index, 1, this.getLatLng());
          })
        }

        // Redraw polyline!
        self.polyline.redraw();
    })

    marker.on('click',function(e){
      if(!self.editing){
          return
      }
      //disable propogation of click to map so that marker click can also be accounted into adding a polyline
      L.DomEvent.stopPropagation(e);
      var length = self.polyline.getLatLngs().length;

      //create a check list for duplicates so that thier positions can also be changed in polylines
      if(!self.polyIndexMap[this._polylineIndex]){
        self.polyIndexMap[this._polylineIndex] = [length];
      }else{
        self.polyIndexMap[this._polylineIndex] = self.polyIndexMap[this._polylineIndex].push(length);
      }
      
      self.polyline.addLatLng(this.getLatLng());
      self.polyline.redraw();

      
      self.drawPolyLine.getLatLngs().splice(0, 2);
      
      self.drawPolyLine.addLatLng(this.getLatLng());
      
      self.drawPolyLine.redraw();

    })
    return marker;
}
  


changeEditMode() {
        this.editing = !this.editing;
        if(!this.editing){
          this.drawPolyLine.getLatLngs().splice(0, 2);
          this.drawPolyLine.redraw();
        }
}

getCSSClasses() {
    console.log("12345")
       if(!this.editing) {  
           return "effectOne"
 }

return "effectTwo"


} 

removeLastAdded(){
  //Set new params for already drawn polyline and markers
  var length    = this.polyline.getLatLngs().length
  let latlng    = this.polyline.getLatLngs()[length-1]
  this.polyline.getLatLngs().splice(length-1, 1);
  this.polyline.redraw();
  let marker;
  
  this.markers.forEach(mark=>{
    
    if(mark.getLatLng() == latlng){
      marker = mark;

    }
  })

  if(marker){
    let _polylineIndex  = marker._polylineIndex;

    if(!this.polyIndexMap[_polylineIndex] || this.polyIndexMap[_polylineIndex].length == 0){
      this.markers.splice(this.markers.length-1,1);
      if(marker){
        this.map.removeLayer(marker);
      }
    }else{
      let array    = this.polyIndexMap[_polylineIndex];
      let index    =  array.indexOf(length)
      array.splice(index,1);
      this.polyIndexMap[_polylineIndex] = array;
    }  
  }
  //Set draw polyline params
   this.drawPolyLine.getLatLngs().splice(0, 2);
   
   if(this.polyline.getLatLngs().length > 0){
     this.drawPolyLine.addLatLng(this.polyline.getLatLngs()[this.polyline.getLatLngs().length-1]);
   }
   this.drawPolyLine.redraw();
}

onSaveLine(){
  this.onsave.emit(this.polyline);
  this.editing = false;
  this.drawPolyLine.getLatLngs().splice(0, 2);
  this.drawPolyLine.redraw();
}



}














