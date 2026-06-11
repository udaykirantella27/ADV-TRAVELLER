import styles from './SafetySection.module.css';

export default function SafetySection() {
  return (
    <section id="safety" style={{ background: '#060606' }}>
      <div className="container">
        <span className="section-num">04</span>
        <p className="eyebrow">SAFETY FIRST</p>
        <h2>Built for the worst case scenario</h2>
        <div className={styles.layout}>
          <div className={styles.sosWrap}>
            <div className={styles.sos}>SOS</div>
            <p className={styles.sosText}>Hold 3 seconds to broadcast your last GPS location via SMS — even with 0 bars of signal</p>
          </div>
          <div className={styles.cards}>
            <div className="card">
              <h3><i className="fa-solid fa-car-burst" style={{ color: 'var(--accent)', marginRight: 8 }}></i>Crash Detection</h3>
              <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 8 }}>Gyroscope + accelerometer detect sudden impact. 30-second countdown with loud alarm. If you don&apos;t cancel, SOS fires automatically.</p>
            </div>
            <div className="card">
              <h3><i className="fa-solid fa-hospital" style={{ color: 'var(--accent)', marginRight: 8 }}></i>Hospital Locator</h3>
              <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 8 }}>Offline database of 12,000+ hospitals across India. Works without internet. Shows distance, beds, and trauma grade.</p>
            </div>
            <div className="card">
              <h3><i className="fa-solid fa-people-group" style={{ color: 'var(--accent)', marginRight: 8 }}></i>Group SOS</h3>
              <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 8 }}>Alerts your entire riding squad simultaneously with GPS, battery level, and last known speed. No one left behind.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
