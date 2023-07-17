import HttpFactory from '@/repository/factory'
import { IUsersListItemResponse } from '@/types/users/IUsersListItemResponse'

class UsersModule extends HttpFactory {
  private RESOURCE = '/users'

  async getAll(): Promise<IUsersListItemResponse> {
    return await this.call<IUsersListItemResponse>('GET', `${this.RESOURCE}/`)
  }
}

export default UsersModule
