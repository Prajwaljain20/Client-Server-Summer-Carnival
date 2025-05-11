export class ErrorMap {
    static getErrorEnum (error: string): string | undefined {
        return errorMap.get(error);
    }
}

const errorMap = new Map <string, string> ([
    ['ECONNREFUSED', 'Connection Refused'],
    ['ENOENT','File Not Found'],
    ['ECONNRESET', 'Service Unavailable'],
    ['422', 'Invalid input'],
    ['ERR_INVALID_ARG_TYPE', 'Invalid input'],
    ['EISDIR', 'Invalid Command']
]);
