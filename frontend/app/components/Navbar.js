'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/map', label: 'Live Map' },
  { href: '/tracker', label: 'Tracker' },
  { href: '/routes', label: 'Routes' },
  { href: '/safety', label: 'Safety' },
  { href: '/community', label: 'Community' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    window.dispatchEvent(new Event('themechange'));
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} aria-label="Main navigation">
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoAccent}>ADV</span>RIDER
            <small className={styles.tagline}>Ride. Survive. Explore.</small>
          </Link>
          <ul className={styles.links}>
            {navLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className={styles.link}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
              {theme === 'dark' ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
            </button>
            <Link href="/map" className={`btn btn-primary ${styles.cta}`}>
              <i className="fa-solid fa-map-location-dot"></i> Open Map
            </Link>
          </div>
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.menuOpen : ''}`}>
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            className={styles.mobileLink}
            style={{ transitionDelay: `${i * 80}ms` }}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <button onClick={toggleTheme} className={styles.mobileThemeToggle} aria-label="Toggle theme">
          {theme === 'dark' ? (
            <><i className="fa-solid fa-sun"></i> Light Mode</>
          ) : (
            <><i className="fa-solid fa-moon"></i> Dark Mode</>
          )}
        </button>
        <Link href="/map" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
          <i className="fa-solid fa-map-location-dot"></i> Open Map
        </Link>
      </div>
    </>
  );
}
