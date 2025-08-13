import { type IAuthResponse } from '@/types/common/IAuthResponse'

export default eventHandler(async event => {
  const runtimeConfig = useRuntimeConfig()
  const body = await readBody(event)

  try {
    const res = await $fetch<IAuthResponse>(
      'auth/login',
      {
        baseURL: runtimeConfig.public.API_BASE_URL + '',
        method: 'POST',
        body: {
          username: body.username,
          password: body.password,
        },
        // headers: { "Content-Type": "application/json" },
        credentials: 'include'
      }
    )

    setCookie(
      event,
      'accessToken',
      res.accessToken,
      {
        path: '/',
        maxAge: 3600, // Set the cookie expiration time in seconds (e.g., 1 hour)
        secure: true, // Set the Secure attribute to ensure the cookie is sent only over HTTPS
        // httpOnly: true, // Set the HttpOnly attribute to prevent client-side access to the cookie
        sameSite: 'strict' // Set the SameSite attribute to restrict cross-origin cookie sharing
      }
    )

    setCookie(
      event,
      'refreshToken',
      res.refreshToken,
      {
        path: '/',
        maxAge: 3600, // Set the cookie expiration time in seconds (e.g., 1 hour)
        secure: true, // Set the Secure attribute to ensure the cookie is sent only over HTTPS
        httpOnly: true, // Set the HttpOnly attribute to prevent client-side access to the cookie
        sameSite: 'strict' // Set the SameSite attribute to restrict cross-origin cookie sharing
      }
    )

    return true
  } catch(err: any) {
    throw new Error(err)
  }
})
