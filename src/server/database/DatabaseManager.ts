import { SqlClient } from 'msnodesqlv8';
import { Constants } from '../../Core/Utils/Constants';
import { DatabaseConnectionError } from '../ErrorHandler/Errors';
import { DatabaseTeam } from '../models/DatabaseTeam.interface';
import { IPlayer } from '../models/Player.interface';
import { IResponseId } from '../models/ResponseId.interface';
import { ITeam } from '../models/Team.interface';
import { ITeamList } from '../models/TeamList.interface';
import { QueryManager } from './QueryManager';

export class DatabaseManager {
    queryManager = new QueryManager();
    sql: SqlClient;
    connectionString: string;

    constructor () {
        this.sql = this.queryManager.SqlClient;
        this.connectionString = this.queryManager.ConnectionString;
    }

    saveTeams (teamList: ITeamList): Promise<ITeamList> {
        const newTeam: ITeam = {};
        let teams = teamList;
        return new Promise((res) => {
            teamList.teams?.forEach(async teamList => {
            newTeam.id = teamList.id;
            newTeam.name = teamList.name;
            newTeam.gameType = teamList.gameType;
            newTeam.players = teamList.players;

            const insertionQuery = this.queryManager.InsertIntoTeams;
            let index !: IResponseId[]
            this.sql.query(this.connectionString, insertionQuery, [newTeam.name!, Constants.numberOne, newTeam.gameType!], (err, rows) => {
                if (err) {
                    new DatabaseConnectionError();
                }
                else{
                    if(rows?.length !== Constants.numberZero) {
                        index = rows as IResponseId[];
                        teamList.id = index[0].Column0;
                    }
                }
            });
            await this.savePlayers(newTeam.players!);
            
            setTimeout(() => {
                this.saveTeamPlayers(newTeam)
                res(teams);
            }, Constants.minTimeOut);
        });
    })
    }

    getTeams (gameId: number): Promise<DatabaseTeam[]> {
        const query = this.queryManager.getTeamById(gameId);
        return new Promise((res, rej)=>{
            this.sql.query(this.connectionString, query , (err, rows) => {
                if (err) throw new DatabaseConnectionError();
                res(rows);
            })
        });
    }

    savePlayers (playerList: IPlayer[]) {
        return new Promise((res) => {
            playerList.forEach(player => {
                const query = this.queryManager.SavePlayers;
                let index!:IResponseId[]
                this.sql.query(this.connectionString, query, [player.name], (err, rows) => {
                    if (err) new DatabaseConnectionError();
                    else{
                        if(rows?.length!==0) {
                            index = rows as IResponseId[];
                            player.playerId = index[0].Column0;
                        }
                    }
                });
            });
            setTimeout(() => res(playerList), Constants.minTimeOut);
        })
    }

    saveTeamPlayers (team: ITeam): void {
        team.players?.forEach(player => {
            const query = this.queryManager.SaveTeamPlayers;
            this.sql.query(this.connectionString, query, [player.playerId, team.id!], (err, rows) => {
                if (err) new DatabaseConnectionError();
            });
        });
    }
}
