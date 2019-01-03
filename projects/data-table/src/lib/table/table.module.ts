import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtraTableComponent } from './extra-table/extra-table.component';
import { EditableTableComponent } from './editable-table/editable-table.component';
import { SimpleTableComponent } from './simple-table/simple-table.component';
import { EditableTextComponent } from './editable-text/editable-text.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { FocusDirective } from './focus/focus.directive';

import {
  MatTableModule, MatCheckboxModule, MatInputModule, MatDividerModule,
  MatAutocompleteModule, MatIconModule, MatButtonModule, MatSortModule, MatMenuModule, MatPaginatorModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    ExtraTableComponent, EditableTextComponent, TableHeaderComponent, FocusDirective, EditableTableComponent, SimpleTableComponent
  ],
  imports: [
    CommonModule,
    BrowserModule, FormsModule, MatInputModule, MatDividerModule, MatSortModule,
    MatAutocompleteModule, MatCheckboxModule, MatTableModule, MatIconModule, MatPaginatorModule,
    BrowserAnimationsModule, MatButtonModule, MatMenuModule
  ],
  exports: [
    ExtraTableComponent, EditableTextComponent, TableHeaderComponent, FocusDirective, EditableTableComponent, SimpleTableComponent
  ]
})
export class TableModule { }
