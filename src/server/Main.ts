import { Team } from './Team';
import { IGame } from './models/Game.interface';
import { GameType } from './enums/GameType.enum';
import { ITeamList } from './models/TeamList.interface';
import { DatabaseManager } from './database/DatabaseManager';
import { ITeam } from './models/Team.interface';
import { BaseError, DatabaseConnectionError, InvalidInput } from './ErrorHandler/Errors';
import { PlayerNumbers } from './enums/PlayerNumbers.enum';
import { Constants } from '../Core/Utils/Constants';
import { DatabaseTeam } from './models/DatabaseTeam.interface';

export class Main {
    createTeam(game: IGame) {
        try {
            let numberOfPlayers = Constants.numberZero;
            switch (game.gameType) {
                case GameType.CRICKET: numberOfPlayers = PlayerNumbers.CRICKET;
                    break;
                case GameType.BADMINTON_DOUBLES: numberOfPlayers = PlayerNumbers.BADMINTON_DOUBLES;
                    break;
                case GameType.CHESS: numberOfPlayers = PlayerNumbers.CHESS;
                    break;
                default: throw new InvalidInput();
            }
            if (numberOfPlayers !== Constants.numberZero) {
                let teamList = Team.addTeams(game, numberOfPlayers);
                return this.saveToDatabase(teamList);
            }
        }
        catch (error: BaseError) {
            throw error;
        }
    }

    getTeamById(teamList: ITeamList, gameId: number): void {
        const foundTeam: ITeam = teamList.teams!.filter(team => {
            return team.id == gameId;
        })[Constants.numberZero];
        this.databaseConnection(foundTeam.id!);
    }

    databaseConnection(id: number): Promise<DatabaseTeam[]> {
        if (id === undefined) throw new InvalidInput();
        const database = new DatabaseManager();
        return database.getTeams(id);
    }

    saveToDatabase(teamList: ITeamList) : Promise<ITeamList> {
        const database = new DatabaseManager();
        return database.saveTeams(teamList);
    }
}
