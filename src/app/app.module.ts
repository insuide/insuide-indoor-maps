import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { GeojsonLayerComponent } from './geojson-leaflet/geojson-layer/geojson-layer.component';


@NgModule({
  declarations: [
    AppComponent,
    GeojsonLayerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
