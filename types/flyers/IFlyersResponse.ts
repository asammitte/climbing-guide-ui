export interface IFlyersResponse {
  sku: string
  title: string
  properties: IFlyerProperty[]
  excludes: IFlyerExclude[][]
}

export default IFlyersResponse

export interface IFlyerProperty {
  slug: string
  title: string
  locked: boolean
  options: IFlyerPropertyOption[]
}

export interface IFlyerPropertyOption {
  slug: any
  name?: string
  nullable: boolean
  customSizes?: IFlyerPropertyOptionCustomSize
  eco?: boolean
  type?: string
  description?: string
}

export interface IFlyerPropertyOptionCustomSize {
  minHeight: number
  minWidth: number
  maxHeight: number
  maxWidth: number
}

export interface IFlyerExclude {
  options: string[]
  property: string
}
