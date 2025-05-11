import { GameType } from '../enums/GameType.enum';
import { IPlayer } from './Player.interface';

export interface IGame {
    gameType?: GameType,
    players?: IPlayer[];
};
