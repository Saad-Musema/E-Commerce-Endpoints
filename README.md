# E-Commerce Endpoints

## Overview
This is an E-Commerce API built using **Node.js**, **Express**, and **MongoDB**. The API provides endpoints to manage products and users, including functionality to create, retrieve, update, and delete records for both entities. It includes caching mechanisms to optimize data retrieval and supports authentication and authorization for secure access.

---

## Features

### Product Management:
- Add a new product
- Retrieve all products
- Retrieve a product by its Product Serial Number (PSN)
- Update a product by its PSN
- Delete a product by its PSN

### User Management:
- Create a new user account
- Authenticate a user (login)
- Update a user's details by their username
- Delete a user by their username



---

## Libraries Used
- **Express:** A flexible Node.js web application framework for building APIs.
- **Mongoose:** An Object Data Modeling (ODM) library for MongoDB and Node.js, enabling schema validation and seamless database integration.
- **Body-Parser:** Middleware to parse incoming request bodies under the `req.body` property.
- **Dotenv:** Loads environment variables from a `.env` file into `process.env`.
- **Bcrypt:** A library for hashing passwords for secure storage.
- **Jsonwebtoken:** A library for creating and verifying JSON Web Tokens (JWT).


---

## Installation

### Clone the Repository
```bash
$ git clone <repository-url>
$ cd ecommerce-api
```

### Install Dependencies
```bash
$ npm install
```


### Start the Server
```bash
$ npm run start
```

---

## API Endpoints

### Products Endpoints

#### Add a Product
- **URL:** `/v1/products`
- **Method:** `POST`
- **Description:** Adds a new product to the database.
- **Request Body:**
    ```json
    {
        "name": "string",
        "description": "string",
        "price": "number",
        "type": "string",
        "psn": "string"
    }
    ```

#### Get All Products
- **URL:** `/v1/products`
- **Method:** `GET`
- **Description:** Retrieves a list of all products in the database. Uses Redis caching for optimization.

#### Get Product by PSN
- **URL:** `/v1/products/:psn`
- **Method:** `GET`
- **Description:** Retrieves a specific product by its Product Serial Number (PSN).

#### Update Product by PSN
- **URL:** `/v1/products/:psn`
- **Method:** `PATCH`
- **Description:** Updates a product's details by its Product Serial Number (PSN).
- **Request Params:**
    - `psn` (string) - The Product Serial Number.
- **Request Body:**
    ```json
    {
        "name": "string",
        "description": "string",
        "price": "number"
    }
    ```

#### Delete Product by PSN
- **URL:** `/v1/products/:psn`
- **Method:** `DELETE`
- **Description:** Deletes a product by its Product Serial Number (PSN).
- **Request Params:**
    - `psn` (string) - The Product Serial Number.

---

### Users Endpoints

#### Create a User
- **URL:** `/v1/users`
- **Method:** `POST`
- **Description:** Creates a new user account.
- **Request Body:**
    ```json
    {
        "name": "string",
        "username": "string",
        "email": "string",
        "phoneNumber": "string",
        "address": "string",
        "city": "string",
        "password": "string"
    }
    ```

#### Login User
- **URL:** `/v1/users/login`
- **Method:** `POST`
- **Description:** Authenticates a user and returns an access token.
- **Request Body:**
    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```

#### Update User by Username
- **URL:** `/v1/users/:username`
- **Method:** `PATCH`
- **Description:** Updates a user's details by their username.
- **Request Params:**
    - `username` (string) - The username of the user.
- **Request Body:**
    ```json
    {
        "email": "string",
        "phoneNumber": "string"
    }
    ```

#### Delete User by Username
- **URL:** `/v1/users/:username`
- **Method:** `DELETE`
- **Description:** Marks a user as deleted by their username.
- **Request Params:**
    - `username` (string) - The username of the user.
- **Headers:** `Authorization: Bearer <token>`


## License
This project is licensed under the MIT License.

