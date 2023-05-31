export type Permission = {
  id: string,
  name: string,
  url: string,
  typ: string,
  layers: string,
  roles?: string[],
  format: string,
  version: string,
  singleTile: boolean,
  transparent: boolean,
  transparency: number,
  tilesize: number,
  minScale: number,
  maxScale: number,
  gfiAttributes: string,
  gfiTheme: string,
  cache: boolean,
  featureCount: string,
  legend: string,
  datasets: DatasetItem[]
}

type DatasetItem = {
  [key: string] : string
}