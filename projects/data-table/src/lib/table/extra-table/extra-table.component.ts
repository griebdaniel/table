import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import * as lodash from 'lodash';
import { TableMeta, TableChange, EditableType, ColumnMeta, AutocompleteWithMapperMeta } from '../editable-text/types';
import { EditableTextComponent } from '../editable-text/editable-text.component';

import { MatTableDataSource, MatSort, MatPaginator, MatTable } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'lib-extra-table',
  templateUrl: './extra-table.component.html',
  styleUrls: ['./extra-table.component.scss']
})
export class ExtraTableComponent implements OnInit {
  @Input() data: any;
  @Input() tableMeta: TableMeta;

  @Output() changed = new EventEmitter();
  @Output() closed = new EventEmitter();

  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);

  columnNames: string[];
  currentlyEdited: { row: object, column: string, editableText: any };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('table') table: MatTable<any>;

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    if (!this.data || !this.tableMeta) {
      throw new Error('data or meta is undefined');
    }

    this.dataSource.paginator = this.paginator;

    if (lodash.isArray(this.data)) {
      this.dataSource.data = this.data;
    } else {
      this.data.subscribe((data: any) => {
        this.dataSource.data = data;
      });
    }

    const filterPredicate = (element: object, filter: string): boolean => {
      let expression = '';

      lodash.forIn(element, (value: any, property: string) => {
        const columnMeta = lodash.find(this.tableMeta.columnsMeta, { name: property });

        if (columnMeta) {
          switch (columnMeta.type) {
            case 'AutocompleteWithMapper':
              const typeMeta = <AutocompleteWithMapperMeta>columnMeta.typeMeta;
              expression += typeMeta.map(value);
              break;
            case 'Table':
              expression += value.length;
              break;
            default:
              expression += value;
          }
        }
      });

      return expression.indexOf(filter) > -1;
    };

    this.dataSource.filterPredicate = filterPredicate;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      const columnMeta = lodash.find(this.tableMeta.columnsMeta, { name: property });

      if (columnMeta) {
        switch (columnMeta.type) {
          case 'AutocompleteWithMapper':
            const typeMeta = <AutocompleteWithMapperMeta>columnMeta.typeMeta;
            return typeMeta.map(item[property]);
          case 'Table':
            return item[property].length;
        }
      }

      return item[property];
    };
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
        case 'Number':
          result[value.name] = 0;
          break;
        case 'Text':
          result[value.name] = '';
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
    const rows = lodash.cloneDeep(this.selection.selected);
    const tableChange = new TableChange();
    tableChange.action = 'delete';
    tableChange.position = [];
    tableChange.value = rows;
    this.changed.emit(tableChange);

    lodash.remove(this.dataSource.data, (element) => {
      return lodash.find(this.selection.selected, (selected) => selected === element);
    });

    this.dataSource.data = this.dataSource.data;

    console.log(this.dataSource.data);

    this.selection.clear();
  }

  valueChanged(value: any, element: object, column: string) {
    if (value instanceof TableChange) {
      value.position.unshift({ row: element, column: column });
      this.changed.emit(value);
    } else {
      const tableChange = new TableChange();
      tableChange.action = 'update';
      tableChange.position = [{ row: lodash.cloneDeep(element), column: column }];
      tableChange.value = value;
      this.changed.emit(tableChange);
      element[column] = value;
    }

  }

  enableEdit(event: Event, row: object, column: string, editableText: EditableTextComponent) {
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

  disableEdit() {
    if (this.currentlyEdited) {
      this.currentlyEdited.editableText.disableEdit();
    }

    this.currentlyEdited = undefined;
  }

  editDisabled() {
    this.currentlyEdited = undefined;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }


  close() {
    setTimeout(() => this.closed.emit(), 0);
  }

  isCurrentlyEdited(row: object, column: string): boolean {
    if (this.currentlyEdited) {
      return (this.currentlyEdited.row === row && this.currentlyEdited.column === column);
    }
    return false;
  }

  getColumnNamesWithSelect() {
    const columnNames = lodash.clone(this.columnNames);
    columnNames.unshift('select');
    return columnNames;
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

}
