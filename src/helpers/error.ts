import { AxiosRequestConfig, AxiosResponse } from "../types"

export class AxiosError extends Error {
    isAxiosError: boolean;
    config: AxiosRequestConfig;
    code?: string | null;
    request?: any;
    response?: AxiosResponse
    constructor(
        message: string,
        config: AxiosRequestConfig,
        code?: string | null,
        request?: any,
        response?: AxiosResponse
    ) {
        super(message)
        this.config = config
        this.code = code
        this.request = request
        this.response = response
        Object.setPrototypeOf(this, AxiosError.prototype) // 解决继承Error,Array之后，实例化获取不到方法问题
    }
}

export function createError(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
) {
    const error = new AxiosError(message, config, code, request, response)
    return error
}