export class Config {
    header!: LRHeader
    datas!: LRDatas[]
}

export class LRHeader {
    x!: string
    y!: string

    constructor(x: string, y: string) {
        this.x = x
        this.y = y
    }
}

export class LRDatas {
    x!: number
    y!: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}