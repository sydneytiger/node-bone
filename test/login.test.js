const request = require('supertest');
const {validate} = require('../routes/login');
const {User} = require('../models/user');
const bcrypt = require('bcrypt');

describe('/api/login', () => {
    let server;
    let validLogin;
    describe('login model validation', () => {
        beforeEach(() => {
            validLogin = {
                email: 'validUser@email.com',
                password: '12345'
            }
        });

        it('should NOT return error when login modal is valie', () => {
            const {error} = validate(validLogin);
            expect(error).toBeNull();
        });
        
        it('should return error when email is empty', () => {
            validLogin.email = '';
            const {error} = validate(validLogin);
            expect(error).not.toBeNull();
        });

        it('should return error when email format is incorrect', () => {
            validLogin.email = 'emailtest';
            const {error} = validate(validLogin);
            expect(error).not.toBeNull();
        });

        it('should return error when email length is longer than 255 characters', () => {
            validLogin.email = Array(257).join('1');
            const {error} = validate(validLogin);
            expect(error).not.toBeNull();
        });

        it('should return error when password is empty', () => {
            validLogin.password = '';
            const {error} = validate(validLogin);
            expect(error).not.toBeNull();
        });

        it('should return error when password is less then 5 characters', () => {
            validLogin.password = '1234';
            const {error} = validate(validLogin);
            expect(error).not.toBeNull();
        });

        it('should return error when password is more then 255 characters', () => {
            validLogin.password = Array(257).join(2);
            const {error} = validate(validLogin);
            expect(error).not.toBeNull();
        });
    });

    describe('POST /', () => {
        const url = '/api/login/'
        
        const createUser = async () => {
            const user = new User({
                firstName: '12345',
                lastName: '12345',
                email: 'validUser@email.com',
                password: '12345',
                isVip: true,
                isAdmin: false});
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
                await user.save();
        };
            
        const removeUser = () => {
            return User.deleteMany({email: 'validUser@email.com'});
        };
            
        beforeEach(() => {
            server = require('../index');
            validLogin = {
                email: 'validUser@email.com',
                password: '12345'
            }
        });

        afterEach(async () => {
            await server.close();
            await removeUser();
        });

        it('should return 400 when login model is invalid', async () => {
            validLogin.email = '';
            const res = await request(server).post(url).send(validLogin);
            expect(res.status).toEqual(400);
            expect(res.text).toEqual('Invalid login');
        });

        it('should return 400 when user does NOT exists', async () => {
            const res = await request(server).post(url).send(validLogin);
            expect(res.status).toEqual(400);
            expect(res.text).toEqual('Invalid user');
        });

        it('should return 400 when loging in with incorrect password', async () => {
            await createUser();

            validLogin.password = '54321';
            const res = await request(server).post(url).send(validLogin);
            expect(res.status).toEqual(400);
            expect(res.text).toEqual('Invalid password');

        });

        it('should return token when user successfully logged in', async () => {
            await createUser();

            const res = await request(server).post(url).send(validLogin);
            expect(res.status).toEqual(200);
            expect(res.get('x-auth-token')).toBeDefined();

        });
    });
});