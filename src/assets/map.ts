export interface Departement {
    type:     string;
    features: Feature[];
}

export interface Feature {
    type:       FeatureType;
    geometry:   Geometry;
    properties: Properties;
}

export interface Geometry {
    type:        GeometryType;
    coordinates: Array<Array<Array<number[] | number>>>;
}

export enum GeometryType {
    MultiPolygon = "MultiPolygon",
    Polygon = "Polygon",
}

export interface Properties {
    code: string;
    nom:  string;
}

export enum FeatureType {
    Feature = "Feature",
}
