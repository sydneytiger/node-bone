const request = require('supertest');
let server;
describe('/api/users', () => {
    beforeEach(() => {
         server = require('../index');
    });

    afterEach(() => {
        server.close();
    });
    describe('GET /myself', () => {
        it('should return 401 if no token is provided', async () => {
            const res = await request(server).get('/api/users/myself');
            expect(res.status).toEqual(401);
            expect(res.text).toEqual('No token proivde');
        });

        it('should return 400 with invalid toekn', async () => {
            const res = await request(server)
                .get('/api/users/myself')
                .set('x-auth-token', '1');
            expect(res.status).toEqual(400);
            expect(res.text).toEqual('Invalid token');
        });

        // it('should return login user object without password');
    });

    describe('POST /', () => {
        // it('should return 400 when the user object is invalid');

        // it('should return 400 if the email is already registered');

        // it('should encrypt the password');

        // it('should save the user into db');

        // it('should response with the user object');

        // it('should response with token');
    });
});

