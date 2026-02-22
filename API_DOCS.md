# REST API Documentation

## Base URL
When running locally, the defined backend base URI mapping routes is:
`http://localhost:4000`

---

## Authentication & Users

### 1. Register User
Creates a new user account and attaches an HttpOnly session cookie.
* **URL**: `/user/sign-up`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "strongPassword123"
  }
  ```
* **Success Response** (201 Created):
  * **Cookies Issued**: `token`
  ```json
  {
    "message": "User sign up successful",
    "savedUser": { "_id": "...", "username": "johndoe", "email": "john@example.com" }
  }
  ```

### 2. Login User
Authenticates an existing user and attaches an HttpOnly session cookie.
* **URL**: `/user/sign-in`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Body**:
  ```json
  {
    "identifier": "john@example.com", // Accepts email or username
    "password": "strongPassword123"
  }
  ```
* **Success Response** (200 OK):
  * **Cookies Issued**: `token`
  ```json
  {
    "message": "Login successful"
  }
  ```

### 3. Fetch Authenticated Profile
Retrieves the profile identity of the current session user.
* **URL**: `/user/profile`
* **Method**: `GET`
* **Security Constraints**: Target must possess active HttpOnly cookie.
* **Success Response** (200 OK):
  ```json
  {
    "user": {
      "_id": "67b86...",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
  ```

### 4. Update Identity Profile
Modifies the currently authenticated user's standard configurations.
* **URL**: `/user/profile`
* **Method**: `PUT`
* **Security Constraints**: Target must possess active HttpOnly cookie.
* **Body**:
  ```json
  {
    "firstName": "Jonathan",
    "lastName": "Doe"
  }
  ```
* **Success Response** (200 OK):
  ```json
  {
    "message": "Profile updated successfully",
    "user": { ...updated profile metadata... }
  }
  ```

### 5. Logout
Terminates the session cleanly.
* **URL**: `/user/logout`
* **Method**: `GET`
* **Success Response** (200 OK):
  * **Cookies Terminated**: `token`
  ```json
  {
    "message": "Logout successful"
  }
  ```

---

## Records (To-Dos)

### 1. Fetch Paginated Records
Retrieves records correlating to the authenticated user.
* **URL**: `/todo`
* **Method**: `GET`
* **Security Constraints**: Target must possess active HttpOnly cookie.
* **Query Parameters**:
  * `page` (number): Target subset division point (default: 1)
  * `limit` (number): Fixed count constraint mappings (default: 10)
* **Success Response** (200 OK):
  ```json
  {
    "message": "Todo list fetched successfully",
    "todoList": [
       { "_id": "...", "text": "Walk the dog", "priority": "Moderate", "isComplete": false }
    ],
    "currentPage": 1,
    "totalPages": 5,
    "totalTodos": 43
  }
  ```

### 2. Create Record
Generates a new data record linked sequentially to the current authenticated cookie user context.
* **URL**: `/todo`
* **Method**: `POST`
* **Security Constraints**: Target must possess active HttpOnly cookie.
* **Body**:
  ```json
  {
    "text": "Review architecture scaling",
    "description": "Evaluate horizontal limits",
    "priority": "Extreme"
  }
  ```
* **Success Response** (201 Created):
  ```json
  {
    "message": "Todo created successfully",
    "newTodo": { ...newly formatted metadata... }
  }
  ```

### 3. Update Record Metadata
Overwrites fields relative to specific records (ex: resolving status assignments).
* **URL**: `/todo/:id`
* **Method**: `PUT`
* **Path Parameters**:
  * `id`: Standard 24-char ObjectId identifying target model
* **Security Constraints**: Target must possess active HttpOnly cookie, User verification strictly mapped internally against record owner bounds.
* **Body**:
  ```json
  {
    "isComplete": true
  }
  ```
* **Success Response** (200 OK):
  ```json
  {
    "message": "Todo updated successfully",
    "todo": { ...updated record object... }
  }
  ```

### 4. Delete Record
Destroys specifically targeted records belonging to the authenticated user context boundary.
* **URL**: `/todo/:id`
* **Method**: `DELETE`
* **Path Parameters**:
  * `id`: Standard 24-char ObjectId identifying target model
* **Security Constraints**: Target must possess active HttpOnly cookie, User verification strictly mapped internally against record owner bounds.
* **Success Response** (200 OK):
  ```json
  {
    "message": "Todo deleted successfully"
  }
  ```
