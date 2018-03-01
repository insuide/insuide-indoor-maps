import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { IndoorMapsToolModule } from './indoor-maps-tool/indoor-maps-tool.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IndoorMapsToolModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
