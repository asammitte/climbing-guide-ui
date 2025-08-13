import { type IAuthResponse } from '@/types/common/IAuthResponse'

export default eventHandler(async event => {
  const runtimeConfig = useRuntimeConfig()
  const cookies = parseCookies(event)

  try {
    const res = await $fetch<IAuthResponse>(
      'auth/refresh-token',
      {
        baseURL: runtimeConfig.public.API_BASE_URL + '',
        method: 'POST',
        body: {
          refreshToken: cookies?.refreshToken
        },
        credentials: 'include'
      }
    )

    setCookie(event, 'accessToken', res.accessToken)
    setCookie(
      event,
      'refreshToken',
      res.refreshToken,
      {
        httpOnly: true,
        sameSite: true
      }
    )

    return true
  } catch(err: any) {
    throw new Error(err)
  }
})
