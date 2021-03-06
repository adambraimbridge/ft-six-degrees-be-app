const expect = require('chai').expect,
    sinon = require('sinon'),
    moment = require('moment'),
    CONFIG = require('../config'),
    responder = require('../api/common/responder'),
    Test = require('../api/test');

describe('API Test', function () {

    it('sends healthy response to client', function () {
        const timestamp = moment().format(),
            responseMock = {},
            responseDataMock = {
                status: 200,
                data: {
                    name: CONFIG.DESCRIPTION,
                    time: timestamp
                }
            };

        sinon.stub(responder, 'send', function (response, responseData) {
            expect(responseData).to.eql(responseDataMock);
        });

        Test.check({}, responseMock);

        sinon.assert.calledOnce(responder.send);
        sinon.assert.calledWith(responder.send, responseMock, responseDataMock);

        responder.send.restore();

    });

});


