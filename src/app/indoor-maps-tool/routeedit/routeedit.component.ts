import { Component, OnInit,Input,ElementRef,EventEmitter,ViewChild,Output } from '@angular/core';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import {} from '@types/leaflet';
import { layerStyles } from '../layerStyles';
//import { geojson } from '../geojson';
import { UUID } from 'angular2-uuid';


declare var L : any;
declare var jQuery: any;
declare var draw:any;
//declare var geojsonvt:any;
@Component({
  selector: 'insuide-routeedit',
  templateUrl: './routeedit.component.html',
  styleUrls: ['./routeedit.component.css']
})
export class RouteeditComponent implements OnInit {

map:any;





editing: boolean=true;
splicing:boolean = false;

















@Input()
zoom:number=18;


@Input()
minZoom:number=16;

@Input()
maxZoom:number=22;

// @Input()
// vectorTileStyling:any=layerStyles;



// @Input()
// vectortileOptions:any={
// 			rendererFactory: L.canvas.tile,
// 			attribution: '<a href="https://openmaptiles.org/">&copy; OpenMapTiles</a>, <a href="http://www.openstreetmap.org/copyright">&copy; OpenStreetMap</a> contributors',
// 			vectorTileLayerStyles: this.vectorTileStyling,
// 			subdomains: '0123',
// 			key: 'UmmATPUongHdDmIicgs7'
// };

@Input()
tilesUrl:string="http://mapwarper.net/maps/tile/21711/{z}/{x}/{y}.png"


@Input()
center:number[]= [19.167651, 72.853086];



@Output()
onmarkerchanged:EventEmitter<any>  = new EventEmitter<any>();
@Output()
onroutechanged:EventEmitter<any>           = new EventEmitter<any>(); 
@Output()
onmarkerdeleted:EventEmitter<any>          = new EventEmitter<any>(); 
@Output()
onroutedeleted:EventEmitter<any>           = new EventEmitter<any>();
@Output()
onmarkeradded:EventEmitter<any>            = new EventEmitter<any>();
@Output()
onrouteadded:EventEmitter<any>             = new EventEmitter<any>();
@Output()
onmarkerclicked:EventEmitter<any>             = new EventEmitter<any>();
@Output()
onEditModeChanged:EventEmitter<any>             = new EventEmitter<any>();




drawnItems:any;		
		
polyline:any;

markers:any[]=[];
polyIndexMap:any={};
drawPolyLine:any;
polyLineMap:any={};
draggedKey:string;
existingMarkersMap:any={};





savedPolylines:any[]=[];
@Input()
existingMarkers:any[] =[];
@Input()
existingRoutes:any[]=[];




routeMarkerMap:any = {};

polyLines = [];

initialized:boolean;
addedMarkers:any[]=[];
   
@ViewChild('map') el:ElementRef;

  constructor() {}

  ngOnInit(){
    if(!this.map){
      this.map = L.map('map');
      
    }
  	this.mapInit();
 }
 mapInit(){
   
    this.setMapData();
    this.setPolyLines();
    this.initMarkers();
    this.initRoutes();
    if(!this.initialized){
      this.initiateDrawing();
      this.map.on('mousemove',(e)=>{
        if(this.drawPolyLine.getLatLngs().length > 0 && this.editing){
          this.drawPolyLine.getLatLngs().splice(1, 1, e.latlng);
          this.drawPolyLine.redraw();
        }
      })
      this.initialized = true;
    }
 }

 setMapData(){
   this.map.setView(this.center, this.zoom);
   console.log("map set again");
   
   L.tileLayer(this.tilesUrl, {
         minZoom: this.minZoom, maxZoom: this.maxZoom,
         attribution: 'Insuide Tiles from mapwarper'
     }).addTo(this.map);
 }

 setPolyLines(){
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

 }

 removeAllMarkers(){
   this.existingMarkersMap = {};
   this.addedMarkers.forEach(marker=>{
     this.map.removeLayer(marker);
   })
   this.markers.forEach(marker=>{
     this.map.removeLayer(marker);
   })
   
   this.addedMarkers = [];
   this.markers = [];
 }

ngOnChanges(changes: any) {
  if(!this.map){
      this.map = L.map('map');
  }
  if( changes['tilesUrl'] && changes['tilesUrl'].previousValue != changes['tilesUrl'].currentValue ) {
    // tilesUrl prop changed
    this.setMapData();
    
  }
  if( changes['center'] && changes['center'].previousValue != changes['center'].currentValue ) {
    // tilesUrl prop changed
    this.setMapData();
    
  }
  if( changes['minZoom'] && changes['minZoom'].previousValue != changes['minZoom'].currentValue ) {
    // tilesUrl prop changed
    this.setMapData();
    
  }
  if( changes['maxZoom'] && changes['maxZoom'].previousValue != changes['maxZoom'].currentValue ) {
    // tilesUrl prop changed
    this.setMapData();
    
  }
  if( changes['zoom'] && changes['zoom'].previousValue != changes['zoom'].currentValue ) {
    // tilesUrl prop changed
    this.setMapData();
    this.setPolyLines();
  }
  if( changes['existingMarkers'] && changes['existingMarkers'].previousValue != changes['existingMarkers'].currentValue ) {
    // existingMarkers prop changed
    this.initMarkers();
    //this.initRoutes();

  }
  if( changes['existingRoutes'] && changes['existingRoutes'].previousValue != changes['existingRoutes'].currentValue ) {
    // existingRoutes prop changed
    //this.initMarkers();
    this.initRoutes();

  }

  // if( changes['editing'] && changes['editing'].previousValue != changes['editing'].currentValue ) {
  //     this.onEditModeChanged.emit(changes['editing'].currentValue);
  // }
    
 }
 // ngDoCheck() {
 //   console.log("check called");
 // };








initiateDrawing(){
  this.polyIndexMap = {};
  this.map.on('click', (e)=> {
      var marker = this.addMarkerAndDraw(e);
  });

}

initMarkers(){
  this.removeAllMarkers();
  this.existingMarkers.forEach((marker)=>{

    
    
    var keysLength = 1+Object.keys(this.existingMarkersMap).length;
    
    //var keys   =  this.existingMarkersMap.keys.length;
    var new_marker = {};
    if(marker.marker_id){
      new_marker['marker_id'] = marker.marker_id;
    }else{
      new_marker['marker_id'] = UUID.UUID();
    }
    if(marker.name){
      new_marker['name']      = marker.name;
    }else{
      new_marker['name']      = "A-"+keysLength;
    }
    
    new_marker['lat']       = marker.lat;
    new_marker['lng']       = marker.lng;
    // new_marker
    var key = marker.lat +"-"+marker.lng;
    if(!this.existingMarkersMap[key]){
      this.addSingleMarker(new_marker);
      //this.onmarkeradded.emit(new_marker);
      this.existingMarkersMap[key] = new_marker;
    }


  });
}


initRoutes(){
  //this.removeAllMarkers();
  this.polyLines.forEach(polyline=>{
    this.map.removeLayer(polyline);
  });
  this.savedPolylines = [];
  this.existingRoutes.forEach((polyLineObj)=>{

      let polyline =  L.polyline([[polyLineObj.from_point_lat, polyLineObj.from_point_lng],[polyLineObj.to_point_lat, polyLineObj.to_point_lng]], {
        color: '#00897B',
        clickable: 'true'
      })
      //this.onrouteadded.emit(polylineObj);
      polyline.polyline_id = polyLineObj.line_id;
      if(this.routeMarkerMap[polyLineObj['from_point_marker_id']]){
         this.routeMarkerMap[polyLineObj['from_point_marker_id']].push(polyLineObj);
         
       }else{
         this.routeMarkerMap[polyLineObj['from_point_marker_id']] = [];
         this.routeMarkerMap[polyLineObj['from_point_marker_id']].push(polyLineObj);
         
       }


       if(this.routeMarkerMap[polyLineObj['to_point_marker_id']]){
         this.routeMarkerMap[polyLineObj['to_point_marker_id']].push(polyLineObj);
         
       }else{
         this.routeMarkerMap[polyLineObj['to_point_marker_id']] = [];
         this.routeMarkerMap[polyLineObj['to_point_marker_id']].push(polyLineObj);
         
       }

      polyline.on('contextmenu', (e)=>{
        //console.log("right click");
        L.DomEvent.stopPropagation(e);
        var tdiv='Delete ?';
        var tpopup = L.popup({closeButton:true})
                    .setLatLng(e.latlng)
                    .setContent(tdiv)
                      .openOn(this.map);
        tpopup._wrapper.addEventListener('click', ()=>{
           //console.log("delete");
           this.onroutedeleted.emit(polyLineObj);
           this.map.removeLayer(polyline);
          this.map.closePopup();
        });
        
      });
      
      polyline.on('click', (e)=>{

          if(this.splicing){
          // console.log(e.latlng);
          // console.log(polyline);
          /*
            Removing the current added polyline and adding new
          */
          let frompolyObjs = this.routeMarkerMap[polyLineObj['from_point_marker_id']];
          //let topolyObjs = this.routeMarkerMap[polyLineObj['to_point_marker_id']];
          //let commonPolyLines = [];
          frompolyObjs.forEach(left=>{
            if(left.line_id == polyLineObj.line_id){
                  let index = this.savedPolylines.indexOf(left);
                  this.savedPolylines.splice(index,1);
                  this.onroutedeleted.emit(left);
              }else if(left.from_point_marker_id == polyLineObj.to_point_marker_id && left.to_point_marker_id == polyLineObj.from_point_marker_id){
                  let index = this.savedPolylines.indexOf(left);
                  this.savedPolylines.splice(index,1);
                  this.onroutedeleted.emit(left);
              }
          })
          // topolyObjs.forEach(right=>{
          //     if(right.line_id == polyLineObj.line_id){
          //         let index = this.savedPolylines.indexOf(right);
          //         this.savedPolylines.splice(index,1);
          //         this.onroutedeleted.emit(right);
          //     }else if(right.from_point_marker_id == polyLineObj.to_point_marker_id && right.to_point_marker_id == polyLineObj.from_point_marker_id){
          //         let index = this.savedPolylines.indexOf(right);
          //         this.savedPolylines.splice(index,1);
          //         this.onroutedeleted.emit(right);
          //     }
          //   })
          //add marker
          this.addMarkerSplit(e.latlng);
          //add two routes to left point
          this.addSavedSplit(new L.latLng(polyLineObj.from_point_lat, polyLineObj.from_point_lng),e.latlng)
          //add two routes to right
          this.addSavedSplit(e.latlng,new L.latLng(polyLineObj.to_point_lat, polyLineObj.to_point_lng))
          //redraw every polyline
          this.redrawSaved();
        }
        
      });
      
      polyline.addTo(this.map);
      this.polyLines.push(polyline);
      this.savedPolylines.push(polyLineObj);

  })
  //this.redrawAll();

}



addMarkerAndDraw(e){
    if(!this.editing){
      // var length    = this.polyline.getLatLngs().length;
      // this.polyline.splice(0,length-1);
      // this.drawPolyLine.splice(0,2);
      //this.editing = false;
      return;
    }
    
    // var markerIcon = L.icon({
    //         iconUrl: '/assets/waypoints_marker.png',
    //         iconSize: [12, 12], // size of the icon
    //         iconAnchor: [6, 6], // point of the icon which will correspond to marker's location
            
    // });
    var name = "pending "+this.polyline.getLatLngs().length;
    var markerIcon = new L.DivIcon({
        className: 'my-div-icon',
        html: '<img class="my-div-image" src="/assets/waypoints_marker.png"'+
              '<span class="my-div-span">'+name+'</span>'
    })

    
    var marker = new L.Marker(e.latlng,{
          clickable: true,
          draggable: true,
          icon: markerIcon,
         
    });
    marker.marker_id = UUID.UUID();
    marker.name      = name;
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
    // let map_copy = this.map
    // marker.on('contextmenu', function(e) {
    //   L.DomEvent.stopPropagation(e);
    //   var tdiv='Delete ? '+marker.marker_id;
    //   var tpopup = L.popup({closeButton:true})
    //                 .setLatLng(e.latlng)
    //                 .setContent(tdiv)
    //                 .openOn(map_copy);
    //   tpopup._wrapper.addEventListener('click', ()=>{
    //      //console.log("delete");
    //      map_copy.removeLayer(marker);
    //     map_copy.closePopup();
    //   });
    // });
    return marker;
}
  


changeEditMode() {
        this.editing = !this.editing;
        if(!this.editing){
          this.drawPolyLine.getLatLngs().splice(0, 2);
          this.drawPolyLine.redraw();
        }
        this.onEditModeChanged.emit(this.editing);
}

getCSSClasses() {
    
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
    console.log(_polylineIndex);
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
  //throw new Error("test");
  
  this.editing = false;
  this.drawPolyLine.getLatLngs().splice(0, 2);
  this.drawPolyLine.redraw();
  this.rearrangeMarkers();
  this.markers = [];
  this.addSaved();
  var length = this.polyline.getLatLngs().length;
  this.polyline.getLatLngs().splice(0,length);
  //this.existing
  
  this.polyIndexMap ={};
  
  this.polyline.redraw();
  this.redrawSaved();
  

}

rearrangeMarkers(){

  this.markers.forEach((marker)=>{

    var latlng = marker.getLatLng();
    this.map.removeLayer(marker);
    
    var keysLength = 1+Object.keys(this.existingMarkersMap).length;
    
    //var keys   =  this.existingMarkersMap.keys.length;
    var new_marker = {};
    new_marker['marker_id'] = marker.marker_id;
    new_marker['name']      = "A-"+keysLength;
    new_marker['lat']       = latlng.lat;
    new_marker['lng']       = latlng.lng;
    // new_marker
    var key = latlng.lat +"-"+latlng.lng;
    if(!this.existingMarkersMap[key]){
      this.addSingleMarker(new_marker);
      this.onmarkeradded.emit(new_marker);
      this.existingMarkersMap[key] = new_marker;
    }


  });
}

addSingleMarker(markerObj){
  var name = markerObj.name;
  var self = this;
    var markerIcon = new L.DivIcon({
        className: 'my-div-icon',
        html: '<img class="my-div-image" src="/assets/waypoints_marker.png"'+
              '<span class="my-div-span">'+name+'</span>'
    })

    
    var marker = new L.Marker(new L.latLng(markerObj.lat, markerObj.lng),{
          clickable: true,
          draggable: true,
          icon: markerIcon,
         
    });
    // if(!markerObj.marker_id){
    //   marker.marker_id = UUID.UUID();
    // }
    // markerObj.name      = name;
    this.map.addLayer(marker);
    let map_copy = this.map
    marker.on('dragstart',function(e){
        // if(this.editing){
        //   return;
        // }
        let latlng = this.getLatLng();
        self.draggedKey = latlng.lat+"-"+latlng.lng;
        
        
    });
    marker.on('dragend', function(e){
      console.log("xxxx");
      // if(this.editing){
      //     return;
      // }
      L.DomEvent.stopPropagation(e);

      let markerObj = self.existingMarkersMap[self.draggedKey]
      delete self.existingMarkersMap[self.draggedKey];

      //change marker position in marker map
      let latlng = this.getLatLng();
      let newkey = latlng.lat+"-"+latlng.lng;
      markerObj.lat = latlng.lat;
      markerObj.lng = latlng.lng;
      self.existingMarkersMap[newkey] = markerObj;
      self.onmarkerchanged.emit(markerObj);
      //change polylines data assosciated with markers
      self.changeRoutesData(markerObj);


    });
    marker.on('click', function(e){
      L.DomEvent.stopPropagation(e);
      if(self.editing){
        var length = self.polyline.getLatLngs().length;

      
        
        self.polyline.addLatLng(this.getLatLng());
        self.polyline.redraw();

        
        self.drawPolyLine.getLatLngs().splice(0, 2);
        
        self.drawPolyLine.addLatLng(this.getLatLng());
        
        self.drawPolyLine.redraw();
      }else{
        self.onmarkerclicked.emit(markerObj);
      }
    });
    marker.on('contextmenu', function(e) {
      L.DomEvent.stopPropagation(e);
      var tdiv='Delete ? '+markerObj.marker_id;
      var tpopup = L.popup({closeButton:true})
                    .setLatLng(e.latlng)
                    .setContent(tdiv)
                    .openOn(map_copy);
      let latlng = this.getLatLng();
      let key = latlng.lat+"-"+latlng.lng;
      tpopup._wrapper.addEventListener('click', ()=>{
         //console.log("delete");
         map_copy.removeLayer(marker);
        map_copy.closePopup();
        delete self.existingMarkersMap[key];
        self.onmarkerdeleted.emit(markerObj);
        let polyObjs = self.routeMarkerMap[markerObj.marker_id];
        if(polyObjs){
            polyObjs.forEach(obj=>{
              let index = self.savedPolylines.indexOf(obj);
              self.savedPolylines.splice(index,1);
              self.onroutedeleted.emit(obj);
            });
          }
          self.redrawSaved();
        });
      });
      this.addedMarkers.push(marker);
    // return marker;
}

changeRoutesData(marker){
  let polyObjs = this.routeMarkerMap[marker.marker_id];
  //console.log(polyObjs);
  if(polyObjs){
    polyObjs.forEach(obj=>{

        if(obj.from_point_marker_id == marker.marker_id){
          //change from lat and lng
          obj.from_point_lat  = marker.lat;
          obj.from_point_lng  = marker.lng;
        }else{
          //change to lat and lng
          obj.to_point_lat  = marker.lat;
          obj.to_point_lng  = marker.lng;
        }
        this.onroutechanged.emit(obj);
    })
  }
  this.redrawSaved();
}


addSaved(){
 
 var length = this.polyline.getLatLngs().length;

 
  this.polyline.getLatLngs().forEach((latlng,i)=>{
 //   var temp =  L.polyline([], {
 //      color: '#00897B',
 //      clickable: 'true'
 //   }).addTo(this.map);
   //let i = this.polyline.getLatLngs().indexOf(latlng);
   if(i < length-1)
     {
       var polyLineObj = {};
       var reverseLineObj = {};
       var firstMarkerKey = latlng.lat+"-"+latlng.lng;

       var secondMarkerKey = this.polyline.getLatLngs()[i+1].lat+"-"+this.polyline.getLatLngs()[i+1].lng;
       
       var firstMarker     = this.existingMarkersMap[firstMarkerKey];
       var secondMarker    = this.existingMarkersMap[secondMarkerKey];
       //since routes are bi-directional by default add these twice
       polyLineObj['from_point_marker_id'] = firstMarker['marker_id'];
       polyLineObj['to_point_marker_id']   = secondMarker['marker_id'];
       polyLineObj['from_point_name']      = firstMarker['name'];
       polyLineObj['to_point_name']        = secondMarker['name'];
       polyLineObj['from_point_lat']       = firstMarker['lat'];
       polyLineObj['to_point_lat']         = secondMarker['lat'];
       polyLineObj['from_point_lng']       = firstMarker['lng'];
       polyLineObj['to_point_lng']         = secondMarker['lng'];
       polyLineObj['distance_weight']      = 1;
       polyLineObj['line_id']              = UUID.UUID();

       reverseLineObj['to_point_marker_id'] = firstMarker['marker_id'];
       reverseLineObj['from_point_marker_id']   = secondMarker['marker_id'];
       reverseLineObj['to_point_name']      = firstMarker['name'];
       reverseLineObj['from_point_name']        = secondMarker['name'];
       reverseLineObj['to_point_lat']       = firstMarker['lat'];
       reverseLineObj['from_point_lat']         = secondMarker['lat'];
       reverseLineObj['to_point_lng']       = firstMarker['lng'];
       reverseLineObj['from_point_lng']         = secondMarker['lng'];
       reverseLineObj['distance_weight']      = 1;
       reverseLineObj['line_id']              = UUID.UUID();

       this.savedPolylines.push(polyLineObj);
       this.savedPolylines.push(reverseLineObj);
       //console.log(polylineObj);
       this.onrouteadded.emit(polyLineObj);
       this.onrouteadded.emit(reverseLineObj);
       

     }
  }); 
   
}

redrawSaved(){
  this.polyLines.forEach(polyline=>{
    this.map.removeLayer(polyline);
  });
  this.routeMarkerMap = {};
  
  this.savedPolylines.forEach((polylineObj)=>{
      
      let polyline =  L.polyline([[polylineObj.from_point_lat, polylineObj.from_point_lng],[polylineObj.to_point_lat, polylineObj.to_point_lng]], {
        color: '#00897B',
        clickable: 'true'
      })
      
      polyline.polyline_id = polylineObj.line_id;
      if(this.routeMarkerMap[polylineObj['from_point_marker_id']]){
         this.routeMarkerMap[polylineObj['from_point_marker_id']].push(polylineObj);
         
       }else{
         this.routeMarkerMap[polylineObj['from_point_marker_id']] = [];
         this.routeMarkerMap[polylineObj['from_point_marker_id']].push(polylineObj);
         
       }


       if(this.routeMarkerMap[polylineObj['to_point_marker_id']]){
         this.routeMarkerMap[polylineObj['to_point_marker_id']].push(polylineObj);
         
       }else{
         this.routeMarkerMap[polylineObj['to_point_marker_id']] = [];
         this.routeMarkerMap[polylineObj['to_point_marker_id']].push(polylineObj);
         
       }

      polyline.on('contextmenu', (e)=>{
        //console.log("right click");
        L.DomEvent.stopPropagation(e);
        var tdiv='Delete ?';
        var tpopup = L.popup({closeButton:true})
                    .setLatLng(e.latlng)
                    .setContent(tdiv)
                      .openOn(this.map);
        tpopup._wrapper.addEventListener('click', ()=>{
           //console.log("delete");
           this.onroutedeleted.emit(polylineObj);
           this.map.removeLayer(polyline);
          this.map.closePopup();
        });
        
      });
      
      polyline.on('click', (e)=>{
        if(this.splicing){
          // console.log(e.latlng);
          // console.log(polyline);
          /*
            Removing the current added polyline and adding new
          */
          let frompolyObjs = this.routeMarkerMap[polylineObj['from_point_marker_id']];
          //let topolyObjs = this.routeMarkerMap[polylineObj['to_point_marker_id']];
          //let commonPolyLines = [];
          console.log(this.savedPolylines);
          frompolyObjs.forEach(left=>{
            if(left.line_id == polylineObj.line_id){
                  let index = this.savedPolylines.indexOf(left);
                  this.savedPolylines.splice(index,1);
                  this.onroutedeleted.emit(left);
              }else if(left.from_point_marker_id == polylineObj.to_point_marker_id && left.to_point_marker_id == polylineObj.from_point_marker_id){
                  let index = this.savedPolylines.indexOf(left);
                  if(index != -1){
                    this.savedPolylines.splice(index,1);
                    this.onroutedeleted.emit(left);
                  }
              }
          })
          
          console.log(this.savedPolylines);
          this.map.removeLayer(polyline);
          //add marker
          this.addMarkerSplit(e.latlng);
          //add two routes to left point
          this.addSavedSplit(new L.latLng(polylineObj.from_point_lat, polylineObj.from_point_lng),e.latlng)
          //add two routes to right
          this.addSavedSplit(e.latlng,new L.latLng(polylineObj.to_point_lat, polylineObj.to_point_lng))
          //redraw every polyline
          this.redrawSaved();
        }
      });
      //polyline.redraw();
      polyline.addTo(this.map);
      this.polyLines.push(polyline);

  })
  //this.redrawAll();

}

addSavedSplit(latlng1,latlng2){
       
 
 
       var polyLineObj = {};
       var reverseLineObj = {};
       var firstMarkerKey = latlng1.lat+"-"+latlng1.lng;

       var secondMarkerKey = latlng2.lat+"-"+latlng2.lng;
       
       var firstMarker     = this.existingMarkersMap[firstMarkerKey];
       var secondMarker    = this.existingMarkersMap[secondMarkerKey];
       //since routes are bi-directional by default add these twice
       polyLineObj['from_point_marker_id'] = firstMarker['marker_id'];
       polyLineObj['to_point_marker_id']   = secondMarker['marker_id'];
       polyLineObj['from_point_name']      = firstMarker['name'];
       polyLineObj['to_point_name']        = secondMarker['name'];
       polyLineObj['from_point_lat']       = firstMarker['lat'];
       polyLineObj['to_point_lat']         = secondMarker['lat'];
       polyLineObj['from_point_lng']       = firstMarker['lng'];
       polyLineObj['to_point_lng']         = secondMarker['lng'];
       polyLineObj['distance_weight']      = 1;
       polyLineObj['line_id']              = UUID.UUID();

       reverseLineObj['to_point_marker_id'] = firstMarker['marker_id'];
       reverseLineObj['from_point_marker_id']   = secondMarker['marker_id'];
       reverseLineObj['to_point_name']      = firstMarker['name'];
       reverseLineObj['from_point_name']        = secondMarker['name'];
       reverseLineObj['to_point_lat']       = firstMarker['lat'];
       reverseLineObj['from_point_lat']         = secondMarker['lat'];
       reverseLineObj['to_point_lng']       = firstMarker['lng'];
       reverseLineObj['from_point_lng']         = secondMarker['lng'];
       reverseLineObj['distance_weight']      = 1;
       reverseLineObj['line_id']              = UUID.UUID();

       this.savedPolylines.push(polyLineObj);
       this.savedPolylines.push(reverseLineObj);
       //console.log(polylineObj);
       this.onrouteadded.emit(polyLineObj);
       this.onrouteadded.emit(reverseLineObj);
       

  
   
}

addMarkerSplit(latlng){
  var keysLength = 1+Object.keys(this.existingMarkersMap).length;
    
    //var keys   =  this.existingMarkersMap.keys.length;
    var new_marker = {};
    new_marker['marker_id'] = UUID.UUID();
    new_marker['name']      = "A-"+keysLength;
    new_marker['lat']       = latlng.lat;
    new_marker['lng']       = latlng.lng;
    // new_marker
    var key = latlng.lat +"-"+latlng.lng;
    if(!this.existingMarkersMap[key]){
      this.addSingleMarker(new_marker);
      this.onmarkeradded.emit(new_marker);
      this.existingMarkersMap[key] = new_marker;
    }
}

onSpliceLine(){
  this.splicing = !this.splicing;
}

redrawAll(){
  this.polyLines.forEach(polyline=>{
    //console.log(polyline.getLatLngs());
    polyline.addTo(this.map);
    polyline.redraw();
  })
}

}
