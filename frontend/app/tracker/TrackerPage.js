'use client';
import { useState, useEffect, useCallback } from 'react';
import styles from './TrackerPage.module.css';

const API = 'http://localhost:8000/api';

export default function TrackerPage() {
  const [bikes, setBikes] = useState([]);
  const [activeBike, setActiveBike] = useState(null);
  const [trips, setTrips] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tripModal, setTripModal] = useState(false);
  const [odoModal, setOdoModal] = useState(false);
  const [newOdo, setNewOdo] = useState('');
  const [tripForm, setTripForm] = useState({ name: '', start_location: '', start_odo_km: '' });
  const [endTripModal, setEndTripModal] = useState(null);
  const [endForm, setEndForm] = useState({ end_location: '', end_odo_km: '', fuel_used_litres: '', notes: '' });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [bikesRes, tripsRes] = await Promise.all([
        fetch(`${API}/bikes`), fetch(`${API}/trips`)
      ]);
      const bikesData = await bikesRes.json();
      const tripsData = await tripsRes.json();
      setBikes(bikesData);
      setTrips(tripsData);
      if (bikesData.length > 0 && !activeBike) {
        setActiveBike(bikesData[0]);
        const alertsRes = await fetch(`${API}/service-alerts/${bikesData[0].id}`);
        setAlerts((await alertsRes.json()).alerts || []);
        const remRes = await fetch(`${API}/service-reminders?bike_id=${bikesData[0].id}`);
        setReminders(await remRes.json());
      }
    } catch (e) { console.error('API error:', e); }
    setLoading(false);
  }, [activeBike]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const selectBike = async (bike) => {
    setActiveBike(bike);
    try {
      const [alertsRes, remRes, tripsRes] = await Promise.all([
        fetch(`${API}/service-alerts/${bike.id}`),
        fetch(`${API}/service-reminders?bike_id=${bike.id}`),
        fetch(`${API}/trips?bike_id=${bike.id}`),
      ]);
      setAlerts((await alertsRes.json()).alerts || []);
      setReminders(await remRes.json());
      setTrips(await tripsRes.json());
    } catch (e) { console.error(e); }
  };

  const updateOdo = async () => {
    if (!newOdo || !activeBike) return;
    try {
      const res = await fetch(`${API}/bikes/${activeBike.id}/odo?odo=${parseFloat(newOdo)}`, { method: 'PATCH' });
      const data = await res.json();
      setActiveBike({ ...activeBike, current_odo_km: data.current_odo_km });
      if (data.service_alerts?.length > 0) {
        alert(`⚠️ Service Alerts!\n${data.service_alerts.map(a => `• ${a.title} (${a.priority})`).join('\n')}`);
      }
      setOdoModal(false);
      setNewOdo('');
      fetchData();
    } catch (e) { console.error(e); }
  };

  const startTrip = async () => {
    if (!tripForm.name || !tripForm.start_location) return;
    try {
      await fetch(`${API}/trips/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tripForm, bike_id: activeBike?.id || 1, start_odo_km: parseFloat(tripForm.start_odo_km) || activeBike?.current_odo_km || 0 }),
      });
      setTripModal(false);
      setTripForm({ name: '', start_location: '', start_odo_km: '' });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const endTrip = async () => {
    if (!endTripModal || !endForm.end_odo_km) return;
    try {
      await fetch(`${API}/trips/${endTripModal.id}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...endForm, end_odo_km: parseFloat(endForm.end_odo_km), fuel_used_litres: parseFloat(endForm.fuel_used_litres) || 0 }),
      });
      setEndTripModal(null);
      setEndForm({ end_location: '', end_odo_km: '', fuel_used_litres: '', notes: '' });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const markServiceDone = async (rid) => {
    try {
      await fetch(`${API}/service-reminders/${rid}/done?done_km=${activeBike?.current_odo_km || 0}`, { method: 'POST' });
      fetchData();
      if (activeBike) selectBike(activeBike);
    } catch (e) { console.error(e); }
  };

  const bikeTrips = trips.filter(t => t.bike_id === (activeBike?.id || 1));
  const totalKm = bikeTrips.reduce((s, t) => s + (t.distance_km || 0), 0);
  const avgMileage = bikeTrips.length > 0 ? bikeTrips.filter(t => t.mileage_kmpl > 0).reduce((s, t) => s + t.mileage_kmpl, 0) / (bikeTrips.filter(t => t.mileage_kmpl > 0).length || 1) : activeBike?.avg_mileage_kmpl || 0;
  const overdueAlerts = alerts.filter(a => a.status === 'overdue');
  const upcomingAlerts = alerts.filter(a => a.status === 'upcoming');

  if (loading) return <div className={styles.page}><div className={styles.loading}><i className="fa-solid fa-spinner fa-spin"></i> Loading tracker...</div></div>;

  return (
    <div className={styles.page}>
      <div className="container">
        {/* ── Alerts Banner ── */}
        {overdueAlerts.length > 0 && (
          <div className={styles.alertBanner}>
            <i className="fa-solid fa-triangle-exclamation"></i>
            <div>
              <strong>{overdueAlerts.length} service{overdueAlerts.length > 1 ? 's' : ''} overdue!</strong>
              <span>{overdueAlerts.map(a => a.title).join(', ')}</span>
            </div>
          </div>
        )}
        {upcomingAlerts.length > 0 && (
          <div className={styles.warningBanner}>
            <i className="fa-solid fa-bell"></i>
            <div>
              <strong>{upcomingAlerts.length} upcoming service{upcomingAlerts.length > 1 ? 's' : ''}</strong>
              <span>{upcomingAlerts.map(a => `${a.title} (${Math.abs(a.km_remaining).toFixed(0)} km)`).join(', ')}</span>
            </div>
          </div>
        )}

        <div className={styles.header}>
          <div>
            <p className="eyebrow">RIDE TRACKER</p>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)' }}>
              <i className="fa-solid fa-gauge-high" style={{ color: 'var(--accent)' }}></i> Mileage & Trip Tracker
            </h1>
          </div>
          <div className={styles.headerActions}>
            <button className="btn btn-ghost" onClick={() => setOdoModal(true)}>
              <i className="fa-solid fa-pen"></i> Update ODO
            </button>
            <button className="btn btn-primary" onClick={() => setTripModal(true)}>
              <i className="fa-solid fa-play"></i> Start Trip
            </button>
          </div>
        </div>

        {/* ── Bike Selector ── */}
        <div className={styles.bikeSelector}>
          {bikes.map(b => (
            <button key={b.id} className={`${styles.bikeCard} ${activeBike?.id === b.id ? styles.bikeActive : ''}`} onClick={() => selectBike(b)}>
              <i className="fa-solid fa-motorcycle" style={{ color: 'var(--accent)', fontSize: 20 }}></i>
              <div>
                <strong>{b.name}</strong>
                <small>{b.make} {b.model} · {b.year}</small>
              </div>
              <span className={styles.bikeBadge}>{b.current_odo_km.toLocaleString()} km</span>
            </button>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className={styles.tabs}>
          {['dashboard', 'trips', 'service'].map(t => (
            <button key={t} className={`${styles.tab} ${activeTab === t ? styles.tabActive : ''}`} onClick={() => setActiveTab(t)}>
              {t === 'dashboard' && <><i className="fa-solid fa-gauge"></i> Dashboard</>}
              {t === 'trips' && <><i className="fa-solid fa-road"></i> Trip Log</>}
              {t === 'service' && <><i className="fa-solid fa-wrench"></i> Service{overdueAlerts.length > 0 && <span className={styles.alertDot}>{overdueAlerts.length}</span>}</>}
            </button>
          ))}
        </div>

        {/* ═══ DASHBOARD TAB ═══ */}
        {activeTab === 'dashboard' && activeBike && (
          <div className={styles.dashGrid}>
            <div className={`${styles.statCard} ${styles.bigStat}`}>
              <div className={styles.odoRing}>
                <span className={styles.odoNum}>{activeBike.current_odo_km.toLocaleString()}</span>
                <span className={styles.odoUnit}>KM</span>
              </div>
              <div className={styles.odoLabel}>Odometer Reading</div>
              <div className={styles.odoSub}>{activeBike.make} {activeBike.model}</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}><i className="fa-solid fa-gas-pump"></i></div>
              <div className={styles.statVal}>{avgMileage.toFixed(1)}</div>
              <div className={styles.statLbl}>km/L average</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><i className="fa-solid fa-route"></i></div>
              <div className={styles.statVal}>{totalKm.toFixed(0)}</div>
              <div className={styles.statLbl}>km tracked</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><i className="fa-solid fa-flag-checkered"></i></div>
              <div className={styles.statVal}>{bikeTrips.length}</div>
              <div className={styles.statLbl}>trips logged</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><i className="fa-solid fa-droplet"></i></div>
              <div className={styles.statVal}>{activeBike.fuel_tank_litres}L</div>
              <div className={styles.statLbl}>tank capacity</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: overdueAlerts.length > 0 ? 'var(--red)' : 'var(--green)' }}>
                <i className="fa-solid fa-wrench"></i>
              </div>
              <div className={styles.statVal}>{(activeBike.next_service_km - activeBike.current_odo_km).toFixed(0)}</div>
              <div className={styles.statLbl}>km to next service</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><i className="fa-solid fa-gauge-simple-high"></i></div>
              <div className={styles.statVal}>{(activeBike.fuel_tank_litres * activeBike.avg_mileage_kmpl).toFixed(0)}</div>
              <div className={styles.statLbl}>km range (full tank)</div>
            </div>
          </div>
        )}

        {/* ═══ TRIPS TAB ═══ */}
        {activeTab === 'trips' && (
          <div className={styles.tripList}>
            {bikeTrips.length === 0 && <p style={{ color: 'var(--text2)', textAlign: 'center', padding: 40 }}>No trips yet. Start your first ride!</p>}
            {bikeTrips.map(t => (
              <div key={t.id} className={styles.tripCard}>
                <div className={styles.tripHeader}>
                  <div>
                    <span className={`${styles.tripStatus} ${t.status === 'active' ? styles.tripActive : styles.tripDone}`}>
                      {t.status === 'active' ? '● LIVE' : '✓ Done'}
                    </span>
                    <h3>{t.name}</h3>
                    <p className={styles.tripRoute}>
                      <i className="fa-solid fa-location-dot" style={{ color: 'var(--green)' }}></i> {t.start_location}
                      {t.end_location && <> <i className="fa-solid fa-arrow-right" style={{ margin: '0 6px', fontSize: 10 }}></i> <i className="fa-solid fa-flag-checkered" style={{ color: 'var(--accent)' }}></i> {t.end_location}</>}
                    </p>
                  </div>
                  {t.status === 'active' && <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => { setEndTripModal(t); setEndForm({ ...endForm, end_odo_km: '' }); }}><i className="fa-solid fa-stop"></i> End Trip</button>}
                </div>
                <div className={styles.tripStats}>
                  <div><strong>{t.distance_km.toFixed(1)}</strong><small>km</small></div>
                  <div><strong>{t.duration_minutes > 0 ? `${Math.floor(t.duration_minutes / 60)}h ${t.duration_minutes % 60}m` : '—'}</strong><small>time</small></div>
                  <div><strong>{t.avg_speed_kmph > 0 ? t.avg_speed_kmph.toFixed(0) : '—'}</strong><small>avg km/h</small></div>
                  <div><strong>{t.mileage_kmpl > 0 ? t.mileage_kmpl.toFixed(1) : '—'}</strong><small>km/L</small></div>
                  <div><strong>{t.fuel_used_litres > 0 ? t.fuel_used_litres.toFixed(1) + 'L' : '—'}</strong><small>fuel</small></div>
                  <div><strong>{t.start_odo_km.toLocaleString()}</strong><small>start km</small></div>
                  <div><strong>{t.end_odo_km > 0 ? t.end_odo_km.toLocaleString() : '—'}</strong><small>end km</small></div>
                </div>
                {t.notes && <p className={styles.tripNotes}><i className="fa-solid fa-sticky-note"></i> {t.notes}</p>}
              </div>
            ))}
          </div>
        )}

        {/* ═══ SERVICE TAB ═══ */}
        {activeTab === 'service' && (
          <div className={styles.serviceList}>
            {reminders.map(r => {
              const kmLeft = r.due_km - (activeBike?.current_odo_km || 0);
              const status = r.is_done ? 'done' : kmLeft <= 0 ? 'overdue' : kmLeft <= 500 ? 'upcoming' : 'ok';
              return (
                <div key={r.id} className={`${styles.serviceCard} ${styles[`svc_${status}`]}`}>
                  <div className={styles.svcIcon}>
                    {r.type === 'oil_change' && <i className="fa-solid fa-droplet"></i>}
                    {r.type === 'chain_lube' && <i className="fa-solid fa-link"></i>}
                    {r.type === 'general_service' && <i className="fa-solid fa-wrench"></i>}
                    {r.type === 'tyre_check' && <i className="fa-solid fa-circle-dot"></i>}
                    {r.type === 'air_filter' && <i className="fa-solid fa-wind"></i>}
                    {r.type === 'brake_pad' && <i className="fa-solid fa-hand"></i>}
                  </div>
                  <div className={styles.svcInfo}>
                    <h4>{r.title}</h4>
                    <p>{r.description}</p>
                    <div className={styles.svcMeta}>
                      <span>Due: {r.due_km.toLocaleString()} km</span>
                      {!r.is_done && <span className={styles[`svcBadge_${status}`]}>
                        {status === 'overdue' ? `⚠ Overdue by ${Math.abs(kmLeft).toFixed(0)} km` :
                         status === 'upcoming' ? `⏰ In ${kmLeft.toFixed(0)} km` :
                         `✓ ${kmLeft.toFixed(0)} km to go`}
                      </span>}
                      {r.is_done && <span className={styles.svcBadge_done}>✓ Done at {r.done_at_km?.toLocaleString()} km</span>}
                    </div>
                  </div>
                  {!r.is_done && (
                    <button className={styles.svcBtn} onClick={() => markServiceDone(r.id)} title="Mark as done">
                      <i className="fa-solid fa-check"></i>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══ MODALS ═══ */}
      {odoModal && (
        <div className={styles.overlay} onClick={() => setOdoModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3><i className="fa-solid fa-gauge-high" style={{ color: 'var(--accent)' }}></i> Update Odometer</h3>
            <p style={{ color: 'var(--text2)', fontSize: 13 }}>Current: {activeBike?.current_odo_km.toLocaleString()} km</p>
            <input type="number" placeholder="New odometer reading (km)" value={newOdo} onChange={e => setNewOdo(e.target.value)} className={styles.input} autoFocus />
            <div className={styles.modalBtns}>
              <button className="btn btn-ghost" onClick={() => setOdoModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={updateOdo}>Update</button>
            </div>
          </div>
        </div>
      )}

      {tripModal && (
        <div className={styles.overlay} onClick={() => setTripModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3><i className="fa-solid fa-play" style={{ color: 'var(--accent)' }}></i> Start New Trip</h3>
            <input placeholder="Trip name (e.g. Bengaluru to Coorg)" value={tripForm.name} onChange={e => setTripForm({ ...tripForm, name: e.target.value })} className={styles.input} autoFocus />
            <input placeholder="Start location" value={tripForm.start_location} onChange={e => setTripForm({ ...tripForm, start_location: e.target.value })} className={styles.input} />
            <input type="number" placeholder={`Start ODO (current: ${activeBike?.current_odo_km || 0} km)`} value={tripForm.start_odo_km} onChange={e => setTripForm({ ...tripForm, start_odo_km: e.target.value })} className={styles.input} />
            <div className={styles.modalBtns}>
              <button className="btn btn-ghost" onClick={() => setTripModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={startTrip}><i className="fa-solid fa-play"></i> Start</button>
            </div>
          </div>
        </div>
      )}

      {endTripModal && (
        <div className={styles.overlay} onClick={() => setEndTripModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3><i className="fa-solid fa-flag-checkered" style={{ color: 'var(--accent)' }}></i> End Trip: {endTripModal.name}</h3>
            <input placeholder="End location" value={endForm.end_location} onChange={e => setEndForm({ ...endForm, end_location: e.target.value })} className={styles.input} autoFocus />
            <input type="number" placeholder={`End ODO (started at ${endTripModal.start_odo_km} km)`} value={endForm.end_odo_km} onChange={e => setEndForm({ ...endForm, end_odo_km: e.target.value })} className={styles.input} />
            <input type="number" placeholder="Fuel used (litres)" value={endForm.fuel_used_litres} onChange={e => setEndForm({ ...endForm, fuel_used_litres: e.target.value })} className={styles.input} />
            <textarea placeholder="Notes (road conditions, etc.)" value={endForm.notes} onChange={e => setEndForm({ ...endForm, notes: e.target.value })} className={styles.textarea} />
            <div className={styles.modalBtns}>
              <button className="btn btn-ghost" onClick={() => setEndTripModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={endTrip}><i className="fa-solid fa-stop"></i> End Trip</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
