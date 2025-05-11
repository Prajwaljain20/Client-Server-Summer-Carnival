import { expect } from "chai";
import { Main } from "../../server/Main";

describe('Test Main.ts', () => {
    it('Test the function createTeam', () => {
        const main = new Main();
        const game = require('../../../input/cricket.json');
        const gameObject = main.createTeam(game);
        const gameFile = require('../../../output/null.json');
        expect(gameObject).to.eql(gameFile, 'function result does not match with expected output');
    });

    it('expect error from created team', (done) => {
        try {
            const main = new Main();
            const game = require('../../../input/invalid.json');
            main.createTeam(game);
        } catch {
            done();
        }
    });
});