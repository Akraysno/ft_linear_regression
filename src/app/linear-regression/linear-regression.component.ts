import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Config } from '../_classes/config.class';
import { Trainer } from '../_classes/trainer.class';
import { DEFAULT_THEME, Themes, ThemesService } from '../_services/themes.service';
import * as _ from 'lodash'

@Component({
  selector: 'app-linear-regression',
  templateUrl: './linear-regression.component.html',
  styleUrls: ['./linear-regression.component.scss']
})
export class LinearRegressionComponent implements OnInit {
  currentTheme: Themes = DEFAULT_THEME
  config!: Config
  thetas: [number, number] = [0, 0]

  themes = Themes

  theme$!: Subscription

  constructor(
    private themesService: ThemesService,
  ) { }

  ngOnInit(): void {
    this.theme$ = this.themesService.theme.subscribe(t => {
      this.currentTheme = t
    })
  }

  onConfigChange(config: Config) {
    this.config = config
    if (this.config) {
      this.train()
    } else {
      this.thetas = [0, 0]
    }
  }

  train() {
    let thetas: [number, number] = [0, 0]
    let isTraining = true
    let interval = 100
    let costs = []
    let learningRate = 0.1
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
        isTraining = false;
      }
    }

    training()
  }

}
