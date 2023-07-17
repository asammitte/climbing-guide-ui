import HttpFactory from '@/repository/factory'
// import { ICreateAccountInput, ICreateAccountResponse, ILoginInput, ILoginResponse } from '~/types/GoogleAuth'

class AuthModule extends HttpFactory {
  private RESOURCE = '/auth'

  async googleVerify(credential: any): Promise<any> {
    return await this.call<any>('POST', `${this.RESOURCE}/social-login`, {
      email: 'pavli4enko30@gmail.com',
      provider: 'GOOGLE',
      accessToken: credential
    })
  }

  // async create(account: ICreateAccountInput): Promise<ICreateAccountResponse> {
  //   return await this.call<ICreateAccountResponse>('POST', `${this.RESOURCE}/register`, account)
  // }
}

export default AuthModule
