'use client';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import styles from './HeroSection.module.css';

const Hero3D = dynamic(() => import('../components/Hero3D'), { ssr: false });

export default function HeroSection() {
  const [typed, setTyped] = useState('');
  const fullText = "The first adventure bike app built by riders who've been stranded at 3am in Ladakh with a flat tyre and no signal.";
  const sectionRef = useRef(null);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTyped(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.hero} id="hero" ref={sectionRef}>
      <Hero3D />
      <div className={`container ${styles.content}`}>
        <div className={styles.text}>
          <span className={styles.pill}>
            <i className="fa-solid fa-bolt"></i> Beta · Open Access · Free
          </span>
          <h1>RIDE<br />WITHOUT<br /><em className={styles.accent}>LIMITS.</em></h1>
          <p className={styles.sub}>{typed}<span className={styles.cursor}>|</span></p>
          <div className={styles.ctas}>
            <Link href="/map" className="btn btn-primary btn-lg">
              <i className="fa-solid fa-map-location-dot"></i> Open Live Map
            </Link>
            <Link href="/routes" className="btn btn-ghost btn-lg">
              <i className="fa-solid fa-route"></i> Explore Routes
            </Link>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>12,400+</strong>
              <span>riders on the platform</span>
            </div>
            <div className={styles.stat}>
              <strong>29</strong>
              <span>survival features</span>
            </div>
            <div className={styles.stat}>
              <strong>0 bars</strong>
              <span>works offline</span>
            </div>
          </div>
        </div>
        <div className={styles.visual}>
          <div className={styles.phone}>
            <div className={styles.phoneScreen}>
              <svg width="200" height="320" viewBox="0 0 200 320">
                <path d="M30 290 Q60 210 100 190 Q140 170 120 110 Q100 50 160 30"
                  stroke="#FF4500" strokeWidth="2" fill="none" strokeDasharray="500" strokeDashoffset="0">
                  <animate attributeName="stroke-dashoffset" from="500" to="0" dur="3s" fill="freeze" />
                </path>
                <circle cx="160" cy="30" r="6" fill="#FF4500">
                  <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
            <div className={`${styles.notif} ${styles.n1}`}>
              <i className="fa-solid fa-check-circle" style={{ color: '#22c55e' }}></i> SOS Sent ✓
            </div>
            <div className={`${styles.notif} ${styles.n2}`}>
              <i className="fa-solid fa-wrench" style={{ color: '#FFD700' }}></i> Mechanic 2.1km
            </div>
            <div className={`${styles.notif} ${styles.n3}`}>
              <i className="fa-solid fa-cloud-rain" style={{ color: '#00CED1' }}></i> Rain in 20 min
            </div>
          </div>
        </div>
      </div>
      <span className="section-num">01</span>
    </section>
  );
}
