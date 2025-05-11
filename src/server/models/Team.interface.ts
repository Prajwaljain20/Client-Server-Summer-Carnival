import { GameType } from '../enums/GameType.enum';
import { IPlayer } from './Player.interface';

export interface ITeam {
    id?: number,
    name?: string,
    gameType?: GameType,
    players?: IPlayer[]
};
