import { supabase } from './supabase';
import type { Database } from '../types/supabase';

type TableName = keyof Database['public']['Tables'];

export interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: any;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  foreignTable?: string;
  foreignColumn?: string;
}

export interface TableInfo {
  name: string;
  columns: TableColumn[];
  rowCount: number;
}

export interface TableData {
  rows: any[];
  totalCount: number;
  hasMore: boolean;
}

export class TableEditorService {
  /**
   * Get all available tables in the database
   */
  static async getTables(): Promise<TableInfo[]> {
    try {
      // Get table information from information_schema
      const { data, error } = await supabase.rpc('get_table_info');
      
      if (error) {
        // Fallback: manually define table info based on our known schema
        return this.getKnownTables();
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching tables:', error);
      return this.getKnownTables();
    }
  }

  /**
   * Get known tables based on our TypeScript schema
   */
  private static getKnownTables(): TableInfo[] {
    const tables: TableInfo[] = [
      {
        name: 'accounts',
        columns: [
          { name: 'id', type: 'bigint', nullable: false, defaultValue: null, isPrimaryKey: true, isForeignKey: false },
          { name: 'user_id', type: 'uuid', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: true, foreignTable: 'auth.users', foreignColumn: 'id' },
          { name: 'account_number', type: 'text', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'routing_number', type: 'text', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'account_type', type: 'text', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'balance', type: 'numeric', nullable: true, defaultValue: 0, isPrimaryKey: false, isForeignKey: false },
          { name: 'is_frozen', type: 'boolean', nullable: true, defaultValue: false, isPrimaryKey: false, isForeignKey: false },
          { name: 'created_at', type: 'timestamptz', nullable: true, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false }
        ],
        rowCount: 0
      },
      {
        name: 'cards',
        columns: [
          { name: 'id', type: 'bigint', nullable: false, defaultValue: null, isPrimaryKey: true, isForeignKey: false },
          { name: 'user_id', type: 'uuid', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: true, foreignTable: 'auth.users', foreignColumn: 'id' },
          { name: 'account_id', type: 'bigint', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: true, foreignTable: 'accounts', foreignColumn: 'id' },
          { name: 'card_number', type: 'varchar', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'card_type', type: 'varchar', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'expiry_date', type: 'varchar', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'cvv', type: 'varchar', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'card_holder_name', type: 'varchar', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'is_active', type: 'boolean', nullable: true, defaultValue: true, isPrimaryKey: false, isForeignKey: false },
          { name: 'created_at', type: 'timestamptz', nullable: true, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false },
          { name: 'updated_at', type: 'timestamptz', nullable: true, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false }
        ],
        rowCount: 0
      },
      {
        name: 'profiles',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, defaultValue: null, isPrimaryKey: true, isForeignKey: true, foreignTable: 'auth.users', foreignColumn: 'id' },
          { name: 'email', type: 'text', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'first_name', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'last_name', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'full_name', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'phone', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'address', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'city', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'state', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'zip', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'date_of_birth', type: 'date', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'ssn', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'mothers_maiden_name', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'referral_source', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'avatar_url', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'is_admin', type: 'boolean', nullable: true, defaultValue: false, isPrimaryKey: false, isForeignKey: false },
          { name: 'role', type: 'text', nullable: true, defaultValue: 'user', isPrimaryKey: false, isForeignKey: false },
          { name: 'created_at', type: 'timestamptz', nullable: true, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false },
          { name: 'updated_at', type: 'timestamptz', nullable: true, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false }
        ],
        rowCount: 0
      },
      {
        name: 'notifications',
        columns: [
          { name: 'id', type: 'bigint', nullable: false, defaultValue: null, isPrimaryKey: true, isForeignKey: false },
          { name: 'user_id', type: 'uuid', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: true, foreignTable: 'auth.users', foreignColumn: 'id' },
          { name: 'title', type: 'text', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'message', type: 'text', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'type', type: 'text', nullable: true, defaultValue: 'info', isPrimaryKey: false, isForeignKey: false },
          { name: 'is_read', type: 'boolean', nullable: true, defaultValue: false, isPrimaryKey: false, isForeignKey: false },
          { name: 'created_at', type: 'timestamptz', nullable: true, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false },
          { name: 'updated_at', type: 'timestamptz', nullable: true, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false }
        ],
        rowCount: 0
      },
      {
        name: 'transactions',
        columns: [
          { name: 'id', type: 'bigint', nullable: false, defaultValue: null, isPrimaryKey: true, isForeignKey: false },
          { name: 'account_id', type: 'bigint', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: true, foreignTable: 'accounts', foreignColumn: 'id' },
          { name: 'amount', type: 'numeric', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'description', type: 'text', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'transaction_type', type: 'text', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'created_at', type: 'timestamptz', nullable: true, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false }
        ],
        rowCount: 0
      },
      {
        name: 'banners',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, defaultValue: 'gen_random_uuid()', isPrimaryKey: true, isForeignKey: false },
          { name: 'title', type: 'text', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'description', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'content', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'image_url', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'link_url', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'is_active', type: 'boolean', nullable: true, defaultValue: true, isPrimaryKey: false, isForeignKey: false },
          { name: 'created_at', type: 'timestamptz', nullable: true, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false },
          { name: 'updated_at', type: 'timestamptz', nullable: true, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false }
        ],
        rowCount: 0
      },
      {
        name: 'user_financial_goals',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, defaultValue: 'gen_random_uuid()', isPrimaryKey: true, isForeignKey: false },
          { name: 'user_id', type: 'uuid', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: true, foreignTable: 'auth.users', foreignColumn: 'id' },
          { name: 'title', type: 'text', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'target_amount', type: 'numeric', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'current_amount', type: 'numeric', nullable: true, defaultValue: 0, isPrimaryKey: false, isForeignKey: false },
          { name: 'deadline', type: 'date', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'description', type: 'text', nullable: true, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'category', type: 'text', nullable: true, defaultValue: 'General', isPrimaryKey: false, isForeignKey: false },
          { name: 'icon_name', type: 'text', nullable: true, defaultValue: 'Target', isPrimaryKey: false, isForeignKey: false },
          { name: 'color', type: 'text', nullable: true, defaultValue: 'green', isPrimaryKey: false, isForeignKey: false },
          { name: 'display_order', type: 'integer', nullable: true, defaultValue: 0, isPrimaryKey: false, isForeignKey: false },
          { name: 'is_active', type: 'boolean', nullable: true, defaultValue: true, isPrimaryKey: false, isForeignKey: false },
          { name: 'created_at', type: 'timestamptz', nullable: true, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false },
          { name: 'updated_at', type: 'timestamptz', nullable: true, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false }
        ],
        rowCount: 0
      },
      {
        name: 'user_upcoming_bills',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, defaultValue: 'gen_random_uuid()', isPrimaryKey: true, isForeignKey: false },
          { name: 'user_id', type: 'uuid', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: true, foreignTable: 'auth.users', foreignColumn: 'id' },
          { name: 'name', type: 'text', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'amount', type: 'numeric', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'due_date', type: 'date', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'category', type: 'text', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'is_paid', type: 'boolean', nullable: true, defaultValue: false, isPrimaryKey: false, isForeignKey: false },
          { name: 'display_order', type: 'integer', nullable: true, defaultValue: 0, isPrimaryKey: false, isForeignKey: false },
          { name: 'is_active', type: 'boolean', nullable: true, defaultValue: true, isPrimaryKey: false, isForeignKey: false },
          { name: 'created_at', type: 'timestamptz', nullable: true, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false },
          { name: 'updated_at', type: 'timestamptz', nullable: true, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false }
        ],
        rowCount: 0
      },
      {
        name: 'user_statistics_cards',
        columns: [
          { name: 'id', type: 'uuid', nullable: false, defaultValue: 'gen_random_uuid()', isPrimaryKey: true, isForeignKey: false },
          { name: 'user_id', type: 'uuid', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: true, foreignTable: 'auth.users', foreignColumn: 'id' },
          { name: 'title', type: 'text', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'value', type: 'text', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'change_value', type: 'numeric', nullable: true, defaultValue: 0, isPrimaryKey: false, isForeignKey: false },
          { name: 'change_type', type: 'text', nullable: true, defaultValue: 'neutral', isPrimaryKey: false, isForeignKey: false },
          { name: 'icon_name', type: 'text', nullable: false, defaultValue: null, isPrimaryKey: false, isForeignKey: false },
          { name: 'color', type: 'text', nullable: true, defaultValue: 'blue', isPrimaryKey: false, isForeignKey: false },
          { name: 'display_order', type: 'integer', nullable: true, defaultValue: 0, isPrimaryKey: false, isForeignKey: false },
          { name: 'is_active', type: 'boolean', nullable: true, defaultValue: true, isPrimaryKey: false, isForeignKey: false },
          { name: 'created_at', type: 'timestamptz', nullable: true, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false },
          { name: 'updated_at', type: 'timestamptz', nullable: true, defaultValue: 'now()', isPrimaryKey: false, isForeignKey: false }
        ],
        rowCount: 0
      }
    ];

    // Get row counts for each table
    return Promise.all(tables.map(async (table) => {
      try {
        const { count } = await supabase
          .from(table.name as any)
          .select('*', { count: 'exact', head: true });
        return { ...table, rowCount: count || 0 };
      } catch (error) {
        console.error(`Error getting count for table ${table.name}:`, error);
        return { ...table, rowCount: 0 };
      }
    }));
  }

  /**
   * Get data from a specific table with pagination
   */
  static async getTableData(
    tableName: string,
    page: number = 1,
    pageSize: number = 50,
    searchTerm?: string,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<TableData> {
    try {
      let query = supabase.from(tableName as any).select('*', { count: 'exact' });

      // Apply search if provided
      if (searchTerm) {
        // For now, we'll search in the first few text columns
        // In a real implementation, you might want to make this more sophisticated
        const { data: columns } = await supabase
          .from('information_schema.columns')
          .select('column_name')
          .eq('table_name', tableName)
          .eq('data_type', 'text');

        if (columns && columns.length > 0) {
          const searchColumns = columns.map(col => `${col.column_name}.ilike.%${searchTerm}%`);
          query = query.or(searchColumns.join(','));
        }
      }

      // Apply sorting
      if (sortBy) {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        rows: data || [],
        totalCount: count || 0,
        hasMore: (count || 0) > page * pageSize
      };
    } catch (error) {
      console.error(`Error fetching data from table ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Insert a new row into a table
   */
  static async insertRow(tableName: string, data: any): Promise<any> {
    try {
      const { data: result, error } = await supabase
        .from(tableName as any)
        .insert(data)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return result;
    } catch (error) {
      console.error(`Error inserting row into table ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Update a row in a table
   */
  static async updateRow(tableName: string, id: any, data: any): Promise<any> {
    try {
      const { data: result, error } = await supabase
        .from(tableName as any)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return result;
    } catch (error) {
      console.error(`Error updating row in table ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a row from a table
   */
  static async deleteRow(tableName: string, id: any): Promise<void> {
    try {
      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Error deleting row from table ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Get foreign key options for a column
   */
  static async getForeignKeyOptions(tableName: string, columnName: string): Promise<any[]> {
    try {
      // This is a simplified implementation
      // In a real scenario, you'd query the foreign key relationships
      if (columnName === 'user_id') {
        const { data } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name')
          .limit(100);
        return data || [];
      }
      
      if (columnName === 'account_id') {
        const { data } = await supabase
          .from('accounts')
          .select('id, account_number, account_type')
          .limit(100);
        return data || [];
      }

      return [];
    } catch (error) {
      console.error(`Error fetching foreign key options for ${tableName}.${columnName}:`, error);
      return [];
    }
  }

  /**
   * Execute raw SQL query (admin only)
   */
  static async executeQuery(query: string): Promise<any> {
    try {
      // Note: This would require a custom RPC function in Supabase
      // For security reasons, this should be heavily restricted
      const { data, error } = await supabase.rpc('execute_sql', { query });
      
      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }
}
