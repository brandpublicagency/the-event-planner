import { Database as DatabaseGenerated } from './generated';

// Remove team-related tables completely
export type Database = Omit<
  DatabaseGenerated,
  'companies' | 'teams' | 'team_members'
>;

export type Tables = Database['public']['Tables'];
export type TablesInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type TablesUpdate<T extends keyof Tables> = Tables[T]['Update'];
export type TablesRow<T extends keyof Tables> = Tables[T]['Row'];