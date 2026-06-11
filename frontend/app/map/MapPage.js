'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './MapPage.module.css';

const MapView = dynamic(() => import('../components/MapView'), { ssr: false, loading: () => <div className={styles.loading}><i className="fa-solid fa-spinner fa-spin" style={{marginRight:8}}></i>Loading map...</div> });

export default function MapPage() {
  const [filter, setFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All', icon: 'fa-layer-group' },
    { id: 'routes', label: 'Routes', icon: 'fa-route' },
    { id: 'hazards', label: 'Hazards', icon: 'fa-triangle-exclamation' },
    { id: 'fuel', label: 'Fuel', icon: 'fa-gas-pump' },
    { id: 'stays', label: 'Stays', icon: 'fa-hotel' },
    { id: 'mechanics', label: 'Mechanics', icon: 'fa-wrench' },
    { id: 'restaurants', label: 'Food', icon: 'fa-utensils' },
    { id: 'hospitals', label: 'Hospitals', icon: 'fa-hospital' },
    { id: 'autoshops', label: 'Auto Shops', icon: 'fa-store' },
  ];

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>
          <i className="fa-solid fa-map-location-dot" style={{ color: 'var(--accent)' }}></i> Live Map
        </h2>
        <p className={styles.desc}>Real-time community data from 12,400+ riders across India.</p>

        <div className={styles.filters}>
          {filters.map(f => (
            <button key={f.id} className={`${styles.filterBtn} ${filter === f.id ? styles.filterActive : ''}`} onClick={() => setFilter(f.id)}>
              <i className={`fa-solid ${f.icon}`}></i> {f.label}
            </button>
          ))}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Quick Stats</h3>
          <div className={styles.statGrid}>
            <div className={styles.stat}><span className={styles.statNum}>6</span><span className={styles.statLabel}>Routes</span></div>
            <div className={styles.stat}><span className={styles.statNum}>3</span><span className={styles.statLabel}>Hazards</span></div>
            <div className={styles.stat}><span className={styles.statNum}>5</span><span className={styles.statLabel}>Fuel</span></div>
            <div className={styles.stat}><span className={styles.statNum}>3</span><span className={styles.statLabel}>Stays</span></div>
          </div>
          <div className={styles.statGrid} style={{ marginTop: 8 }}>
            <div className={styles.stat}><span className={styles.statNum} style={{ color: '#f97316' }}>6</span><span className={styles.statLabel}>Food</span></div>
            <div className={styles.stat}><span className={styles.statNum} style={{ color: '#ef4444' }}>5</span><span className={styles.statLabel}>Hospitals</span></div>
            <div className={styles.stat}><span className={styles.statNum} style={{ color: '#a855f7' }}>5</span><span className={styles.statLabel}>Auto Shops</span></div>
            <div className={styles.stat}><span className={styles.statNum} style={{ color: '#FFD700' }}>3</span><span className={styles.statLabel}>Mechanics</span></div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Nearby Alerts</h3>
          <div className={styles.hazardList}>
            <div className={styles.hazard}>
              <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--accent)' }}></i>
              <div><strong>Landslide debris</strong><br /><small>Near Coorg · 2h ago · 5 confirmations</small></div>
            </div>
            <div className={styles.hazard}>
              <i className="fa-solid fa-gas-pump" style={{ color: '#22c55e' }}></i>
              <div><strong>HP Madikeri — ₹104.5/L</strong><br /><small>24/7 · Air available · 2.1 km away</small></div>
            </div>
            <div className={styles.hazard}>
              <i className="fa-solid fa-utensils" style={{ color: '#f97316' }}></i>
              <div><strong>Highway Dhaba NH-275</strong><br /><small>North Indian · 24/7 · 3.5 km away</small></div>
            </div>
            <div className={styles.hazard}>
              <i className="fa-solid fa-hospital" style={{ color: '#ef4444' }}></i>
              <div><strong>Coorg Medical Sciences</strong><br /><small>Trauma · Blood Bank · 24/7 · 5 km</small></div>
            </div>
            <div className={styles.hazard}>
              <i className="fa-solid fa-store" style={{ color: '#a855f7' }}></i>
              <div><strong>RE Showroom Mysuru</strong><br /><small>Parts available · ★★★★ · 12 km</small></div>
            </div>
          </div>
        </div>

        <button className={`btn btn-primary ${styles.reportBtn}`}>
          <i className="fa-solid fa-plus"></i> Report Hazard
        </button>
      </aside>
      <div className={styles.mapArea}>
        <MapView />
      </div>
    </div>
  );
}
