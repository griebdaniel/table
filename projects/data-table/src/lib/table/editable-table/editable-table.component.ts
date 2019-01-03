import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import * as lodash from 'lodash';
import { TableMeta, TableChange } from '../editable-text/types';
import { EditableTextComponent } from '../editable-text/editable-text.component';

import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'lib-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.scss']
})
export class EditableTableComponent implements OnInit {
  @Input() data: object[];
  @Input() tableMeta: TableMeta;
  @Output() changed = new EventEmitter();

  dataSource = new MatTableDataSource();

  columnNames: string[];
  currentlyEdited: { row: number, column: string, editableText: any } | undefined;

  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit() {
    if (!this.data || !this.tableMeta) {
      throw new Error('data or meta is undefined');
    }

    this.dataSource.data = this.data;
    const filterPredicate = (element: object, filter: string): boolean => {
      console.log(element);

      let expression = '';

      lodash.forIn(element, (value) => {
        expression += value;
      });

      console.log(expression);

      return expression.indexOf(filter) > -1;
    };
    this.dataSource.filterPredicate = filterPredicate;
    this.dataSource.sort = this.sort;
    this.columnNames = this.tableMeta.columnsMeta.map(columnMeta => columnMeta.name);
  }

  insert() {
    if (this.currentlyEdited) {
      this.currentlyEdited.editableText.disableEdit();
    }

    this.currentlyEdited = undefined;
    const row = lodash.reduce(this.tableMeta.columnsMeta, (result, value) => {
      switch (value.type) {
        case 'Table':
          result[value.name] = [];
          break;
        default:
          result[value.name] = undefined;
          break;
      }

      return result;
    }, {});

    this.dataSource.data.unshift(row);
    this.dataSource.data = this.dataSource.data;

    const tableChange = new TableChange();
    tableChange.action = 'insert';
    tableChange.position = [];
    tableChange.value = row;
    this.changed.emit(tableChange);
  }

  delete() {

  }

  valueChanged(value: any, row: object, column: string) {
    if (value instanceof TableChange) {
      value.position.unshift({ row: row, column: column });
      this.changed.emit(value);
    } else {
      // this.dataSource.data[row][column] = value;
      const tableChange = new TableChange();
      tableChange.action = 'update';
      tableChange.position = [{ row: row, column: column }];
      tableChange.value = value;
      this.changed.emit(tableChange);
    }
  }

  editDisabled() {
    this.currentlyEdited = undefined;
  }

  getTypeWithMeta(columnName: string) {
    const columnMeta = lodash.find(this.tableMeta.columnsMeta, { name: columnName });

    if (columnMeta) {
      return {
        name: columnMeta.type,
        meta: columnMeta.typeMeta
      };
    }

    return undefined;
  }

  enableEdit(event: Event, row: number, column: string, editableText: EditableTextComponent) {
    event.stopPropagation();

    if (this.currentlyEdited && this.currentlyEdited.row === row && this.currentlyEdited.column === column) {
      return;
    }

    if (this.currentlyEdited) {
      this.currentlyEdited.editableText.disableEdit();
    }

    editableText.enableEdit();
    this.currentlyEdited = { row: row, column: column, editableText: editableText };
  }

  isCurrentlyEdited(row: number, column: string): boolean {
    if (this.currentlyEdited) {
      return (this.currentlyEdited.row === row && this.currentlyEdited.column === column);
    }
    return false;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sortChange(event) {
    console.log(event);
  }


}
