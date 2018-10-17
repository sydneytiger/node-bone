const request = require('supertest');
const {User, validate} = require('../models/user');

let server;
describe('/api/users', () => {
    beforeEach(() => {
         server = require('../index');
    });

    afterEach(async () => {
        await server.close();
    });
    describe('GET /myself', () => {
        const url = '/api/users/myself';
        it('should return 401 if no token is provided', async () => {
            const res = await request(server).get(url);
            expect(res.status).toEqual(401);
            expect(res.text).toEqual('No token proivde');
        });

        it('should return 400 with invalid toekn', async () => {
            const res = await request(server)
                .get(url)
                .set('x-auth-token', '123');
            expect(res.status).toEqual(400);
            expect(res.text).toEqual('Invalid token');
        });

        // it('should return login user object without password');
    });

    describe('POST /', () => {
        const url = '/api/users/';
        it('should return 400 when the user object is invalid', async () => {
            const res = await request(server)
                .post(url)
                .send({firstName: '123'});
            expect(res.status).toEqual(400);
            expect(res.text).toEqual('Invalid input');
        });

        //it('should return 400 if the email is already registered');

        // it('should encrypt the password');

        // it('should save the user into db');

        // it('should response with the user object');

        // it('should response with token');
    });
});

describe('user model', () => {
    let user;
    beforeEach(() => {
        user = {
            firstName: '12345',
            lastName: '12345',
            email: '12345@email.com',
            password: '12345'
        };
    });

    it('should be valid', () => {
        const { error } = validate(user);
        expect(error).toBeNull();
    });

    it('should error when firstName is less then 3 characters', () => {
        //user.firstName = '123';
        const { error } = validate(user);
        console.log({error});
        expect(error).toBeDefined();
    });
});

