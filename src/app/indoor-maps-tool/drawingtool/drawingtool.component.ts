import { Component, OnInit,Input,ElementRef,EventEmitter,ViewChild,Output } from '@angular/core';
import { UUID } from 'angular2-uuid';


declare var L : any;
declare var jQuery: any;
declare var draw:any;

@Component({
  selector: 'insuide-drawingtool',
  templateUrl: './drawingtool.component.html',
  styleUrls: ['./drawingtool.component.css']
  
})

export class DrawingtoolComponent implements OnInit {
map:any;
@ViewChild('map') el:ElementRef;
@Input()
zoom:number=18;
@Input()
minZoom:number=16;
@Input()
maxZoom:number=22;
@Input()
tilesUrl:string="http://mapwarper.net/maps/tile/21711/{z}/{x}/{y}.png"

@Input()
center:number[]= [19.167651, 72.853086];
drawnItems:any; 

@Input()
existingcircles:any[] = [];
initialized:boolean;
circles:any[] = [];

layers :any[] = [];

@Output()
oncircleadded:EventEmitter<any>             = new EventEmitter<any>();
@Output()
oncircledeleted:EventEmitter<any>             = new EventEmitter<any>();

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
   
   L.tileLayer(this.tilesUrl, {
         minZoom: this.minZoom, maxZoom: this.maxZoom,
         attribution: 'Insuide Tiles from mapwarper'
     }).addTo(this.map);
   if(!this.initialized){
     this.drawnItems = new L.FeatureGroup();
     this.map.addLayer(this.drawnItems);

     var drawControl = new L.Control.Draw({
  	  edit: {
  	    featureGroup: this.drawnItems
  	  }
  	});

    	this.map.addControl(drawControl);

    	this.map.on(L.Draw.Event.CREATED,  (e)=> {
    		  var type = e.layerType
    		  var layer = e.layer;
          console.log(layer._latlngs);
    		  // Do whatever else you need to. (save to db, add to map etc)
    		  console.log(type);
    		  
    		  
    		  if(type == 'circle'){
    		  	
    		  	console.log(layer._mRadius);
    		  	let circleObj = {};
    		  	circleObj['center'] = [layer._latlng.lat,layer._latlng.lng]
    		  	circleObj['radius'] = layer._mRadius;
    		  	circleObj['circle_id'] = UUID.UUID();

    		  	this.circles.push(circleObj);
    		  	this.oncircleadded.emit(circleObj);

    		  	//add event added
    		  	this.initCircles();

    		  }
    	});
}
this.initialized = true;
}
	
  removeAll(){
  	this.layers.forEach(layer=>{
  		this.map.removeLayer(layer);
  	})
  	this.layers = [];
  }
  initCircles(){
  	this.removeAll();
  	this.circles.forEach((circleObj,index)=>{
  		
  	  var circleLayer = L.circle(circleObj.center, {
          color: '#2196F3',
          fillColor: '#B0BEC5',
          fillOpacity: 0.3,
          radius: circleObj.radius
      })

  	  circleLayer.on('contextmenu', (e)=>{
  	  		L.DomEvent.stopPropagation(e);
	        var tdiv='Delete ?';
	        var tpopup = L.popup({closeButton:true})
	                    .setLatLng(e.latlng)
	                    .setContent(tdiv)
	                      .openOn(this.map);
	        tpopup._wrapper.addEventListener('click', ()=>{
	           
	           
	           this.map.removeLayer(circleLayer);
	           this.circles.splice(index,1);
	           this.map.closePopup();
	           this.oncircledeleted.emit(circleObj);
	           //add event deleted
	        });
  	  });

      this.map.addLayer(circleLayer);
      this.layers.push(circleLayer);

  	})
  }

  
  ngOnChanges(changes:any) {
    console.log("changes");
      if(!this.map){
          this.map = L.map('map');
      }
      if( changes['tilesUrl'] && changes['tilesUrl'].previousValue != changes['tilesUrl'].currentValue ) {
        // tilesUrl prop changed
        console.log("url changed");
        this.mapInit();
        
      }
      if( changes['center'] && changes['center'].previousValue != changes['center'].currentValue ) {
        // tilesUrl prop changed
        this.mapInit();
        
      }
      if( changes['minZoom'] && changes['minZoom'].previousValue != changes['minZoom'].currentValue ) {
        // tilesUrl prop changed
        this.mapInit();
        
      }
      if( changes['maxZoom'] && changes['maxZoom'].previousValue != changes['maxZoom'].currentValue ) {
        // tilesUrl prop changed
        this.mapInit();
        
      }
      if( changes['zoom'] && changes['zoom'].previousValue != changes['zoom'].currentValue ) {
        // tilesUrl prop changed
        this.mapInit();
        
      }
      if( changes['existingcircles'] && changes['existingcircles'].previousValue != changes['existingcircles'].currentValue ) {
        // existingMarkers prop changed
        this.circles = this.existingcircles;
        this.initCircles();
        console.log("circles changed");
        //this.initRoutes();

      }
  
    
 }

  
}
