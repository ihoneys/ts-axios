import { createError } from '../helpers/error'
import { parseHeaders } from '../helpers/headers'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types/index'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resovle, reject) => {
        const { data = null, url, method = 'get', headers, responseType, timeout, cancelToken } = config
        const request = new XMLHttpRequest()
        if (responseType) {
            request.responseType = responseType
        }

        request.open(method.toUpperCase(), url!, true)
        request.onreadystatechange = function handleLoad() {
            if (request.readyState !== 4) return
            const responseHeader = parseHeaders(request.getAllResponseHeaders())
            const responseData = responseType !== 'text' ? request.response : request.responseText
            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeader,
                request,
                config
            }
            handleResponse(response)
        }
        request.onerror = function handleError() {
            reject(createError('Network Error', config, null, request))
        }
        request.ontimeout = function handleTimeout() {
            reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECODEABORTED', request))
        }
        Object.keys(headers).forEach(name => {
            if (data === null && name.toLowerCase() === 'content-type') {
                delete headers[name]
            } else {
                request.setRequestHeader(name, headers[name])
            }
        })
        if (cancelToken) {
            cancelToken.promise.then(reason => {
                request.abort()
                reject(reason)
            })
        }
        request.send(data)

        function handleResponse(response: AxiosResponse): void {
            if (response.status <= 200 && response.status < 300) {
                resovle(response)
            } else {
                reject(createError(`Request failed with status code ${response.data}`, config, null, request))
            }
        }
    })

}