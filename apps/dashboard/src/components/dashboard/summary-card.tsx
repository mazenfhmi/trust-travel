import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
}

export function SummaryCard({ title, value, icon, trend }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? '+' : '-'}{trend.value}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
