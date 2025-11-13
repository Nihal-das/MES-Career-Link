# MES Career Link

A full‑stack portal connecting **students**, **alumni**, and **teachers**, enabling job postings, communication, and career‑networking — built with React on the frontend and Spring Boot on the backend.

---

## 🚀 Tech Stack  
- **Frontend**: React (with Vite)  
- **Backend**: Spring Boot (Java)  
- **Database**: MySQL  
- **Auth & Security**: JWT, role‑based access (ADMIN, STUDENT, ALUMNI, TEACHER)  
- **Hosting/Docs**: GitHub Pages / Docsify (optional)  

---

## 🧭 Directory Structure
```
MES‑Career‑Link/
├── backend/   ← Spring Boot Java project  
├── frontend/  ← React project  
└── docs/      ← Project documentation (for GitHub Pages / Docsify)  
```

---

## 📌 Getting Started

### 1. Clone the repository  
```bash
git clone https://github.com/your‑username/MES‑Career‑Link.git
cd MES‑Career‑Link
```

### 2. Setup the backend  
```bash
cd backend
# Update application.properties: configure MySQL URL, username, password  
mvn clean install
mvn spring‑boot:run
```
🟢 The backend will start (by default) on `http://localhost:8080`.

### 3. Setup the frontend  
```bash
cd ../frontend
npm install
npm run dev
```
🟢 The frontend will start (by default) on `http://localhost:3000`.

---

## 🔐 Key Features  
- Role‑based user management (Admin / Student / Alumni / Teacher)  
- User registration and login via JWT (except Admin which is created by default)  
- Alumni can post job vacancies  
- Students can browse vacancies, apply, and message alumni  
- Chat functionality between students and alumni  
- Professional UI built in React — responsive and modern  

---

## 📂 API Endpoints (Backend Highlights)  
- `/api/auth/signup` – Register user (Student/Alumni/Teacher)  
- `/api/auth/login` – Login and receive JWT token  
- `/api/jobs` – Create/View job vacancies (Alumni)  
- `/api/applications` – Student applies for a job  
- `/api/messages` – Real‑time messaging endpoint  

*(For full endpoint list, refer to `backend/src/main/resources/api‑documentation.md`.)*

---

## 🎨 Frontend Pages  
- **Home** – Landing page with navigation  
- **Login / Signup** – Authentication for users  
- **Dashboard** – Role‑specific view (Admin / Student / Alumni / Teacher)  
- **Job Board** – Alumni post listings; Students browse/apply  
- **Messages** – Chat interface between students and alumni  

---

## 📖 Documentation  
Full docs are available in the `docs/` folder and are ready to be published via GitHub Pages using [Docsify](https://docsify.js.org).  
You can view the live documentation at:  
```
https://your‑Nihal-das.github.io/MES‑Career‑Link/
```

---

## 🛠 Development Tips  
- Use `.env` files (both backend/front) to store secrets (JWT keys, DB credentials) and add them to `.gitignore`  
- Use `frontend/.gitignore` to ignore:  
  ```
  node_modules/
  dist/
  .env
  ```
- Use `backend/.gitignore` to ignore:  
  ```
  /target/
  *.log
  *.iml
  .idea/
  *.jar
  .env
  ```
- Keep your `README.md` and `docs/` folder consistent as your project evolves. A clear README = less future confusion.

---

## ✅ Licensing & Acknowledgements  
This project is open‑source. Feel free to fork, adapt, and extend.  
Thanks to all contributors and the vibrant developer community!

---

> “Build fast, build right — let your code speak for you.”  
NIHAL, aspiring developer
