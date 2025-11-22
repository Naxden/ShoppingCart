# ADR – Assumptions and Justifications

## 1. Reasoning Behind the Chosen Approach

The goal of this project was to implement a backend shopping cart service that integrates with an external API. The chosen approach focused on delivering a clear and straightforward solution without unnecessary complexity, while fully meeting the requirements of the task.

## 2. How the Shopping Cart Is Stored

An initial concept was to store carts in memory. However, this approach would be neither persistent nor elegant.
Therefore, the decision was made to use SQLite, which is lightweight, easy to configure, and sufficiently robust for the scope of this task.

Entity Framework Core was chosen to simplify data access and enable potential migration to other database engines in the future.

## 3. Handling Multiple Users and Their Carts

A backend service limited to a single cart would not meet the expectations of a real-world scenario. To maintain a stateless architecture while supporting multiple users, JWT authentication was introduced.

Each user receives a token, and the server identifies the correct cart based on the user ID stored in that token. This ensures proper request handling without requiring server-side session storage.

## 4. Simplified User Model

Although the external API provides user roles, the task description does not specify any role-based behavior for the shopping cart.
For this reason, the system treats all users the same, and both “customers” and “admins” are allowed to create and use carts without restrictions.

## 5. Caching External API Requests

The external API is the main performance bottleneck, as each request for products or users is forwarded directly to the external service. Introducing a caching layer (e.g., Redis in a Docker container) would significantly reduce latency and external dependency.

This solution was not implemented to keep the project simple and aligned with the recruitment task’s scope.

While caching may lead to outdated data, this can be controlled with TTL-based expiration. Since the application does not modify product or user data, occasional staleness is acceptable.
