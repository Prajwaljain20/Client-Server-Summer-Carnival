import * as readline from 'readline';
import * as net from 'net';
import { BaseError, EConnRefused, EConnReset, FileNotFound, InvalidCommand, InvalidInput, NamingConvention } from './ErrorHandler/Errors';
import { CommunicationProtocol } from '../Core/CommunicationProtocol';
import { ErrorMap } from './Utils/Error.Mapper';
import { Encoding } from '../server/enums/Encoding.format.enum';
import { ISCRequest } from '../Core/ISCRequest';
import { DataSerializerFactory } from '../Core/DataSerializerFactory';
import { ISCResponse } from '../Core/ISCResponse';
import * as fs from 'fs';
import { Logger } from '../Core/Logger';
import { Help } from './Help';
import { Constants } from '../Core/Utils/Constants';
import { Format } from '../Core/enums/Format.enum';
import { SocketOperations } from '../Core/enums/SocketOperations.enum';
import { Errors } from './Enums/Error.enum';
import { ErrorObject } from '../Core/ErrorObject';
import { Command } from './Command';
import { Actions } from '../Core/enums/Actions.enum';

export class Client {
    private host;
    private port;
    private read;
    private logger;
    private client;
    private outputFilePath = Constants.defaultErrorFile;
    private id = Constants.numberMinusOne;

    constructor() {
        this.host = Constants.host;
        this.port = Constants.port;
        this.read = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.logger = new Logger();
        this.client = new net.Socket();
    }

    private convertDataForServer(data: Uint8Array, action: string): string {
        const communicationProtocol: CommunicationProtocol = {
            data: data,
            format: Format.JSON,
            headers: {}
        };
        if (action === Actions.CREATE_TEAM) {
            communicationProtocol.outputFilePath = this.outputFilePath;
        } else {
            communicationProtocol.id = this.id;
        }
        const iscRequest = new ISCRequest(communicationProtocol);
        iscRequest.headers = { action: action };
        const dataSerializerFactory = DataSerializerFactory.getSerializer(iscRequest.format);
        return dataSerializerFactory.serialize(iscRequest);
    }

    private convertDataFromServer(data: string): CommunicationProtocol {
        const index = data.indexOf(Constants.format);
        const firstSlice = data.slice(index + Constants.numberTen)
        const lastIndex = firstSlice.indexOf(Constants.quoteComma);
        const secondSlice = firstSlice.slice(Constants.numberZero, lastIndex);
        const dataSerializerFactory = DataSerializerFactory.getSerializer(secondSlice.toString());
        const dataSerializer = dataSerializerFactory.deserialize(data);
        return dataSerializer;
    }

    private getDataFromProtocol(data: CommunicationProtocol): void {
        const iscResponse = new ISCResponse(data);
        const jsonString = Buffer.from(iscResponse.data).toString(Encoding.UTF_8);
        if (data.hasOwnProperty(Constants.id)) {
            console.log(jsonString);
        } else this.writeToFile(jsonString, iscResponse.outputFilePath!);
    }

    private writeToFile(jsonString: string, outputFilePath: string): void {
        fs.writeFile(outputFilePath!, jsonString, (err) => {
            if (err) {
                if (!process.env.NODE_ENV) {
                    this.logger.log(err.stack!)
                }
                this.showAndWriteError(new NamingConvention(), Constants.defaultErrorFile);
            }
        });
    }

    private convertErrorFromProtocol(error: CommunicationProtocol): void {
        const heading = error.headers[Constants.status];
        const message = error.headers[Constants.message];
        const code = error.headers[Constants.statusCode];
        const baseError = new BaseError(heading, message, code);
        if (baseError.heading === undefined) {
            this.retrieveErrorFromCode(baseError);
        } else this.showAndWriteError(baseError);
    }

    private retrieveErrorFromCode(error: BaseError): void {
        try {
            if (!process.env.NODE_ENV) {
                this.logger.log(error.stack!);
            }    
            const errorCode = ErrorMap.getErrorEnum(error.code);
            if (errorCode === Errors.FILE_NOT_FOUND) throw new FileNotFound();
            else if (errorCode === Errors.ECONNREFUSED) throw new EConnRefused();
            else if (errorCode === Errors.ECONNRESET) throw new EConnReset();
            else if (errorCode === Errors.INVALID_INPUT) throw new InvalidInput();
            else if (errorCode === Errors.INVALID_COMMAND) throw new InvalidCommand();
            else throw error;
        }
        catch (err: BaseError) {
            this.showAndWriteError(err);
        }
    }

    private showAndWriteError(err: BaseError, outputFilePath?: string): void {
        if (outputFilePath !== undefined) {
            this.outputFilePath = outputFilePath;
        } else if (this.outputFilePath === undefined ||
            this.outputFilePath === Constants.dash || this.outputFilePath === Constants.empty) {
            this.outputFilePath = Constants.defaultErrorFile;
        }
        fs.writeFileSync(this.outputFilePath, JSON.stringify(new ErrorObject(err.message)));
        if (err instanceof BaseError) {
            console.error(`Error occured\n${err.heading} ${err.code}\n${err.message}`);
        } else {
            console.error(err);
            this.logger.log(err);
        }
    }

    public startClient(): void {
        this.client.connect(this.port, this.host, () => {
            this.logger.log(`Connected to ${this.host}:${this.port}`);
        });
        this.client.on(SocketOperations.DATA, (data: string) => {
            const dataSerializer = this.convertDataFromServer(data);
            if (dataSerializer.headers[Constants.statusCode] !== Constants.successCode) this.convertErrorFromProtocol(dataSerializer);
            else this.getDataFromProtocol(dataSerializer);
        });
        this.client.on(SocketOperations.CLOSE, () => {
            this.read.close();
        });
        this.client.on(SocketOperations.ERROR, (error: BaseError) => {
            this.retrieveErrorFromCode(error);
        });
        this.read.on(SocketOperations.LINE, (input: string) => {
            this.readlineListener(input);
        });
    }

    private readlineListener(input: string): void {
        try {
            const command = new Command();
            const result = command.readCommand(input);
            if (result === Constants.helpParameter) {
                this.helpmenu();
            } else if (result === Constants.closeParameter) {
                this.destroyClient();
            } else if (result === Actions.GET_TEAM) {
                const action = command.Action;
                this.id = parseInt(command.ID);
                this.throwErrorIfUndefined(action, this.id.toString());
                const databaseObj = this.convertDataForServer(new Uint8Array(), action);
                this.client.write(databaseObj);
            } else if (result === Actions.CREATE_TEAM) {
                const inputFile = command.InputFile;
                this.outputFilePath = command.OutputFile;
                const action = command.Action;
                this.throwErrorIfUndefined(inputFile, this.outputFilePath, action);
                const data = fs.readFileSync(inputFile);
                const dataSerializer = this.convertDataForServer(data, action);
                this.client.write(dataSerializer);
            } else {
                throw new InvalidCommand();
            }
        }
        catch (error: BaseError) {
            this.outputFilePath = Constants.defaultErrorFile;
            this.retrieveErrorFromCode(error);
        }
    }

    private helpmenu(): boolean {
        Help.showHelp();
        return false;
    }

    private destroyClient(): void {
        this.client.destroy();
    }

    private throwErrorIfUndefined(...args: string[]): void {
        args.forEach(element => {
            if (element === undefined || element === Constants.empty ||
                element === null) throw new InvalidInput();
        })
    }
}
