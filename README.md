# Zestora

Zestora is a food-delivery app built with React, JavaScript, Vite, and Node.js
microservices. The frontend is already React-based; it does not use Next.js.

## Requirements

- Node.js 22 or newer and npm
- MongoDB and RabbitMQ reachable at the URLs in the service environment files
- Credentials for the integrations you use, such as Google sign-in, Stripe,
  Razorpay, and ImageKit

## Run locally

Every app and service keeps its dependencies and lockfile in its own folder.
Install dependencies from each folder:

```sh
cd frontend && npm install && cd ..
cd services/auth && npm install && cd ../..
cd services/restaurant && npm install && cd ../..
cd services/utils && npm install && cd ../..
cd services/realtime && npm install && cd ../..
cd services/rider && npm install && cd ../..
cd services/admin && npm install && cd ../..
```

Create each private environment file from its example:

```sh
cp -n frontend/.env.example frontend/.env
cp -n services/auth/.env.example services/auth/.env
cp -n services/admin/.env.example services/admin/.env
cp -n services/realtime/.env.example services/realtime/.env
cp -n services/restaurant/.env.example services/restaurant/.env
cp -n services/rider/.env.example services/rider/.env
cp -n services/utils/.env.example services/utils/.env
```

Then fill in the values by the labels in each file. Use the same `JWT_SECRET`
in auth, admin, realtime, restaurant, and rider. Use the same
`INTERNAL_SERVICE_SECRET` in realtime, restaurant, rider, and utils. Razorpay
test/live keys go only in `services/utils/.env` (`RAZORPAY_KEY_ID` and
`RAZORPAY_KEY_SECRET`). Get them from Razorpay Dashboard > Account & Settings >
API Keys. Never put secret keys in `frontend/.env`. Private `.env` files are
ignored by Git. `cp -n` leaves any `.env` file you already have untouched.
Set `IMAGEKIT_PRIVATE_KEY` in `services/utils/.env` from ImageKit Dashboard >
Developer > API keys.

For Google sign-in, add `http://localhost:5173` to your OAuth client under
**Google Cloud Console → APIs & Services → Credentials → Authorized
JavaScript origins**. The frontend and auth service must use the same Google
Web client ID.

Start MongoDB, RabbitMQ, and any external integrations you use. Open a terminal
in `frontend/` and each `services/<service>/` folder, and run `npm run dev` in
each terminal. The frontend is available at `http://localhost:5173`.

The frontend API URLs default to local service ports and can be overridden with
`VITE_AUTH_SERVICE_URL`, `VITE_RESTAURANT_SERVICE_URL`,
`VITE_UTILS_SERVICE_URL`, `VITE_REALTIME_SERVICE_URL`, `VITE_RIDER_SERVICE_URL`,
and `VITE_ADMIN_SERVICE_URL` in `frontend/.env`.

## Checks

```sh
cd frontend && npm run build && npm run lint
cd ../services/auth && npm run build
cd ../restaurant && npm run build
cd ../utils && npm run build
cd ../realtime && npm run build
cd ../rider && npm run build
cd ../admin && npm run build
```

Format frontend and backend JavaScript from the frontend folder:

```sh
cd frontend && npm run format
```
