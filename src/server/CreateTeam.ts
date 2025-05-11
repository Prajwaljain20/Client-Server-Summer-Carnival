import { IGame } from './models/Game.interface';
import { PlayerNumbers } from './enums/PlayerNumbers.enum';
import { ITeam } from './models/Team.interface';
import { Constants } from '../Core/Utils/Constants';
import { IPlayer } from './models/Player.interface';
import { InsufficientData } from './ErrorHandler/Errors';

export class CreateTeam {
    team: ITeam = {};
    constructor(game: IGame, playerNumbers: PlayerNumbers, id: number) {
        this.team.id = id + Constants.numberOne;
        this.team.name = Constants.teamNamePrefix + (this.team.id);
        this.team.gameType = game.gameType;
        this.validatePlayersInfo(game.players!);
        this.team.players = game.players!.splice(Constants.numberZero, playerNumbers);
    }
    get Team(): ITeam {
        return this.team;
    }
    private validatePlayersInfo(infoObject: IPlayer[]): void {
        infoObject.forEach(object => {
            if (object.name === undefined || object.name.length === Constants.numberZero
                || object.name === null || object.playerId === undefined || object.playerId === null) {
                    throw new InsufficientData();
                }
        })
    }
}