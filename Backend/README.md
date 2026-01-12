# Backend Documentation & Mentor Guide 🎓

## 1. Backend Architecture (Simple Explanation)
We are using a **client-server** model.
- **Client (Frontend)**: React app that users interact with.
- **Server (Backend)**: Node.js/Express app that handles logic.
- **Database**: Firebase Firestore (stores data like "Lost iPhone").
- **Storage**: Firebase Storage (stores images like "iphone.jpg").

**Flow:**
1. Frontend sends data (e.g., "I lost my keys") to Backend.
2. Backend checks if data is valid.
3. Backend saves text to Firestore and image to Storage.
4. Backend confirms "Saved!" to Frontend.

## 2. Folder Structure (MVC Style)
This keeps your code organized so you don't get lost.
```
Backend/
├── config/         # Configuration files (Firebase setup)
├── controllers/    # Logic! (What happens when a user requests something)
├── routes/         # API URLs (e.g., /api/lost-items)
├── server.js       # Main entry point (starts the server)
└── package.json    # Dependencies list
```

## 3. API Endpoints (The "Menu" for Frontend)
These are the URLs the Frontend will call.

### Auth
- `POST /api/auth/login` (Verify Google Token)

### Lost Items
- `GET /api/lost-items` (Get all lost items)
- `POST /api/lost-items` (Report a lost item)

### Found Items
- `GET /api/found-items` (Get all found items)
- `POST /api/found-items` (Report a found item)

### AI
- `POST /api/ai/match` (Send image, get matches)

## 4. GitHub Workflow for Backend
1. **Pull Latest**: `git pull origin main` (Always start fresh!)
2. **Create Branch**: `git checkout -b feature/backend-api`
3. **Work**: specific changes (avoid changing everything at once).
4. **Commit**: `git add .` -> `git commit -m "Added lost items route"`
5. **Push**: `git push origin feature/backend-api`

## 5. Connection Steps
1. **Firebase**: You need a `serviceAccountKey.json` from Firebase Console -> Project Settings -> Service Accounts. **DO NOT UPLOAD THIS TO GITHUB**.
2. **Frontend**: The Frontend needs your URL (e.g., `http://localhost:5000` locally).

## 6. Deployment (Free)
**Render / Railway**:
1. Create a new "Web Service".
2. Connect your GitHub repo.
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add Environment Variables (firebase config, etc.).

## 7. Common Beginner Mistakes (Avoid These!) ⚠️
1. **Pushing `serviceAccountKey.json` to GitHub**: This is a security risk! Always use `.gitignore`.
2. **Not waiting for `await`**: Database calls are slow. If you forget `await`, your code will crash or return empty data.
3. **Restarting server manually**: Use `nodemon` (install with `npm install -g nodemon`) to auto-restart on save.
4. **Hardcoding URLs**: Don't use `localhost` in your frontend code for production. Use env variables.
5. **Overcomplicating the DB**: Keep your data structure flat. Don't nest too deeply.

