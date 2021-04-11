import { deepMerge, isPlainObject } from "./util";

function normalizeHeaderName(headers: any, normalizeName: string): void {
    if (!headers) return
    Object.keys(headers).forEach(name => {
        if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
            headers[normalizeName] = headers[name]
            delete headers[name]
        }
    })
}
export function processHeaders(headers: any, data: any): any {
    normalizeHeaderName(headers, 'Content-Type')
    if (isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8'
        }
    }
    return headers
}

export function parseHeaders(headers: string): any {
    let parse = Object.create(null)
    if (!headers) return parse
    headers.split('\r\n').forEach(line => {
        let [key, val] = line.split(':')
        key = key.trim().toLowerCase()
        if (!key) return
        if (val) {
            val = val.trim()
        }
        parse[key] = val
    });
    return parse
}

export function flattenHeaders(headers: any, method: any): any {
    if (!headers) {
        return headers
    }
    console.log(headers,'99999')
    headers = deepMerge(headers.common, headers[method], headers) // 将headers 属性对象 合并

    const methodToDelete = ['delete', 'get', 'head', 'options', 'put', 'post', 'patch', 'common']
    methodToDelete.forEach(method => {
        delete headers[method]
    })

    return headers
}