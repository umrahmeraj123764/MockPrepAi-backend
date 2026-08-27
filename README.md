# 🎤 MockPrepAI — Backend

The API server for **MockPrepAI**, an AI-powered mock interview platform that generates role-specific interview questions and gives instant, scored feedback on your answers.

**Frontend repo:** [MockPrepAI-frontend](https://github.com/umrahmeraj123764/MockPrepAI-frontend)
**Live API:** `https://mockprepai-backend.onrender.com`

---

## What it does

1. A user registers/logs in (JWT auth, stored in an httpOnly cookie)
2. They pick a **job role** (Frontend, Backend, Full Stack, DevOps, or custom) and an **interview type** (Technical or Behavioral/HR)
3. The backend asks an LLM to generate 5 tailored interview questions and creates a `Session` document to track them
4. For each answer the user submits, the backend sends the question + answer to the LLM, which returns a **score out of 10** and **written feedback** — stored back on the session

## Tech stack

- **Node.js / Express 5** — REST API
- **MongoDB / Mongoose** — user accounts and interview sessions
- **JWT + bcrypt** — authentication, with tokens set as httpOnly, secure, `SameSite=None` cookies for cross-origin use
- **Groq SDK** (`openai/gpt-oss-20b`) — question generation and answer scoring
- **CORS** configured for the deployed frontend origin

## Project structure

```
MockPrepAi-backend/
├── index.js                       # App entry point, DB connection, middleware
├── controllers/
│   ├── authController.js          # register / login
│   └── interviewController.js     # start interview / score an answer
├── middlewares/
│   └── protectmiddleware.js       # JWT auth guard
├── models/
│   ├── User.js
│   └── Session.js                 # role, type, questions, answers, feedback, scores
└── routes/
    ├── authRoutes.js
    └── interviewRoutes.js
```

## API reference

### Auth — `/api/auth`

| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/register` | `{ name, email, password }` | Creates a user, returns a session cookie |
| POST | `/login` | `{ email, password }` | Verifies credentials, returns a session cookie |

### Interview — `/api/interview` *(requires auth cookie)*

| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/start` | `{ role, type }` | Generates 5 AI interview questions and creates a session |
| POST | `/response` | `{ sessionId, question, answer }` | Scores an answer (0–10) with written feedback, appends it to the session |

## Environment variables

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=https://your-frontend-url.vercel.app
```

## Getting started

```bash
npm install
# create a .env file with the variables above
npm run dev     # nodemon, for local development
# or
npm start
```

## Notes / roadmap

- Interview questions and scoring both currently rely on the model returning strict JSON — worth adding stronger parsing/validation around that
- Add an endpoint to fetch a user's past sessions and overall progress
- Rate-limit interview generation to control LLM costs

## License

MIT
