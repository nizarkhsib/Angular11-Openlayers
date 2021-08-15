import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Geoloc } from '../models/geolocation/geoloc';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  private _apiName = 'https://api-adresse.data.gouv.fr/search/?q=';

  constructor(private _httpClient: HttpClient) { }

  searchAddress(street: string, postalCode?: string): Observable<Geoloc> {
    let url = this._apiName.concat(street);

    if (postalCode)
      url.concat(street + '&' + postalCode);

    return this._httpClient.get<Geoloc>(url);
  }
}
