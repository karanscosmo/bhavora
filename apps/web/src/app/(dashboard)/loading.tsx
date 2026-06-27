import React from 'react';

export default function DashboardLoading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        marginLeft: '256px',
        background: 'var(--bg-base)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid var(--border-subtle)',
            borderTopColor: 'var(--accent-navy)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <span className="micro-label" style={{ color: 'var(--text-muted)' }}>
          Loading...
        </span>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
