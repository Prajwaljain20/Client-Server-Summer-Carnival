import * as net from 'net';
import { CommunicationProtocol } from '../Core/CommunicationProtocol';
import { DataSerializerFactory } from '../Core/DataSerializerFactory';
import { Encoding } from './enums/Encoding.format.enum';
import { Actions } from '../Core/enums/Actions.enum';
import { Bad_Request, BaseError, Not_Found } from './ErrorHandler/Errors';
import { ISCRequest } from '../Core/ISCRequest';
import { ISCResponse } from '../Core/ISCResponse';
import { Main } from './Main';
import { ITeamList } from './models/TeamList.interface';
import { SocketOperations } from '../Core/enums/SocketOperations.enum';
import { Logger } from '../Core/Logger';
import { IGame } from './models/Game.interface';
import { Constants } from '../Core/Utils/Constants';
import { DatabaseTeam } from './models/DatabaseTeam.interface';

export class Server {
    private port;
    private host;
    private server;
    private sockets: net.Socket[] = [];
    private iscRequest!: ISCRequest;
    private logger: Logger;

    constructor() {
        this.port = Constants.port;
        this.host = Constants.host;
        this.server = net.createServer();
        this.logger = new Logger();
    }

    private convertDataFromClient(data: string) {
        const index = data.indexOf(Constants.format);
        const firstSlice = data.slice(index + Constants.numberTen);
        const lastIndex = firstSlice.indexOf(Constants.quoteComma);
        const secondSlice = firstSlice.slice(Constants.numberZero, lastIndex);
        const dataSerializerFactory = DataSerializerFactory.getSerializer(secondSlice.toString());
        const dataSerializer = dataSerializerFactory.deserialize(data);
        this.iscRequest = new ISCRequest(dataSerializer);
        let jsonString = JSON.stringify(this.iscRequest);
        if (Object.keys(this.iscRequest.data).length !== Constants.numberZero) {
            jsonString = Buffer.from(this.iscRequest.data).toString(Encoding.UTF_8)
        }
        return JSON.parse(jsonString);
    }

    private convertDataForClient(data: ITeamList | DatabaseTeam[], action: string): string {
        const dataString = JSON.stringify(data)
        const encodedData = Buffer.from(dataString);
        const communicationProtocol: CommunicationProtocol = {
            data: encodedData,
            format: this.iscRequest.format,
            headers: {}
        };
        if (action === Actions.CREATE_TEAM) {
            communicationProtocol.outputFilePath = this.iscRequest.outputFilePath;
        } else {
            communicationProtocol.id = this.iscRequest.id;
        }
        const iscResponse = new ISCResponse(communicationProtocol);
        iscResponse.Message = Constants.successMessage;
        iscResponse.Status = Constants.successStatus;
        iscResponse.StatusCode = Constants.successCode;
        const dataSerializerFactory = DataSerializerFactory.getSerializer(iscResponse.format);
        const dataSerializer = dataSerializerFactory.serialize(iscResponse);
        return dataSerializer;
    }

    private giveErrorToClient(error: BaseError, action: string): string {
        const communicationProtocol: CommunicationProtocol = {
            data: new Uint8Array(),
            format: this.iscRequest.format,
            headers: {}
        };
        if (action === Actions.CREATE_TEAM) {
            communicationProtocol.outputFilePath = this.iscRequest.outputFilePath;
        } else {
            communicationProtocol.id = this.iscRequest.id;
        }
        const iscResponse = new ISCResponse(communicationProtocol);
        iscResponse.Message = error.message;
        iscResponse.Status = error.heading;
        iscResponse.StatusCode = error.code;
        const dataSerializerFactory = DataSerializerFactory.getSerializer(iscResponse.format);
        const dataSerializer = dataSerializerFactory.serialize(iscResponse);
        return dataSerializer;
    }

    private getActions(data: string): string {
        const index = data.indexOf(Constants.action);
        const firstSlice = data.slice(index + Constants.numberTen);
        const lastIndex = firstSlice.indexOf(Constants.quoteBraces);
        const secondSlice = firstSlice.slice(Constants.numberZero, lastIndex);
        return secondSlice.toString();
    }

    public openServer(): void {
        this.server.listen(this.port, this.host, () => {
            this.logger.log(`TCP server listening on ${this.host}:${this.port}`);
            this.serverOperations();
        });
    }
    private serverOperations(): void {
        this.server.on(SocketOperations.CONNECTION, (socket: net.Socket) => {
            let remoteAddress = socket.remoteAddress;
            let remotePort = socket.remotePort;
            const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
            this.logger.log(`new client connected: ${clientAddress}`);
            this.sockets.push(socket);
            socket.on(SocketOperations.DATA, async (data: string) => {
                try {
                    const parsedData = this.convertDataFromClient(data);
                    const action = this.getActions(data);
                    const main = new Main();
                    let team: ITeamList;
                    let databaseResult: DatabaseTeam[] = [];
                    let id: number;
                    if (action.toLowerCase() === Actions.CREATE_TEAM) {
                        team = await main.createTeam(parsedData)!;
                    } else if (action.toLowerCase() === Actions.GET_TEAM) {
                        id = parsedData.id;
                        databaseResult = await main.databaseConnection(id);
                    } else {
                        throw new Bad_Request();
                    }
                    this.sockets.forEach((sock) => {
                        if (sock.remoteAddress === remoteAddress && sock.remotePort === remotePort) {
                            this.logger.log(`${sock.remoteAddress} ${sock.remotePort}`);
                            if (action === Actions.CREATE_TEAM) sock.write(this.convertDataForClient(team, action));
                            else {
                                if (databaseResult.length !== Constants.numberZero) {
                                    sock.write(this.convertDataForClient(databaseResult, action));
                                } else {
                                    sock.write(this.giveErrorToClient(new Not_Found(), action));
                                }
                            }
                        }
                    });
                }
                catch (err: BaseError) {
                    this.logger.log(err.stack);
                    this.sockets.forEach((sock) => {
                        if (sock.remoteAddress === remoteAddress && sock.remotePort === remotePort) {
                            this.logger.log(`${sock.remoteAddress} ${sock.remotePort}`);
                            sock.write(this.giveErrorToClient(err, Actions.CREATE_TEAM));
                        }
                    });
                }
            });
            socket.on(SocketOperations.CLOSE, () => {
                this.sockets.forEach((sock) => {
                    if (sock.remoteAddress === socket.remoteAddress && sock.remotePort === socket.remotePort) {
                        sock.write(`${clientAddress} disconnected\n`);
                    }
                });
                let index = this.sockets.findIndex((sock) => {
                    return sock.remoteAddress === socket.remoteAddress && sock.remotePort === socket.remotePort;
                })
                if (index !== Constants.numberMinusOne) this.sockets.splice(index, Constants.numberOne);
                this.logger.log(`connection closed: ${clientAddress}`);
            });
            socket.on(SocketOperations.ERROR, (err: Error) => {
                this.logger.log(`${clientAddress}: ${err.stack}`);
            });
        });
    }
}
