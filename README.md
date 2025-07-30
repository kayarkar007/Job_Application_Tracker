# Job Application Tracker

A full-stack web application for tracking job applications with authentication, dashboard analytics, and CRUD operations.

## Features

- 🔐 **User Authentication** - Secure login/signup with JWT tokens
- 📊 **Dashboard Analytics** - Visual charts showing application statistics
- 📝 **Job Management** - Add, edit, delete, and track job applications
- 🔍 **Search & Filter** - Search jobs by title/company and filter by status
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS

## Tech Stack

### Frontend

- React 19
- React Router DOM
- Tailwind CSS
- Chart.js with react-chartjs-2
- Axios for API calls

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
cd job_application_tracker
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Environment Setup

Create a `.env` file in the `server` directory:

```env
MONGO_URI=mongodb://localhost:27017/job-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

**Note:** Replace the MongoDB URI with your own connection string if using a cloud database.

### 3. Start the Application

#### Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

#### Start the Frontend Development Server

```bash
# In a new terminal, from the root directory
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

## Usage

### Authentication

1. **Sign Up**: Create a new account with your name, email, and password
2. **Login**: Use your credentials to access the application
3. **Logout**: Click the logout button in the navigation bar

### Managing Job Applications

#### Adding a Job

1. Click "Add Job" in the navigation or jobs page
2. Fill in the required fields:
   - **Position**: Job title (required)
   - **Company**: Company name (required)
   - **Location**: Job location (optional)
   - **Status**: Current application status
   - **Notes**: Additional information (optional)
3. Click "Add Job" to save

#### Viewing Jobs

- **Dashboard**: See statistics and charts
- **Jobs Page**: View all applications with search and filter options

#### Editing/Deleting Jobs

- Use the edit/delete buttons on each job card
- Confirm deletion when prompted

### Dashboard Features

- **Statistics Cards**: Total applications, interviews, offers, rejections
- **Bar Chart**: Visual representation of application status
- **Pie Chart**: Distribution of application statuses

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Jobs (Protected Routes)

- `GET /api/jobs` - Get all jobs for user
- `POST /api/jobs` - Create new job
- `GET /api/jobs/:id` - Get specific job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/jobs/stats` - Get job statistics

## Project Structure

```
job_application_tracker/
├── src/
│   ├── components/          # Reusable components
│   ├── context/            # React context (AuthContext)
│   ├── pages/              # Page components
│   ├── services/           # API services
│   └── App.jsx            # Main app component
├── server/
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── server.js          # Express server
└── package.json
```

## Development

### Running in Development Mode

```bash
# Frontend (from root directory)
npm run dev

# Backend (from server directory)
npm run dev
```

### Building for Production

```bash
# Frontend
npm run build

# Backend
npm start
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Backend routes require valid JWT tokens
- **Input Validation**: Server-side validation for all inputs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
