import { HttpException, HttpStatus } from '@nestjs/common';

interface ErrorResponseBody {
  code: string;
  message: string;
  status: HttpStatus;
  description: any;
}

const errorResponseBody = (body: ErrorResponseBody) => body;

export class MissingRequestFieldsException extends HttpException {
  constructor(fields?: string[]) {
    super(
      errorResponseBody({
        code: 'MISSING_REQUEST_FIELDS_400',
        message: `Missing request field(s): ${fields?.join(', ')}`,
        status: HttpStatus.BAD_REQUEST,
        description: fields
          ? `${fields.join(', ')} ${fields.length > 1 ? 'are' : 'is'} missing`
          : undefined,
      }),
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UnsuccessfulRegistrationException extends HttpException {
  constructor(prop: string) {
    super(
      errorResponseBody({
        code: `${prop.toUpperCase()}_REGISTRATION_FAILED`,
        message: `Unable to comeplete ${prop} registration`,
        status: HttpStatus.NOT_MODIFIED,
        description: 'Something went wrong',
      }),
      HttpStatus.NOT_MODIFIED,
    );
  }
}
export class ValueExistsException extends HttpException {
  constructor(fields: string[]) {
    super(
      errorResponseBody({
        code: 'VALUE EXISTS',
        message: `Value(s) submitted already exists: ${fields?.join(', ')}`,
        status: HttpStatus.CONFLICT,
        description: fields ? `${fields.join(', ')} already exists` : undefined,
      }),
      HttpStatus.CONFLICT,
    );
  }
}
export class UnauthorisedUserException extends HttpException {
  constructor() {
    super(
      errorResponseBody({
        code: 'UNAUTHORISED USER',
        message: `User is not authorized to perform this action`,
        status: HttpStatus.UNAUTHORIZED,
        description: 'User cannot perform this action',
      }),
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class UnsuccessfulLoginException extends HttpException {
  constructor(description?: string, code?: string) {
    super(
      errorResponseBody({
        code: code || 'LOGIN FAILED',
        description: description || 'Login Failed',
        message: description || 'Unable to complete login',
        status: HttpStatus.NOT_FOUND,
      }),
      HttpStatus.NOT_FOUND,
    );
  }
}

export class NotFoundException extends HttpException {
  constructor(prop: string) {
    super(
      errorResponseBody({
        code: `${prop.toUpperCase()}_NOT_FOUND`,
        message: `Unable to complete operation because this ${prop} does not exist`,
        status: HttpStatus.NOT_FOUND,
        description: `${prop} does not exist`,
      }),
      HttpStatus.NOT_FOUND,
    );
  }
}
export class UnsuccessfulUpdateException extends HttpException {
  constructor(prop: string) {
    super(
      errorResponseBody({
        code: `${prop.toUpperCase()}_NOT_MODIFIED`,
        message: `Unable to update ${prop}`,
        status: HttpStatus.NOT_MODIFIED,
        description: `Unable to update ${prop}. ${prop} does not exist or something went wrong`,
      }),
      HttpStatus.NOT_MODIFIED,
    );
  }
}
export class UnsuccessfulDeleteException extends HttpException {
  constructor(prop: string) {
    super(
      errorResponseBody({
        code: `${prop.toUpperCase()}_NOT_DELETED`,
        message: `Unable to delete ${prop}`,
        status: HttpStatus.NOT_MODIFIED,
        description: `${prop} is not deleted. Something went wrong`,
      }),
      HttpStatus.NOT_MODIFIED,
    );
  }
}
export class UnsuccessfulRequestException extends HttpException {
  constructor(prop?: string) {
    super(
      errorResponseBody({
        code: `FAILED_REQUEST`,
        message: `Unable to complete this request. ${prop}`,
        status: HttpStatus.NOT_MODIFIED,
        description: `Something went wrong. ${prop}`,
      }),
      HttpStatus.NOT_MODIFIED,
    );
  }
}
