import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Config } from '../_classes/config.class';
import { Trainer } from '../_classes/trainer.class';
import * as _ from 'lodash'
import { DEFAULT_LANGUAGE, Languages, TranslateService } from '../_services/translate.service';

@Component({
  selector: 'app-linear-regression',
  templateUrl: './linear-regression.component.html',
  styleUrls: ['./linear-regression.component.scss']
})
export class LinearRegressionComponent implements OnInit {
  config!: Config
  thetas: [number, number] = [0, 0]
  currentLanguage: Languages = DEFAULT_LANGUAGE
  languages = Languages
  isTraining: boolean = false

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
    this.config = config
  }

  train() {
    this.isTraining = true
    let thetas: [number, number] = [0, 0]
    let interval = 100
    let costs = []
    let learningRate = 0.5
    let iteration: {
      current: number
    } = {
      current: 0
    }
    if (!learningRate) return alert("Invalid learning rate");
    let trainer = new Trainer(_.cloneDeep(this.config.datas), learningRate, [0, 0])

    const training = () => {
      let tmpTheta = [1, 1];
      let thetaSum = [0, 0];
      for (let d of trainer.data) {
        thetaSum[0] += trainer.hypothesis(d.x) - d.y;
        thetaSum[1] += (trainer.hypothesis(d.x) - d.y) * d.x;
      }
      tmpTheta[0] = (trainer.learningRate / trainer.M) * thetaSum[0];
      tmpTheta[1] = (trainer.learningRate / trainer.M) * thetaSum[1];
      trainer.thetas[0] -= tmpTheta[0];
      trainer.thetas[1] -= tmpTheta[1];
      iteration.current += 1;

      thetas = [trainer.thetas[0], trainer.thetas[1] / trainer.scale]
      this.thetas = thetas
      costs.push(trainer.cost())
      if (iteration.current < 200) {
        setTimeout(() => training(), interval)
      } else {
        this.thetas = thetas
        this.isTraining = false;
      }
    }

    training()
  }

  ngOnDestroy() {
    if (this.language$) {
      this.language$.unsubscribe()
      this.language$ = null
    }
  }

}
