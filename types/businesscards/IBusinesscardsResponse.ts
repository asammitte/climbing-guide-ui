export interface IBbusinesscardsResponse {
  sku: string
  title: string
  properties: IBbusinesscardProperty[]
  excludes: IBbusinesscardExclude[][]
}

export default IBbusinesscardsResponse

export interface IBbusinesscardProperty {
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
  eco?: boolean
  enrichments?: Enrichment[]
  width?: number
  height?: number
  customSizes?: CustomSizes
  pages?: Page[]
  parent?: string
  type?: string
  description?: string
}

export interface Enrichment {
  propertySlug: string
  optionSlug: string
}

export interface CustomSizes {
  minHeight: number
  minWidth: number
  maxHeight: number
  maxWidth: number
}

export interface Page {
  numberOfColors: number
  colorspace: string
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
}

export interface IBbusinesscardExclude {
  options: string[]
  property: string
}
