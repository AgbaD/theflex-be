## Local Setup

### clone from github
`git clone https://github.com/agbad/theflex-be.git`

### change working directory
`cd theflex-be`

### Create .env in the backend root

```
PORT=5000
NODE_ENV=development

JWT_SECRET=738oi2yuglkhj4rfiu632fyj3
JWT_EXPIRATION=7200
JWT_REFRESH_SECRET=i2yuglkhj4rfiu632khj4rf
JWT_REFRESH_EXPIRATION=180000

MANAGER_EMAIL=
MANAGER_PASSWORD=
MANAGER_FIRST_NAME=
MANAGER_LAST_NAME=

HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
HOSTAWAY_BASE_URL=https://api.hostaway.com/v1

GOOGLE_PLACES_API_KEY=
GOOGLE_PLACES_BASE_URL=https://places.googleapis.com/v1
```

#### Where to get these:
- JWT_*: generate any secure random strings; expirations are seconds.
- MANAGER_*: input the initial manager’s credentials — on boot, the server creates this user.
- HOSTAWAY_*: provided sandbox creds; sandbox may have no reviews, so the code can mock.
- GOOGLE_PLACES_*: see full documentation; you can leave blank if you’re not testing Google integration.


### Install
`npm install`

### Run server
`npm run start:dev`

-  The API will be available at http://localhost:5000/api (CORS allows http://localhost:3000).
- Endpoints to know
  - POST /api/auth/login — body { email, password } (use manager creds from .env).
  - GET /api/review — public; optional ?status=PUBLISHED for published-only (used by FE carousel).
  - GET /api/review/dashboard — auth required (Bearer token).
  - POST /api/review/status — auth required; body { reviewId, status: "PUBLISHED"|"HIDDEN" }.
  - GET /api/review/hostaway?mock=1 — auth required; fetch Hostaway reviews; mock=1 forces mock.



