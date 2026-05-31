# Hackathon

# Scope
After two different dimensions connected, dangerous mutant animals began appearing, putting normal people in danger because they have no direct way to report these creatures or call for quick help. To solve this problem and keep communities safe, Mutant Hunt Network provides a central platform with a live map. Its distinct features include a smart interface that changes depending on whether you are a citizen or a hunter, a live map that uses real GPS locations to show glowing monster marks, and an automatic matching system. This system connects dangerous tasks with the right hunters to catch the creatures safely.

# Key Features
1. Mutant Hunting Request System (Create a post (user), Delete a post (user), View post overlay (user & hunter), Post details (user & hunter), Apply post (hunter)) 862
2. Hunt Matching (Matching System (user’s post and hunter), Hunter rank (by completing the quest)) 861
3. Mutant World Mapping: Live Map that changes interface depending on your roles (user/hunter) uses real GPS location. 866

# Technology Stack

## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

## Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- JWT Authentication

## Database
- SQLite

## Other Technologies
- bcrypt / bcryptjs for password hashing
- Multer and Cloudinary for image upload support
- Zod for data validation

# How to Run the Project

## 1. Install Frontend Dependencies
```bash
cd Frontend
npm install
```

## 2. Run the Frontend
```bash
npm run dev
```

The frontend will run using Vite. Open the URL shown in the terminal.

## 3. Install Backend Dependencies
Open another terminal and run:

```bash
cd Backend
npm install
```

## 4. Set Up the Database
Make sure the `Backend/.env` file contains the correct database URL.

Example:

```env
DATABASE_URL="file:./dev.db"
ALLOW_ORIGIN=http://localhost:5173
PORT=3000
JWT_SECRET=""

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

Then run:

```bash
npx prisma generate
npx prisma migrate dev
```

## 5. Run the Backend
```bash
npm run dev
```

The backend server will start and connect to the SQLite database.

# Additional Notes
- Run the frontend and backend in separate terminals.
- Make sure the backend is running before testing login, requests, posts, and messages.
- JWT Authentication is used to protect user-related actions.
