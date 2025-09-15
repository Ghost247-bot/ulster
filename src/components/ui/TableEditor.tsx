import React, { useState, useEffect } from 'react';
import { TableEditorService, type TableInfo, type TableData } from '../../lib/tableEditorService';

interface TableEditorProps {
  className?: string;
}

export const TableEditor: React.FC<TableEditorProps> = ({ className = '' }) => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<TableData>({ rows: [], totalCount: 0, hasMore: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [editingRow, setEditingRow] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      loadTableData();
    }
  }, [selectedTable, currentPage, pageSize, searchTerm, sortBy, sortOrder]);

  const loadTables = async () => {
    try {
      setLoading(true);
      const tablesData = await TableEditorService.getTables();
      setTables(tablesData);
      if (tablesData.length > 0) {
        setSelectedTable(tablesData[0].name);
      }
    } catch (err) {
      setError('Failed to load tables');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTableData = async () => {
    if (!selectedTable) return;

    try {
      setLoading(true);
      const data = await TableEditorService.getTableData(
        selectedTable,
        currentPage,
        pageSize,
        searchTerm || undefined,
        sortBy || undefined,
        sortOrder
      );
      setTableData(data);
    } catch (err) {
      setError(`Failed to load data from ${selectedTable}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    setCurrentPage(1);
    setSearchTerm('');
    setSortBy('');
    setSortOrder('asc');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadTableData();
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleEdit = (row: any) => {
    setEditingRow({ ...row });
    setIsEditing(true);
  };

  const handleCreate = () => {
    const table = tables.find(t => t.name === selectedTable);
    if (!table) return;

    const newRow: any = {};
    table.columns.forEach(col => {
      if (!col.isPrimaryKey) {
        newRow[col.name] = col.defaultValue || (col.nullable ? null : '');
      }
    });
    setEditingRow(newRow);
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!editingRow || !selectedTable) return;

    try {
      setLoading(true);
      if (isCreating) {
        await TableEditorService.insertRow(selectedTable, editingRow);
      } else {
        await TableEditorService.updateRow(selectedTable, editingRow.id, editingRow);
      }
      
      setIsEditing(false);
      setIsCreating(false);
      setEditingRow(null);
      loadTableData();
    } catch (err) {
      setError(`Failed to save row: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!selectedTable || !confirm('Are you sure you want to delete this row?')) return;

    try {
      setLoading(true);
      await TableEditorService.deleteRow(selectedTable, id);
      loadTableData();
    } catch (err) {
      setError(`Failed to delete row: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditingRow(null);
  };

  const getCurrentTable = () => {
    return tables.find(t => t.name === selectedTable);
  };

  const formatValue = (value: any, type: string) => {
    if (value === null || value === undefined) return '';
    
    if (type.includes('timestamptz') || type.includes('timestamp')) {
      return new Date(value).toLocaleString();
    }
    
    if (type === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (type === 'numeric' || type === 'decimal') {
      return typeof value === 'number' ? value.toFixed(2) : value;
    }
    
    return String(value);
  };

  const renderInput = (column: any, value: any) => {
    const inputId = `edit-${column.name}`;
    
    if (column.type === 'boolean') {
      return (
        <select
          id={inputId}
          value={value ? 'true' : 'false'}
          onChange={(e) => setEditingRow({ ...editingRow, [column.name]: e.target.value === 'true' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    }
    
    if (column.type.includes('timestamptz') || column.type.includes('timestamp')) {
      return (
        <input
          type="datetime-local"
          id={inputId}
          value={value ? new Date(value).toISOString().slice(0, 16) : ''}
          onChange={(e) => setEditingRow({ ...editingRow, [column.name]: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    }
    
    if (column.type === 'date') {
      return (
        <input
          type="date"
          id={inputId}
          value={value ? new Date(value).toISOString().slice(0, 10) : ''}
          onChange={(e) => setEditingRow({ ...editingRow, [column.name]: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    }
    
    if (column.type === 'numeric' || column.type === 'decimal') {
      return (
        <input
          type="number"
          step="0.01"
          id={inputId}
          value={value || ''}
          onChange={(e) => setEditingRow({ ...editingRow, [column.name]: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    }
    
    if (column.type === 'integer' || column.type === 'bigint') {
      return (
        <input
          type="number"
          id={inputId}
          value={value || ''}
          onChange={(e) => setEditingRow({ ...editingRow, [column.name]: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    }
    
    return (
      <input
        type="text"
        id={inputId}
        value={value || ''}
        onChange={(e) => setEditingRow({ ...editingRow, [column.name]: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  };

  if (loading && tables.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-lg">Loading tables...</div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Database Table Editor</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTable}
            onChange={(e) => handleTableSelect(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {tables.map(table => (
              <option key={table.name} value={table.name}>
                {table.name} ({table.rowCount} rows)
              </option>
            ))}
          </select>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Row
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
          <button
            onClick={() => setError('')}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>
        
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>

      {/* Table */}
      {selectedTable && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {getCurrentTable()?.columns.map(column => (
                    <th
                      key={column.name}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort(column.name)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.name}</span>
                        {sortBy === column.name && (
                          <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.rows.map((row, index) => (
                  <tr key={row.id || index} className="hover:bg-gray-50">
                    {getCurrentTable()?.columns.map(column => (
                      <td key={column.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatValue(row[column.name], column.type)}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(row)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!tableData.hasMore}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
                  {' '}to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, tableData.totalCount)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{tableData.totalCount}</span>
                  {' '}results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!tableData.hasMore}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {(isEditing || isCreating) && editingRow && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {isCreating ? 'Create New Row' : 'Edit Row'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getCurrentTable()?.columns.map(column => (
                  <div key={column.name} className="space-y-1">
                    <label
                      htmlFor={`edit-${column.name}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {column.name}
                      {!column.nullable && !column.isPrimaryKey && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {renderInput(column, editingRow[column.name])}
                    <p className="text-xs text-gray-500">
                      Type: {column.type}
                      {column.isPrimaryKey && ' (Primary Key)'}
                      {column.isForeignKey && ` (Foreign Key → ${column.foreignTable})`}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
