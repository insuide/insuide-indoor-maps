import { Component, OnInit, ViewEncapsulation, ElementRef ,ViewChild, NgModule, ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, Injector, NgZone, EventEmitter, Input} from '@angular/core';
import {} from '@types/leaflet';
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
zoom:number=3;
@ViewChild('map') el:ElementRef;

  constructor() { }

  ngOnInit(){
 	this.map = L.map(this.el.nativeElement).setView([19.23, 72.55], this.zoom);
//L.tileLayer('http://b.tilecloudmade.com/e7b61e61295a44a5b319ca0bd3150890/997/256/18/149531/108306.png', {
L.tileLayer('http://{s}.tile.cloudmade.com/e7b61e61295a44a5b319ca0bd3150890/997/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 22
}).addTo(this.map);

	
}

}
