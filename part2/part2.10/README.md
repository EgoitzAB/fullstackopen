# ☎️ Phonebook App

A simple phonebook application built with **React + Vite** for the frontend and **Node.js + Express + MongoDB** for the backend.

## 📚 Features
- Add new contacts with a name and phone number.
- Update an existing contact's phone number.
- Delete contacts from the phonebook.
- Filter contacts by name.
- Displays the total number of contacts.

## 🛠️ Technologies Used
### Frontend
- React + Vite
- Axios (for HTTP requests)
- CSS (for styling)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Helmet (for security)
- Morgan (for logging)
- CORS (to handle cross-origin requests)

## 🛡️ Installation
### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) database (local or cloud)

### 1. Clone the Repository
```sh
git clone https://github.com/your-username/phonebook-app.git
cd phonebook-app
```

### 2. Install Dependencies
#### Backend
```sh
cd backend
npm install
```

#### Frontend
```sh
cd frontend
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the `backend` directory and add your MongoDB connection string:
```sh
MONGODB_URI=your-mongodb-connection-string
PORT=3001
```

### 4. Start the Development Servers
#### Backend
```sh
cd backend
npm start
```

#### Frontend
```sh
cd frontend
npm run dev
```

The frontend should now be running at `http://localhost:5173` and the backend at `http://localhost:3001`.

## 📝 API Endpoints
| Method | Endpoint         | Description |
|--------|----------------|-------------|
| GET    | /api/persons    | Get all contacts |
| GET    | /api/persons/:id | Get a single contact by ID |
| POST   | /api/persons    | Add a new contact |
| PUT    | /api/persons/:id | Update a contact's phone number |
| DELETE | /api/persons/:id | Delete a contact |
| GET    | /info           | Get total contacts count |

## 🛠️ Deployment
### Backend (Render, Vercel, etc.)
Modify `backend/config/mongo.js` to use your production database.

### Frontend (Netlify, Vercel, etc.)
Update the API base URL in `frontend/src/services/rest.js`:
```js
const baseUrl = 'https://fullstackopen2-r3mb.onrender.com/api/persons';
```

## 👥 Author
- **Egoitz Abilleira** - [GitHub Profile](https://github.com/EgoitzAV)

## 🌟 Acknowledgments
- Based on the FullStackOpen course by [University of Helsinki](https://fullstackopen.com/)

---
Happy coding! 💪

