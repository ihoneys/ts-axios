import { AxiosRequestConfig } from '../types/index'
// 合并策略

const strats = Object.create(null)

function defaultStrat(val1: any, val2: any): any {//如果2有的话就去2否则取1
    return typeof val2 !== 'undefined' ? val2 : val1
}

function formVal2Strat(val1: any, val2: any): any { // 如果2有的话就取2
    if (typeof val2 !== 'undefined') {
        return val2
    }
}

const stratKeysFormVal2 = ['url', 'params', 'data']
stratKeysFormVal2.forEach(key => {
    strats[key] = formVal2Strat
})

export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig):
    AxiosRequestConfig {
    if (!config2) {
        config2 = {}
    }
    const config = Object.create(null)

    for (const key in config2) {
        mergeField(key)
    }

    for (const key in config1) {
        if (!config2[key]) {
            mergeField(key)
        }
    }

    function mergeField(key: string): void {
        const strat = strats[key] || defaultStrat
        config[key] = strat(config1[key], config2![key])
    }

    return config
}