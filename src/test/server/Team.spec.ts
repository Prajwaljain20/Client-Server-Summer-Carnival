import { expect } from "chai";
import { Team } from "../../server/Team";
import { PlayerNumbers } from "../../server/enums/PlayerNumbers.enum";

describe('Test Team.ts', () => {
    it('Test the function addTeams', () => {
        const game = require('../../../input/badminton.json');
        const teamObject = Team.addTeams(game, PlayerNumbers.BADMINTON_DOUBLES);
        const gameFile = require('../../../output/Team_Creation_Response_1.json');
        expect(teamObject).to.eql(gameFile, 'function result does not match with expected output');
    });

    it('expect error from addTeams', (done) => {
        try {
            const game = require('../../../input/invalid.json');
            Team.addTeams(game, PlayerNumbers.CRICKET);
        } catch {
            done();
        }
    });
});