import { ErrorMessages } from '../Enums/Error-message.enum';
import { ErrorStatus } from '../Enums/Error-status.enum';
import { Errors } from '../Enums/Error.enum';

export class BaseError extends Error {
    heading: string;
    message: string;
    code: string;

    constructor (heading: string, message: string, statusCode: string) {
        super(message);
        this.heading = heading;
        this.message = message;
        this.code = statusCode;
    }
}

export class FileNotFound extends BaseError {
    constructor() {
        super(Errors.FILE_NOT_FOUND, ErrorMessages.FILE_NOT_FOUND, ErrorStatus.FILE_NOT_FOUND)
    }
}

export class EConnReset extends BaseError {
    constructor () {
        super(Errors.ECONNRESET, ErrorMessages.ECONNRESET, ErrorStatus.ECONNRESET);
    }
}

export class EConnRefused extends BaseError {
    constructor () {
        super(Errors.ECONNREFUSED, ErrorMessages.ECONNREFUSED, ErrorStatus.ECONNREFUSED);
    }
}

export class InvalidInput extends BaseError {
    constructor () {
        super(Errors.INVALID_INPUT, ErrorMessages.INVALID_INPUT, ErrorStatus.INVALID_INPUT);
    }
}

export class InvalidCommand extends BaseError {
    constructor () {
        super(Errors.INVALID_COMMAND, ErrorMessages.INVALID_COMMAND, ErrorStatus.INVALID_COMMAND);
    }
}

export class NamingConvention extends BaseError {
    constructor () {
        super(Errors.NAMING_CONVENTION, ErrorMessages.NAMING_CONVENTION, ErrorStatus.NAMING_CONVENTION);
    }
}

export class Bad_Request extends BaseError {
    constructor() {
        super(Errors.BAD_REQUEST, ErrorMessages.BAD_REQUEST, ErrorStatus.BAD_REQUEST);
    }
}
