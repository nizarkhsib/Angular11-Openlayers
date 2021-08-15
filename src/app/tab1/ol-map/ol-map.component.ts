import { Component, Input, AfterViewInit, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import olMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { LiteralStyle, SymbolType } from 'ol/style/LiteralStyle';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { Geometry } from 'src/app/shared/models/geolocation/geometry';
import VectorLayer from 'ol/layer/Vector';
import { Icon, Style } from 'ol/style';

@Component({
  selector: 'app-ol-map',
  template: `
    <div #map id="map"></div>
  `,
  styles: [`
    #map {
      height: 100%;
    }
    .ol-viewport, .ol-layer, canvas {
      height: 100%!important;
      width: 100%!important;
    }
  `]
})
export class OlMapComponent implements AfterViewInit, OnChanges {

  @ViewChild('map') map: ElementRef<HTMLElement>;
  @Input() data: any[];
  @Input() options: { radiusMarkerKey?: string, center?: number[], zoom?: number };
  @Output() action: EventEmitter<{ type: string; payload: any }> = new EventEmitter();
  olMap: olMap;
  markersLayer: any;
  vectorSource = new VectorSource();;
  vectorLayer: VectorLayer;
  tileLayer: TileLayer;
  @Input() features: Geometry[];

  private iconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: './assets/location.png',
      scale: 0.5,
      color: 'blue'
    }),

  });

  ngOnChanges(changes: SimpleChanges) {
    if (this.vectorLayer)
      this.setFeatures();
  }

  ngAfterViewInit() {
    // init DOM
    setTimeout(() => {
      this.init();
    }, 1000);
  }

  init() {

    this.tileLayer = new TileLayer({
      source: new OSM(),
    });

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: this.iconStyle
    });

    this.olMap = new olMap({
      view: new View({
        center: [0, 0],
        zoom: 1,
      }),
      layers: [
        this.tileLayer,
        this.vectorLayer
      ],
      target: 'map'
    });
  }

  setFeatures() {
    const processedFeatures = this.features.map(
      feature => {

        const coords = fromLonLat([
          feature.coordinates[0], feature.coordinates[1]
        ]);

        const f = new Feature({
          type: 'geoMarker', // add type to identify event
          geometry: new Point(coords)
        });

        return f;

      }
    );
    this.vectorLayer.getSource().clear();
    this.vectorLayer.getSource().addFeatures(processedFeatures);

    this.olMap.getView().setZoom(14);
    const point: Point = <Point>processedFeatures[0].getGeometry();
    this.olMap.getView().setCenter(point.getFlatCoordinates());
  }

  private _addClickEvent() {
    // handle map click event
    this.olMap.on('click', async (evt) => {
      // extract ft
      const feature = this.olMap.forEachFeatureAtPixel(evt.pixel, ft => ft);
      // if click on point
      if (!feature) return;
      const payload = feature.getProperties();
      if (!payload) return;
      console.log(payload);
      this.action.emit({
        type: payload.type,
        payload
      });
    });
  }

}