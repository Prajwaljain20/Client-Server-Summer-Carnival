export class ErrorMap {
    static getErrorEnum(error: string) {
        return errorMap.get(error);
    }
}

const errorMap = new Map<string, string>([
    ['422','Invalid input'] 
]);

