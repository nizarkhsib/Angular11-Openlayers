import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { OlMapComponent } from './ol-map/ol-map.component';
import { MaterialModule } from '../material-module';
import { ComponentsModuleModule } from '../shared/components/components-module.module';
import { GeolocationService } from '../shared/services/geolocation.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    MaterialModule,
    ComponentsModuleModule
  ],
  declarations: [Tab1Page,OlMapComponent],
  providers: [GeolocationService]
})
export class Tab1PageModule {}
