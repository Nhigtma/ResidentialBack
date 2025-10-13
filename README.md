# ResidentialBack

A NestJS-based backend application for managing residential communities. This project provides a robust API for handling authentication, user management, assemblies, votes, assistance registers, and house-related operations in a residential setting.

## Features

- **Authentication**: Secure login with JWT tokens and role-based access control.
- **User Management**: CRUD operations for users with roles (e.g., admin, resident).
- **Assemblies**: Manage community assemblies and meetings.
- **Votes**: Handle voting processes within the community.
- **Assistance Registers**: Track attendance and participation in events.
- **Houses**: Manage residential units and their details.
- **API Documentation**: Integrated Swagger UI and Scalar API Reference for easy API exploration.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with Passport.js
- **Validation**: Class Validator
- **API Docs**: Swagger/OpenAPI with Scalar
- **Testing**: Jest for unit and e2e tests
- **Linting**: ESLint with Prettier

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance (local or cloud, e.g., MongoDB Atlas)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd residential-back
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URL=mongodb://localhost:27017/residential
   JWT_SECRET=your-secret-key
   JWT_EXPIRES=1h
   PORT=3000
   ```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

The application will start on `http://localhost:3000` (or the port specified in `.env`).

## API Documentation

- **Swagger UI**: Visit `http://localhost:3000/api` for the Swagger interface.
- **Scalar API Reference**: Visit `http://localhost:3000/reference` for the Scalar documentation.

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Scripts

- `npm run build`: Build the application
- `npm run format`: Format code with Prettier
- `npm run lint`: Lint code with ESLint
- `npm run start`: Start the application
- `npm run start:dev`: Start in watch mode
- `npm run start:debug`: Start in debug mode
- `npm run start:prod`: Start the production build

## Project Structure

```
src/
├── controllers/          # API controllers
├── dtos/                 # Data Transfer Objects
├── interfaces/           # TypeScript interfaces
├── middleware/           # Custom middleware and guards
├── modules/              # NestJS modules
├── responses/            # API response models
├── schemas/              # Mongoose schemas
├── services/             # Business logic services
└── main.ts               # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED license.
