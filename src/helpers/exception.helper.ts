export class NotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundException';
  }
}

export class IllegalArgumentException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IllegalArgumentException';
  }
}

export class NotSupportedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotSupportedException';
  }
}

export class ExpiredException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExpiredException';
  }
}

export class SignatureException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SignatureException';
  }
}
