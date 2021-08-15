import { AfterViewInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { FeatureApi } from '../shared/models/geolocation/feature';
import { Geoloc } from '../shared/models/geolocation/geoloc';
import { Geometry } from '../shared/models/geolocation/geometry';
import { GeolocationService } from '../shared/services/geolocation.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements AfterViewInit {
  myControl = new FormControl();
  options: FeatureApi[] = [];
  features: Geometry[] = [];

  constructor(private _geolocService: GeolocationService) {

    this.myControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      filter(e => e !== ''),
      switchMap(
        (value) => this.searchAddress(value)
      )
    ).subscribe(
      (searchResult: Geoloc) => {
        this.options = searchResult.features;
      }
    );

  }

  searchAddress(value: string) {
    return this._geolocService.searchAddress(value);
  }

  selectedAddress(event: FeatureApi) {
    this.features = [];
    this.features.push(event.geometry);
  }

  ngAfterViewInit(): void {

  }

}
