import { CreateTeam } from './CreateTeam';
import { IGame } from './models/Game.interface';
import { ITeamList } from './models/TeamList.interface';
import { InsufficientData } from './ErrorHandler/Errors';
import { Constants } from '../Core/Utils/Constants';

export class Team {
    static addTeams(game: IGame, playersInTeam: number): ITeamList {
        const teamList: ITeamList = {};
        const numberOfPlayers: number = game.players!.length;
        if (this.validatePlayerCount(numberOfPlayers, playersInTeam)) {
            throw new InsufficientData();
        }
        teamList.total = Math.floor(numberOfPlayers / playersInTeam);
        let teamIndex = Constants.numberZero;
        teamList.teams = [];
        while (teamIndex < teamList.total) {
            let teamObject = new CreateTeam(game, playersInTeam, teamIndex);
            teamList.teams.push(teamObject.Team);
            teamIndex++;
        }
        return teamList;
    }
    private static validatePlayerCount(numberOfPlayers: number, playersInTeam: number): boolean {
        if (numberOfPlayers < playersInTeam) {
            return true;
        }
        return false;
    }
}
