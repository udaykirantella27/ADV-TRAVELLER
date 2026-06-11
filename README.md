# 🏍️ ADV TRAVELLER — The Ultimate Adventure Motorcycle Travel Portal

[![GitHub Release](https://img.shields.io/github/v/release/udaykirantella27/ADV-TRAVELLER?color=orange&logo=github)](https://github.com/udaykirantella27/ADV-TRAVELLER)
[![Python Version](https://img.shields.io/badge/python-3.10%20%7C%203.11-blue?logo=python)](https://python.org)
[![Next.js](https://img.shields.io/badge/next.js-v14-black?logo=nextdotjs)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.100%2B-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/license-MIT-green)](#license)

**ADV Traveller** is a full-featured, state-of-the-art web application engineered for adventure motorcyclists. It combines interactive mapping, crowdsourced hazard warnings, real-time points of interest (POI) discovery, and a robust trip/maintenance logging system.

Designed to assist riders negotiating remote terrains like the Himalayas or the Western Ghats, the application features an intuitive Next.js frontend integrated with a powerful FastAPI backend.

---

## 📸 Preview & Dashboard Insights

*   **Interactive Live Map**: Displays routes, accommodations, mechanics, fuel stations, and road hazards.
*   **Trip Logger**: Log starts/ends of trips, record odometer readings, calculate average speed, duration, and fuel mileage.
*   **Service Reminders**: Intelligent alerts based on odometer tracking (e.g., chain lubing, oil change, tyre checks).
*   **Crowdsourced Hazards**: Live reporting of landslides, river flooding, and loose gravel with verification votes from fellow riders.

---

## 🛠️ Architecture & Tech Stack

The project is structured as a monorepo containing both the backend service and the frontend web application:

```
ADV-TRAVELLER/
├── backend/            # FastAPI Python Backend
│   ├── database.py     # SQLAlchemy ORM Models & SQLite DB Setup
│   ├── main.py         # REST API Endpoints & DB Seeding
│   ├── requirements.txt# Python Dependencies
│   └── advrider.db     # SQLite Database (auto-generated)
├── frontend/           # Next.js React Frontend
│   ├── app/            # App Router pages (Map, Tracker, landing page)
│   ├── components/     # Reusable UI Components (Navbar, MapView, Footer)
│   ├── sections/       # Landing page sections
│   ├── public/         # Static Assets
│   └── package.json    # npm scripts & dependencies
└── index.html          # Legacy HTML index
```

### Backend
*   **Core Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous, self-documenting REST APIs)
*   **Database ORM**: [SQLAlchemy](https://www.sqlalchemy.org/) (SQLite base)
*   **Validation**: [Pydantic](https://docs.pydantic.dev/) for request/response serialization
*   **Features**:
    *   Automatic SQLite DB seeding with remote Indian ADV routes (Manali-Leh, Guwahati-Tawang, Ooty, etc.).
    *   Radius-based POI querying (nearby mechanic shops, stays, fuel stations, hospitals).
    *   Service alerts logic based on odometer triggers.

### Frontend
*   **Core Framework**: [Next.js 14](https://nextjs.org/) (React, App Router, CSS Modules)
*   **Styling**: Pure CSS Modules & global styles for maximum design customization, featuring smooth micro-animations, glassmorphism UI, and dark-mode aesthetics.
*   **Features**:
    *   Interactive maps with filters for different types of POIs.
    *   Live GPS coordinate-based search.
    *   Dynamic service notifications and trip metrics visualizations.

---

## 🚀 Getting Started

Follow these instructions to run the application locally on your machine.

### Prerequisites
*   **Python 3.10+**
*   **Node.js 18+** & **npm**

---

### 📥 1. Backend Setup & Run

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   *   **Windows (PowerShell)**:
       ```powershell
       python -m venv venv
       .\venv\Scripts\Activate.ps1
       ```
   *   **macOS/Linux**:
       ```bash
       python3 -m venv venv
       source venv/bin/activate
       ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Launch the FastAPI server:
   ```bash
   python main.py
   ```
   *   The server will start on [http://localhost:8000](http://localhost:8000).
   *   Access interactive API documentation (Swagger UI) at [http://localhost:8000/docs](http://localhost:8000/docs).
   *   *Note: On first startup, the backend automatically seeds the database with legendary adventure routes and biker-friendly POIs.*

---

### 💻 2. Frontend Setup & Run

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *   Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🗺️ Curated ADV Routes Preloaded
Out of the box, the app comes preloaded with some of India's most challenging and iconic motorcycle routes:
*   🏔️ **Manali → Leh**: 479 km of high-altitude passes (Rohtang, Sarchu, Pang) with extreme difficulty.
*   💨 **Shimla → Spiti**: 412 km of remote dirt trails and water crossings.
*   ☕ **Bengaluru → Coorg**: 265 km of winding tarmac roads through coffee estates.
*   🌧️ **Guwahati → Tawang**: 525 km via the Sela Pass (13,700 ft) with mixed dirt & mud tracks.

---

## 📈 Key API Endpoints Reference

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/routes` | Fetch all registered adventure routes |
| `GET` | `/api/nearby` | Query nearby POIs (`lat`, `lng`, `radius_km`) |
| `GET` | `/api/hazards` | Retrieve active road hazard alerts |
| `POST` | `/api/hazards` | Report a new road hazard (landslide, flood, etc.) |
| `POST` | `/api/trips/start` | Start a new motorcycle trip log |
| `POST` | `/api/trips/{id}/end`| Conclude trip, record final ODO, and calculate mileage |
| `GET` | `/api/service-alerts/{bike_id}` | Fetch maintenance alerts based on current odometer |
| `GET` | `/api/stats` | Retrieve system-wide dashboard stats |

---

## 🤝 Contributing & Support

We welcome contributions from fellow riders and developers! 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

*Designed with ❤️ for adventure motorcyclists everywhere. Keep the rubber side down!* 🏍️💨
