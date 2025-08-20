import HttpFactory from '@/repository/factory'
import { type IRouteItem } from '~/types/routes/IRouteItem'
import { type IRoutesListItem } from '~/types/routes/IRoutesListItem'
import { type IBaseViewList } from '@/types/common/IBaseViewListModel'

class RoutesModule extends HttpFactory {
  private RESOURCE = '/api/routes'

  async get(id: number): Promise<IRouteItem> {
    return await this.call<IRouteItem>('GET', `${this.RESOURCE}/${id}`)
  }

  async getAll(sectorId: number, pageIndex?: number, pageSize?: number): Promise<IBaseViewList<IRoutesListItem>> {
    return await this.call<IBaseViewList<IRoutesListItem>>(
      'GET',
      `${this.RESOURCE}/sectors/${sectorId}`,
      {
        pageIndex: pageIndex,
        pageSize: pageSize
      }
    )
  }

  async create(payload: Record<string, any>): Promise<boolean> {
    return await this.call<boolean>('POST', `${this.RESOURCE}/`, undefined, payload)
  }

  async update(id: number, payload: Record<string, any>): Promise<boolean> {
    return await this.call<boolean>('PUT', `${this.RESOURCE}/${id}`, undefined, payload)
  }

  async delete(id: number): Promise<boolean> {
    return await this.call<boolean>('DELETE', `${this.RESOURCE}/${id}`)
  }
}

export default RoutesModule
