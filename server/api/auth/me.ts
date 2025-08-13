import type { ISessionResponse } from "@/types/users/ISessionResponse"

export default eventHandler(async event => {
  const runtimeConfig = useRuntimeConfig()
  
  const cookies = parseCookies(event)
  const accessToken = cookies?.accessToken

  console.log('session token')
  console.log(accessToken)

  const res = await $fetch<ISessionResponse>(
    'auth/me',
    {
      baseURL: runtimeConfig.public.API_BASE_URL + '',
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'include'
    }
  )

  return res
})
