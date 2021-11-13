import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Config } from '../_classes/config.class';
import { Trainer } from '../_classes/trainer.class';
import * as _ from 'lodash'
import { DEFAULT_LANGUAGE, Languages, TranslateService } from '../_services/translate.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-linear-regression',
  templateUrl: './linear-regression.component.html',
  styleUrls: ['./linear-regression.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LinearRegressionComponent implements OnInit {
  config!: Config
  thetas: [number, number] = [0, 0]
  currentLanguage: Languages = DEFAULT_LANGUAGE
  languages = Languages
  isTraining: boolean = false
  trainingAnimation: boolean = true
  nbIterations: number = 500
  currentIteration: number = 0
  learningRate: number = 0.5
  prediction!: number

  language$!: Subscription | null

  constructor(
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.language$ = this.translateService.language.subscribe(language => this.currentLanguage = language)
  }

  updateLanguage(language: Languages) {
    this.translateService.setTranslations(language)
  }

  onConfigChange(config: Config) {
    this.thetas = [0, 0]
    this.currentIteration = 0
    this.config = config
  }

  train() {
    if (!this.config || !this.config.datas || !this.config.datas.length) return
    this.isTraining = true
    this.currentIteration = 0
    let thetas: [number, number] = [0, 0]
    let interval = 100
    if (!this.learningRate) return alert("Invalid learning rate");
    let trainer = new Trainer(this.config.datas, this.learningRate, [0, 0])

    const training = () => {
      let tmpTheta = [1, 1];
      let thetaSum = [0, 0];
      for (let d of trainer.datas) {
        thetaSum[0] += Trainer.hypothesis(trainer.thetas, d.x) - d.y;
        thetaSum[1] += (Trainer.hypothesis(trainer.thetas, d.x) - d.y) * d.x;
      }
      tmpTheta[0] = (trainer.learningRate / trainer.M) * thetaSum[0];
      tmpTheta[1] = (trainer.learningRate / trainer.M) * thetaSum[1];
      trainer.thetas[0] -= tmpTheta[0];
      trainer.thetas[1] -= tmpTheta[1];
      this.currentIteration += 1;

      thetas = [trainer.thetas[0], trainer.thetas[1] / trainer.scale]
      if (this.trainingAnimation) {
        this.thetas = thetas
      }
      if (this.currentIteration < this.nbIterations) {
        if (this.trainingAnimation) {
          setTimeout(() => training(), interval)
        } else {
          training()
        }
      } else {
        this.thetas = thetas
        this.isTraining = false;
      }
    }

    training()
  }

  showTooltip(elem: MatTooltip) {
    elem.show()
    setTimeout(() => elem.hide(), 1000)
  }

  ngOnDestroy() {
    if (this.language$) {
      this.language$.unsubscribe()
      this.language$ = null
    }
  }

}
