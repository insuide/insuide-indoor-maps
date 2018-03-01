import { NgModule ,ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteeditComponent } from './routeedit/routeedit.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RouteeditComponent],
  exports:[RouteeditComponent]
})
export class IndoorMapsToolModule {
	static forRoot(): ModuleWithProviders {
        return {ngModule: IndoorMapsToolModule, providers: []};
    }
 }
