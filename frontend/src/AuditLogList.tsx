import React from 'react';
import { AuditLog } from '@/types';
import { Terminal, Clock, ChevronRight, Hash } from 'lucide-react';

interface AuditLogListProps {
  logs?: AuditLog[];
}

export default function AuditLogList({ logs = [] }: AuditLogListProps) {
  if (logs.length === 0) {
    return (
      <div className="p-20 text-center flex flex-col items-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-white/5">
          <Terminal size={24} className="text-slate-600" />
        </div>
        <div className="space-y-1">
          <p className="text-white font-bold uppercase tracking-widest text-xs">No entries found</p>
          <p className="text-slate-500 text-[10px] uppercase tracking-wider font-medium">Activity history will appear here as you use the platform</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {logs.map((log, index) => (
        <div 
          key={log.id} 
          className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group animate-in slide-in-from-left duration-500"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center space-x-5">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:border-indigo-200 transition-colors text-gray-400 group-hover:text-indigo-600">
              <Hash size={16} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                {log.action.replace(/_/g, ' ')}
              </p>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <Clock size={10} />
                  <span>{new Date(log.created_at).toLocaleString()}</span>
                </div>
                {log.details && (
                  <>
                    <span className="text-gray-200">•</span>
                    <span className="text-[10px] text-indigo-600 font-mono tracking-tighter bg-indigo-50 px-1.5 rounded">
                      {typeof log.details === 'object' ? JSON.stringify(log.details).substring(0, 60) : log.details}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-900">
            <ChevronRight size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}