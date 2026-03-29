# Auction System API Endpoints

This document lists all API endpoints used by the frontend to communicate with the Spring Boot backend.

## Base URLs
- **Local Development**: `http://localhost:8080`
- **Production**: `https://auctionsystem-production.up.railway.app`

---

## User APIs (`/api/users`)

### 1. Register User
- **Endpoint**: `POST /api/users/register`
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
- **Response**: 
  - `200 OK`: "Registration successful"
  - `400 Bad Request`: "Email already in use"

### 2. Login User
- **Endpoint**: `POST /api/users/login`
- **Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response**:
  - `200 OK`: UserDetailsDTO
```json
{
  "userId": "Long",
  "name": "string",
  "email": "string",
  "role": "string",
  "auctions": []
}
```
  - `400 Bad Request`: null body

### 3. Get All Users
- **Endpoint**: `GET /api/users/all`
- **Response**: List<AllUsersDTO>

### 4. Get Unregistered Auctions
- **Endpoint**: `GET /api/users/unregistered/{userId}`
- **Response**: List<Auction>

### 5. Register for Auction
- **Endpoint**: `POST /api/users/registerAuction`
- **Request Body**:
```json
{
  "userId": "Long",
  "auctionId": "Long"
}
```
- **Response**: `200 OK`: "User registered successfully!"

### 6. Get Registered Auctions
- **Endpoint**: `GET /api/users/registered/{userId}`
- **Response**: List<BidderAuctionDTO>
```json
[
  {
    "auctionId": "Long",
    "name": "string",
    "auctionDate": "Date",
    "status": "Live|Upcoming|Completed"
  }
]
```

### 7. Get Purchased Items
- **Endpoint**: `GET /api/users/purchases/{userId}/{auctionId}`
- **Response**: List<ItemDTO>

### 8. Change Password
- **Endpoint**: `POST /api/users/changePassword/{userId}`
- **Request Body**:
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```
- **Response**:
  - `200 OK`: "Password updated successfully"
  - `400 Bad Request`: "Incorrect old password" or "User not found"

---

## Auction APIs (`/api/auctions`)

### 1. Get Upcoming Auctions
- **Endpoint**: `GET /api/auctions/upcoming`
- **Response**: List<Auction>

### 2. Get Live Auctions
- **Endpoint**: `GET /api/auctions/live`
- **Response**: List<Auction>

### 3. Get Completed Auctions
- **Endpoint**: `GET /api/auctions/completed`
- **Response**: List<Auction>

### 4. Create Auction
- **Endpoint**: `POST /api/auctions/createAuction`
- **Request Body**: Auction object
- **Response**: `201 CREATED`: Auction object

### 5. Add Item to Auction
- **Endpoint**: `POST /api/auctions/addItem/{auctionId}`
- **Request Body**: Item object
- **Response**: `201 CREATED`: Item object

### 6. Get Auction Items
- **Endpoint**: `GET /api/auctions/auctionItems/{auctionId}`
- **Response**: List<ItemDTO>
```json
[
  {
    "itemId": "Long",
    "name": "string",
    "description": "string",
    "startingPrice": "double",
    "status": "AVAILABLE|SOLD",
    "auctionId": "Long"
  }
]
```

---

## Bid APIs (`/api/bids`)

### 1. Get Latest Bid
- **Endpoint**: `GET /api/bids/latestBid/{auctionId}/{itemId}`
- **Response**:
  - `200 OK`: BidDTO
```json
{
  "itemId": "Long",
  "bidderId": "Long",
  "bidderName": "string",
  "bidAmount": "double",
  "bidtime": "Date"
}
```
  - `204 No Content`: No bids yet

### 2. Get Bid History
- **Endpoint**: `GET /api/bids/bidHistory/{auctionId}/{itemId}`
- **Response**: List<BidDTO>

### 3. Place Bid
- **Endpoint**: `POST /api/bids/placeBid`
- **Request Body**:
```json
{
  "item": { "itemId": "Long" },
  "bidder": { "userId": "Long" },
  "auction": { "auctionId": "Long" },
  "bidAmount": "double"
}
```
- **Response**:
  - `200 OK`: "Bid placed successfully"
  - `400 Bad Request`: "Bid placement failed"

### 4. Sell Item
- **Endpoint**: `POST /api/bids/sellItem/{itemId}`
- **Request Body**:
```json
{
  "bidderId": "Long",
  "bidAmount": "double"
}
```
- **Response**:
  - `200 OK`: "Item sold successfully"
  - `400 Bad Request`: "Error selling item"

---

## Admin APIs (`/api/admin`)

### 1. Get Registered Bidders
- **Endpoint**: `GET /api/admin/bidders/{auctionId}`
- **Response**: List<BidderDTO>
```json
[
  {
    "userId": "Long",
    "name": "string",
    "email": "string",
    "role": "string"
  }
]
```

### 2. Delete Bidder
- **Endpoint**: `DELETE /api/admin/deleteBidder/{auctionId}/{userId}`
- **Response**: `200 OK`

---

## Notes

1. **Authentication**: Currently using localStorage to store user session. No JWT tokens implemented.
2. **CORS**: All controllers have `@CrossOrigin(origins = "*")` enabled.
3. **Password Security**: Passwords are stored in plain text (not recommended for production).
4. **Error Handling**: Backend returns plain text error messages, not JSON objects.
5. **Date Format**: Dates are returned in ISO format from the backend.

## Frontend Routes

- `/` - Home (Unregistered Auctions)
- `/login` - Login Page
- `/register` - Register Page
- `/bidderAuctions` - My Registered Auctions
- `/auctionItems/:auctionId/:auctionName` - View Auction Items
- `/purchases/:auctionId/:auctionName/:userId` - View Purchased Items
- `/profile/:userId` - User Profile & Change Password
- `/live/:auctionId/:name/:userId` - Live Auction Bidding Panel
