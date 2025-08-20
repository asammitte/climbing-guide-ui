// types/routes.ts
export type Point = [number, number];      // [x,y] on 0..grid
export type Polyline = Point[];            // array of points

export interface RouteGeometry {
  grid: number;                            // e.g. 10000
  segments: Polyline[];                    // one or more polylines
  style?: { width?: number };              // stroke width in grid units (optional)
}

export interface RouteItem {
  id: number;
  name: string;
  grade?: string | null;
  color?: string;                          // '#RRGGBB'
  geometry: RouteGeometry;
}

export interface PhotoItem {
  id: number;
  url: string;
  grid?: number;                           // defaults to 10000
  natural_w?: number;
  natural_h?: number;
}
