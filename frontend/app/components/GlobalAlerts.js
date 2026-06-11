'use client';
import { useState, useEffect } from 'react';
import styles from './GlobalAlerts.module.css';

export default function GlobalAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function checkAlerts() {
      try {
        const bikesRes = await fetch('http://localhost:8000/api/bikes');
        const bikesData = await bikesRes.json();
        if (bikesData.length > 0) {
          const alertsRes = await fetch(`http://localhost:8000/api/service-alerts/${bikesData[0].id}`);
          const alertsData = await alertsRes.json();
          const overdue = alertsData.alerts?.filter(a => a.status === 'overdue' || a.km_remaining <= 100) || [];
          setAlerts(overdue);
        }
      } catch (e) {
        console.error('Failed to fetch global alerts', e);
      }
    }
    checkAlerts();
    // Check every minute just in case
    const interval = setInterval(checkAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  if (alerts.length === 0 || dismissed) return null;

  return (
    <div className={styles.alertBar}>
      <i className="fa-solid fa-triangle-exclamation"></i>
      <div className={styles.alertContent}>
        <strong>Service Required!</strong>
        <span>
          {alerts.map(a => a.title).join(', ')} 
          {alerts.some(a => a.type === 'chain_lube') && " — Clean and lube your chain immediately for safety and performance."}
        </span>
      </div>
      <button className={styles.closeBtn} onClick={() => setDismissed(true)}>
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
}
