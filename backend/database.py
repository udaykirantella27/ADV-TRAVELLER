from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./advrider.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Route(Base):
    __tablename__ = "routes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    start_lat = Column(Float)
    start_lng = Column(Float)
    end_lat = Column(Float)
    end_lng = Column(Float)
    distance_km = Column(Float)
    difficulty = Column(String)
    terrain = Column(String)
    rating = Column(Float, default=0)
    reports_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class Hazard(Base):
    __tablename__ = "hazards"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    description = Column(Text)
    lat = Column(Float)
    lng = Column(Float)
    severity = Column(String)
    confirmations = Column(Integer, default=1)
    active = Column(Boolean, default=True)
    reported_by = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Stay(Base):
    __tablename__ = "stays"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    price_range = Column(String)
    has_parking = Column(Boolean, default=True)
    rating = Column(Float, default=0)
    reviews_count = Column(Integer, default=0)
    phone = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class FuelStation(Base):
    __tablename__ = "fuel_stations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    brand = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    price_per_litre = Column(Float)
    is_24h = Column(Boolean, default=False)
    has_air = Column(Boolean, default=False)
    verified_at = Column(DateTime, default=datetime.utcnow)


class Mechanic(Base):
    __tablename__ = "mechanics"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    specialization = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    phone = Column(String)
    rating = Column(Float, default=0)
    fair_pricing = Column(Boolean, default=True)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Rider(Base):
    __tablename__ = "riders"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    bike = Column(String)
    total_km = Column(Float, default=0)
    total_rides = Column(Integer, default=0)
    badges = Column(Text, default="[]")
    joined_at = Column(DateTime, default=datetime.utcnow)


# ═══ NEW MODELS ═══

class Bike(Base):
    """Rider's bike with mileage and service tracking."""
    __tablename__ = "bikes"
    id = Column(Integer, primary_key=True, index=True)
    owner = Column(String, default="default_rider")
    name = Column(String)              # e.g. "My Himalayan"
    make = Column(String)              # Royal Enfield, KTM, BMW, etc.
    model = Column(String)             # Himalayan, 390 ADV, GS 310, etc.
    year = Column(Integer)
    current_odo_km = Column(Float, default=0)    # Current odometer reading
    fuel_tank_litres = Column(Float, default=15)
    avg_mileage_kmpl = Column(Float, default=30) # Average fuel efficiency
    last_service_km = Column(Float, default=0)
    service_interval_km = Column(Float, default=5000) # Service every X km
    next_service_km = Column(Float, default=5000)
    chain_lube_km = Column(Float, default=0)     # Last chain lube odo
    tyre_change_km = Column(Float, default=0)    # Last tyre change odo
    oil_change_km = Column(Float, default=0)     # Last oil change odo
    created_at = Column(DateTime, default=datetime.utcnow)


class Trip(Base):
    """Individual ride/trip with start, end, km tracking."""
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True, index=True)
    bike_id = Column(Integer, default=1)
    name = Column(String)
    start_location = Column(String)
    end_location = Column(String)
    start_lat = Column(Float)
    start_lng = Column(Float)
    end_lat = Column(Float)
    end_lng = Column(Float)
    start_odo_km = Column(Float, default=0)
    end_odo_km = Column(Float, default=0)
    distance_km = Column(Float, default=0)
    duration_minutes = Column(Integer, default=0)
    avg_speed_kmph = Column(Float, default=0)
    max_speed_kmph = Column(Float, default=0)
    fuel_used_litres = Column(Float, default=0)
    mileage_kmpl = Column(Float, default=0)
    elevation_gain_m = Column(Float, default=0)
    status = Column(String, default="completed")  # active, completed, paused
    notes = Column(Text, default="")
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)


class ServiceReminder(Base):
    """Service and maintenance reminders."""
    __tablename__ = "service_reminders"
    id = Column(Integer, primary_key=True, index=True)
    bike_id = Column(Integer, default=1)
    type = Column(String)        # oil_change, chain_lube, tyre_check, general_service, air_filter, brake_pad
    title = Column(String)
    description = Column(Text)
    due_km = Column(Float)       # Trigger at this odometer reading
    due_date = Column(DateTime, nullable=True)
    is_done = Column(Boolean, default=False)
    done_at_km = Column(Float, nullable=True)
    done_at = Column(DateTime, nullable=True)
    priority = Column(String, default="normal")  # low, normal, high, critical
    created_at = Column(DateTime, default=datetime.utcnow)


class Restaurant(Base):
    """Rider-friendly restaurants, dhabas, and food stops."""
    __tablename__ = "restaurants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)        # dhaba, restaurant, cafe, highway_stop
    lat = Column(Float)
    lng = Column(Float)
    cuisine = Column(String)     # north_indian, south_indian, multi
    is_24h = Column(Boolean, default=False)
    has_parking = Column(Boolean, default=True)
    avg_cost = Column(String)    # ₹100-200
    rating = Column(Float, default=0)
    phone = Column(String, nullable=True)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Hospital(Base):
    """Hospitals and medical facilities."""
    __tablename__ = "hospitals"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)        # hospital, clinic, trauma_center, pharmacy
    lat = Column(Float)
    lng = Column(Float)
    has_trauma = Column(Boolean, default=False)
    has_blood_bank = Column(Boolean, default=False)
    is_24h = Column(Boolean, default=True)
    phone = Column(String, nullable=True)
    beds = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class AutoShop(Base):
    """Automobile showrooms, parts shops, and accessory stores."""
    __tablename__ = "auto_shops"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)        # showroom, parts_shop, accessories, tyre_shop
    brand = Column(String)       # RE, KTM, BMW, Multi-brand
    lat = Column(Float)
    lng = Column(Float)
    phone = Column(String, nullable=True)
    has_spare_parts = Column(Boolean, default=True)
    rating = Column(Float, default=0)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
