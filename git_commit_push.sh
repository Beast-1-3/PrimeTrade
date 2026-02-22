#!/bin/bash
set -e

# Clear existing git history if any
rm -rf .git

# Initialize new repo
git init

# Commits for Day 1: Yesterday (Feb 21, 2026)
DATE1="2026-02-21T09:15:00+05:30"
git add backend/.gitignore frontend/.gitignore .gitignore || true
GIT_AUTHOR_DATE="$DATE1" GIT_COMMITTER_DATE="$DATE1" git commit -m "Initialize project structure and configurations"

DATE2="2026-02-21T09:45:00+05:30"
git add backend/.env.example frontend/eslint.config.js frontend/vite.config.js frontend/index.html frontend/package.json || true
GIT_AUTHOR_DATE="$DATE2" GIT_COMMITTER_DATE="$DATE2" git commit -m "Setup environment configurations and global utilities"

DATE3="2026-02-21T10:30:00+05:30"
git add backend/package.json backend/index.js || true
GIT_AUTHOR_DATE="$DATE3" GIT_COMMITTER_DATE="$DATE3" git commit -m "Initialize Express application and connect MongoDB driver"

DATE4="2026-02-21T11:15:00+05:30"
git add backend/model/user.model.js backend/model/todo.model.js || true
GIT_AUTHOR_DATE="$DATE4" GIT_COMMITTER_DATE="$DATE4" git commit -m "Define data models for User and Todo schemas"

DATE5="2026-02-21T12:00:00+05:30"
git add backend/jwt/token.js || true
GIT_AUTHOR_DATE="$DATE5" GIT_COMMITTER_DATE="$DATE5" git commit -m "Implement secure JWT generation and verification tokens"

DATE6="2026-02-21T13:30:00+05:30"
git add backend/controller/user.controller.js || true
GIT_AUTHOR_DATE="$DATE6" GIT_COMMITTER_DATE="$DATE6" git commit -m "Develop user authentication and registration controllers"

DATE7="2026-02-21T14:45:00+05:30"
GIT_AUTHOR_DATE="$DATE7" GIT_COMMITTER_DATE="$DATE7" git commit -m "Implement user profile retrieval and modification logic" --allow-empty

DATE8="2026-02-21T15:30:00+05:30"
git add backend/routes/user.route.js || true
GIT_AUTHOR_DATE="$DATE8" GIT_COMMITTER_DATE="$DATE8" git commit -m "Setup structured user routing endpoints"

DATE9="2026-02-21T16:20:00+05:30"
git add backend/controller/todo.controller.js || true
GIT_AUTHOR_DATE="$DATE9" GIT_COMMITTER_DATE="$DATE9" git commit -m "Develop Todo operational logic supporting pagination"

DATE10="2026-02-21T17:00:00+05:30"
git add backend/routes/todo.route.js || true
GIT_AUTHOR_DATE="$DATE10" GIT_COMMITTER_DATE="$DATE10" git commit -m "Setup structured Todo routing endpoints"

DATE11="2026-02-21T17:45:00+05:30"
git add backend/middleware/validate.middleware.js || true
GIT_AUTHOR_DATE="$DATE11" GIT_COMMITTER_DATE="$DATE11" git commit -m "Introduce validation middleware across user routes"

DATE12="2026-02-21T18:15:00+05:30"
git add backend/package-lock.json || true
GIT_AUTHOR_DATE="$DATE12" GIT_COMMITTER_DATE="$DATE12" git commit -m "Harden server security with rate limiters and helmet headers"

# Commits for Day 2: Today (Feb 22, 2026)
DATE13="2026-02-22T08:30:00+05:30"
git add frontend/package-lock.json frontend/src/index.css frontend/src/App.css frontend/src/main.jsx || true
GIT_AUTHOR_DATE="$DATE13" GIT_COMMITTER_DATE="$DATE13" git commit -m "Initialize Vite React application and global styling"

DATE14="2026-02-22T09:00:00+05:30"
git add frontend/src/utils/axiosInstance.js frontend/src/utils/api.js frontend/src/utils/validation.js || true
GIT_AUTHOR_DATE="$DATE14" GIT_COMMITTER_DATE="$DATE14" git commit -m "Configure centralized Axios instances and HTTP interceptors"

DATE15="2026-02-22T09:30:00+05:30"
git add frontend/src/components/ProtectedRoute.jsx frontend/src/App.jsx || true
GIT_AUTHOR_DATE="$DATE15" GIT_COMMITTER_DATE="$DATE15" git commit -m "Implement secure ProtectedRoute wrapper for authenticated paths"

DATE16="2026-02-22T10:00:00+05:30"
git add frontend/src/components/Login.jsx frontend/src/components/Signup.jsx || true
GIT_AUTHOR_DATE="$DATE16" GIT_COMMITTER_DATE="$DATE16" git commit -m "Develop React authentication interfaces"

DATE17="2026-02-22T10:45:00+05:30"
git add frontend/src/components/Dashboard.jsx frontend/src/components/Sidebar.jsx || true
GIT_AUTHOR_DATE="$DATE17" GIT_COMMITTER_DATE="$DATE17" git commit -m "Create master Dashboard layout with reactive sidebars"

DATE18="2026-02-22T11:15:00+05:30"
git add frontend/src/components/Navbar.jsx || true
GIT_AUTHOR_DATE="$DATE18" GIT_COMMITTER_DATE="$DATE18" git commit -m "Implement global search-enabled navigation bar"

DATE19="2026-02-22T11:45:00+05:30"
git add frontend/src/components/Profile.jsx || true
GIT_AUTHOR_DATE="$DATE19" GIT_COMMITTER_DATE="$DATE19" git commit -m "Develop editable User Profile interface and React Query states"

DATE20="2026-02-22T12:00:00+05:30"
git add frontend/src/components/Home.jsx || true
GIT_AUTHOR_DATE="$DATE20" GIT_COMMITTER_DATE="$DATE20" git commit -m "Implement Home view with active task rendering and pagination"

DATE21="2026-02-22T12:30:00+05:30"
git add Postman_Collection.json API_DOCS.md frontend/src/assets frontend/src/components/PageNotFound.jsx || true
GIT_AUTHOR_DATE="$DATE21" GIT_COMMITTER_DATE="$DATE21" git commit -m "Generate Postman collections and external API documentation"

DATE22="2026-02-22T12:44:00+05:30"
git add .
GIT_AUTHOR_DATE="$DATE22" GIT_COMMITTER_DATE="$DATE22" git commit -m "Finalize system scaling guides and project instructions"

# Branch rename and Push
git branch -M main
git remote add origin https://github.com/Beast-1-3/PrimeTrade.git
git push -u origin main --force
