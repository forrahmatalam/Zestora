# Zestora web app

The frontend is a React + JavaScript/JSX single-page app built with Vite. It uses
React Router for pages and Axios for API requests.

## Run

From the project root, install the frontend dependencies and start it:

```sh
cd frontend
npm install
npm run dev
```

The frontend uses `http://localhost` service URLs by default. To point it at
deployed services, set the corresponding `VITE_*_SERVICE_URL` values in
`.env`. See the root [README](../README.md) for running the backend services.
