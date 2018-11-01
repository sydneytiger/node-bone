const request = require('supertest');
const { User } = require('../../models/user');

let server;
describe('/api/users', () => {
    const validUser = {
        firstName: '12345',
        lastName: '12345',
        email: '12345@email.com',
        password: '12345',
        isVip: true,
        isAdmin: false
    };

    beforeEach(() => {
         server = require('../../index');
    });

    afterEach(async () => {
        debugger;
        await server.close();
        await User.remove({});
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

        it('should return login user object without password, isAdmin, registeredDate', async () => {
            const user = new User(validUser);
            await user.save();
            const token = user.generateAuthToken();

            const res = await request(server)
                .get(url)
                .set('x-auth-token', token);
            expect(res.status).toEqual(200);
            expect(JSON.parse(res.text).password).not.toBeDefined();
            expect(JSON.parse(res.text).isAdmin).not.toBeDefined();
            expect(JSON.parse(res.text).registeredDate).not.toBeDefined();
        });
    });

    describe('POST /', () => {
        const url = '/api/users/';

        it('should return 400 if first name is less then 3 characters', async () => {
            const res = await request(server).post(url).send({
                firstName: '12',
                lastName: '12345',
                email: '12345@email.com',
                password: '12345',
                isVip: true,
                isAdmin: false
            });

            expect(res.status).toEqual(400);
            expect(res.text).toEqual('Invalid input');
        });

        it('should return 400 if the email is already registered', async () => {
            const user = new User(validUser);
            await user.save();

            const res = await request(server).post(url).send(validUser);
            expect(res.status).toEqual(400);
            expect(res.text).toEqual('User already registered');

        });

        it('should encrypt the password', async () => {
            const user = new User(validUser);
            await request(server).post(url).send(validUser);

            const registeredUser = await User.findOne({email: validUser.email});

            expect(registeredUser).not.toBeNull();
            expect(registeredUser.password).not.toEqual(validUser.password);
            expect(registeredUser.password.length).toBeGreaterThan(validUser.password.length);
        });

        it('should response with token', async () => {
            const res = await request(server).post(url).send(validUser);

            const token = res.get('x-auth-token');

            expect(token).toBeDefined();
            expect(token.length).toBeGreaterThan(10);
        });
    });
});




