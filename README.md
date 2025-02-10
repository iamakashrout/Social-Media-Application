# Social-Media-Application
### OneWorld: Explore, Engage, Empower<br>
Production Link: https://oneworld-blush.vercel.app<br>
Demo Video Link: https://www.youtube.com/watch?v=CsTe5ioElMI

## Introduction
This is a fully functional social media application built using the MERN (MongoDB, Express.js, React, Node.js) stack. It includes features such as user authentication, posts, likes, comments, and real-time messaging using Socket.io.

## Features
- User authentication (Login, Register, JWT-based authorization)
- Profile creation and editing
- Post creation, editing, and deletion
- Like and comment functionality
- Friend requests and follow/unfollow feature
- Real-time chat and notifications with Socket.io
- Responsive UI built with React
- Backend API using Express.js and MongoDB

## Tech Stack
### Frontend:
- React.js
- Redux (for state management)
- React Router (for navigation)
- Fetch API (for API calls)
- Material UI (for styling)

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose for ORM)
- JSON Web Tokens (JWT) for authentication
- Socket.io for real-time messaging

## Installation and Setup
### Prerequisites:
Ensure you have the following installed:
- Node.js
- MongoDB
- npm or yarn

### Steps to Run the Project:
1. **Clone the repository:**
   ```bash
   git clone https://github.com/iamakashrout/Social-Media-Application.git
   cd Social-Media-Application
2. **Install dependencies:**
   - For backend:
     ```bash
     cd backend
     npm install
   - For frontend:
     ```bash
     cd frontend
     npm install
3. **Set up environment variables:**
    - Create a .env file in the backend folder and add:
      ```bash
      MONGO_URL=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret
      BASE_URL=https://oneworld.onrender.com
4. **Start the application:**
    - Run the backend server:
      ```bash
      cd backend
      npm start
    - Run the frontend app:
      ```bash
      cd frontend
      npm start
5. **Access the application:** Open ```http://localhost:3000``` in your browser.

## Contributing
Feel free to fork the repo and submit pull requests. Make sure to follow coding standards and write clean, modular code.

## Contact
For any issues, feel free to reach out via GitHub Issues.
