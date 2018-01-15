import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GeojsonLeafletModule } from './geojson-leaflet/geojson-leaflet.module';
import { AppComponent } from './app.component';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GeojsonLeafletModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
