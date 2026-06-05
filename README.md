# 🌿 Tenderly

### *a quiet museum for lost things*

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## about

**Tenderly** is a digital museum where people leave behind lost things feelings, memories, moments, versions of themselves. 

Others can **grow branches** onto these artifacts (responses that build on the feeling) and leave **reactions** (❤️ ✨ 🌙). 

The museum grows like a garden quiet, emotional, and deeply human.

> This is not social media. This is a place to leave things behind.

---

## The aesthetic

| element | vibe |
|---------|------|
| palette | crispy green, creamy glow, burgundy, silver, dark canvas |
| typography | Playfair Display (serif) + DM Sans |
| feeling | botanical museum meets moody greenhouse |
| layout | off‑center, guest‑book energy, archival |

---

## Features

| feature | description |
|---------|-------------|
|  **auth** | register / login with JWT |
|  **the museum** | browse all artifacts with mood + era filters |
|  **submit artifact** | leave a lost thing behind (title, body, mood, era, anonymous toggle) |
|  **branches** | grow responses onto artifacts (coming soon) |
|  **reactions** | react with ❤️ ✨ 🌙 |
|  **wander** | stumble upon a random artifact |
|  **my garden** | view your own submissions + branches |

---

## tech stack

### Backend

| tech | purpose |
|------|---------|
| **Node.js + Express** | REST API server |
| **SQLite (better-sqlite3)** | lightweight database |
| **JWT (jsonwebtoken)** | authentication |
| **bcryptjs** | password hashing |
| **cors + dotenv** | security + config |

### Frontend

| tech | purpose |
|------|---------|
| **Vanilla JavaScript** | no frameworks, pure DOM |
| **CSS custom properties** | theming + tokens |
| **Fetch API** | backend communication |
| **LocalStorage** | session persistence |



---

## Getting started

### prerequisites

- Node.js (v18+)
- npm or yarn

### 1. clone the repository

```bash
git clone https://github.com/yourusername/lostgarden.git
cd lostgarden
2. set up the backend
bash
cd backend
npm install
create a .env file:

env
PORT=5000
JWT_SECRET=your_super_secret_key_here
create the database and tables:

bash
node setup.js
start the server:

bash
npm run dev
3. set up the frontend
serve the frontend/ folder using Live Server, or:

bash
cd frontend
python -m http.server 3000
4. visit the garden
landing: http://localhost:3000

register: http://localhost:3000/register.html

login: http://localhost:3000/login.html

backend runs on port 5000, frontend on port 3000

 database schema
sql
users          -- id, username, email, password_hash
artifacts      -- id, user_id, title, body, mood_tag, era_tag, is_anonymous
branches       -- id, artifact_id, user_id, body
reactions      -- id, artifact_id, user_id, emoji
 api endpoints
auth
method	endpoint	description
POST	/api/auth/register	create account
POST	/api/auth/login	get JWT token
artifacts (protected routes require token)
method	endpoint	description
GET	/api/artifacts	get all artifacts
GET	/api/artifacts/:id	get single artifact
POST	/api/artifacts	submit new artifact
DELETE	/api/artifacts/:id	delete your own
branches
method	endpoint	description
GET	/api/branches/:artifact_id	get branches for artifact
POST	/api/branches	plant a branch
reactions
method	endpoint	description
POST	/api/reactions	add/update reaction
 color palette
role	hex
canvas (bg)	#2C1A12
cream (text)	#F5EDD8
green (accent)	#4A7C59
burgundy (accent)	#5C1F2E
silver (subtle)	#9BA4A8
muted (secondary)	#7A6A55
 responsiveness
breakpoint	behavior
> 768px	2‑column artifact grid, right side card visible
≤ 768px	1‑column grid, filters stack vertically, right side hidden
≤ 480px	compact padding, smaller typography

 future additions
live branch growth visualization (tree animation)

seasonal themes (museum changes with time)

wander mode — truly random artifact with "stumble" button

trending algorithm (most branched, most felt)

moderation queue for new submissions

email notifications for branch activity


 license
MIT feel free to fork, learn from it, and build your own garden 

 acknowledgments
inspired by quiet corners of the internet


built with late‑night tea and a lot of heart

<p align="center"> <i>“the museum grows like a garden — quiet, emotional, and deeply human.”</i> <br/> 🌿 </p> ```
