import { Component, OnInit,Input,ElementRef,EventEmitter,ViewChild,Output } from '@angular/core';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';



@Component({
  selector: 'app-routetester',
  templateUrl: './routetester.component.html',
  styleUrls: ['./routetester.component.css']
})
export class RoutetesterComponent implements OnInit {

map:any;

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



@Input()
offset:Number=2;






  constructor() { }

  ngOnInit() {
  }

}
