export interface IPostersResponse {
  sku: string
  title: string
  properties: Property[]
  excludes: Exclude[][]
}

export default IPostersResponse

export interface Property {
  slug: string
  title: string
  locked: boolean
  options: Option[]
  viewMode?: ViewMode
  type?: string
  optionsInSummary?: string[]
  parentOptions?: ParentOption[]
}

export interface Option {
  slug: any
  name?: string
  nullable: boolean
  width: any
  height: any
  parent?: string
  customSizes?: CustomSizes
  eco?: boolean
  pages?: Page[]
  enrichments?: Enrichment[]
  type?: string
  description?: string
}

export interface CustomSizes {
  minHeight: number
  sizeUnit: string
  minWidth: number
  maxHeight: number
  maxWidth: number
}

export interface Page {
  numberOfColors: number
  colorspace: string
}

export interface Enrichment {
  propertySlug: string
  optionSlug: string
}

export interface ViewMode {
  reseller: string
  storefront?: string
}

export interface ParentOption {
  slug: string
  name: string
  nullable: boolean
  eco?: boolean
  enrichments?: any[]
  width?: number
  height?: number
}

export interface Exclude {
  options: any[]
  property: string
}
