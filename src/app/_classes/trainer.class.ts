import { LRDatas } from "./config.class"
import * as _ from 'lodash'

export class Trainer {
    public data: LRDatas[]
    public learningRate: number
    public thetas: [number, number]
    public scale!: number
    public M: number = 0

    constructor(
        data: LRDatas[],
        learningRate: number = 0.5,
        thetas: [number, number] = [0, 0]
    ) {
        this.data = _.cloneDeep(data)
        this.M = this.data.length;
        this.learningRate = learningRate
        this.thetas = thetas
        this.normalize()
    }

    normalize() {
        const dataX = this.data.map(v => v.x);
        const [min, max] = [Math.min(...dataX), Math.max(...dataX)];
        this.scale = max - min;
        this.data.forEach(v => { v.x = (v.x - min) / this.scale });
    }

    public hypothesis(km: number) {
        return this.thetas[0] + this.thetas[1] * km;
    }

}
