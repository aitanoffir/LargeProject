
---

# **LargeProject - COP4331 Team 18**
A **Personal Trainer Client Manager** built with **MERN stack**.

## **📂 Project Structure**
The project is organized as follows:

```
/LargeProject
│── /backend
│   │── /config         # Database configuration and environment settings
│   │── /controllers    # API route handlers (business logic)
│   │── /models         # Mongoose schemas for MongoDB collections
│   │── /routes         # Express routes for API endpoints
│   │── helpers.js      # Utility functions (e.g., JWT verification)
│   │── server.js       # Starts the Express server
│── /Front End          # React-based client-side application 
│── README.md           # Project overview
│── .gitignore          # Ignore unnecessary files in Git
│── package.json        # Project dependencies and scripts
│── .env                # Environemnt variables
```

---

## **🚀 Features**
✅ **User Authentication:** Sign-up & Login for Trainers  
✅ **Trainer & Client Management:** Manage trainer and client profiles  
✅ **Scheduling & Sessions:** Assign and track training sessions  
✅ **JWT-Based Authentication:** Secure API access  
✅ **MongoDB Integration:** Store and manage user data  

---

## **🛠️ Installation & Setup**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/aitanoffir/LargeProject.git
cd LargeProject
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Setup Environment Variables**
Create a **`.env`** file in the `/LargeProject` directory and add:
```
MONGO_URI=mongodb+srv://<your_mongodb_url>
JWT_SECRET=your_secret_key
PORT=7000
```

### **4️⃣ Start the Server**
```sh
npm run dev
```
The backend should now be running at:
```
http://localhost:7000/
```

---

## **📡 API Endpoints**
### **🔹 Authentication**
| Method | Endpoint        | Description              |
|--------|----------------|--------------------------|
| POST   | `/api/accounts/` | Sign up a new trainer    |
| POST   | `/api/accounts/login` | Trainer login |

### **🔹 Trainer Management**
| Method | Endpoint                  | Description                   |
|-------:|---------------------------|-------------------------------|
| POST   | `/api/accounts/trainer`  | Add trainer account info      |
| GET    | `/api/accounts/trainer`  | Get trainer account info      |

### **🔹 Client Management**
| Method | Endpoint                        | Description                                    |
|-------:|---------------------------------|------------------------------------------------|
| POST   | `/api/accounts/client`          | Add client info                                |
| GET    | `/api/accounts/client?id=ID`    | Get client by ID (e.g., `?id=605c72ad...`)     |
| GET    | `/api/accounts/client?lastName=Smith` | Search clients by last name                 |
| DELETE | `/api/accounts/client/:id`      | Delete a client by ID                          |
| PUT    | `/api/accounts/client/:id`      | Update a client by ID                          |

### **🔹 Session Management**
| Method | Endpoint                | Description                            |
|-------:|-------------------------|----------------------------------------|
| POST   | `/api/accounts/session` | Add session notes info                 |
| GET    | `/api/accounts/session` | Retrieve session notes info            |
| DELETE | `/api/accounts/session/:id` | Delete a session by ID             |
| PUT    | `/api/accounts/session/:id`   | Update a session by ID             |

### **🔹 Google OAuth**
| Method | Endpoint                                 | Description                             |
|-------:|------------------------------------------|-----------------------------------------|
| GET    | `/api/accounts/auth/google`              | Start Google Login flow                 |
| GET    | `/api/accounts/auth/google/callback`     | Google OAuth callback URI               |
| GET    | `/api/accounts/auth/google/logout`       | Google OAuth Logout URI                 |

### **🔹 Google Calendar**
| Method | Endpoint                                    | Description            |
|-------:|---------------------------------------------|------------------------|
| POST   | `/api/accounts/calendar/event`              | Create event           |
| GET    | `/api/accounts/calendar/events`             | Get events             |
| PUT    | `/api/accounts/calendar/event/:eventId`     | Update event           |
| DELETE | `/api/accounts/calendar/event/:eventId`     | Delete event           |

---

### **📧 Contact & Contributors**
- **Team 18 - COP4331**
- **Maintainer:** [Aitan Offir](https://github.com/aitanoffir)

