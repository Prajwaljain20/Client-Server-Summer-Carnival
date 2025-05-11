import { expect } from "chai";
import rewire from 'rewire';

const rewiredModule = rewire('../../Client/Client');
const rewiredServerClass = rewiredModule.__get__('Client');

describe('Test Client.ts', () => {

    let client: any;

    beforeEach(() => {
        client = new rewiredServerClass();
    });

    it('Test the function convertDataFromServer', () => {
        const data = JSON.stringify(require('../../../input/Client-convertDataFromServer.json'));
        const result = client.convertDataFromServer(data);
        const compare = require('../../../input/Client-convertDataFromServer.output.json');
        expect(result).to.eql(compare);
    });

    it('expect error from function convertDataFromServer', (done) => {
        try {
            client.convertDataFromServer(null);
        }
        catch {
            done();
        }
    });
});