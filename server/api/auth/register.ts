import { type IAuthResponse } from '@/types/common/IAuthResponse'

export default eventHandler(async event => {
  const runtimeConfig = useRuntimeConfig()
  const body = await readBody(event)

  try {
    const res = await $fetch<IAuthResponse>(
      'auth/register',
      {
        baseURL: runtimeConfig.public.API_BASE_URL + '',
        method: 'POST',
        body: {
          username: body.username,
          email: body.email,
          password: body.password
        },
      }
    )

    setCookie(event, 'accessToken', res.accessToken)
    setCookie(event, 'refreshToken', res.refreshToken, { httpOnly: true })

    return true
  } catch(err: any) {
    throw new Error(err)
  }
})
