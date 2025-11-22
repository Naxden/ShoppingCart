# Shopping Cart API

A RESTful API for managing shopping carts built with ASP.NET Core 9.0, Entity Framework Core, and JWT authentication.

## Features

- **JWT Authentication**: Secure user authentication using JSON Web Tokens
- **Shopping Cart Management**: Add, remove, and clear items from cart
- **External API Integration**: Fetches users and products from external API
- **SQLite Database**: Lightweight database for cart persistence
- **Swagger Documentation**: Interactive API documentation

## Project Structure

```
ShoppingCart/
├── Controllers/
│   ├── AuthController.cs      # Authentication endpoints
│   └── CartController.cs      # Cart management endpoints
├── DTOs/
│   ├── CartDto.cs            # Cart data transfer objects
│   ├── CartItemDto.cs
│   ├── CategoryDto.cs
│   ├── ProductDto.cs
│   └── UserDto.cs
├── Models/
│   ├── AppDbContext.cs       # Entity Framework context
│   └── CartEntry.cs          # Cart entry entity
├── Services/
│   ├── CartService.cs        # Cart business logic
│   ├── JwtService.cs         # JWT token generation
│   ├── ProductApiClient.cs   # External product API client
│   └── UserApiClient.cs      # External user API client
└── Program.cs                # Application startup
```

## Getting Started

### Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ShoppingCart
```

2. Restore dependencies:

```bash
dotnet restore
```

3. Build the application:

```bash
dotnet restore
```

4. Run the application:

```bash
dotnet run --project ShoppingCart
```

The API will be available at:

- HTTP: `http://localhost:5112`
- HTTPS: `https://localhost:7072`

## API Endpoints

### Authentication

#### Get Available Users (proxy to external API)

```http
GET /api/auth
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json
{
  "userid": 1
}
```

This will return the JWT for the chosen user

### Cart Management

#### Get All Products (proxy to external API)

```http
GET /api/cart/products
```

#### Get User Cart

```http
GET /api/cart
Authorization: Bearer <token>
```

#### Add Item to Cart

```http
POST /api/cart/{productId}?quantity=2
Authorization: Bearer <token>
```

#### Remove Item from Cart

```http
DELETE /api/cart/{productId}?quantity=1
Authorization: Bearer <token>
```

#### Clear Cart

```http
DELETE /api/cart
Authorization: Bearer <token>
```

## Authentication Flow

1. Request available users from `/api/auth`
2. Login with a user ID via `/api/auth/login`
3. Use the returned JWT token for authenticated requests
4. Include token in Authorization header: `Bearer <token>`

## Database

The application uses SQLite with Entity Framework Core. The database schema includes:

- **CartEntries**: Stores user cart items with ProductId, UserId, and Quantity

## External APIs

The application integrates with the following external API:

- **Products API**: `https://api.escuelajs.co/api/v1/products/`
- **Users API**: `https://api.escuelajs.co/api/v1/users/`

## Testing

### Swagger UI

1. Access the interactive API documentation at after running the app:

- `http://localhost:5112/swagger`
- `https://localhost:7072/swagger`

2. Login with the /api/auth/login endpoint
3. Paste the returned JWT to Authorize section (lock icon).
4. Test the endpoints

### Using Postman

A Postman collection is included in [`ShoppingCart.postman_collection.json`](ShoppingCart.postman_collection.json) for testing all endpoints.

1. Import the collection into Postman
2. Set the `login_token` collection variable after logging in
3. Test the endpoints

## Development

### Running in Development Mode

```bash
dotnet run --environment Development
```

### Building for Production

```bash
dotnet build --configuration Release
```
