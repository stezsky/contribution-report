import React from 'react';
import { NoDataIcon } from './icons';

interface ChartPlaceholderProps {
  message?: string;
}

const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ message = 'No data available' }) => {
  return (
    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
      <div className="flex flex-col items-center gap-2 text-center">
        <NoDataIcon className="h-10 w-10" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

export default ChartPlaceholder;
