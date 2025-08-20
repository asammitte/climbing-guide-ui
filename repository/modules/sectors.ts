import HttpFactory from '@/repository/factory'
import { type IBaseViewList } from '@/types/common/IBaseViewListModel'
import { type ISectorItem } from '~/types/sectors/ISectorItem'
import { type ISectorsListItem } from '@/types/sectors/ISectorsListItem'

class SectorsModule extends HttpFactory {
  private RESOURCE = '/api/sectors'

  async get(id: number): Promise<ISectorItem> {
    return await this.call<ISectorItem>('GET', `${this.RESOURCE}/${id}`)
  }

  async getAll(areaId: number, pageIndex?: number, pageSize?: number): Promise<IBaseViewList<ISectorsListItem>> {
    return await this.call<IBaseViewList<ISectorsListItem>>(
      'GET',
      `${this.RESOURCE}/belong-to-area/${areaId}`,
      {
        pageIndex: pageIndex,
        pageSize: pageSize
      }
    )
  }
}

export default SectorsModule
