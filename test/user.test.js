const request = require('supertest');
const {User, validate} = require('../models/user');

let server;
describe('/api/users', () => {
    beforeEach(() => {
         server = require('../index');
    });

    afterEach(async () => {
        await server.close();
        await User.remove({});
    });
    describe('GET /myself', () => {
        debugger;
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
        it('should return 400 if the email is already registered', async () => {
            const validUser = {
                firstName: '12345',
                lastName: '12345',
                email: '12345@email.com',
                password: '12345'
            };
            const user = new User(validUser);
            await user.save();

            const res = await request(server).post(url).send(validUser);
            expect(res.status).toEqual(400);
            expect(res.text).toEqual('User already registered');

        });

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

    it('should error when firstName is empty', () => {
        user.firstName = '';
        const { error } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when firstName is less then 3 characters', () => {
        user.firstName = '12';
        const { error } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when firstName is less then 50 characters', () => {
        user.firstName = Array(52).join('1');
        const { error } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when lastName is empty', () => {
        user.lastName = '';
        const { error } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when lastName is less then 3 characters', () => {
        user.lastName = '12';
        const { error } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when lastName is less then 50 characters', () => {
        user.lastName = Array(52).join('1');
        const { error } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when email is empty', () => {
        user.email = '';
        const { error } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when email is less then 255 characters', () => {
        user.email = Array(256).join('1');
        const { error } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when email format is invalid', () => {
        user.email = '111111';
        const { error } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when password is empty', () => {
        user.password = '';
        const { error } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when password is less then 5 characters', () => {
        user.password = '1234';
        const { error } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when password is less then 255 characters', () => {
        user.password = Array(257).join('1');
        const { error } = validate(user);
        expect(error).not.toBeNull();
    });
});

