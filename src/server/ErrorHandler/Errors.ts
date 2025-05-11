import { ErrorMessages } from '../enums/Error-message.enum';
import { ErrorStatus } from '../enums/Error-status.enum';
import { Errors } from '../enums/Error.enum';

export class BaseError extends Error {
    heading: string;
    message: string;
    code: string;

    constructor(heading: string, message: string, statusCode: string) {
        super(message);
        this.heading = heading;
        this.message = message;
        this.code = statusCode;
    }
}

export class InsufficientData extends BaseError {
    constructor() {
        super(Errors.INSUFFICIENT_DATA, ErrorMessages.INSUFFICIENT_DATA, ErrorStatus.INSUFFICIENT_DATA);
    }
}

export class TimeOutError extends BaseError {
    constructor() {
        super(Errors.TIME_OUT_ERROR, ErrorMessages.TIME_OUT_ERROR, ErrorStatus.TIME_OUT_ERROR);
    }
}

export class InvalidInput extends BaseError {
    constructor() {
        super(Errors.INVALID_INPUT, ErrorMessages.INVALID_INPUT, ErrorStatus.INVALID_INPUT);
    }
}

export class DatabaseConnectionError extends BaseError {
    constructor() {
        super(Errors.DATABASE_CONNECTION_ERROR, ErrorMessages.DATABASE_CONNECTION_ERROR, ErrorStatus.DATABASE_CONNECTION_ERROR);
    }
}

export class Bad_Request extends BaseError {
    constructor() {
        super(Errors.BAD_REQUEST, ErrorMessages.BAD_REQUEST, ErrorStatus.BAD_REQUEST);
    }
}

export class Not_Found extends BaseError {
    constructor() {
        super(Errors.NOT_FOUND, ErrorMessages.NOT_FOUND, ErrorStatus.NOT_FOUND);
    }
}
