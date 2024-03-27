Authentication API Documentation
This document provides documentation for the Authentication API endpoints.

Base URL
All endpoints are relative to the base URL: /api

Endpoints
User Registration
Endpoint: POST /register
Description: Register a new user.
Request Body:
username (string, required): User's username.
email (string, required): User's email address.
password (string, required): User's password.
role (string, optional): User's role (default: "user").
User Login
Endpoint: POST /login
Description: Login with existing user credentials.
Request Body:
email (string, required): User's email address.
password (string, required): User's password.
User Registration with Google
Endpoint: POST /register/google
Description: Register a new user using Google authentication.
User Login with Google
Endpoint: POST /login/google
Description: Login with existing user account using Google authentication.
User Sign Out
Endpoint: POST /signout
Description: Sign out the current user.
Get User Profile by ID
Endpoint: GET /profile/id
Description: Get the profile details of the authenticated user.
Authorization: Requires a valid authentication token with user role.
Edit User Profile
Endpoint: POST /edit/profile
Description: Edit the profile details of the authenticated user.
Authorization: Requires a valid authentication token with user role.
Upload Profile Photo
Endpoint: POST /upload/profile/photo
Description: Upload a new profile photo for the authenticated user.
Authorization: Requires a valid authentication token with user role.
Set Profile Visibility
Endpoint: POST /set/profile-visibility
Description: Set the visibility of the user's profile (public or private).
Authorization: Requires a valid authentication token with user role.
Get Admin Profiles
Endpoint: GET /admin/profile
Description: Get profiles of all users (admin only).
Authorization: Requires a valid authentication token with admin role.
Get Public Profiles
Endpoint: GET /public/profile
Description: Get profiles of all public users.
Authorization: Requires a valid authentication token.
Example Usage
Base URL: https://yourdomain.com/api