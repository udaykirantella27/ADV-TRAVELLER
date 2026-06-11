'use client';
import { useEffect, useRef, useState } from 'react';

export default function MapView({ filters = null }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
      const handleThemeChange = () => {
        setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
      };
      window.addEventListener('themechange', handleThemeChange);
      return () => window.removeEventListener('themechange', handleThemeChange);
    }
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;
    let map;

    import('leaflet').then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      map = L.map(mapRef.current, {
        center: [12.9716, 77.5946],
        zoom: 7,
        zoomControl: true,
        attributionControl: false,
      });
      mapInstanceRef.current = map;

      const tileUrl = theme === 'light'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);
      setTimeout(() => map.invalidateSize(), 200);

      const icon = (emoji, bg) => L.divIcon({
        className: '',
        html: `<div style="width:28px;height:28px;background:${bg};border-radius:50%;border:2px solid #080808;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,0.5)">${emoji}</div>`,
        iconSize: [28, 28], iconAnchor: [14, 14],
      });

      const popup = (color, title, sub) =>
        `<div style="font-family:Inter,sans-serif;padding:4px"><strong style="color:${color}">${title}</strong><br><span style="color:#9A9690;font-size:12px">${sub}</span></div>`;

      /* ADV Routes */
      const routes = [
        { name: 'Bengaluru → Coorg', coords: [[12.97,77.59],[12.80,77.10],[12.60,76.50],[12.42,75.74]], color: '#FF4500' },
        { name: 'Coorg → Wayanad', coords: [[12.42,75.74],[12.10,75.90],[11.68,76.08]], color: '#00CED1' },
        { name: 'Wayanad → Ooty', coords: [[11.68,76.08],[11.50,76.40],[11.41,76.69]], color: '#FFD700' },
      ];
      routes.forEach(r => {
        L.polyline(r.coords, { color: r.color, weight: 3, opacity: 0.8, dashArray: '10 6' })
          .addTo(map).bindPopup(popup(r.color, `🛣️ ${r.name}`, 'ADV Route · Community Rated ★★★★'));
      });

      /* Hazards */
      [
        { pos: [12.70,76.60], name: 'Landslide debris', time: '2h ago', conf: 5 },
        { pos: [11.90,76.10], name: 'Flooded crossing', time: '45m ago', conf: 8 },
        { pos: [12.10,75.90], name: 'Loose gravel 500m', time: '1h ago', conf: 3 },
      ].forEach(h => {
        L.marker(h.pos, { icon: icon('⚠️','#FF4500') }).addTo(map)
          .bindPopup(popup('#FF4500', `⚠️ ${h.name}`, `Reported ${h.time} · ${h.conf} confirmations`));
      });

      /* Fuel Stations */
      [
        { pos: [12.42,75.75], name: 'HP Madikeri', info: '₹104.5/L · 24/7' },
        { pos: [12.30,76.65], name: 'Indian Oil Mysuru', info: '₹103.2/L · 24/7' },
        { pos: [11.41,76.70], name: 'Bharat Ooty', info: '₹104.1/L' },
        { pos: [12.60,76.80], name: 'HP Highway', info: '₹104.3/L · 24/7 · Air' },
        { pos: [12.93,77.63], name: 'Shell ORR', info: '₹108.5/L · 24/7 · Air' },
      ].forEach(f => {
        L.marker(f.pos, { icon: icon('⛽','#22c55e') }).addTo(map)
          .bindPopup(popup('#22c55e', `⛽ ${f.name}`, f.info));
      });

      /* Mechanics */
      [
        { pos: [11.68,76.08], name: 'Kumar Two-Wheelers', info: 'RE Specialist · ★★★★★' },
        { pos: [12.30,75.90], name: 'Raju Bike Works', info: 'General · ★★★★' },
        { pos: [12.31,76.66], name: 'Mysuru RE Service', info: 'RE Specialist · ★★★★★' },
      ].forEach(m => {
        L.marker(m.pos, { icon: icon('🔧','#FFD700') }).addTo(map)
          .bindPopup(popup('#FFD700', `🔧 ${m.name}`, m.info));
      });

      /* Stays */
      [
        { pos: [12.42,75.74], name: 'Coorg Riders Inn', info: '₹800-1200 · Parking · ★★★★★' },
        { pos: [11.70,76.10], name: 'Wayanad Camp Ground', info: '₹500-800 · Camping · ★★★★' },
        { pos: [11.41,76.69], name: 'Ooty Biker Stay', info: '₹1000-1800 · Hotel · ★★★★' },
      ].forEach(s => {
        L.marker(s.pos, { icon: icon('🏨','#00CED1') }).addTo(map)
          .bindPopup(popup('#00CED1', `🏨 ${s.name}`, s.info));
      });

      /* ── NEW: Restaurants ── */
      [
        { pos: [12.60,76.78], name: 'Highway Dhaba NH-275', info: 'North Indian · 24/7 · ₹100-200 · ★★★★' },
        { pos: [12.43,75.75], name: 'Coorg Cuisine Corner', info: 'South Indian · ₹200-400 · ★★★★★' },
        { pos: [12.31,76.66], name: 'Mysuru Dosa Point', info: 'South Indian · ₹80-150 · ★★★★★' },
        { pos: [12.10,75.92], name: "Rider's Chai Stop", info: 'Multi-cuisine · ₹50-100 · ★★★★' },
        { pos: [11.42,76.70], name: 'Ooty Lake Cafe', info: 'Cafe · ₹150-300 · ★★★★' },
        { pos: [11.69,76.09], name: 'Wayanad Bamboo Hut', info: 'South Indian · ₹200-350 · ★★★★★' },
      ].forEach(r => {
        L.marker(r.pos, { icon: icon('🍽️','#f97316') }).addTo(map)
          .bindPopup(popup('#f97316', `🍽️ ${r.name}`, r.info));
      });

      /* ── NEW: Hospitals ── */
      [
        { pos: [12.44,75.73], name: 'Coorg Institute of Medical Sciences', info: 'Trauma · Blood Bank · 24/7 · 200 beds' },
        { pos: [12.31,76.65], name: 'Mysuru District Hospital', info: 'Trauma · Blood Bank · 24/7 · 500 beds' },
        { pos: [11.70,76.07], name: 'Wayanad PHC', info: 'Clinic · 24/7 · 30 beds' },
        { pos: [11.40,76.70], name: 'Ooty Government Hospital', info: 'Trauma · Blood Bank · 24/7 · 150 beds' },
        { pos: [12.55,76.72], name: 'NH-275 Emergency Clinic', info: 'Emergency · 24/7 · 10 beds' },
      ].forEach(h => {
        L.marker(h.pos, { icon: icon('🏥','#ef4444') }).addTo(map)
          .bindPopup(popup('#ef4444', `🏥 ${h.name}`, h.info));
      });

      /* ── NEW: Auto Shops / Showrooms ── */
      [
        { pos: [12.32,76.67], name: 'RE Showroom Mysuru', info: 'Royal Enfield · Parts · ★★★★' },
        { pos: [12.96,77.60], name: 'KTM Bengaluru', info: 'KTM · Parts · ★★★★' },
        { pos: [12.42,75.76], name: 'Bike Parts Hub', info: 'Multi-brand · Spare Parts · ★★★★' },
        { pos: [12.55,76.70], name: 'Highway Tyre Works', info: 'Tyre Shop · Multi-brand · ★★★' },
        { pos: [12.97,77.58], name: 'Rider Accessories', info: 'Accessories · Multi-brand · ★★★★★' },
      ].forEach(a => {
        L.marker(a.pos, { icon: icon('🏭','#a855f7') }).addTo(map)
          .bindPopup(popup('#a855f7', `🏭 ${a.name}`, a.info));
      });

      /* Rider location */
      const riderIcon = L.divIcon({
        className: '',
        html: '<div style="width:18px;height:18px;background:#FF4500;border-radius:50%;border:3px solid #080808;box-shadow:0 0 0 6px rgba(255,69,0,0.25),0 0 0 12px rgba(255,69,0,0.1);animation:pulse 2s infinite"></div>',
        iconSize: [18, 18], iconAnchor: [9, 9],
      });
      L.marker([12.97, 77.59], { icon: riderIcon }).addTo(map)
        .bindPopup(popup('#FF4500', '📍 You are here', 'Bengaluru · Signal: Strong'));
    });

    return () => { if (map) { map.remove(); mapInstanceRef.current = null; } };
  }, [theme]);

  return (
    <>
      <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,69,0,0.6)}70%{box-shadow:0 0 0 16px rgba(255,69,0,0)}}`}</style>
      <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '500px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', background: '#0d1117' }} />
    </>
  );
}
