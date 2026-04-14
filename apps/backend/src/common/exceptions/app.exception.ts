export class AppException extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string>
  ) {
    super(message);
    this.name = 'AppException';
  }
}

export class BadRequestException extends AppException {
  constructor(message: string, errors?: Record<string, string>) {
    super(400, message, errors);
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenException extends AppException {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundException extends AppException {
  constructor(message: string = 'Not Found') {
    super(404, message);
  }
}

export class ConflictException extends AppException {
  constructor(message: string) {
    super(409, message);
  }
}

export class InternalServerErrorException extends AppException {
  constructor(message: string = 'Internal Server Error') {
    super(500, message);
  }
}
