import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types/index'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import { transform } from './transform'
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    throwIfCancellactionRequest(config)
    processConfig(config)
    return xhr(config).then(res => transformResponseData(res))
}

function processConfig(config: AxiosRequestConfig) {
    config.url = transformURL(config)
    config.data = transform(config.data, config.headers, config.transformRequest)
    config.headers = flattenHeaders(config.headers, config.method!)
}

function transformURL(config: AxiosRequestConfig): string {
    const { url, params } = config
    return buildURL(url!, params)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
    res.data = transform(res.data, res.headers, res.config.transformReponse)
    return res
}

function throwIfCancellactionRequest(config: AxiosRequestConfig): void {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequest()
    }
}