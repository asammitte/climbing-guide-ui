import HttpFactory from '@/repository/factory'
import IFlyerItemResponse from '~/types/flyers/IFlyersResponse'

import flyersJson from '@/repository/mockedResponses/flyers.json'

class FlyersModule extends HttpFactory {

  async getAll(): Promise<IFlyerItemResponse[]> {
    return await new Promise((resolve, reject) => {
      const flyers: IFlyerItemResponse[] = JSON.parse(JSON.stringify(flyersJson));
      resolve(flyers)
    })
  }
}

export default FlyersModule
