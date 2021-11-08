import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ThemesService, DEFAULT_THEME, Themes } from 'src/app/_services/themes.service';
import { Subscription } from 'rxjs';
import { LinearRegressionService } from '../linear-regression.service';
import { Config } from 'src/app/_classes/config.class';
import * as XLSX from 'xlsx'
import { ErrorsService } from 'src/app/_services/errors.service';
import { TranslateService } from 'src/app/_services/translate.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: [
    './configuration.component.scss',
    '../menu.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigurationComponent implements OnInit {
  @Output() onConfigChange: EventEmitter<Config> = new EventEmitter()
  @ViewChild('configContainer') configContainer!: ElementRef
  config!: Config
  currentTheme: Themes = DEFAULT_THEME
  dataHeader!: RowHeaderData | undefined
  dataList: RowData[] = []
  hasErrors: boolean = false
  deletingRow: number = -1

  themes = Themes

  theme$!: Subscription | null

  canScrollTop: boolean = false
  canScrollBottom: boolean = false

  constructor(
    private linearRegressionService: LinearRegressionService,
    private themesService: ThemesService,
    private errorsService: ErrorsService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.config = new Config()
    this.onConfigChange.emit(this.config)
    this.theme$ = this.themesService.theme.subscribe(theme => this.currentTheme = theme)
  }

  refreshScrollButtons() {
    if (this.configContainer && this.configContainer.nativeElement) {
      let elem: HTMLElement = this.configContainer.nativeElement.parentNode.parentNode;
      this.canScrollTop = elem.scrollTop > 0
      this.canScrollBottom = elem.scrollHeight - (elem.scrollTop + elem.clientHeight) !== 0
    }
  }

  ngAfterViewInit() {
    this.refreshScrollButtons()
    this.configContainer.nativeElement.parentNode.parentNode.addEventListener('scroll', () => {
      this.refreshScrollButtons()
    })
  }

  scrollMenu(value: number) {
    let tmp = 0;
    let iterations = 20
    let interval = setInterval(() => {
      this.configContainer.nativeElement.parentNode.parentNode.scrollTop += value / iterations
      tmp += 1
      if (tmp === iterations) {
        clearInterval(interval)
      }
    }, 10)
  }

  fileChange(file: File) {
    if (file) {
      let self = this
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = function (e) {
        var data = new Uint8Array(reader.result as ArrayBuffer);
        var workbook = XLSX.read(data, { type: 'array' });
        var sheet = workbook.Sheets[workbook.SheetNames[0]];
        let csv = XLSX.utils.sheet_to_csv(sheet).split('\n')
        if (csv && csv.length) {
          let datas: RowData[] = []
          let dataHeader: RowHeaderData
          let headers = (csv.splice(0, 1).shift() || '').split(',')
          if (headers.length >= 2) {
            dataHeader = new RowHeaderData(headers[0], headers[1])
            for (let line of csv) {
              let row = line.split(',')
              let data1 = row.length >= 1 ? row[0] : undefined
              let data2 = row.length >= 2 ? row[1] : undefined
              if (data1 === undefined && data2 === undefined) continue
              datas.push(new RowData(data1, data2))
            }
            self.dataHeader = dataHeader
            self.dataList = datas
            self.checkErrors()
          } else {
            self.errorsService.displayError(self.translateService.getTranslationForKey('linearRegression.configuration.fileHeaderMissing'))
          }
        }
      }
    } else {
      this.hasErrors = false
      this.dataHeader = undefined
      this.dataList = []
    }
  }

  checkErrors() {
    this.hasErrors = !!this.dataList.find(r => r.isValid() === false)
  }

  onUpdate() {
    this.onConfigChange.emit(this.config)
    this.linearRegressionService.config.next(this.config)
  }

  addRow() {
    this.dataList.push(new RowData(undefined, undefined))
  }

  deleteRow(index: number) {
    this.deletingRow = index
  }

  confirmDeleteRow(index: number) {
    if (this.deletingRow === index) {
      this.deletingRow = -1
      this.dataList.splice(index, 1)
    }
  }

  validate() {
    let filteredData = this.dataList.filter(d => d.isValid())
  }

  ngOnDestroy() {
    if (this.theme$) {
      this.theme$.unsubscribe()
      this.theme$ = null
    }
  }

}

class RowHeaderData {
  data1!: string
  data2!: string

  constructor(data1: string, data2: string) {
    this.data1 = data1
    this.data2 = data2
  }

  isValid() {
    return  !!this.data1 && !!this.data2
  }
}
class RowData {
  data1!: number | undefined
  data2!: number | undefined

  constructor(data1: string | undefined, data2: string | undefined) {
    this.data1 = data1 !== undefined ? +data1 : undefined
    this.data2 = data2 !== undefined ? +data2 : undefined
  }

  isValid() {
    let data1Error = (typeof(this.data1) === 'string' && String(this.data1).length === 0) || this.data1 === undefined || isNaN(+this.data1)
    let data2Error = (typeof(this.data2) === 'string' && String(this.data2).length === 0) || this.data2 === undefined || isNaN(+this.data2)
    return !data1Error && !data2Error
  }
}