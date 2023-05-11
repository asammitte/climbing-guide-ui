import HttpFactory from '@/repository/factory'
// import { ICreateAccountInput, ICreateAccountResponse } from 'types'
import { IUsersListItemResponse } from '@/types/users/IUsersListItemResponse'

class UsersModule extends HttpFactory {
  private RESOURCE = '/users'

  async getAll(): Promise<IUsersListItemResponse> {
    return await this.call<IUsersListItemResponse>('GET', `${this.RESOURCE}/`)
  }

  // async create(account: ICreateAccountInput): Promise<ICreateAccountResponse> {
  //   return await this.call<ICreateAccountResponse>('POST', `${this.RESOURCE}/register`, account)
  // }
}

export default UsersModule
