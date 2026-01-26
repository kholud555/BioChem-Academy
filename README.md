# 🧪 BioChem Academy

**BioChem Academy** is a full-stack web application designed for an online Chemistry school.  
It provides a platform for managing **students, grades, terms, units, lessons, and educational media** (videos, PDFs, images), along with fine-grained access control for content visibility.

---

## 🧭 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Core Features](#-core-features)
- [Security & Permissions](#-security--permissions)
- [Demo](#-demo)
- [Ongoing Enhancements](#-ongoing-enhancements)

---

## 📖 Overview

**BioChem Academy** is a **learning management system (LMS)** focused on Chemistry education.  
The platform allows:
- Admins to manage content (Grades, Terms, Units, Lessons)
- Upload and organize **videos, images, and PDFs**
- Students to access content dynamically based on permissions
- Secure cloud-based video hosting through **Cloudflare R2**

This project combines **ASP.NET Core 9** for the backend API and **Angular 20** for the frontend UI.

---

## ⚙️ Tech Stack

### **Backend**
- ASP.NET Core 9 (Web API)
- Entity Framework Core (SQL Server)
- Clean Architecture Pattern
- AutoMapper
- Dependency Injection
- Global Exception Handling & Validation Filters
- Cloudflare R2 (for secure media hosting)
- JWT Authentication + ASP.NET Identity

### **Frontend**
- Angular 20
- TypeScript + RxJS
- Bootstrap 5
- Angular Signals + Reactive Forms
- API Integration via HttpClient

### **Database**
- Microsoft SQL Server

### **Hosting**
- SmarterASP.NET (Backend)
- Cloudflare R2 for media storage

---

## 🧱 Architecture

This project follows the **Clean Architecture** approach to ensure scalability, separation of concerns, and maintainability.

**Layers Overview:**

| Layer | Description |
|-------|-------------|
| **Core** | Contains entities, enums, and interfaces (domain layer). |
| **Infrastructure** | Implements repositories and data access logic using EF Core. |
| **Application** | Includes DTOs, mapping profiles, and service-level business logic. |
| **API** | Exposes REST endpoints, handles authentication, and applies filters. |
| **AngularClient** | The front-end layer built with Angular 20. |

This structure allows for **independent testing and easy replacement of layers** (for example, switching the database provider or hosting platform).

---

## 🚀 Core Features

### 👩‍🏫 Admin Features
- Manage Grades, Terms, Units, and Lessons
- Upload videos, PDFs, and images to Cloudflare R2
- Control student access per Grade / Term / Unit / Lesson
- Grant and revoke content access dynamically

### 👨‍🎓 Student Features
- View available lessons and materials
- Stream media (videos, PDFs, images) directly from Cloudflare
- Access free lessons without login restrictions

### 🔐 Authentication
- Register, Login, and Logout
- Role-based authorization (Admin / Student)
- Token-based access via JWT

---

## 🧩 Security & Permissions

The app implements **Access Control** to manage which student can access specific content.

| Level     | Example Action                |
|------------|------------------------------|
| Grade      | Grants access to all terms   |
| Term       | Grants access to all units   |
| Unit       | Grants access to all lessons |
| Lesson     | Grants access to a single lesson |

- Access is stored in the `AccessControl` table.  
- Free lessons are automatically visible to all users.  
- Revoking a Grade or Term removes all child-level access.  
- Global validation filters handle input validation and model state errors gracefully.  
- Global exception middleware ensures consistent API error responses.

---

## 🎥 Demo

https://biochemacademy.net/

## 🔄 Ongoing Enhancements

The following modules are currently being integrated and tested:

✅ Google Login Integration

✅ Email Confirmation & Password Reset

🧠 Exam Module – allows students to take quizzes per lesson or unit

🔄 Refresh Token Mechanism – optional security enhancement for session longevity

✉️ Enhanced Notifications System (Email / In-App Alerts)

🧾 Activity Logs for admin monitoring

🎨 Improved UI/UX with responsive design and better accessibility


