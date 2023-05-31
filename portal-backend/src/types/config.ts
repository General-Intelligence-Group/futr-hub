export type ConfigObject = {
  Portalconfig? : PortalConfig
  Themenconfig?: Themenconfig
  Error?: {
    [key : string] : any
  } | string
}

export type PortalConfig = {
  treeType: String,
  searchBar?: any,
  mapView?: any,
  menu?: PortalMenuConfig,
  portalTitle?: any,
  controls?: any
}

export type PortalMenuConfig = {
  tree?: any,
  tools?: {
    [x: string]: any,
    children: ToolChildren
  },
  legend?: any,
  filter?: {
    [x: string]: any,
    roles?: string[]
  } 
}
export type ToolChildren = {
  [x: string]: Tool
}

export type Tool = {
    [x: string]: any
    name: String
    roles?: string[]
}

export type Themenconfig = {
  Hintergrundkarten?: DatenObject,
  Fachdaten_3D?: DatenObject,
  Fachdaten?: DatenObject    
}

export type Hintergrundkarten = {
  Ordner : HintergrundkartenOrdner[]
}

export type HintergrundkartenOrdner = {
  Titel: string,
  Layer?: HintergrundkartenOrdnerLayer[]
}

export type HintergrundkartenOrdnerLayer =  {
  id: string,
  name: string,
  layerAttribution?: string,
  visibility?: boolean,
  children? : HintergrundkartenOrdnerLayerChild[]
}

export type HintergrundkartenOrdnerLayerChild = {
  id: string,
  minScale: string,
  maxScale: string,                  
}

export type Fachdaten_3D = {
  Layer: FachDaten3dLayer[],
}

export type FachDaten3dLayer = {
  id: string,
  name: string,
  visibility?: boolean,          
}

export type Fachdaten = {
  [x: string]: any
  Ordner: [
    {
      Titel: string,
      Ordner?: FachdatenSubOrdner[],
      Layer?: FachDatenLayer[],
    }
  ]
}

export type FachdatenSubOrdner = {
    Titel: string,
    Layer?: FachDatenLayer[],
    isFolderSelectable?: boolean
}

export type FachDatenLayer =  {
  id: string,
  name: string,
  layerAttribution? : string,
  styleId?: string,
  visibility?: boolean,
  autoRefresh? : string,
  children?: FachDatenLayerChild[]
}

type FachDatenLayerChild = {
  id: string,
  name: string,
  isNeverVisibleInTree: true
}









export type DatenObject = {
  [x: string]: any,
  Ordner?: Ordner [],
  Layer?: Layer[]
}

export type Ordner = {
    Titel: string,
    Ordner?: Ordner[],
    Layer?: Layer[]
}

export type Layer = {
    id: string,
    name: string,
    children?: Layer[],
    visibility?: boolean,
    [x: string]: any
}
