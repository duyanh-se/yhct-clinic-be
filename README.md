# 🏥 YHCT Clinic Backend

NestJS + PostgreSQL + Prisma backend application for YHCT Clinic.

## 📋 Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT (Passport)
- **API**: REST with Swagger
- **Testing**: Jest

## 🚀 Quick Start

### 1. Start Database (First Time)

```bash
# Start PostgreSQL container
docker-compose up -d

# Verify container is running
docker ps
```

### 2. Setup Backend

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run migrations
npx prisma migrate deploy

# Seed data
npx prisma db seed
```

### 3. Start Development

```bash
# Development server (watch mode)
npm run start:dev

# Backend will run at http://localhost:3000
```

### Daily Development

```bash
# Terminal 1: Start database
docker-compose up -d

# Terminal 2: Start backend
npm run start:dev
```

### View Database

```bash
# GUI - Opens at http://localhost:5555
npx prisma studio

# CLI
docker exec -it yhct-clinic-db psql -U postgres -d yhct-clinic-db
```

## 📚 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── dto/                 # Data transfer objects
│   │   ├── login.dto.ts
│   │   ├── register.dto.ts
│   │   └── register-staff.dto.ts
│   └── interfaces/
│       └── jwt-payload.interface.ts
│
├── common/                  # Shared utilities
│   ├── decorators/
│   │   └── roles.decorator.ts
│   ├── guards/
│   │   └── roles.guard.ts
│   ├── enums/
│   │   └── role.enum.ts
│   └── interfaces/
│       └── request-with-user.interface.ts
│
├── prisma/                  # Database service
│   ├── prisma.module.ts
│   └── prisma.service.ts
│
├── app.module.ts            # Root module
├── app.service.ts
├── app.controller.ts
└── main.ts                  # Entry point
```

## 🔧 Available Commands

### Development

```bash
npm run start              # Start normally
npm run start:dev         # Watch mode (recommended)
npm run start:debug       # Debug mode with breakpoints
```

### Building

```bash
npm run build             # Compile TypeScript
npm run start:prod        # Run production build
```

### Testing

```bash
npm run test              # Unit tests
npm run test:watch        # Watch mode
npm run test:cov          # Coverage report
npm run test:debug        # Debug tests
npm run test:e2e          # End-to-end tests
```

### Code Quality

```bash
npm run lint              # Check code
npm run format            # Format code (Prettier)
```

### Database

```bash
npx prisma migrate dev --name <name>     # Create migration
npx prisma migrate deploy                # Run migrations
npx prisma db seed                       # Seed data
npx prisma studio                        # GUI viewer
npx prisma generate                      # Update client
```

## 🐘 Database

**PostgreSQL runs in Docker container: `yhct-clinic-db`**

**Connection String:**

```
postgresql://postgres:postgres@localhost:5432/yhct-clinic-db
```

**View Data (GUI):**

```bash
npx prisma studio
# Opens http://localhost:5555
```

**View Data (CLI):**

```bash
docker exec -it yhct-clinic-db psql -U postgres -d yhct-clinic-db

# Useful SQL commands:
\dt                    # List tables
SELECT * FROM "User";  # Query data
\q                     # Exit
```

**Docker Compose File:** `docker-compose.yml` (in this directory)

## 🐘 Database Schema

**Enums:**

- `Role`: ADMIN, DOCTOR, NURSE, RECEPTIONIST, PATIENT
- `Gender`: MALE, FEMALE, OTHER
- `Department`: RECEPTION, CONSULTATION, PHARMACY, MANAGEMENT

**Models:**

- `User`: Core user info with email, role, credentials
- `Employee`: Employee-specific data (fullName, department)
- `Patient`: Patient-specific data

See [prisma/schema.prisma](./prisma/schema.prisma) for full schema.

## 📝 API Documentation

Once backend is running, view Swagger API docs:

```
http://localhost:3000/api
```

## 🔄 Git Workflow

### First Time Setup

```bash
# Configure git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Start database
docker-compose up -d

# Install dependencies
npm install

# Setup database
npx prisma migrate deploy
npx prisma db seed
```

### Before Starting Development

```bash
# Get latest code
git pull origin main

# Install new dependencies if needed
npm install

# Start database
docker-compose up -d

# Run migrations if needed
npx prisma migrate deploy
```

### While Developing

```bash
# Create feature branch
git checkout -b feature/your-feature

# Commit regularly
git commit -m "feat: describe changes"

# Push to remote
git push origin feature/your-feature

# Create Pull Request on GitHub
```

### Handling Migrations

```bash
# If you modified schema.prisma:
npx prisma migrate dev --name describe_changes

# If someone else created migrations:
npx prisma migrate deploy
```

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check Docker is running
docker ps

# Start container if not running
docker-compose up -d

# Check database health
docker-compose logs postgres

# Ensure .env has correct DATABASE_URL
cat .env | grep DATABASE_URL
```

### Port 5432 Already in Use

```bash
# Stop and remove old container
docker-compose down -v

# Start fresh
docker-compose up -d
```

### Port 3000 Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Prisma Client Error

```bash
# Regenerate client
npx prisma generate

# Clear cache and reinstall
rm -rf node_modules
npm install
npx prisma generate
```

### Migration Issues

```bash
# Check migration status
npx prisma migrate status

# Reset database (⚠️ DELETES ALL DATA)
npx prisma migrate reset
```

### Docker Commands Reference

```bash
# Start container in background
docker-compose up -d

# Stop container (keep data)
docker-compose stop

# Start stopped container
docker-compose start

# Remove container (keep data)
docker-compose down

# Remove container and delete all data
docker-compose down -v

# View logs
docker-compose logs postgres

# Real-time logs
docker-compose logs -f postgres

# Check running containers
docker ps

# Execute SQL in container
docker exec -it yhct-clinic-db psql -U postgres -d yhct-clinic-db
```

## 🔐 Security Best Practices

- ✅ Never commit `.env` files (already in `.gitignore`)
- ✅ Use `.env.example` as template for team
- ✅ Change `JWT_SECRET` in production
- ✅ Use strong `POSTGRES_PASSWORD` in production
- ✅ Validate all user inputs (use DTOs)
- ✅ Hash passwords with bcrypt (already implemented)
- ✅ Implement rate limiting for API endpoints
- ✅ Use HTTPS in production

## 🚀 Deployment

### Production Environment Variables

Create `.env.production`:

```bash
NODE_ENV=production
DATABASE_URL="your_production_db_url"
JWT_SECRET="strong_secret_here"
PORT=3000
```

### Build and Run

```bash
npm run build
npm run start:prod
```

## 📖 Documentation

- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 💬 Support

For issues and questions:

1. Check troubleshooting section above
2. Check NestJS/Prisma documentation
3. Ask team lead or create an issue

## 📄 License

This project is proprietary software for YHCT Clinic.
