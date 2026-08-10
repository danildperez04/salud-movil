import type { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = 'Sin registros',
}: TableProps<T>) {
  if (rows.length === 0) {
    return (
      <p className='py-8 text-center text-sm text-slate-500'>{emptyMessage}</p>
    );
  }
  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-left text-sm'>
        <thead>
          <tr className='border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500'>
            {columns.map((column) => (
              <th key={column.header} className='px-3 py-2 font-semibold'>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-100'>
          {rows.map((row) => (
            <tr key={rowKey(row)} className='hover:bg-slate-50'>
              {columns.map((column) => (
                <td key={column.header} className='px-3 py-3 align-top'>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
