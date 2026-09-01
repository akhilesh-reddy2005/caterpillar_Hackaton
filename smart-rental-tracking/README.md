# Smart Rental Tracking System

A Caterpillar-themed equipment rental management system for construction / mining
equipment. Customers browse and book equipment, pay (mock), and receive a QR code.
Admins scan the QR at pickup and return, so check-out / check-in dates are
**witnessed** instead of self-reported. The admin dashboard also surfaces
anomalies, maintenance, demand insights and operator assignments.

---

## 1. Project overview

- **User** browses available equipment, books it, chooses "bring my own operator"
  or "request a Caterpillar operator", pays (mock), and gets a QR code.
- **Admin** scans the QR (camera or manual booking ID) to confirm pickup and
  return, manages equipment, maintenance, anomalies, demand insights and operators.
- **Operator** gets a simple informational page.

## 2. Features

- Role selection login (no real auth)
- Equipment catalogue with filters
- Booking flow with operator selection + mock payment
- QR code generation (encodes only the `bookingId`)
- Admin QR scanner (html5-qrcode) → validate → confirm pickup / return
- Equipment table with client-side **OVERDUE** computation
- Anomaly flags: Unassigned, Underutilized, Rental Integrity
- Maintenance panel with status workflow (pending → in-progress → resolved)
- Demand insights (count + average operating days by type)
- Operator assignment table
- Floating chatbot widget that POSTs to a configurable n8n webhook

## 3. Tech stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Axios, html5-qrcode
**Backend:** Node.js, Express, MongoDB, Mongoose, qrcode
**Automation:** n8n (built separately — the frontend just calls a webhook)

## 4. Folder structure

```
smart-rental-tracking/
  backend/
    models/        Equipment, Booking, Maintenance, User, Operator
    routes/        equipment, operators, bookings, scan, maintenance, users, chatbot
    seed.js        clears + reseeds demo data
    server.js
    .env.example
  frontend/
    src/
      components/  Badge, Header, BookingModal, QRCard, QRScanner,
                   AdminScanner, EquipmentTable, AnomalyPanel,
                   MaintenancePanel, DemandInsights, OperatorTable, ChatWidget
      pages/       Login, UserDashboard, AdminDashboard, OperatorPage
      services/    api.js, auth.js
      utils/       helpers.js
      App.jsx
      main.jsx
    .env.example
```

## 5. MongoDB setup

You need a running MongoDB. Locally with Homebrew:

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

Or use MongoDB Atlas and put the connection string in `backend/.env`.

Default connection string: `mongodb://127.0.0.1:27017/smart-rental-tracking`

## 6. Backend setup

```bash
cd backend
cp .env.example .env
npm install
```

## 7. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
```

## 8. Environment variables

**backend/.env**

```
MONGO_URI=mongodb://127.0.0.1:27017/smart-rental-tracking
PORT=5000
```

**frontend/.env**

```
VITE_API_URL=http://localhost:5000/api
VITE_CHATBOT_WEBHOOK_URL=      # paste your n8n webhook URL here (optional)
```

If `VITE_CHATBOT_WEBHOOK_URL` is empty the chat widget replies
"Chatbot is not configured."

## 9. Seed the database

```bash
cd backend
npm run seed
```

This safely deletes existing demo data and reinserts 7 equipment, 3 users,
3 operators and 3 maintenance records.

## 10. Run the backend

```bash
cd backend
npm start
# http://localhost:5000
```

## 11. Run the frontend

```bash
cd frontend
npm run dev
# http://localhost:5173
```

## 12. API endpoints

| Method | Endpoint | Notes |
| ------ | -------- | ----- |
| GET | `/api/equipment` | filters: `?siteId=S003`, `?status=available` |
| GET | `/api/equipment/:id` | id = equipmentId |
| GET | `/api/operators?type=Excavator` | certified + available only |
| GET | `/api/operators` | all operators (admin panel) |
| POST | `/api/bookings` | `{ userId, equipmentId, operatorRequest }` → booking + QR |
| GET | `/api/bookings/:userId` | user's bookings with QR + equipment + operator |
| POST | `/api/scan/validate` | `{ bookingId }` → action = confirm-pickup / confirm-return |
| POST | `/api/scan/confirm-pickup` | `{ bookingId, siteId?, operatorId? }` |
| POST | `/api/scan/confirm-return` | `{ bookingId }` |
| GET | `/api/maintenance` | filter: `?status=pending` |
| POST | `/api/maintenance` | create record |
| PATCH | `/api/maintenance/:id` | update status (sets resolvedDate when resolved) |
| GET | `/api/users` / `/api/users/:userId` | |
| POST | `/api/telemetry/:equipmentId` | receive machine heartbeat & telemetry metrics |
| GET | `/api/telemetry/:equipmentId` | get latest telemetry & dynamic connection status (online/offline) |
| GET | `/api/telemetry` | get telemetry overview for all equipment |
| GET | `/api/chatbot-context` | combined equipment + maintenance + bookings + operators + telemetry (for n8n) |

## 13. QR flow

1. User books equipment and pays (mock) → backend creates the booking with
   `paymentStatus = paid`, `qrStatus = unused`, and returns a QR code that
   **encodes only the bookingId**.
2. At pickup, Admin scans the QR → `POST /api/scan/validate`.
   - `qrStatus = unused` → `action: "confirm-pickup"`.
   - Admin enters Site ID (and operator ID if the customer brought their own),
     then `POST /api/scan/confirm-pickup`.
   - Booking → `checked-out`; Equipment → `active`.
3. At return, Admin scans again → `action: "confirm-return"` →
   `POST /api/scan/confirm-return`.
   - Booking → `completed`; Equipment → `available`; a Caterpillar-assigned
     operator is freed back to `available`.
4. Scanning a completed/expired booking or one with unpaid payment returns a
   clear error.

## 14. Demo credentials / user IDs

| Role | User ID | Name |
| ---- | ------- | ---- |
| user | `USR001` | Alex Morgan |
| admin | `ADM001` | Dana Scott |
| operator | `OPR001` | Chris Bennett |

Operators: `OP101` Ravi Kumar (Excavator, Grader), `OP203` Maria Gomez
(Bulldozer, Crane), `OP301` Sam Lee (Excavator, Bulldozer, Crane).

On the login screen you can leave the User ID blank and just click a role — it
falls back to the demo ID for that role.
