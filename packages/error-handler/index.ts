export class AppError extends Error{
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(message: string, statusCode: number, isOperational = true, details?: any){
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  }
}

// Not found Error
export class NotFoundError extends AppError{
  constructor(message = "Resources not found"){
    super(message, 404);
  }
}

// validation error ( use for joi/zod/react-hook-form validation errors)
export class ValidationError extends AppError{
  constructor(message = "Invalid request data", details?:any){
    super(message, 400, true, details);
  }
}

// Authentication Error
export class AuthError extends AppError{
  constructor(message = "Unauthorize"){
    super(message, 401);
  }
}

// Forbidden Error (For insufficient permission)
export class ForbiddenError extends AppError{
  constructor(message = "Forbidden access"){
    super(message, 403);
  }
}

// Database Error (For MongoDB/Postgres Error)
export class DatabaseError extends AppError{
  constructor(message = "Database Error", details?: any){
    super(message, 500, true, details);
  }
}

// RateLimit Error (If user exceeds API Limit)
export class RateLimitError extends AppError{
  constructor(message = "Too many requests, please try again later"){
    super(message, 429);
  }
}
