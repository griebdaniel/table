import { Component, OnInit, Input } from '@angular/core';
import * as lodash from 'lodash';

@Component({
  selector: 'lib-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.scss']
})
export class SimpleTableComponent implements OnInit {

  @Input() data: object[];
  @Input() metaData: string[];
  @Input() columns: string[];

  constructor() { }

  ngOnInit() {
    this.columns = lodash.keys(this.data[0]);
  }
}
