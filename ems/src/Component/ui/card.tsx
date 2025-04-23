import React from 'react';

interface CardProps {
    className?: string;
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-4 ${className || ''}`}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="mb-4">{children}</div>;
};

export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <h3 className="text-lg font-bold text-gray-800">{children}</h3>;
};

export const CardDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <p className="text-gray-600">{children}</p>;
};

export const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div>{children}</div>;
};