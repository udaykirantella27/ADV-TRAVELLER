import styles from './CommunitySection.module.css';

export default function CommunitySection() {
  return (
    <section id="community">
      <div className="container">
        <span className="section-num">05</span>
        <p className="eyebrow">COMMUNITY</p>
        <h2>The living map only riders can build</h2>
        <div className={styles.cards}>
          <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: 36, color: 'var(--accent)', display: 'block', marginBottom: 16 }}></i>
            <h3>Report a hazard</h3>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 8 }}>Your report protects the next rider. Landslide, pothole, flood — one tap to warn thousands.</p>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <i className="fa-solid fa-star" style={{ fontSize: 36, color: 'var(--accent)', display: 'block', marginBottom: 16 }}></i>
            <h3>Rate a stay</h3>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 8 }}>3,400+ biker-friendly stays already rated. Help the next rider find safe parking at midnight.</p>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <i className="fa-solid fa-flag" style={{ fontSize: 36, color: 'var(--accent)', display: 'block', marginBottom: 16 }}></i>
            <h3>Flag a scam</h3>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 8 }}>Community-powered price benchmarks. Know the fair rate before you pay.</p>
          </div>
        </div>
        <div className={styles.stats}>
          <div><span className={styles.num}>12,400+</span><span className={styles.lbl}>Riders</span></div>
          <div><span className={styles.num}>3,400+</span><span className={styles.lbl}>Stays rated</span></div>
          <div><span className={styles.num}>18,000+</span><span className={styles.lbl}>Hazard reports</span></div>
          <div><span className={styles.num}>140+</span><span className={styles.lbl}>Routes mapped</span></div>
        </div>
      </div>
    </section>
  );
}
