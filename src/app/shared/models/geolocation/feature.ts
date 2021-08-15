import { Geometry } from './geometry';
import { Properties } from './properties';

export interface FeatureApi {
    type: string;
    geometry: Geometry;
    properties: Properties;
}
