'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SupabaseStatus() {
  const [status, setStatus] = useState('connecting'); // 'connecting' | 'connected' | 'error'
  const [details, setDetails] = useState('');

  useEffect(() => {
    async function checkConnection() {
      try {
        // Query a dummy endpoint/table to check connection and key validity
        const { error } = await supabase.from('routes').select('id').limit(1);
        
        if (error && error.code === 'PGRST301') {
          // JWT/API Key issue
          setStatus('error');
          setDetails('API Key Invalid');
        } else if (error && error.message === 'FetchError') {
          setStatus('error');
          setDetails('Network Unreachable');
        } else {
          // If we got a PG relation error (meaning table doesn't exist) or successfully got data,
          // it means the connection is active and key is accepted.
          setStatus('connected');
          setDetails('Supabase API Connected');
        }
      } catch (err) {
        setStatus('error');
        setDetails(err.message || 'Connection failed');
      }
    }
    checkConnection();
  }, []);

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 12px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      fontSize: '11px',
      fontFamily: 'var(--font-mono, monospace)',
      color: 'var(--text-secondary)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    }}>
      <span style={{
        position: 'relative',
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: status === 'connected' ? '#10b981' : status === 'error' ? '#ef4444' : '#f59e0b',
        boxShadow: status === 'connected' 
          ? '0 0 8px #10b981' 
          : status === 'error' 
            ? '0 0 8px #ef4444' 
            : '0 0 8px #f59e0b'
      }}>
        {status === 'connecting' && (
          <span style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'inherit',
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
            opacity: 0.75
          }} />
        )}
      </span>
      <span>
        {status === 'connected' && 'Supabase Connected'}
        {status === 'connecting' && 'Connecting to Supabase...'}
        {status === 'error' && `Supabase Offline (${details})`}
      </span>
      
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
