import HttpFactory from '@/repository/factory'
import { type IArea } from '@/types/areas/IArea'
import { type IAreasListItem } from '@/types/areas/IAreasListItem'
import { type IBaseViewList } from '@/types/common/IBaseViewListModel'

class AreasModule extends HttpFactory {
  private RESOURCE = '/api/areas'

  async getAll(pageIndex?: number, pageSize?: number): Promise<IBaseViewList<IAreasListItem>> {
    return await this.call<IBaseViewList<IAreasListItem>>(
      'GET',
      `${this.RESOURCE}/`,
      {
        pageIndex: pageIndex,
        pageSize: pageSize
      }
    )
  }

  async get(id: number): Promise<IArea> {
    return await this.call<IArea>('GET', `${this.RESOURCE}/${id}`)
  }
}

export default AreasModule
