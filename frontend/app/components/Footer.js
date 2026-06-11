import Link from 'next/link';
import styles from './Footer.module.css';
import SupabaseStatus from './SupabaseStatus';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.col}>
            <div className={styles.logo}><span>ADV</span>RIDER</div>
            <p className={styles.desc}>Built by riders, for riders. The adventure motorcycle app that works when nothing else does.</p>
            <div className={styles.socials}>
              <a href="#" aria-label="Twitter"><i className="fa-brands fa-x-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
            </div>
          </div>
          <div className={styles.col}>
            <h4>App</h4>
            <Link href="/map">Live Map</Link>
            <Link href="/routes">Routes</Link>
            <Link href="/safety">Safety</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/community">Community</Link>
          </div>
          <div className={styles.col}>
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Press Kit</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div className={styles.col}>
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>© 2026 ADV Rider Technologies Pvt. Ltd. Bengaluru, India</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <SupabaseStatus />
            <span className={styles.love}>Made with ❤️ on a Royal Enfield Himalayan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

