import type { UseFetchOptions } from 'nuxt/app'
// 3rd's
import type { NitroFetchRequest, $Fetch } from 'nitropack'

class FetchFactory {
  protected fetcher: $Fetch;

  constructor(fetcher: $Fetch) {
    this.fetcher = fetcher;
  }

  /** 
    * method - GET, POST, PUT
    * URL
  **/
  // async call<T>(method: string, url: string, query?: object, data?: object, extras = {}): Promise<T> {
  //   const tokenCookie = useCookie('accessToken')
  //   const accessToken = tokenCookie.value

  //   const $res: T = await this.$fetch(url, { method, query: query, body: data, ...extras, headers: {
  //     Authorization: `Bearer ${accessToken}`
  //   } });
  //   return $res;
  // }

  /**
   * The HTTP client is utilized to control the process of making API requests.
   * @param method the HTTP method (GET, POST, ...)
   * @param url the endpoint url
   * @param params
   * @param data the body data
   * @returns 
   */
  protected async call<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    query?: any,
    body?: any,
    headers?: any,
    signal?: any,
    responseType?: any,
  ): Promise<T> {
    // return useFetch<T>(url, {
    //   method: method,
    //   params: params,
    //   body: body,
    //   query: query,
    //   $fetch: useNuxtApp().$api as typeof $fetch
    // })
    const $res = await this.fetcher.raw<T>(url, {
      method: method,
      query: query,
      body: body,
      headers: headers,
      signal: signal,
      responseType: responseType
    })

    return $res._data!
  }
}

export default FetchFactory;
