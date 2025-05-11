import * as net from 'net';
import { Actions } from '../Core/enums/Actions.enum';
import { Constants } from '../Core/Utils/Constants';
import { Bad_Request, InvalidCommand } from './ErrorHandler/Errors';

export class Command {
    private inputFile: string = Constants.empty;
    private action: string = Constants.empty;
    private outputFile: string = Constants.defaultErrorFile;
    private id: string = Constants.empty;
    
    public readCommand (input: string): string {
        const words = input.split(Constants.dash);
        const availableActions: string[] = Object.values(Actions);
        let index: number = Constants.numberZero;
        let lastIndex = words[words.length-1];
        if (lastIndex === Constants.actionParameter ||
            lastIndex === Constants.inputParameter ||
            lastIndex === Constants.outputParameter ||
            lastIndex === Constants.idParameter) {
                throw new InvalidCommand();
            }
        while (index < words.length) {
            if (words[index] === Constants.actionParameter) {
                this.action = words[++index];
            }
            if (words[index] === Constants.inputParameter) {
                this.inputFile = words[++index];
            }
            if (words[index] === Constants.outputParameter) {
                this.outputFile = words[++index];
            }
            if (words[index] === Constants.idParameter) {
                this.id = words[++index];
            }
            if (words[index] === Constants.closeParameter ||
                words[index] === Constants.helpParameter) {
                return words[index];
            }
            index++;
        }
        if (!availableActions.includes(this.action)) {
            throw new Bad_Request();
        } else if (this.action.length !== Constants.numberZero &&
            this.id.length !== Constants.numberZero &&
            this.inputFile.length === Constants.numberZero &&
            (this.outputFile === Constants.defaultErrorFile ||
                this.outputFile.length === Constants.numberZero)) {
                return Actions.GET_TEAM;
        } else if (this.action.length !== Constants.numberZero &&
            this.inputFile.length !== Constants.numberZero &&
            this.outputFile !== Constants.defaultErrorFile &&
            this.outputFile.length !== Constants.numberZero &&
            this.id.length === Constants.numberZero) {
                return Actions.CREATE_TEAM;
        } else {
            throw new InvalidCommand();
        }
    }
    get InputFile(): string {
        return this.inputFile;
    }
    get OutputFile(): string {
        return this.outputFile;
    }
    get Action(): string {
        return this.action;
    }
    get ID(): string {
        return this.id;
    }
}