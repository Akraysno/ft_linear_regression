import { LRDatas } from "./config.class"
import * as _ from 'lodash'

export class Trainer {
    public datas: LRDatas[]
    public learningRate: number
    public thetas: [number, number]
    public scale!: number
    public M: number = 0

    constructor(
        data: LRDatas[],
        learningRate: number = 0.5,
        thetas: [number, number] = [0, 0]
    ) {
        this.datas = _.cloneDeep(data)
        this.M = this.datas.length;
        this.learningRate = learningRate
        this.thetas = thetas
        this._normalizeDatas()
    }

    private _normalizeDatas() {
        const dataX = this.datas.map(v => v.x)
        const min = Math.min(...dataX)
        const max = Math.max(...dataX)
        this.scale = max - min
        for (let v of this.datas) {
            v.x = (v.x - min) / this.scale
        }
    }

    static hypothesis(thetas: [number, number], x: number) {
        return thetas[1] * x + thetas[0];
    }
}
