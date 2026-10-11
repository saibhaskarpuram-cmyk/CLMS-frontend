import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function AlertBanner({ type = 'success', message, onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className={`alert-banner ${isSuccess ? 'alert-success' : 'alert-danger'}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        <span>{message}</span>
      </div>
      {onClose && (
        <button type="button" className="alert-close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
