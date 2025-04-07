# Social-Media-Application
### OneWorld: Explore, Engage, Empower<br>
Production Link: https://oneworld-blush.vercel.app<br>
Demo Video Link: https://www.youtube.com/watch?v=CsTe5ioElMI

## Introduction
This is a fully functional social media application built using the MERN (MongoDB, Express.js, React, Node.js) stack. It includes features such as user authentication, posts, likes, comments, and real-time messaging using Socket.io.

![image](https://github.com/user-attachments/assets/79dea729-1d3c-4137-a736-8b1940f4ff6a)

## Features :

### Authentication & Profile Management
- User authentication (Login, Register, JWT-based authorization)
- Profile creation, editing & picture upload
- Password reset and email verification
- Persistent login to avoid repeated sign-ins

![Screenshot 2025-04-06 225233](https://github.com/user-attachments/assets/9cc3bc80-839e-4297-a936-e9e83bdcef06)
![Screenshot 2025-04-06 225330](https://github.com/user-attachments/assets/bedc2007-3ea6-4adb-8de1-93437c386952)
![Screenshot 2025-04-06 225311](https://github.com/user-attachments/assets/2dff3dba-9704-4847-b62b-468958c1cb0b)


### Post Interactions
- Create, edit, and delete posts
- Like and comment on posts
- Delete posts and comments

### Chatbot
- Text-to-speech responses from chatbot
- Highlight text feature
- Voice search feature
- Text to speech response
  
![image](https://github.com/user-attachments/assets/6d4c728e-e1b5-4d42-930a-d20d3701de06)


### Social Features
- Friend requests and follow/unfollow 
- Friend-only filters on feeds
- Search users with optimization
- Voice search feature in search bar
- Creating and viewing stories
  
![image](https://github.com/user-attachments/assets/46da5050-d0e0-44a1-ae12-4ddc41bebec2)


### Notifications Feature
- Real-time activity alerts are received whenever :
   1. Someone likes someone's post or comment
   2. Someone's friend posts something
   3. Someone comments on someone's post
   4. A user adds someone or is added to someone's friend list
   5. A user removes someone or is removed from someone's friend list
  
![image](https://github.com/user-attachments/assets/5ef3021c-f01c-4ecb-9d63-fba567e9c13e)


### Chat & Communication
- Real-time messaging with Socket.io
  
![image](https://github.com/user-attachments/assets/a8e19235-6e56-4857-b7f5-c4b364065e53)


### Caching
- Caching of search history and past queries using Redis

### Additional Tools & Enhancements
- Dockerized application setup
- Media storage on Cloudinary
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
- Redis Cloud for caching

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
      EMAIL_HOST=your_email_host
      EMAIL_PORT=your_email_port
      EMAIL_USER=your_email
      EMAIL_PASS=your_email_passkey
      GOOGLE_API_KEY=your_google_api_key
      REDIS_URL=your_redis_url
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
