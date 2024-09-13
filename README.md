# Educa School Fees Management System - Backend

This is the backend part of the **Educa School Fees Management System**, built with **Node.js**, **Express**, and **MongoDB**. It allows school administrators to manage students, fees, and generate payment receipts.

## Features

### Authentication & Authorization
- Secure **JWT-based** authentication.
- **Role-based access control** (Super-admin, Admin, User).

### Student Management
- Create, update, and delete student profiles.
- View student details, including fee status.

### Fees Management
- Add, update, and delete fees for students.
- Track due and paid fees for each student.


### Reporting
- Generate reports with filters based on students, fees, and payment history.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Token)
- **Validation**: Zod

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AR-Tausif/educa-backend.git
   cd educa-backend
   npm install
   npm run dev
