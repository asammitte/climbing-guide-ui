interface CustomRoute {
  file: string // Path to the Vue file file
  name?: string
  chunkName?: string
  path: string
  children?: CustomRoute[] // Optional children, also of type CustomRoute
}

const customRoutes: CustomRoute[] = [
  {
    file: 'pages_man/sectors/[sectorId].vue',
    name: 'areas-areaId-sectors-sectorId',
    path: '/areas/:areaId/sectors/:sectorId',
  }
]

export default customRoutes
