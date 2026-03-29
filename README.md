# Auction System — OOAD Mini Project

**Course:** UE23CS352B – Object Oriented Analysis & Design  
**Team:**

| Member | GitHub | Role |
|--------|--------|------|
| Chinmay | Chinmay-13 | Bid Engine, Live Bidding, Strategy & Observer |
| Brunda | brunda933 | Auction Creation, Item Management, Factory & Builder |
| Chirag | ilb225112 | User Auth, Registration, Command Pattern |
| Bhavini | BhaviniShrutha | Admin Panel, Facade & Observer Patterns |

## Tech Stack
- **Backend:** Java Spring Boot (MVC)
- **Frontend:** React + Vite
- **Database:** MySQL

## Design Patterns Implemented
- Creational: Factory, Builder, Singleton
- Structural: Facade, Adapter, Repository
- Behavioral: Observer, Strategy, Command

## SOLID Principles
All 5 SOLID principles demonstrated across the codebase.

## How to Run

### Database
Import `sqlfile.sql` into MySQL on port 3306.

### Backend
```powershell
cd Backend
$env:DB_URL="jdbc:mysql://localhost:3306/auction_system_ooad?createDatabaseIfNotExist=true`&useSSL=false`&serverTimezone=UTC`&allowPublicKeyRetrieval=true"
$env:DB_USERNAME="root"
$env:DB_PASSWORD=""
mvn spring-boot:run
```

### User Frontend
```powershell
cd Frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

### Admin Panel
```powershell
cd Admin
npm install
npm run dev
```

Runs on `http://localhost:5174`

## Test Accounts
- Admin: `admin@auction.com / admin123`
- Register a new bidder account via the frontend
