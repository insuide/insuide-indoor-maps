import { NgModule ,ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeojsonLayerComponent } from './geojson-layer/geojson-layer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [GeojsonLayerComponent],
  exports: [GeojsonLayerComponent] 
})
export class GeojsonLeafletModule { 
  static forRoot(): ModuleWithProviders {
        return {ngModule: GeojsonLeafletModule, providers: []};
    }
}
