import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { AutocompleteWithMapperMeta, TableMeta, TableChange, EditableType } from './types';
import * as lodash from 'lodash';
import { Subject } from 'rxjs';


@Component({
  selector: 'lib-editable-text',
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.scss']
})
export class EditableTextComponent implements OnInit {

  @Input() data: any;
  @Input() type: { name: EditableType, meta: any };

  @Output() editDisabled = new EventEmitter();
  @Output() valueChanged = new EventEmitter();

  isEditEnabled = false;
  
  filteredOptions = new Subject<string[]>();

  @ViewChild('autocompleteMapper') acMapper: ElementRef;
  private unchangedData: any;

  constructor() { }

  ngOnInit() {
    this.unchangedData = this.data;
  }

  enableEdit() {
    this.isEditEnabled = true;
  }

  disableEdit() {
    this.isEditEnabled = false;
  }

  disableEditInternal() {
    this.isEditEnabled = false;
    this.editDisabled.emit();

    switch (this.type.name) {
      case 'AutocompleteWithMapper':
        const data = lodash.find(this.type.meta.options, (option) => this.type.meta.map(option) === this.acMapper.nativeElement.value);

        if (data && !lodash.isEqual(this.data, data)) {
          this.data = data;
        }
        break;
    }

    if (this.data !== this.unchangedData) {
      this.unchangedData = this.data;
      this.valueChanged.emit(this.data);
    }
  }

  filterOptions(filter: string) {
    let options: Array<any> = this.type.meta.options;
    options = lodash.map(options, (option) => this.type.meta.map(option));
    this.filteredOptions.next(options.filter(option => option.toLowerCase().includes(filter.toLowerCase())));
  }

  changed(change: TableChange) {
    this.valueChanged.emit(change);
  }

}
