import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { TableTesterComponent } from './table-tester/table-tester.component';
import { DataTableModule } from 'data-table';

@NgModule({
  declarations: [
    AppComponent, TableTesterComponent, 
  ],
  imports: [
    BrowserModule, FormsModule, DataTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
