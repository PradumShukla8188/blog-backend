# Deploy on Render.com

## Render settings

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |

## Required environment variables

| Key | Description |
|-----|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |

Render sets `PORT` and `RENDER_EXTERNAL_URL` automatically.

## Optional

`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NODE_ENV=production`

## Local development

```bash
cp .env.example .env
# Edit .env with your values
npm start
```

`config.js` in the backend root is gitignored and overrides `config/index.js` locally if present.

## MongoDB Atlas

Network Access → allow `0.0.0.0/0` so Render can connect.

## After deploy

- API: `https://your-app.onrender.com/api/v1/blog/active`
- Swagger: `https://your-app.onrender.com/api-docs`

Seed database once (run locally with Atlas URI in `.env`):

```bash
npm run seed
```
