export interface IData<T> {
  error: {
    code: string
    message: string
  }
  code: number
  data: T
  message: string
}

class Service {
  baseOptions: UniApp.RequestOptions = {
    url: 'https://fc-mp-100650ce-3d2d-4645-9348-d5267e5c5957.next.bspapp.com',
    data: {},
    header: {
      'content-type': 'application/json',
    },
    method: 'GET',
    timeout: 60000,
  }

  async request<T>(options: UniApp.RequestOptions) {
    try {
      options = {
        ...this.baseOptions,
        ...options,
        url: this.baseOptions.url + options.url,
      }
      const result = await uni.request({ ...options })
      const { error, code, data, message } = result.data as IData<T>
      if (error) throw new Error(error.message)
      if (code !== 200) throw new Error(message)
      return data
    } catch (error: any) {
      uni.showToast({ title: error.message, icon: 'none' })
    }
  }

  get<T>(url: string, params?: string | AnyObject | ArrayBuffer | undefined) {
    return this.request<T>({ url, method: 'GET', data: params })
  }

  post<T>(url: string, params: string | AnyObject | ArrayBuffer | undefined) {
    return this.request<T>({ url, method: 'POST', data: params })
  }
}

const service = new Service()
export const request = service.request.bind(service)
export default service
