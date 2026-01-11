# 📘 Lost2Found Frontend Mentor Guide

Welcome team! This guide will help you build the frontend for **Lost2Found**. We are using **React, Vite, and Tailwind CSS**.

## 🏗️ 1. Architecture Explained
Think of our app like a Lego house:
- **Components**: The individual Lego bricks (Buttons, Cards, Forms).
- **Pages**: The rooms built from bricks (Login Page, Dashboard).
- **Router**: The hallway connecting the rooms.
- **Context**: The electricity running through the house (User Login State).

### Folder Structure
```
/src
  /assets        # Images & logos
  /components    # Reusable UI (Navbar, ItemCard)
  /pages         # Main screens (Login, Dashboard)
  /context       # Global state (AuthContext)
  /services      # talking to Backend (api.js)
  App.jsx        # The main container
  main.jsx       # The entry point
```

## 🎨 2. UI Flow
1.  **Login Page**: Simple screen with "Sign in with Google".
2.  **Dashboard**: Grid of "Lost" and "Found" items.
3.  **Report Item**: Form to upload image and details.
4.  **Matches**: View AI results.

## 🔑 3. Google Login (Firebase)
We use Firebase Authentication. It handles the security for us.
1.  User clicks "Login".
2.  Firebase opens Google popup.
3.  User signs in.
4.  Firebase gives us a `user` object.
5.  We save this `user` in `AuthContext` so all pages know who is logged in.

## 🔌 4. Connecting to Backend
We use `axios` (like a highly-trained messenger pigeon) to send data to our backend.
Example:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api' // Backend URL
});

export const getItems = () => api.get('/items');
export const reportItem = (data) => api.post('/items', data);
```

## 📸 5. Image Upload Flow
1.  User selects file in `<input type="file" />`.
2.  We upload this file to **Firebase Storage**.
3.  Firebase gives us a public URL (e.g., `https://firebasestorage.../image.jpg`).
4.  We send this URL + item details to our Backend.

## 🐙 6. GitHub Workflow (Simple)
1.  **Pull** latest changes: `git pull origin main`
2.  **Create Branch**: `git checkout -b feature-login`
3.  **Code** your changes.
4.  **Add & Commit**: `git add .`, `git commit -m "Added login button"`
5.  **Push**: `git push origin feature-login`
6.  **Pull Request**: Go to GitHub and merge to main.

## 🚀 7. Deployment (Free)
We will use **Vercel** or **Firebase Hosting**.
1.  Run `npm run build` (Creates `dist` folder).
2.  Install Vercel CLI: `npm i -g vercel`
3.  Run `vercel login` -> `vercel deploy`.
4.  Done!

---
**Next Steps:**
- Check `src/firebase.js` to add your keys.
- Start coding the `Navbar` component!
