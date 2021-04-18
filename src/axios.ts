import Axios from "./core/Axios";
import { deepMerge, extend } from "./helpers/util";
import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from "./types";
import defaults from './defaults'
import Cancel, { isCancel } from "./cancel/cancel";
import CancelToken from "./cancel/cancelToken";


function createInstance(config: AxiosRequestConfig): AxiosStatic {
    const context = new Axios(config)
    const instance = Axios.prototype.request.bind(context)
    extend(instance, context)
    return instance as AxiosStatic
}

const axios = createInstance(defaults)
axios.create = function (config) {
    return createInstance(deepMerge(defaults, config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel
export default axios