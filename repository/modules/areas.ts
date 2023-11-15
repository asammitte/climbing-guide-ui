import HttpFactory from '@/repository/factory'
import { type IAreasListItem } from '@/types/areas/IAreasListItem'
import { type IBaseViewList } from '@/types/common/IBaseViewListModel'

class AreasModule extends HttpFactory {
  private RESOURCE = '/areas'

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
}

export default AreasModule
