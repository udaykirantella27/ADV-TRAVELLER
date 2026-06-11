'use client';
import { useState } from 'react';
import styles from './FeaturesSection.module.css';

const categories = {
  Safety: [
    { name: 'SOS Panic Button', p: 'P1', icon: 'fa-circle-exclamation', prob: 'No way to alert anyone when you crash alone', sol: 'One-tap SOS broadcasts GPS via SMS even without data' },
    { name: 'Crash Detection', p: 'P1', icon: 'fa-car-burst', prob: "You're unconscious after a fall, no one knows", sol: 'Gyroscope + accelerometer detect impact, 30s countdown then auto-alert' },
    { name: 'Hospital Locator', p: 'P1', icon: 'fa-hospital', prob: 'Nearest hospital unknown in remote areas', sol: 'Offline database of trauma centres, blood banks, and clinics' },
    { name: 'Fatigue Alert', p: 'P2', icon: 'fa-eye', prob: 'Drowsy riding kills more than speed', sol: 'Time-based alerts with rest stop suggestions every 2 hours' },
    { name: 'Hazard Alerts', p: 'P2', icon: 'fa-triangle-exclamation', prob: 'No warning for landslides or floods', sol: 'Community-reported hazards synced before every ride' },
    { name: 'Night Mode', p: 'P2', icon: 'fa-moon', prob: 'Bright screens destroy night vision', sol: 'Ultra-dim red UI mode for night riding' },
  ],
  Navigation: [
    { name: 'Offline Navigation', p: 'P1', icon: 'fa-wifi-slash', prob: 'Maps die when signal dies', sol: 'Full turn-by-turn with zero connectivity' },
    { name: 'ADV Route Builder', p: 'P1', icon: 'fa-mountain', prob: 'Regular maps optimize for cars', sol: 'Routes for trails, passes, scenic roads' },
    { name: 'Road Conditions', p: 'P1', icon: 'fa-road', prob: 'No idea if a road is rideable', sol: 'Rider-reported conditions updated hourly' },
    { name: 'Weather Overlay', p: 'P2', icon: 'fa-cloud-sun', prob: "Weather apps don't show route forecasts", sol: 'Weather layer on your exact route' },
    { name: 'Permit Tracker', p: 'P2', icon: 'fa-passport', prob: 'Forgot your inner line permit', sol: 'Auto-reminds permits and border requirements' },
    { name: 'Toll Calculator', p: 'P3', icon: 'fa-calculator', prob: 'Surprise tolls drain cash', sol: 'Pre-calculates all tolls on your route' },
  ],
  Mechanical: [
    { name: 'Mechanic Finder', p: 'P1', icon: 'fa-wrench', prob: 'Breakdown in the middle of nowhere', sol: 'Offline database of verified mechanics' },
    { name: 'Flat Tyre Guide', p: 'P1', icon: 'fa-life-ring', prob: 'Never plugged a tyre in your life', sol: 'Step-by-step video for your bike model' },
    { name: 'Service Tracker', p: 'P2', icon: 'fa-oil-can', prob: 'Forgot last oil change', sol: 'Auto-tracks service intervals' },
    { name: 'Towing Connect', p: 'P2', icon: 'fa-truck-pickup', prob: "Bike won't start, need a tow", sol: 'One-tap nearest recovery service' },
    { name: 'Parts Map', p: 'P2', icon: 'fa-gears', prob: 'Need a clutch cable 200km away', sol: 'Parts shops with stock info' },
    { name: 'Community Help', p: 'P3', icon: 'fa-handshake', prob: 'No mechanic, but a rider might help', sol: 'Broadcast repair requests nearby' },
  ],
  'Stays & Fuel': [
    { name: 'Fuel Calculator', p: 'P1', icon: 'fa-gas-pump', prob: 'Will I make it to the next pump?', sol: 'Real-time range based on your bike' },
    { name: 'Biker Stays', p: 'P1', icon: 'fa-hotel', prob: 'Hotels refuse motorcycle parking', sol: '3,400+ verified stays with secure parking' },
    { name: 'Camp Finder', p: 'P2', icon: 'fa-campground', prob: "Don't know safe camping spots", sol: 'Community-mapped spots with safety ratings' },
    { name: 'Dhaba Finder', p: 'P2', icon: 'fa-utensils', prob: '2am on NH-44, everything closed', sol: '24/7 dhabas verified by riders' },
    { name: 'ATM Map', p: 'P2', icon: 'fa-money-bill', prob: "UPI doesn't work at remote pumps", sol: 'Working ATMs verified weekly' },
  ],
  Tracking: [
    { name: 'Mileage Tracker', p: 'P1', icon: 'fa-gauge-high', prob: 'No idea what mileage your bike actually gives', sol: 'Per-trip fuel efficiency tracking with bike-specific calculations' },
    { name: 'KM Logger', p: 'P1', icon: 'fa-road', prob: 'Odometer readings are never recorded', sol: 'Auto-logs every km. Start ODO → End ODO with full trip history' },
    { name: 'Trip Start/End', p: 'P1', icon: 'fa-flag-checkered', prob: 'No record of where you went', sol: 'One-tap trip start, end location, distance, speed, fuel used' },
    { name: 'Service Reminders', p: 'P1', icon: 'fa-bell', prob: 'Forgot last oil change, chain lube overdue', sol: 'KM-based alerts: oil, chain, tyres, air filter, brakes' },
    { name: 'Nearby Alerts', p: 'P1', icon: 'fa-location-crosshairs', prob: 'Don\'t know what\'s around you', sol: 'Live proximity to fuel, food, hospitals, mechanics, auto shops' },
    { name: 'Auto Shop Finder', p: 'P2', icon: 'fa-store', prob: 'Need parts but no showroom nearby', sol: 'RE, KTM, BMW showrooms + tyre shops + accessories stores' },
  ],
  Community: [
    { name: 'Phrasebook', p: 'P2', icon: 'fa-language', prob: "Can't communicate in rural areas", sol: '22 Indian languages, works offline' },
    { name: 'Scam Alerts', p: 'P2', icon: 'fa-flag', prob: 'Tourist traps charging 5x', sol: 'Community-flagged scam zones' },
    { name: 'Group Coordinator', p: 'P1', icon: 'fa-users', prob: 'Herding 8 riders is impossible', sol: 'Live location, waypoints, group alerts' },
    { name: 'Ride Journal', p: 'P2', icon: 'fa-book', prob: 'Too busy riding to document', sol: 'Auto-logs route, speed, altitude' },
    { name: 'Doc Wallet', p: 'P2', icon: 'fa-id-card', prob: 'Left your RC at home', sol: 'Digital vault for all documents' },
    { name: 'Quality Ratings', p: 'P3', icon: 'fa-star', prob: 'Is that bridge safe?', sol: 'Community-rated infrastructure' },
  ],
};

export default function FeaturesSection() {
  const [active, setActive] = useState('Safety');
  const cats = Object.keys(categories);

  return (
    <section id="features">
      <div className="container">
        <span className="section-num">02</span>
        <p className="eyebrow">35 FEATURES. 6 CATEGORIES.</p>
        <h2>Everything a rider actually needs</h2>
        <p style={{ color: 'var(--text2)', marginBottom: 32, fontSize: 15 }}>
          All features are <strong style={{ color: 'var(--gold)' }}>100% free</strong>. No subscription. No paywall. Ever.
        </p>
        <div className={styles.tabs}>
          {cats.map(cat => (
            <button
              key={cat}
              className={`${styles.tab} ${active === cat ? styles.active : ''}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className={styles.grid}>
          {categories[active].map((feat, i) => (
            <div key={i} className={`card ${styles.feat}`}>
              <span className={`badge badge-${feat.p.toLowerCase()}`}>{feat.p}</span>
              <h4><i className={`fa-solid ${feat.icon}`} style={{ color: 'var(--accent)', marginRight: 8 }}></i>{feat.name}</h4>
              <p className={styles.prob}><b>The problem:</b> {feat.prob}</p>
              <p className={styles.sol}>{feat.sol}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
