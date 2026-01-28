# 🎓 LMS Backend (Node.js)

![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

> **Backend for a Learning Management System built using Node.js, Express, and MongoDB.**
> *Implemented to understand real-world backend architecture, authentication, and role-based access control.*

---

## 📌 Project Purpose

This repository is a deep dive into building production-ready backends. It moves beyond simple CRUD applications to handle complex logic, security, and scalability.

**Key Learning Goals:**
* Understand production-style backend folder structure.
* Implement secure **Authentication & Authorization**.
* Practice advanced **MongoDB data modeling**.
* Handle **Role-Based Access Control** (Admin, Instructor, Student).
* Manage media uploads and payment integrations.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT & Bcrypt |
| **Storage** | Cloudinary (Media) |
| **Payments** | Razorpay / Stripe (Integration Ready) |

---

## ✨ Key Features

### 🔐 User Authentication
* **Secure Sign-up/Login** using JWT.
* **Password Hashing** via Bcrypt.
* **Role-Based Authorization**:
    * `Admin`: Full system control.
    * `Instructor`: Create and manage courses.
    * `Student`: Purchase and view courses.

### 📚 Course Management
* CRUD operations for Courses.
* Hierarchical structure: **Course → Sections → Lectures**.
* Media handling for video lectures and thumbnails.

### 💳 Payments & Media
* **Cloudinary Integration** for seamless file uploads.
* **Payment Gateway** integration logic for course purchases.

---

## 🗂 Project Structure

The folder structure is modular and scalable, designed to mimic real-world codebases.

```text
LMS-Backend/
│
├── config/             # Database & 3rd party configurations
├── controllers/        # Request logic (clean & separated)
├── models/             # Mongoose schemas
├── routes/             # API endpoints
├── middlewares/        # Auth checks, error handling
├── utils/              # Helper functions (emails, response handlers)
│
├── app.js              # Express app setup
├── index.js            # Server entry point
└── README.md           # Documentation
