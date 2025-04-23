import React from 'react';

export const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                {children}
            </table>
        </div>
    );
};

export const TableHead: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <thead className="bg-gray-100">{children}</thead>;
};

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
            {children}
        </th>
    );
};

export const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <tbody>{children}</tbody>;
};

export const TableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <tr className="hover:bg-gray-50">{children}</tr>;
};

export const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
}) => {
    return (
        <td className={`px-4 py-2 text-sm text-gray-600 border-b ${className || ''}`}>
            {children}
        </td>
    );
};