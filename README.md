# Kaaragir (Labour Link)

> On-demand home services marketplace that connects customers with verified local service providers, with real-time chat, live location tracking and online payments.

**Live:** [kaaragir.in](https://kaaragir.in)

![Home page screenshot](docs/screenshots/home.png)

## Features

**Customers**
- Browse services and book instantly or schedule for later
- Live tracking of the assigned provider on a map
- In-app real-time chat with the provider
- Pay online with Razorpay, view payment and booking history
- Email OTP verification at signup

**Service providers**
- Register, upload KYC documents and wait for admin approval
- Go online or offline, accept or reject booking requests
- Share live location with the customer while en route
- Wallet with earnings and transaction history (15% platform fee)

**Admin**
- Separate admin login
- Dashboard with users, providers, bookings and revenue stats
- Review and approve or reject provider KYC

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router, React Hook Form, i18next, TomTom Maps SDK |
| Backend | Node.js, Express, TypeScript, Socket.io |
| Database | MongoDB with Mongoose (geospatial queries for nearby providers) |
| Auth and security | JWT access and refresh tokens, bcrypt, role-based middleware, Helmet, rate limiting, CORS |
| Integrations | Razorpay (payments), Resend (transactional email), TomTom (maps) |
| Deployment | Vercel (client), Render (API), MongoDB Atlas |

## Architecture

```
React (Vite)  --REST-->  Express API  -->  MongoDB
      |                      |
      +----- Socket.io ------+   chat, live location, booking events
                             |
                  Razorpay / Resend / TomTom
```

## Project structure

```
labour-link/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── Pages/          # customer, provider, admin, auth, public pages
│       ├── components/     # layout and shared components
│       ├── hooks/          # useSocket
│       └── utils/          # API config
└── server/                 # Express + TypeScript API
    └── src/
        ├── controllers/    # request handlers
        ├── services/       # booking, payment, auth, email logic
        ├── models/         # Mongoose schemas
        ├── routes/         # API routes
        ├── middlewares/    # auth, roles, error handling
        └── socket/         # Socket.io events
```

## API overview

| Prefix | Purpose |
| --- | --- |
| `/api/auth` | Register, login, OTP verification |
| `/api/customer` | Customer profile |
| `/api/provider` | Provider profile, availability, KYC |
| `/api/services` | Service catalogue, nearby providers |
| `/api/bookings` | Create, list, cancel, update booking status |
| `/api/payments` | Create Razorpay order, verify payment |
| `/api/chat` | Booking chat messages |
| `/api/reviews` | Ratings and reviews |
| `/api/notifications` | User notifications |
| `/api/admin` | Admin login, stats, KYC review |

## Getting started

### Prerequisites
- Node.js 20.19+ or 22.12+
- MongoDB (local, Docker or Atlas)
- Razorpay test keys, a Resend API key, a TomTom API key

### 1. Clone

```bash
git clone https://github.com/<your-username>/labour-link.git
cd labour-link
```

### 2. Start MongoDB (Docker)

```bash
docker run -d -p 27017:27017 --name mongo mongo:7
```

### 3. Configure the backend

```bash
cd server
cp .env.example .env
npm install
```

Fill in `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/labourlink
CLIENT_URL=http://localhost:5173

JWT_SECRET=change_me
JWT_REFRESH_SECRET=change_me_too
ADMIN_JWT_SECRET=change_me_admin
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxx
RESEND_API_KEY=re_xxxxxxxx
TOMTOM_API_KEY=xxxxxxxx
PLATFORM_FEE_PERCENT=15
```

```bash
npm run dev     # API on http://localhost:5000
```

### 4. Configure the frontend

```bash
cd ../client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
VITE_TOMTOM_API_KEY=xxxxxxxx
```

```bash
npm run dev     # App on http://localhost:5173
```

### 5. Add starter data

The database starts empty. Add a few documents to the `services` collection and one document to `admins` (with a bcrypt `passwordHash`) to try the full flow.

## Scripts

| Where | Command | What it does |
| --- | --- | --- |
| server | `npm run dev` | Start the API with nodemon and ts-node |
| server | `npm run build` / `npm start` | Compile to `dist/` and run |
| client | `npm run dev` | Start the Vite dev server |
| client | `npm run build` | Production build |

## Security notes

- Never commit `.env` files. Both are listed in `.gitignore`.
- Use Razorpay test keys in development.
- Payment signatures are verified on the server before a booking is marked paid.

## Roadmap

- [ ] Seed script for services and admin
- [ ] Automated tests
- [ ] Docker Compose setup
- [ ] Razorpay webhooks and refunds from the admin panel
- [ ] Push notifications

## License

MIT. See [LICENSE](LICENSE).

## Author

**[Your Name]** · [LinkedIn](https://linkedin.com/in/yourname) · [GitHub](https://github.com/yourname)
