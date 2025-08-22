import { eventHandler } from 'h3'
import { joinURL } from 'ufo'

export default eventHandler(async (event) => {
  // Get runtime config proxy url
  const { apiProxyUrl } = useRuntimeConfig()
  const path = event.path.replace(/^\/api\/dotnet\//, '/api/') // /api/dotnet/users -> /api/users
  const target = joinURL(apiProxyUrl, path)

  const session = event.context.session
  const accessToken = session?.tokenSet?.access_token

  let headers = { ...getRequestHeaders(event) }
  headers = {
    ...headers,
    'Request-Path': '/',
    accept: 'application/json',
    'Authorization': accessToken ? `Bearer ${accessToken}` : ''
  }

  return proxyRequest(event, target, { headers })
})
