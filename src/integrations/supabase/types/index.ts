import type { Database as DatabaseGenerated } from './generated';
import type { Tables, TablesInsert, TablesUpdate } from './tables';
import type { Enums } from './enums';
import type { CompositeTypes } from './compositeTypes';

export type Database = DatabaseGenerated;
export type { Tables, TablesInsert, TablesUpdate, Enums, CompositeTypes };