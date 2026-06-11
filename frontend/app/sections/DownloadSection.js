import Link from 'next/link';
import styles from './DownloadSection.module.css';

export default function DownloadSection() {
  return (
    <section id="download" className={styles.cta}>
      <div className="container">
        <h2 className={styles.heading}>Your next ride starts here.</h2>
        <p className={styles.sub}>Join 12,400+ riders. Completely free. iOS and Android.</p>
        <div className={styles.btns}>
          <a href="#" className={styles.store}>
            <i className="fa-brands fa-apple" style={{ fontSize: 24 }}></i>
            <div><small>Download on the</small><br /><strong>App Store</strong></div>
          </a>
          <a href="#" className={styles.store}>
            <i className="fa-brands fa-google-play" style={{ fontSize: 20 }}></i>
            <div><small>Get it on</small><br /><strong>Google Play</strong></div>
          </a>
        </div>
        <p className={styles.note}>Open access. Free forever. No credit card needed.</p>
      </div>
    </section>
  );
}
