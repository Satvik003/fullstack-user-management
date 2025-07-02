# Fullstack User Management App

This is a full-stack user management app I built to practice full-stack development for my placements. It lets you add, edit, delete, and view users. It also supports Excel upload and download, and stores all data in a MySQL database.

The goal was to build something practical from scratch using React, Next.js, TypeScript, and MySQL — and to learn how frontend, backend, validation, and database come together in a real-world project.

---

## 🔧 Tech Stack

- **Frontend:** React + TypeScript + TailwindCSS
- **Backend:** Next.js (API Routes) + TypeScript
- **Database:** MySQL
- **Excel Handling:** Formidable + xlsx

---

## ✅ Features

- Add a new user using a form
- Edit user with pre-filled data
- Delete a user
- View users in a table
- Upload multiple users from an Excel (.xlsx) file
- Download a ready-made sample Excel template
- Basic validation for phone and PAN
- PAN masking with toggle

---

## 📂 Folder Structure

fullstack-user-management/
├── frontend/ → React app (UI)
├── backend/ → Next.js API routes + DB connection


---

## ▶️ Running the Project Locally

### Backend

```bash
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm start

If port 3000 is taken, you can run on 3001:
set PORT=3001 && npm start

Excel Format (for Upload)
| first\_name | last\_name | email                                   | phone      | pan        |
| ----------- | ---------- | --------------------------------------- | ---------- | ---------- |
| Aman        | Mehra      | [aman@gmail.com](mailto:aman@gmail.com) | 9876543210 | ABCDE1234F |


About Me
I’m Satvik, a B.Tech CSE student currently preparing for placements.





