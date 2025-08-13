export interface IArea {
  id: number
  name: string
  countryName: string
  image: string
  description: string
  stay: string
  totalSectors: number
  totalLines: number
  totalAscents: number
  totalVideos: number
  totalByGrades: Record<string, number>[]
  totalByMonths: Record<number, number>[]
}
