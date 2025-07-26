# SecureBYTE Frontend

A comprehensive React-based frontend application 5. Copy the configuration values to your `.env` file

### 4. Backend Setup (Required) a secure code review and project management platform. Built with modern web technologies including React 19, Firebase Authentication, and Vite for optimal performance.

## 🚀 Features

- **User Authentication**: Firebase Authentication with email/password and Google OAuth
- **Project Management**: Create, edit, delete, and organize coding projects
- **Code Submissions**: Upload and manage code files with syntax highlighting
- **Real-time Data**: Integration with Firebase Realtime Database for live updates
- **Responsive Design**: Modern, responsive UI that works across all devices
- **User Isolation**: Secure user-specific data separation

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 6.0.1
- **Authentication**: Firebase Auth
- **Database**: Firebase Realtime Database
- **HTTP Client**: Axios 1.10.0
- **Styling**: CSS-in-JS (inline styles)
- **Linting**: ESLint

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **Firebase Project** - [Create one here](https://console.firebase.google.com/)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/BYTE-TMU/SecureBYTE_Frontend.git
cd SecureBYTE_Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration (Keys provided by executive team)
VITE_FIREBASE_API_KEY=***
VITE_FIREBASE_AUTH_DOMAIN=***
VITE_FIREBASE_PROJECT_ID=***
VITE_FIREBASE_STORAGE_BUCKET=***
VITE_FIREBASE_MESSAGING_SENDER_ID=***
VITE_FIREBASE_APP_ID=***
VITE_FIREBASE_DATABASE_URL=***

# Backend API Configuration
VITE_API_URL=http://localhost:5000
```

#### Firebase Configuration:

The Firebase configuration keys will be provided by the executive team. The application uses:

- **Firebase Authentication**: For user login/signup with email/password and Google OAuth
- **Firebase Realtime Database**: For storing user-specific projects and submissions

### 4. Backend Setup (Required)

This frontend requires the SecureBYTE Backend to be running. Please ensure the backend is set up and running on your local machine or server. The backend API URL should be set in the `.env` file as `VITE_API_URL`. Please refer to the backend documentation for setup instructions on their repository.

## 🚀 Running the Project

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

## 📂 Project Structure

```
SecureBYTE_Frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.css
│   ├── App.jsx          # Main application component
│   ├── api.js           # API service layer
│   ├── firebase.js      # Firebase configuration
│   ├── index.css
│   └── main.jsx         # Application entry point
├── .env                 # Environment variables (create this)
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## 🔗 API Integration

The frontend communicates with the backend through RESTful API endpoints for:

### Projects
- Get user's projects
- Create new project
- Update project
- Delete project

### Submissions
- Get project submissions
- Create submission
- Update submission
- Delete submission

*Note: Detailed API documentation is available to authorized developers.*

## 🔐 Authentication Flow

1. User signs in with email/password or Google OAuth
2. Firebase Auth provides user token and UID
3. Frontend uses UID for all API calls to ensure data isolation
4. Backend validates requests and maintains user-specific data

## 🎯 Usage

### For Users:
1. **Sign Up/Sign In**: Create account or login with existing credentials
2. **Create Projects**: Add new coding projects with descriptions
3. **Manage Submissions**: Upload code files and manage versions
4. **Edit & Delete**: Modify or remove projects and submissions as needed

### For Developers:
1. **Development**: Use `npm run dev` for hot reload during development
2. **Testing**: Test authentication and API integrations
3. **Building**: Use `npm run build` for production builds
4. **Deployment**: Deploy to your preferred hosting platform

## 🐛 Troubleshooting

### Common Issues:

1. **Firebase Configuration Error**:
   - Ensure all Firebase environment variables are set correctly
   - Check Firebase project settings and enabled services

2. **API Connection Issues**:
   - Verify backend server is running
   - Contact development team for backend configuration
   - Ensure environment variables are properly set

3. **Build Errors**:
   - Run `npm install` to ensure all dependencies are installed
   - Check Node.js version compatibility

4. **Authentication Issues**:
   - Contact executive team for Firebase configuration
   - Check browser console for error messages

### Debug Mode:

The application includes extensive console logging for debugging:
- Authentication state changes
- API request/response cycles
- Error handling with detailed messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m 'Add some feature'`
5. Push: `git push origin feature-name`
6. Submit a pull request to the `develop` branch

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Contact the team at TMU BYTE
- Check the troubleshooting section above

---

Built with ❤️ by the TMU BYTE team
