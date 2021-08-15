import { FeatureApi } from './feature';
import { Filters } from './filters';

export interface Geoloc {
    type: string;
    version: string;
    features: FeatureApi[];
    attribution: string;
    licence: string;
    query: string;
    filters: Filters;
    limit: number;
}
