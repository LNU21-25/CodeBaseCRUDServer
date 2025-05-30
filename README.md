# B2-CRUD Application
A simple Node.js and Express application with user authentication (registration and login) and basic CRUD functionality using MongoDB and bcrypt for password hashing.

Features
User registration and login
Password hashing with bcrypt
Flash messages for user feedback
Basic CRUD operations (create, read, update, delete) for resources

Prerequisites
Node.js (v14+)
npm
MongoDB instance (local or hosted)

Installation
Clone the repository:
git clone <repository-url>
cd b2-crud
Install dependencies:
npm install

Configuration
Create a .env file in the project root with the following variables:
MONGO_URI=mongodb://localhost:27017/b2crud
SESSION_SECRET=yourSessionSecret

Running the Application
Start the server:
npm start

The app will run on http://localhost:3000 by default.