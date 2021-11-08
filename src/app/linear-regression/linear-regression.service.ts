import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Config } from "../_classes/config.class";

@Injectable({ providedIn: 'root' })
export class LinearRegressionService {
    config: BehaviorSubject<Config> = new BehaviorSubject(new Config())

    constructor() {}

}