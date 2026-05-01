#  Team Task Manager
A full-stack web application that allows teams to manage projects, assign tasks, and track progress with role-based access control.

---

## Live Demo

Live Link: (https://extraordinary-inspiration-production-0ffd.up.railway.app/)

---

## Features

### Authentication

* User Signup & Login (JWT-based)
* Secure password hashing using bcrypt

### Project Management

* Create projects (Admin only)
* Delete projects (Admin only)
* View all assigned projects

### Team Management

* Add members to project via email
* Role-based access (ADMIN / MEMBER)

### Task Management

* Create tasks inside projects
* Assign tasks using member email
* View all project tasks

### Task Status Tracking

* Status flow: Todo → In Progress → Done
* Only assigned user can update status

### Dashboard

* View all assigned projects
* Clean UI with quick navigation

---

##  Tech Stack

### Frontend

* React (Vite)
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

---

##  System Design Highlights

* UUID used for project identification (external-safe)
* Role-based access control (RBAC)
* Task ownership enforcement (only assigned user can update)
* Cascade deletion (projects → tasks → members)
* Modular MVC backend architecture

---

##  Installation (Local Setup)

### Backend

cd backend
npm install
npm run dev

### Frontend

cd frontend
npm install
npm run dev

---

##  API Endpoints (Core)

POST   /api/auth/signup
POST   /api/auth/login

POST   /api/projects
GET    /api/projects/my
POST   /api/projects/:id/add-member
DELETE /api/projects/:id

POST   /api/tasks
POST   /api/tasks/:id/assign
PATCH  /api/tasks/:id/status
GET    /api/tasks/project/:id

---

##  Demo Video

(Attach your Loom / Drive link here)

---
##  Future Improvements

* Notifications for task assignment
* File attachments in tasks
* Real-time updates (WebSockets)
* Kanban board UI

---

##  Author

Aditya Gupta
