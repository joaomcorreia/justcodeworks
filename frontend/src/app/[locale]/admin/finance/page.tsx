"use client";

import React, { useState, useEffect } from 'react';

// Types
interface SubscriptionColumn {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'currency';
  required: boolean;
}

interface SubscriptionRow {
  id: string;
  data: Record<string, any>;
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [columns, setColumns] = useState<SubscriptionColumn[]>([
    { id: 'service_name', name: 'Service Name', type: 'text', required: true },
    { id: 'provider', name: 'Provider', type: 'text', required: true },
    { id: 'monthly_cost', name: 'Monthly Cost', type: 'currency', required: true },
    { id: 'billing_date', name: 'Billing Date', type: 'date', required: true },
    { id: 'status', name: 'Status', type: 'text', required: false },
  ]);
  
  const [rows, setRows] = useState<SubscriptionRow[]>([
    {
      id: '1',
      data: {
        service_name: 'AWS Hosting',
        provider: 'Amazon Web Services',
        monthly_cost: 150.00,
        billing_date: '2025-11-15',
        status: 'Active'
      }
    },
    {
      id: '2',
      data: {
        service_name: 'Domain Registration',
        provider: 'GoDaddy',
        monthly_cost: 12.99,
        billing_date: '2025-11-20',
        status: 'Active'
      }
    },
    {
      id: '3',
      data: {
        service_name: 'CDN Service',
        provider: 'Cloudflare',
        monthly_cost: 25.00,
        billing_date: '2025-11-10',
        status: 'Active'
      }
    }
  ]);

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumn, setNewColumn] = useState<Partial<SubscriptionColumn>>({
    name: '',
    type: 'text',
    required: false
  });

  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Record<string, any>>({});

  // Calculate totals
  const monthlyTotal = rows.reduce((sum, row) => {
    const cost = row.data.monthly_cost || 0;
    return sum + (typeof cost === 'number' ? cost : parseFloat(cost) || 0);
  }, 0);

  const annualTotal = monthlyTotal * 12;

  const addColumn = () => {
    if (!newColumn.name) return;
    
    const column: SubscriptionColumn = {
      id: newColumn.name.toLowerCase().replace(/\s+/g, '_'),
      name: newColumn.name,
      type: newColumn.type || 'text',
      required: newColumn.required || false
    };

    setColumns([...columns, column]);
    setNewColumn({ name: '', type: 'text', required: false });
    setIsAddingColumn(false);

    // Add empty data for this column to all existing rows
    setRows(rows.map(row => ({
      ...row,
      data: { ...row.data, [column.id]: '' }
    })));
  };

  const deleteColumn = (columnId: string) => {
    if (confirm('Are you sure you want to delete this column? This will remove all data in this column.')) {
      setColumns(columns.filter(col => col.id !== columnId));
      setRows(rows.map(row => {
        const newData = { ...row.data };
        delete newData[columnId];
        return { ...row, data: newData };
      }));
    }
  };

  const startEditingRow = (rowId: string) => {
    const row = rows.find(r => r.id === rowId);
    if (row) {
      setEditingRow(rowId);
      setEditingData({ ...row.data });
    }
  };

  const saveRow = () => {
    if (editingRow) {
      setRows(rows.map(row => 
        row.id === editingRow 
          ? { ...row, data: editingData }
          : row
      ));
    }
    setEditingRow(null);
    setEditingData({});
  };

  const deleteRow = (rowId: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      setRows(rows.filter(row => row.id !== rowId));
    }
  };

  const addNewRow = () => {
    const newRow: SubscriptionRow = {
      id: Date.now().toString(),
      data: columns.reduce((acc, col) => ({ ...acc, [col.id]: '' }), {})
    };
    setRows([...rows, newRow]);
    setEditingRow(newRow.id);
    setEditingData(newRow.data);
  };

  const formatCurrency = (value: any) => {
    const num = typeof value === 'number' ? value : parseFloat(value) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const renderCellValue = (column: SubscriptionColumn, value: any) => {
    if (column.type === 'currency') {
      return formatCurrency(value);
    }
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString();
    }
    return value || '-';
  };

  const renderEditableCell = (column: SubscriptionColumn, value: any) => {
    if (column.type === 'currency') {
      return (
        <input
          type="number"
          step="0.01"
          value={value || ''}
          onChange={(e) => setEditingData({
            ...editingData,
            [column.id]: parseFloat(e.target.value) || 0
          })}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        />
      );
    }
    if (column.type === 'date') {
      return (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => setEditingData({
            ...editingData,
            [column.id]: e.target.value
          })}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        />
      );
    }
    if (column.type === 'number') {
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => setEditingData({
            ...editingData,
            [column.id]: parseFloat(e.target.value) || 0
          })}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        />
      );
    }
    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => setEditingData({
          ...editingData,
          [column.id]: e.target.value
        })}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
      />
    );
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          💰 Finance Management
        </h1>
        <p className="text-gray-600">
          Manage your subscriptions, hosting bills, domain costs and other financial data.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Total</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(monthlyTotal)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Annual Total</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(annualTotal)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">🔢</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Services</p>
              <p className="text-2xl font-semibold text-gray-900">{rows.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subscriptions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              💳 Subscriptions
            </button>
            <button
              onClick={() => setActiveTab('hosting')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'hosting'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🌐 Hosting Bills
            </button>
            <button
              onClick={() => setActiveTab('domains')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'domains'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔗 Domain Bills
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Column Management */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Subscription Management</h3>
            <div className="space-x-2">
              <button
                onClick={() => setIsAddingColumn(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                + Add Column
              </button>
              <button
                onClick={addNewRow}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
              >
                + Add Subscription
              </button>
            </div>
          </div>

          {/* Add Column Form */}
          {isAddingColumn && (
            <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Column</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Column Name
                  </label>
                  <input
                    type="text"
                    value={newColumn.name || ''}
                    onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="e.g., License Cost"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Column Type
                  </label>
                  <select
                    value={newColumn.type}
                    onChange={(e) => setNewColumn({ ...newColumn, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="currency">Currency</option>
                    <option value="date">Date</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newColumn.required || false}
                      onChange={(e) => setNewColumn({ ...newColumn, required: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-xs font-medium text-gray-700">Required</span>
                  </label>
                </div>
                <div className="flex items-end space-x-2">
                  <button
                    onClick={addColumn}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingColumn(false);
                      setNewColumn({ name: '', type: 'text', required: false });
                    }}
                    className="px-3 py-2 bg-gray-500 text-white rounded-md text-xs font-medium hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center justify-between">
                        <span>
                          {column.name}
                          {column.required && <span className="text-red-500 ml-1">*</span>}
                        </span>
                        <button
                          onClick={() => deleteColumn(column.id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                          title="Delete Column"
                        >
                          ✕
                        </button>
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingRow === row.id ? (
                          renderEditableCell(column, editingData[column.id])
                        ) : (
                          renderCellValue(column, row.data[column.id])
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingRow === row.id ? (
                        <div className="space-x-2">
                          <button
                            onClick={saveRow}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingRow(null);
                              setEditingData({});
                            }}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="space-x-2">
                          <button
                            onClick={() => startEditingRow(row.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteRow(row.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rows.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">💰</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions yet</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first subscription.</p>
              <button
                onClick={addNewRow}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Add First Subscription
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}