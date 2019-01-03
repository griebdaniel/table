import { Component, OnInit } from '@angular/core';
// import { TableMeta, AutocompleteWithMapperMeta } from '../table/editable-text/types';
import { AutocompleteWithMapperMeta, TableMeta  } from 'data-table';
import * as lodash from 'lodash';
import { of } from 'rxjs';

@Component({
  selector: 'app-table-tester',
  templateUrl: './table-tester.component.html',
  styleUrls: ['./table-tester.component.scss']
})
export class TableTesterComponent implements OnInit {

  private colors = [
    { id: 2, name: 'blue' },
    { id: 4, name: 'black' },
    { id: 1, name: 'yellow' },
    { id: 3, name: 'red' },
    { id: 5, name: 'green' },
    { id: 6, name: 'purple' },
    { id: 7, name: 'orange' }
  ];

  private data;

  private tableMeta: TableMeta;

  constructor() {


  }

  ngOnInit(): void {
    const flatData = [
      {
        name: 'foo', quantity: 10, elements: [
          {
            type: 'abc', color: { id: 2, name: 'blue' }, positions: [
              { x: 1, y: 0 },
              { x: 1, y: 0 },
            ]
          },
          {
            type: 'def', color: { id: 4, name: 'black' }, positions: [
              { x: 1, y: 0 },
              { x: 1, y: 0 },
            ]
          }
        ]
      },
      {
        name: 'bar', quantity: 20, elements: [
          {
            type: 'ghi', color: { id: 1, name: 'yellow' }, positions: [
              { x: 1, y: 0 },
              { x: 1, y: 0 },
            ]
          },
          {
            type: 'jkl', color: { id: 3, name: 'red' }, positions: [
              { x: 1, y: 0 },
              { x: 1, y: 0 },
            ]
          }
        ]
      }
    ];

    this.data = of(flatData);

    const positionsTableMeta = new TableMeta();
    positionsTableMeta.columnsMeta = [
      { name: 'x', type: 'Number' },
      { name: 'y', type: 'Number' },
    ];

    const elementsTableMeta = new TableMeta();
    const acMapper = new AutocompleteWithMapperMeta();
    acMapper.options = this.colors;
    acMapper.map = (value: any) => {
      if (value !== undefined) {
        return value.name;
      }
    };

    elementsTableMeta.columnsMeta = [
      { name: 'type', type: 'Text' },
      { name: 'color', type: 'AutocompleteWithMapper', typeMeta: acMapper },
      { name: 'positions', type: 'Table', typeMeta: positionsTableMeta }
    ];

    this.tableMeta = new TableMeta();
    this.tableMeta.columnsMeta = [
      { name: 'name', type: 'Text' },
      { name: 'quantity', type: 'Number', typeMeta: acMapper },
      { name: 'elements', type: 'Table', typeMeta: elementsTableMeta }
    ];
  }

  changed(data: any) {
    console.log(data);
  }

}
