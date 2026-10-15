# GoLoan Angular Frontend

This is a separate Angular frontend for the GoLoan .NET API. The source follows the reference TestApp conventions: standalone components and separate `.ts`, `.html`, and `.scss` files.

## Requirements

- Node.js compatible with the Angular CLI version in `package.json`
- npm
- GoLoan .NET API running locally

## Run the frontend

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## API configuration

The default API base URL is `http://localhost:5047/api`, matching the HTTP launch URL in the uploaded GoLoan backend. Change `src/environments/environment.ts` if your API runs on a different host or port.

The backend's CORS policy currently allows `http://localhost:4200`. Keep that origin aligned with the frontend development server. The frontend sends requests with credentials enabled for the backend's HttpOnly `access_token` cookie and also attaches a Bearer token when the standard login response contains one.

## Included in this first pass

- Sign-in screen matching `POST /api/Auth/Login`
- TOTP 2FA setup and verification matching `/api/Auth/Setup2FA` and `/api/Auth/Verify2FA`
- Authenticated shell with responsive sidebar and topbar
- Role-aware navigation: customer menu vs back-office menu
- Customer dashboard using `GET /api/CustomerDashboard?customerId=...`
- Back-office dashboard using `GET /api/LMSReports/Dashboard`
- Route placeholders for the other loan-management modules, ready for incremental implementation

## Backend notes

- Public registration is not included because the backend requires a `RoleId` and this ZIP does not provide a stable role-ID mapping for the UI to use safely.
- The current backend has several endpoints without `[Authorize]`. Angular route guards improve navigation UX but are not security boundaries. Add authorization and role checks in .NET before production deployment.
- Login/2FA routes and request payloads are based on the controllers in the uploaded GoLoan backend.
