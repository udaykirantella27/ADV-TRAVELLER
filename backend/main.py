"""
ADV Rider — FastAPI Backend v2.0
Complete REST API with mileage tracking, trips, service reminders, and all POIs.
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from database import (init_db, get_db, Route, Hazard, Stay, FuelStation,
                      Mechanic, Rider, Bike, Trip, ServiceReminder,
                      Restaurant, Hospital, AutoShop)

app = FastAPI(title="ADV Rider API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ═══ SCHEMAS ═══

class BikeCreate(BaseModel):
    name: str
    make: str
    model: str
    year: int = 2024
    current_odo_km: float = 0
    fuel_tank_litres: float = 15
    avg_mileage_kmpl: float = 30
    service_interval_km: float = 5000

class BikeUpdate(BaseModel):
    current_odo_km: Optional[float] = None
    avg_mileage_kmpl: Optional[float] = None
    last_service_km: Optional[float] = None

class TripCreate(BaseModel):
    bike_id: int = 1
    name: str
    start_location: str
    end_location: str = ""
    start_lat: float = 0
    start_lng: float = 0
    start_odo_km: float = 0

class TripEnd(BaseModel):
    end_location: str
    end_lat: float = 0
    end_lng: float = 0
    end_odo_km: float
    fuel_used_litres: float = 0
    notes: str = ""

class ServiceReminderCreate(BaseModel):
    bike_id: int = 1
    type: str
    title: str
    description: str = ""
    due_km: float
    priority: str = "normal"

class HazardCreate(BaseModel):
    type: str
    description: str
    lat: float
    lng: float
    severity: str = "medium"
    reported_by: str = "anonymous"

class RouteCreate(BaseModel):
    name: str
    description: str
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float
    distance_km: float
    difficulty: str = "moderate"
    terrain: str = "mixed"


# ═══ STARTUP + SEED ═══

@app.on_event("startup")
def startup():
    init_db()
    seed_all()


def seed_all():
    db = next(get_db())
    if db.query(Route).count() > 0:
        db.close()
        return

    # ── Routes ──
    db.add_all([
        Route(name="Bengaluru → Coorg", description="Weekend ghat roads through coffee plantations", start_lat=12.97, start_lng=77.59, end_lat=12.42, end_lng=75.74, distance_km=265, difficulty="moderate", terrain="tarmac", rating=4.5),
        Route(name="Coorg → Wayanad", description="Cross-state through dense forests", start_lat=12.42, start_lng=75.74, end_lat=11.68, end_lng=76.08, distance_km=120, difficulty="hard", terrain="mixed", rating=4.8),
        Route(name="Wayanad → Ooty", description="Hairpin bends and tea estates", start_lat=11.68, start_lng=76.08, end_lat=11.41, end_lng=76.69, distance_km=95, difficulty="moderate", terrain="tarmac", rating=4.6),
        Route(name="Manali → Leh", description="The ultimate Indian ADV route via Rohtang, Keylong, Sarchu, Pang", start_lat=32.24, start_lng=77.19, end_lat=34.16, end_lng=77.58, distance_km=479, difficulty="extreme", terrain="offroad", rating=4.9),
        Route(name="Shimla → Spiti", description="Remote Himalayan valley via Kunzum Pass", start_lat=31.10, start_lng=77.17, end_lat=32.59, end_lng=78.03, distance_km=412, difficulty="extreme", terrain="offroad", rating=4.7),
        Route(name="Guwahati → Tawang", description="Northeast frontier via Sela Pass at 13,700ft", start_lat=26.14, start_lng=91.74, end_lat=27.58, end_lng=91.86, distance_km=525, difficulty="hard", terrain="mixed", rating=4.8),
    ])

    # ── Hazards ──
    db.add_all([
        Hazard(type="landslide", description="Rock debris, single lane open", lat=12.70, lng=76.60, severity="high", confirmations=5, reported_by="rider_rk"),
        Hazard(type="flood", description="River crossing flooded, 2ft deep", lat=11.90, lng=76.10, severity="critical", confirmations=8, reported_by="rider_sp"),
        Hazard(type="gravel", description="Loose gravel 500m stretch", lat=12.10, lng=75.90, severity="medium", confirmations=3, reported_by="rider_am"),
    ])

    # ── Stays ──
    db.add_all([
        Stay(name="Coorg Riders Inn", type="homestay", lat=12.42, lng=75.74, price_range="₹800-1200", rating=4.8, reviews_count=156, phone="+91-9876543210"),
        Stay(name="Wayanad Camp Ground", type="camp", lat=11.70, lng=76.10, price_range="₹500-800", rating=4.5, reviews_count=89),
        Stay(name="Ooty Biker Stay", type="hotel", lat=11.41, lng=76.69, price_range="₹1000-1800", rating=4.3, reviews_count=67),
    ])

    # ── Fuel ──
    db.add_all([
        FuelStation(name="HP Madikeri", brand="HP", lat=12.42, lng=75.75, price_per_litre=104.5, is_24h=True, has_air=True),
        FuelStation(name="Indian Oil Mysuru", brand="Indian Oil", lat=12.30, lng=76.65, price_per_litre=103.2, is_24h=True),
        FuelStation(name="Bharat Ooty", brand="Bharat", lat=11.41, lng=76.70, price_per_litre=104.1, is_24h=False, has_air=True),
        FuelStation(name="HP Highway NH-275", brand="HP", lat=12.60, lng=76.80, price_per_litre=104.3, is_24h=True, has_air=True),
        FuelStation(name="Shell Bengaluru ORR", brand="Shell", lat=12.93, lng=77.63, price_per_litre=108.5, is_24h=True, has_air=True),
    ])

    # ── Mechanics ──
    db.add_all([
        Mechanic(name="Kumar Two-Wheelers", specialization="RE", lat=11.68, lng=76.08, phone="+91-9876543220", rating=4.6, fair_pricing=True, verified=True),
        Mechanic(name="Raju Bike Works", specialization="General", lat=12.30, lng=75.90, phone="+91-9876543221", rating=4.2, fair_pricing=True, verified=True),
        Mechanic(name="Mysuru RE Service", specialization="RE", lat=12.31, lng=76.66, phone="+91-9876543223", rating=4.5, fair_pricing=True, verified=True),
    ])

    # ── Removed Mock Bikes, Trips, and Reminders for Production ──
    pass

    # ── Restaurants ──
    db.add_all([
        Restaurant(name="Highway Dhaba NH-275", type="dhaba", lat=12.60, lng=76.78, cuisine="north_indian", is_24h=True, has_parking=True, avg_cost="₹100-200", rating=4.2, verified=True),
        Restaurant(name="Coorg Cuisine Corner", type="restaurant", lat=12.43, lng=75.75, cuisine="south_indian", is_24h=False, has_parking=True, avg_cost="₹200-400", rating=4.5, verified=True),
        Restaurant(name="Mysuru Dosa Point", type="restaurant", lat=12.31, lng=76.66, cuisine="south_indian", is_24h=False, has_parking=True, avg_cost="₹80-150", rating=4.7, verified=True),
        Restaurant(name="Rider's Chai Stop", type="cafe", lat=12.10, lng=75.92, cuisine="multi", is_24h=False, has_parking=True, avg_cost="₹50-100", rating=4.0),
        Restaurant(name="Ooty Lake Cafe", type="cafe", lat=11.42, lng=76.70, cuisine="multi", is_24h=False, has_parking=True, avg_cost="₹150-300", rating=4.3, verified=True),
        Restaurant(name="Wayanad Bamboo Hut", type="restaurant", lat=11.69, lng=76.09, cuisine="south_indian", is_24h=False, has_parking=True, avg_cost="₹200-350", rating=4.6, verified=True),
    ])

    # ── Hospitals ──
    db.add_all([
        Hospital(name="Coorg Institute of Medical Sciences", type="hospital", lat=12.44, lng=75.73, has_trauma=True, has_blood_bank=True, is_24h=True, phone="+91-8272-225555", beds=200),
        Hospital(name="Mysuru District Hospital", type="hospital", lat=12.31, lng=76.65, has_trauma=True, has_blood_bank=True, is_24h=True, phone="+91-821-2520999", beds=500),
        Hospital(name="Wayanad PHC", type="clinic", lat=11.70, lng=76.07, has_trauma=False, has_blood_bank=False, is_24h=True, phone="+91-4936-202256", beds=30),
        Hospital(name="Ooty Government Hospital", type="hospital", lat=11.40, lng=76.70, has_trauma=True, has_blood_bank=True, is_24h=True, phone="+91-423-2444477", beds=150),
        Hospital(name="NH-275 Emergency Clinic", type="clinic", lat=12.55, lng=76.72, has_trauma=False, is_24h=True, phone="+91-9900112233", beds=10),
    ])

    # ── Auto Shops ──
    db.add_all([
        AutoShop(name="RE Showroom Mysuru", type="showroom", brand="Royal Enfield", lat=12.32, lng=76.67, phone="+91-821-2419888", has_spare_parts=True, rating=4.4, verified=True),
        AutoShop(name="KTM Bengaluru", type="showroom", brand="KTM", lat=12.96, lng=77.60, phone="+91-80-41234567", has_spare_parts=True, rating=4.3, verified=True),
        AutoShop(name="Bike Parts Hub", type="parts_shop", brand="Multi-brand", lat=12.42, lng=75.76, phone="+91-9876543230", has_spare_parts=True, rating=4.1),
        AutoShop(name="Highway Tyre Works", type="tyre_shop", brand="Multi-brand", lat=12.55, lng=76.70, phone="+91-9876543231", has_spare_parts=True, rating=3.9),
        AutoShop(name="Rider Accessories", type="accessories", brand="Multi-brand", lat=12.97, lng=77.58, phone="+91-9876543232", has_spare_parts=True, rating=4.5, verified=True),
    ])

    db.commit()
    db.close()
    print("[OK] Database seeded with all data")


# ═══ API ENDPOINTS ═══

@app.get("/")
def root():
    return {"app": "ADV Rider API", "version": "2.0.0", "status": "running"}

# ── Routes ──
@app.get("/api/routes")
def list_routes(db: Session = Depends(get_db)):
    return db.query(Route).all()

@app.post("/api/routes")
def create_route(route: RouteCreate, db: Session = Depends(get_db)):
    r = Route(**route.dict())
    db.add(r); db.commit(); db.refresh(r)
    return r

# ── Hazards ──
@app.get("/api/hazards")
def list_hazards(db: Session = Depends(get_db)):
    return db.query(Hazard).filter(Hazard.active == True).all()

@app.post("/api/hazards")
def report_hazard(h: HazardCreate, db: Session = Depends(get_db)):
    haz = Hazard(**h.dict())
    db.add(haz); db.commit(); db.refresh(haz)
    return haz

@app.post("/api/hazards/{hid}/confirm")
def confirm_hazard(hid: int, db: Session = Depends(get_db)):
    h = db.query(Hazard).filter(Hazard.id == hid).first()
    if not h: raise HTTPException(404, "Not found")
    h.confirmations += 1; db.commit()
    return {"confirmations": h.confirmations}

# ── Stays ──
@app.get("/api/stays")
def list_stays(db: Session = Depends(get_db)):
    return db.query(Stay).all()

# ── Fuel ──
@app.get("/api/fuel")
def list_fuel(db: Session = Depends(get_db)):
    return db.query(FuelStation).all()

# ── Mechanics ──
@app.get("/api/mechanics")
def list_mechanics(db: Session = Depends(get_db)):
    return db.query(Mechanic).all()

# ── Bikes ──
@app.get("/api/bikes")
def list_bikes(db: Session = Depends(get_db)):
    return db.query(Bike).all()

@app.post("/api/bikes")
def add_bike(b: BikeCreate, db: Session = Depends(get_db)):
    bike = Bike(**b.dict(), next_service_km=b.current_odo_km + b.service_interval_km)
    db.add(bike); db.commit(); db.refresh(bike)
    # Add chain lube reminder every 500km
    rem = ServiceReminder(
        bike_id=bike.id,
        type="chain_lube",
        title="Chain Clean & Lube",
        description="Clean and lube chain for smooth operation",
        due_km=bike.current_odo_km + 500,
        priority="high"
    )
    db.add(rem); db.commit()
    return bike

@app.get("/api/bikes/{bid}")
def get_bike(bid: int, db: Session = Depends(get_db)):
    bike = db.query(Bike).filter(Bike.id == bid).first()
    if not bike: raise HTTPException(404, "Bike not found")
    return bike

@app.patch("/api/bikes/{bid}/odo")
def update_odo(bid: int, odo: float, db: Session = Depends(get_db)):
    bike = db.query(Bike).filter(Bike.id == bid).first()
    if not bike: raise HTTPException(404, "Bike not found")
    bike.current_odo_km = odo
    db.commit()
    # Check service reminders
    alerts = []
    reminders = db.query(ServiceReminder).filter(ServiceReminder.bike_id == bid, ServiceReminder.is_done == False).all()
    for r in reminders:
        if odo >= r.due_km:
            alerts.append({"type": r.type, "title": r.title, "priority": r.priority, "due_km": r.due_km})
    return {"current_odo_km": odo, "service_alerts": alerts}

# ── Trips ──
@app.get("/api/trips")
def list_trips(bike_id: int = None, db: Session = Depends(get_db)):
    q = db.query(Trip).order_by(Trip.started_at.desc())
    if bike_id: q = q.filter(Trip.bike_id == bike_id)
    return q.all()

@app.post("/api/trips/start")
def start_trip(t: TripCreate, db: Session = Depends(get_db)):
    trip = Trip(**t.dict(), status="active", started_at=datetime.utcnow())
    db.add(trip); db.commit(); db.refresh(trip)
    return trip

@app.post("/api/trips/{tid}/end")
def end_trip(tid: int, data: TripEnd, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == tid).first()
    if not trip: raise HTTPException(404, "Trip not found")
    trip.end_location = data.end_location
    trip.end_lat = data.end_lat
    trip.end_lng = data.end_lng
    trip.end_odo_km = data.end_odo_km
    trip.distance_km = data.end_odo_km - trip.start_odo_km
    trip.fuel_used_litres = data.fuel_used_litres
    trip.mileage_kmpl = trip.distance_km / data.fuel_used_litres if data.fuel_used_litres > 0 else 0
    trip.ended_at = datetime.utcnow()
    trip.duration_minutes = int((trip.ended_at - trip.started_at).total_seconds() / 60)
    trip.avg_speed_kmph = (trip.distance_km / trip.duration_minutes * 60) if trip.duration_minutes > 0 else 0
    trip.notes = data.notes
    trip.status = "completed"
    # Update bike odometer
    bike = db.query(Bike).filter(Bike.id == trip.bike_id).first()
    if bike:
        bike.current_odo_km = data.end_odo_km
    db.commit(); db.refresh(trip)
    return trip

@app.get("/api/trips/{tid}")
def get_trip(tid: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == tid).first()
    if not trip: raise HTTPException(404, "Trip not found")
    return trip

# ── Service Reminders ──
@app.get("/api/service-reminders")
def list_reminders(bike_id: int = None, db: Session = Depends(get_db)):
    q = db.query(ServiceReminder)
    if bike_id: q = q.filter(ServiceReminder.bike_id == bike_id)
    return q.order_by(ServiceReminder.due_km).all()

@app.post("/api/service-reminders")
def add_reminder(r: ServiceReminderCreate, db: Session = Depends(get_db)):
    rem = ServiceReminder(**r.dict())
    db.add(rem); db.commit(); db.refresh(rem)
    return rem

@app.post("/api/service-reminders/{rid}/done")
def mark_done(rid: int, done_km: float, db: Session = Depends(get_db)):
    r = db.query(ServiceReminder).filter(ServiceReminder.id == rid).first()
    if not r: raise HTTPException(404, "Reminder not found")
    r.is_done = True
    r.done_at_km = done_km
    r.done_at = datetime.utcnow()
    db.commit()
    return {"status": "done", "done_at_km": done_km}

@app.get("/api/service-alerts/{bike_id}")
def service_alerts(bike_id: int, db: Session = Depends(get_db)):
    bike = db.query(Bike).filter(Bike.id == bike_id).first()
    if not bike: raise HTTPException(404, "Bike not found")
    reminders = db.query(ServiceReminder).filter(ServiceReminder.bike_id == bike_id, ServiceReminder.is_done == False).all()
    alerts = []
    for r in reminders:
        km_remaining = r.due_km - bike.current_odo_km
        status = "overdue" if km_remaining <= 0 else "upcoming" if km_remaining <= 500 else "ok"
        alerts.append({"id": r.id, "type": r.type, "title": r.title, "due_km": r.due_km, "km_remaining": km_remaining, "status": status, "priority": r.priority})
    return {"bike": bike.name, "odo_km": bike.current_odo_km, "alerts": sorted(alerts, key=lambda x: x["km_remaining"])}

# ── Restaurants ──
@app.get("/api/restaurants")
def list_restaurants(db: Session = Depends(get_db)):
    return db.query(Restaurant).all()

# ── Hospitals ──
@app.get("/api/hospitals")
def list_hospitals(db: Session = Depends(get_db)):
    return db.query(Hospital).all()

# ── Auto Shops ──
@app.get("/api/auto-shops")
def list_auto_shops(db: Session = Depends(get_db)):
    return db.query(AutoShop).all()

# ── Nearby POIs (by distance) ──
@app.get("/api/nearby")
def nearby_pois(lat: float, lng: float, radius_km: float = 50, db: Session = Depends(get_db)):
    """Get all nearby POIs within radius. Simple distance calc (not haversine for speed)."""
    deg = radius_km / 111  # rough km to degrees
    results = {
        "fuel": [dict(id=f.id, name=f.name, brand=f.brand, lat=f.lat, lng=f.lng, price=f.price_per_litre, is_24h=f.is_24h)
                 for f in db.query(FuelStation).filter(FuelStation.lat.between(lat-deg, lat+deg), FuelStation.lng.between(lng-deg, lng+deg)).all()],
        "mechanics": [dict(id=m.id, name=m.name, specialization=m.specialization, lat=m.lat, lng=m.lng, phone=m.phone, rating=m.rating)
                      for m in db.query(Mechanic).filter(Mechanic.lat.between(lat-deg, lat+deg), Mechanic.lng.between(lng-deg, lng+deg)).all()],
        "restaurants": [dict(id=r.id, name=r.name, type=r.type, lat=r.lat, lng=r.lng, cuisine=r.cuisine, avg_cost=r.avg_cost, rating=r.rating)
                        for r in db.query(Restaurant).filter(Restaurant.lat.between(lat-deg, lat+deg), Restaurant.lng.between(lng-deg, lng+deg)).all()],
        "hospitals": [dict(id=h.id, name=h.name, type=h.type, lat=h.lat, lng=h.lng, has_trauma=h.has_trauma, is_24h=h.is_24h, phone=h.phone)
                      for h in db.query(Hospital).filter(Hospital.lat.between(lat-deg, lat+deg), Hospital.lng.between(lng-deg, lng+deg)).all()],
        "auto_shops": [dict(id=a.id, name=a.name, type=a.type, brand=a.brand, lat=a.lat, lng=a.lng, phone=a.phone)
                       for a in db.query(AutoShop).filter(AutoShop.lat.between(lat-deg, lat+deg), AutoShop.lng.between(lng-deg, lng+deg)).all()],
        "stays": [dict(id=s.id, name=s.name, type=s.type, lat=s.lat, lng=s.lng, price_range=s.price_range, rating=s.rating)
                  for s in db.query(Stay).filter(Stay.lat.between(lat-deg, lat+deg), Stay.lng.between(lng-deg, lng+deg)).all()],
        "hazards": [dict(id=h.id, type=h.type, description=h.description, lat=h.lat, lng=h.lng, severity=h.severity, confirmations=h.confirmations)
                    for h in db.query(Hazard).filter(Hazard.active==True, Hazard.lat.between(lat-deg, lat+deg), Hazard.lng.between(lng-deg, lng+deg)).all()],
    }
    return results

# ── Stats ──
@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    return {
        "routes": db.query(Route).count(),
        "hazards": db.query(Hazard).filter(Hazard.active == True).count(),
        "stays": db.query(Stay).count(),
        "fuel_stations": db.query(FuelStation).count(),
        "mechanics": db.query(Mechanic).count(),
        "restaurants": db.query(Restaurant).count(),
        "hospitals": db.query(Hospital).count(),
        "auto_shops": db.query(AutoShop).count(),
        "bikes": db.query(Bike).count(),
        "trips": db.query(Trip).count(),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
