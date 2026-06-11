'use client';
import Link from 'next/link';
import styles from './TrackerPreview.module.css';

export default function TrackerPreview() {
  return (
    <section id="tracker-preview" style={{ background: '#060606' }}>
      <div className="container">
        <span className="section-num">04</span>
        <p className="eyebrow">NEW · MILEAGE & TRIP TRACKER</p>
        <h2>Every km counts. We track them all.</h2>
        <p style={{ color: 'var(--text2)', marginBottom: 40, maxWidth: 600, fontSize: 15 }}>
          Bike-specific mileage tracking, service reminders, trip logs with fuel efficiency — and nearby everything you need on the road.
        </p>

        <div className={styles.features}>
          {/* Mileage Tracker */}
          <div className={`card ${styles.feat}`}>
            <div className={styles.featIcon} style={{ background: 'rgba(255,69,0,0.12)' }}>
              <i className="fa-solid fa-gauge-high" style={{ color: '#FF4500', fontSize: 24 }}></i>
            </div>
            <h3>Mileage Tracker</h3>
            <p>Track km per bike. Know your exact odometer reading. Calculate real-world fuel efficiency for every ride.</p>
            <div className={styles.miniDash}>
              <div><strong>12,450</strong><small>km total</small></div>
              <div><strong>28.8</strong><small>km/L avg</small></div>
              <div><strong>510</strong><small>km range</small></div>
            </div>
          </div>

          {/* Trip Logger */}
          <div className={`card ${styles.feat}`}>
            <div className={styles.featIcon} style={{ background: 'rgba(0,206,209,0.12)' }}>
              <i className="fa-solid fa-road" style={{ color: '#00CED1', fontSize: 24 }}></i>
            </div>
            <h3>Trip Start → End</h3>
            <p>Log every ride. Start odometer, end odometer, fuel used. Auto-calculates distance, time, speed, and mileage.</p>
            <div className={styles.tripDemo}>
              <div className={styles.tripPoint}>
                <i className="fa-solid fa-circle" style={{ color: '#22c55e', fontSize: 8 }}></i>
                <span>Bengaluru <small>12,100 km</small></span>
              </div>
              <div className={styles.tripLine}></div>
              <div className={styles.tripPoint}>
                <i className="fa-solid fa-flag-checkered" style={{ color: '#FF4500', fontSize: 10 }}></i>
                <span>Coorg <small>12,365 km</small></span>
              </div>
              <div className={styles.tripResult}>265 km · 6h 30m · 28.8 km/L</div>
            </div>
          </div>

          {/* Service Reminder */}
          <div className={`card ${styles.feat}`}>
            <div className={styles.featIcon} style={{ background: 'rgba(255,215,0,0.12)' }}>
              <i className="fa-solid fa-wrench" style={{ color: '#FFD700', fontSize: 24 }}></i>
            </div>
            <h3>Service Reminders</h3>
            <p>Never miss an oil change, chain lube, or general service. Alerts based on km driven — not calendar dates.</p>
            <div className={styles.reminderList}>
              <div className={styles.reminderItem}>
                <span className={styles.reminderDot} style={{ background: '#ef4444' }}></span>
                <span>Chain Lube <small className={styles.overdue}>Overdue by 50 km</small></span>
              </div>
              <div className={styles.reminderItem}>
                <span className={styles.reminderDot} style={{ background: '#FFD700' }}></span>
                <span>General Service <small className={styles.upcoming}>In 2,550 km</small></span>
              </div>
              <div className={styles.reminderItem}>
                <span className={styles.reminderDot} style={{ background: '#22c55e' }}></span>
                <span>Oil Change <small>In 2,550 km</small></span>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby POIs */}
        <div className={styles.nearbySection}>
          <h3 className={styles.nearbyTitle}>Nearby on every ride</h3>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>Live proximity alerts and one-tap navigation to everything you need.</p>
          <div className={styles.nearbyGrid}>
            <div className={styles.nearbyCard}>
              <i className="fa-solid fa-gas-pump" style={{ color: '#22c55e' }}></i>
              <strong>Petrol Pumps</strong>
              <p>5 stations nearby · HP, Shell, Indian Oil · 24/7 availability · fuel prices</p>
            </div>
            <div className={styles.nearbyCard}>
              <i className="fa-solid fa-utensils" style={{ color: '#f97316' }}></i>
              <strong>Restaurants & Dhabas</strong>
              <p>6 food stops · Highway dhabas, cafes · rider-rated · parking info</p>
            </div>
            <div className={styles.nearbyCard}>
              <i className="fa-solid fa-hospital" style={{ color: '#ef4444' }}></i>
              <strong>Hospitals & Clinics</strong>
              <p>5 medical facilities · Trauma centres, blood banks · 24/7 emergency</p>
            </div>
            <div className={styles.nearbyCard}>
              <i className="fa-solid fa-wrench" style={{ color: '#FFD700' }}></i>
              <strong>Mechanic Shops</strong>
              <p>3 verified mechanics · RE specialists, general · fair pricing · rated</p>
            </div>
            <div className={styles.nearbyCard}>
              <i className="fa-solid fa-store" style={{ color: '#a855f7' }}></i>
              <strong>Auto Showrooms & Parts</strong>
              <p>5 auto shops · RE, KTM showrooms · spare parts · tyre shops · accessories</p>
            </div>
            <div className={styles.nearbyCard}>
              <i className="fa-solid fa-hotel" style={{ color: '#00CED1' }}></i>
              <strong>Biker Stays</strong>
              <p>3 verified stays · secure parking · camping spots · night-friendly</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/tracker" className="btn btn-primary btn-lg">
            <i className="fa-solid fa-gauge-high"></i> Open Ride Tracker
          </Link>
        </div>
      </div>
    </section>
  );
}
