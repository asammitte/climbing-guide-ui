import HttpFactory from '@/repository/factory'
import { type ISectorsListItem } from '@/types/sectors/ISectorsListItem'
import { type IBaseViewList } from '@/types/common/IBaseViewListModel'

class SectorsModule extends HttpFactory {
  private RESOURCE = '/api/sectors'

  async getAll(areaId: number, pageIndex?: number, pageSize?: number): Promise<IBaseViewList<ISectorsListItem>> {
    return await this.call<IBaseViewList<ISectorsListItem>>(
      'GET',
      `${this.RESOURCE}/${areaId}`,
      {
        pageIndex: pageIndex,
        pageSize: pageSize
      }
    )
  }
}

export default SectorsModule
