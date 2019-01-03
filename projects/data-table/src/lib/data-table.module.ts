import { NgModule } from '@angular/core';
import { DataTableComponent } from './data-table.component';
import { TableModule } from './table/table.module';

@NgModule({
  declarations: [DataTableComponent],
  imports: [TableModule],
  exports: [DataTableComponent, TableModule]
})
export class DataTableModule { }
