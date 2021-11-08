import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from 'src/app/_services/translate.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss'],
})
export class DragAndDropComponent implements OnInit {
  @Input() darkMode: boolean = false
  @HostBinding('attr.id') externalId: string | null = '';
  @Input() accept: string = ''
  @Input('value') _value: File | null = null
  @Input() set id(value: string | null) {
    this._ID = value;
    this.externalId = null;
  }
  @ViewChild('inputCurrentFiles') inputCurrentFiles!: ElementRef
  @ViewChild('dragAndDropContainer') container!: ElementRef
  @HostListener('dragover', ['$event']) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.container.nativeElement.classList.add('dragover');
  }
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.container.nativeElement.classList.remove('dragover');
  }
  @HostListener('drop', ['$event']) public onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    let files = evt.dataTransfer.files;
    this.container.nativeElement.classList.remove('dragover');
    if (files.length > 0) {
      this.onFilesChange(files)
    }
  }
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter()
  onTouched: any = () => { };
  private _ID: string | null = '';
  imageIsLoading: boolean = false

  get id() { return this._ID }
  get value() { return this._value; }
  set value(val: File | null) {
    this._value = val;
    this.onChange.emit(val);
    this.onTouched();
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private dialog: MatDialog,
    private translateService: TranslateService,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void { }

  onFilesChange(files: FileList | null) {
    if (files && files.length) {
      this.value = files[0]
    }
  }

  removeFile() {
    let dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        darkMode: this.darkMode,
        title: this.translateService.getTranslationForKey('components.dragAndDrop.deleteTitle'),
        message: this.translateService.getTranslationForKey('components.dragAndDrop.deleteMessage'),
        warningMessage: this.translateService.getTranslationForKey('components.dragAndDrop.deleteWarningMessage'),
      }
    })
    dialog.afterClosed().subscribe(data => {
      if (data) {
        this.value = null
      }
    })
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  writeValue(value: File) {
    this.value = value;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

}
