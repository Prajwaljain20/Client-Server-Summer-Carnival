import { expect } from "chai";
import rewire from 'rewire';

const rewiredModule = rewire('../../server/Server');
const rewiredServerClass = rewiredModule.__get__('Server');

describe('Test Server.ts', () => {

    let server: any;

    beforeEach(() => {
        server = new rewiredServerClass();
    });

    it('Test the function convertDataFromClient', () => {
        const data = JSON.stringify(require('../../../input/Server-ConvertData.json'));
        const result = server.convertDataFromClient(data);
        const compare = require('../../../input/Server-ConvertData.output.json')
        expect(result).to.eql(compare);
    });

    it('expect error from function convertDataFromClient', (done) => {
        try {
            server.convertDataFromClient(null);
        }
        catch {
            done();
        }
    });

    it('Test the function convertDataForClient', () => {
        server.iscRequest = {};
        server.iscRequest.format = 'json';
        const data = require('../../../input/Server-ConvertForClient.json');
        const result = server.convertDataForClient(data);
        const compare = JSON.stringify(require('../../../input/Server-ConvertForClient.output.json'));
        expect(result).to.eql(compare);
    });

    it('expect error from function convertDataForClient', (done) => {
        try {
            server.convertDataForClient(null);
        }
        catch {
            done();
        }
    });
});