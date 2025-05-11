import { SqlClient } from 'msnodesqlv8';

export class QueryManager {
    sqlClient: SqlClient = require('msnodesqlv8');
    connectionString: string = 'server=.;Database=workshop;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}';
    insertIntoTeams: string = `declare @name varchar(45) = ?;
        declare @eventId int = ?;
        declare @gameId int = ?;
        insert into team (name, eventId, gameId)
        values (@name, @eventId, @gameId)
        SELECT SCOPE_IDENTITY()`;
    savePlayers: string = `declare @playerName varchar(45) = ?;
        insert into player (playerName) values (@playerName)
        SELECT SCOPE_IDENTITY()`;
    saveTeamPlayers: string = `declare @playerId int = ?;
        declare @teamId int = ?;
        insert into team_player (playerId, teamId) values (@playerId, @teamId)`;

    get SqlClient (): SqlClient {
        return this.sqlClient;
    }
    get ConnectionString (): string {
        return this.connectionString;
    }
    get InsertIntoTeams (): string {
        return this.insertIntoTeams;
    }
    getTeamById (teamId: number): string {
        return `SELECT * FROM Team where teamId=${teamId}`;
    }
    get SavePlayers (): string {
        return this.savePlayers;
    }
    get SaveTeamPlayers (): string {
        return this.saveTeamPlayers;
    }
}
