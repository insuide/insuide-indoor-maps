import { Component, OnInit,Input,ElementRef,EventEmitter,ViewChild,Output } from '@angular/core';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import {} from '@types/leaflet';
import { layerStyles } from '../layerStyles';
import { geojson } from '../geojson';
import { UUID } from 'angular2-uuid';


declare var L : any;
declare var jQuery: any;
declare var draw:any;
declare var geojsonvt:any;
@Component({
  selector: 'insuide-routeedit',
  templateUrl: './routeedit.component.html',
  styleUrls: ['./routeedit.component.css']
})
export class RouteeditComponent implements OnInit {

map:any;





editing: boolean=true;


















@Input()
zoom:number=18;


@Input()
minZoom:number=16;

@Input()
maxZoom:number=22;

@Input()
vectorTileStyling:any=layerStyles;



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




routeMarkerMap:any[] = [];

polyLines = [];



   
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
    //this.listenPolyLineClick();

    this.map.on('mousemove',(e)=>{
      if(this.drawPolyLine.getLatLngs().length > 0 && this.editing){
        this.drawPolyLine.getLatLngs().splice(1, 1, e.latlng);
        this.drawPolyLine.redraw();
      }
    })



}






// listenPolyLineClick(){
//   this.polyline.on('click',e=>{
//       L.DomEvent.stopPropagation(e);
//       this.polylineclicked.emit(this.polyline);
      
//   })
// }

initiateDrawing(){
  this.polyIndexMap = {};
  this.map.on('click', (e)=> {
      var marker = this.addMarkerAndDraw(e);
  });

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
        let latlng = this.getLatLng();
        self.draggedKey = latlng.lat+"-"+latlng.lng;
        
        
    });
    marker.on('dragend', function(e){
      L.DomEvent.stopPropagation(e);

      let markerObj = self.existingMarkersMap[self.draggedKey]
      delete self.existingMarkersMap[self.draggedKey];

      //change marker position in marker map
      let latlng = this.getLatLng();
      let newkey = latlng.lat+"-"+latlng.lng;
      markerObj.lat = latlng.lat;
      markerObj.lng = latlng.lng;
      self.existingMarkersMap[newkey] = markerObj;
      this.onmarkerchanged.emit(markerObj);
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
        this.onmarkerdeleted.emit(markerObj);
        let polyObjs = self.routeMarkerMap[markerObj.marker_id];
        if(polyObjs){
            polyObjs.forEach(obj=>{
              let index = self.savedPolylines.indexOf(obj);
              self.savedPolylines.splice(index,1);
              this.onroutedeleted.emit(obj);
            });
          }
          self.redrawSaved();
        });
      });
    
    // return marker;
}

changeRoutesData(marker){
  let polyObjs = this.routeMarkerMap[marker.marker_id];
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

       reverseLineObj['from_point_marker_id'] = firstMarker['marker_id'];
       reverseLineObj['to_point_marker_id']   = secondMarker['marker_id'];
       reverseLineObj['from_point_name']      = firstMarker['name'];
       reverseLineObj['to_point_name']        = secondMarker['name'];
       reverseLineObj['from_point_lat']       = firstMarker['lat'];
       reverseLineObj['to_point_lat']         = secondMarker['lat'];
       reverseLineObj['from_point_lng']       = firstMarker['lng'];
       reverseLineObj['to_point_lng']         = secondMarker['lng'];
       reverseLineObj['distance_weight']      = 1;
       reverseLineObj['line_id']              = UUID.UUID();

       this.savedPolylines.push(polyLineObj);
       this.savedPolylines.push(reverseLineObj);

       if(this.routeMarkerMap[firstMarker['marker_id']]){
         this.routeMarkerMap[firstMarker['marker_id']].push(polyLineObj);
         this.routeMarkerMap[firstMarker['marker_id']].push(reverseLineObj);
       }else{
         this.routeMarkerMap[firstMarker['marker_id']] = [];
         this.routeMarkerMap[firstMarker['marker_id']].push(polyLineObj);
         this.routeMarkerMap[firstMarker['marker_id']].push(reverseLineObj);
       }


       if(this.routeMarkerMap[secondMarker['marker_id']]){
         this.routeMarkerMap[secondMarker['marker_id']].push(polyLineObj);
         this.routeMarkerMap[secondMarker['marker_id']].push(reverseLineObj);
       }else{
         this.routeMarkerMap[secondMarker['marker_id']] = [];
         this.routeMarkerMap[secondMarker['marker_id']].push(polyLineObj);
         this.routeMarkerMap[secondMarker['marker_id']].push(reverseLineObj);
       }

     }
  }); 
   
}

redrawSaved(){
  this.polyLines.forEach(polyline=>{
    this.map.removeLayer(polyline);
  });
  
  this.savedPolylines.forEach((polylineObj)=>{

      let polyline =  L.polyline([[polylineObj.from_point_lat, polylineObj.from_point_lng],[polylineObj.to_point_lat, polylineObj.to_point_lng]], {
        color: '#00897B',
        clickable: 'true'
      })
      this.onrouteadded.emit(polylineObj);
      polyline.polyline_id = polylineObj.line_id;
      

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
        //console.log(polyline.polyline_id);
      });
      //polyline.redraw();
      polyline.addTo(this.map);
      this.polyLines.push(polyline);

  })
  //this.redrawAll();

}

redrawAll(){
  this.polyLines.forEach(polyline=>{
    //console.log(polyline.getLatLngs());
    polyline.addTo(this.map);
    polyline.redraw();
  })
}

}
