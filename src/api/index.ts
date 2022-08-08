import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'

// Toast替换为实际的toast组件
const Toast = {
  loading: (text: string) => {
    console.log(text)
  },
  clear: () => {
    console.log('clear')
  },
  fail: (conf: { message: string }) => {
    console.log(conf.message)
  }
}

type Config = AxiosRequestConfig & {
  alert?: boolean;
  loading?: boolean;
  loadingText?: string;
};

type Plugin = {
  request?: (config: Config) => Config;
  response?: (data: AxiosResponse) => AxiosResponse;
};

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL
})

// 添加拦截器
const usePlugin = (plugin: Plugin) => {
  if (plugin.request) {
    instance.interceptors.request.use(plugin.request)
  }

  if (plugin.response) {
    instance.interceptors.response.use(plugin.response)
  }
}

const loadingPlugin: Plugin = {
  request: config => {
    if (config.loading) {
      Toast.loading(config.loadingText || '加载中...')
    }

    return config
  },
  response: data => {
    const config = data.config as Config
    if (config.loading) {
      Toast.clear()
    }

    return data
  }
}

const alertPlugin: Plugin = {
  response: data => {
    const config = data.config as Config
    if (config.alert === true) {
      Toast.fail({
        message: '这里写从接口取到的错误提示'
      })
    }
    return data
  }
}

usePlugin(loadingPlugin)
usePlugin(alertPlugin)

// 定义了返回体的类型 范型T是后端定义的返回值类型（即调用时定义的 RGetInfo）
export type CommonRes<T = any> = {
  code: number;
  msg: string;
  data: T;
};

// config参数是一些自定义的配置 loading、错误提示、内置的AxiosRequestConfig
type Request<R, T> = (params?: T, config?: Config) => Promise<CommonRes<R>>;
// 请求的类型 范型R是返回值 范型T是请求参数
type RequestMethod = <R, T = any>(
  url: string,
  config?: Config
) => Request<R, T>;

type toLowerCaseMethod =
| 'get'
| 'delete'
| 'head'
| 'options'
| 'post'
| 'put'
| 'patch'
| 'postForm'
| 'putForm'
| 'patchForm'

const wrapperRequest = (method: Method): RequestMethod => {
  // 默认如果有错误会自动弹出toast，后面也可以关闭。
  return <R, T = any>(url: string, config: Config = { alert: true }) => {
    return (params?: T, requestConfig?: Config) => {
      let realParams = [
        params,
        {
          ...config,
          ...requestConfig
        }
      ]
      if (method === 'get' || method === 'delete') {
        realParams = [{ params, ...config, ...requestConfig }]
      }

      // Method类型定义了大写的请求类型 AxiosInstance上不存在 需要断言
      // 这里axios的定义是<T = any, R = AxiosResponse<T>, D = any>
      // 如果在responseInterceptor里完全修改了返回值，第一个参数是必传的。
      // 剩余的参数通过扩展元组传入
      return instance[method as toLowerCaseMethod]<any, CommonRes<R>>(url, ...realParams)
    }
  }
}

export const get = wrapperRequest('get')
export const del = wrapperRequest('delete')
export const post = wrapperRequest('post')
export const put = wrapperRequest('put')
