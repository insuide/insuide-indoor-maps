import { NgModule ,ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteeditComponent } from './routeedit/routeedit.component';
import { DrawingtoolComponent } from './drawingtool/drawingtool.component';
import { HeatmapComponent } from './heatmap/heatmap.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RouteeditComponent, DrawingtoolComponent, HeatmapComponent],
  exports:[RouteeditComponent,DrawingtoolComponent,HeatmapComponent]
})
export class IndoorMapsToolModule {
	static forRoot(): ModuleWithProviders {
        return {ngModule: IndoorMapsToolModule, providers: []};
    }
 }
