import HttpFactory from '@/repository/factory'
import type { ISessionResponse } from '@/types/users/ISessionResponse'
// import { ICreateAccountInput, ICreateAccountResponse, ILoginInput, ILoginResponse } from '~/types/GoogleAuth'

class AuthModule extends HttpFactory {
  private RESOURCE = '/auth'

  // async googleVerify(credential: string): Promise<any> {
  //   return await this.call<any>('POST', `${this.RESOURCE}/social-login`, {}, {
  //     provider: 'GOOGLE',
  //     accessToken: credential
  //   })
  // }

  // async me(): Promise<ISessionResponse> {
  //   return await this.call<ISessionResponse>('GET', `${this.RESOURCE}/me`)
  // }

  // async create(account: ICreateAccountInput): Promise<ICreateAccountResponse> {
  //   return await this.call<ICreateAccountResponse>('POST', `${this.RESOURCE}/register`, account)
  // }
}

export default AuthModule
