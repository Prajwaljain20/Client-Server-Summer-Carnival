import { Constants } from "./Utils/Constants";

export class ErrorObject {
    private type: string = Constants.error;
    private message: string;

    constructor(message: string) {
        this.message = message;
    }
}
