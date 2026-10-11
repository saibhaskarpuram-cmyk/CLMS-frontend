import React from 'react';

export default function LoadingSpinner({ message = 'Loading records...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}
