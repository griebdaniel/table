export type EditableType = 'Text' | 'Number' | 'Table' | 'AutocompleteWithMapper';

export interface ColumnMeta {
  name: string;
  type: EditableType;
  typeMeta?: AutocompleteWithMapperMeta | TableMeta;
}

export class AutocompleteWithMapperMeta {
  options: any[];
  map: (value: any) => any;
}

export class TableMeta {
  columnsMeta: Array<ColumnMeta>;
}

export class TableChange {
  action: 'update' | 'insert' | 'delete';
  position: Array<{ row: object, column: string }>;
  value: any;
}
