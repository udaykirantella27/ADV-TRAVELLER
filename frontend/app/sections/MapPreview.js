'use client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import styles from './MapPreview.module.css';

const MapView = dynamic(() => import('../components/MapView'), { ssr: false, loading: () => <div className={styles.loading}><i className="fa-solid fa-spinner fa-spin" style={{marginRight:8}}></i>Loading map...</div> });

export default function MapPreview() {
  return (
    <section id="map-preview" style={{ background: '#060606' }}>
      <div className="container">
        <span className="section-num">03</span>
        <p className="eyebrow">LIVE MAP</p>
        <h2>Real routes. Real hazards. Real riders.</h2>
        <p style={{ color: 'var(--text2)', marginBottom: 32, maxWidth: 600 }}>
          Powered by Leaflet with community-reported data. See ADV routes, hazards, fuel stations, mechanics, and biker-friendly stays — all on one dark-themed map.
        </p>
        <div className={styles.mapWrap}>
          <MapView />
        </div>
        <div className={styles.legend}>
          <span><i className="fa-solid fa-route" style={{ color: '#FF4500' }}></i> Routes</span>
          <span><i className="fa-solid fa-triangle-exclamation" style={{ color: '#FF4500' }}></i> Hazards</span>
          <span><i className="fa-solid fa-gas-pump" style={{ color: '#22c55e' }}></i> Fuel</span>
          <span><i className="fa-solid fa-hotel" style={{ color: '#00CED1' }}></i> Stays</span>
          <span><i className="fa-solid fa-wrench" style={{ color: '#FFD700' }}></i> Mechanics</span>
          <span><i className="fa-solid fa-utensils" style={{ color: '#f97316' }}></i> Restaurants</span>
          <span><i className="fa-solid fa-hospital" style={{ color: '#ef4444' }}></i> Hospitals</span>
          <span><i className="fa-solid fa-store" style={{ color: '#a855f7' }}></i> Auto Shops</span>
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link href="/map" className="btn btn-primary btn-lg">
            <i className="fa-solid fa-expand"></i> Open Full Map
          </Link>
        </div>
      </div>
    </section>
  );
}
