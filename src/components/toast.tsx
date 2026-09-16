'use client';
import { useToast } from '@/lib/toast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(t => (
        <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border shadow-lg bg-background animate-in slide-in-from-right">
          {t.type === 'success' ? <CheckCircle size={18} className="text-green-500 flex-shrink-0" /> : t.type === 'error' ? <AlertCircle size={18} className="text-destructive flex-shrink-0" /> : t.type === 'info' ? <Info size={18} className="text-blue-500 flex-shrink-0" /> : null}
          <p className="text-sm flex-1">{t.message}</p>
          <button onClick={() => removeToast(t.id)} className="text-muted-foreground hover:text-foreground transition-colors"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}
