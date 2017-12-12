import { NgModule ,ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeojsonLayerComponent } from './geojson-layer/geojson-layer.component';
import { MarkerComponentComponent } from './geojson-layer/marker-component/marker-component.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [GeojsonLayerComponent, MarkerComponentComponent],
  exports: [GeojsonLayerComponent] 
})
export class GeojsonLeafletModule { 
  static forRoot(): ModuleWithProviders {
        return {ngModule: GeojsonLeafletModule, providers: []};
    }
}
