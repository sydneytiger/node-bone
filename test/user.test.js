const request = require('supertest');
const {User, validate} = require('../models/user');
const {validate: profileValidate} = require('../models/profile');

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
         server = require('../index');
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

describe('profile model', () => {
    let profile;
    beforeEach(() => {
        profile = {
            dateOfBirth: '2001-11-11',
            gender: 'male',
            yearStart: 1979
        } 
    });

    it('should be valid', () => {
        const {error} = profileValidate(profile);
        expect(error).toBeNull();
    });

    it('should error when dateOfBirth is greater then now', () => {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        profile.dateOfBirth = now;
        const { error } = profileValidate(profile);
        expect(error).not.toBeNull();
    });

    it('should error when dateOfBrith is empty', () => {
        profile.dateOfBirth = '';
        const { error } = profileValidate(profile);
        expect(error).not.toBeNull();
    });

    it('should error when gender is empty', () => {
        profile.gender = '';
        const { error } = profileValidate(profile);
        expect(error).not.toBeNull();
    });

    it('should be valid when gender is male', () => {
        profile.gender = 'male';
        const { error } = profileValidate(profile);
        expect(error).toBeNull();
    });

    it('should be valid when gender is female', () => {
        profile.gender = 'female';
        const { error } = profileValidate(profile);
        expect(error).toBeNull();
    });

    it('should error when gender is not male or female', () => {
        profile.gender = 'mala';
        const { error } = profileValidate(profile);
        expect(error).not.toBeNull();
    });

    it('should error when year starts more then 40 years ago', () => {
        const thisYear = new Date().getFullYear();
        profile.yearStart = thisYear - 41;
        const { error } = profileValidate(profile);
        expect(error).not.toBeNull();
    });

    it('should error when year starts from next year', () => {
        const thisYear = new Date().getFullYear();
        profile.yearStart = thisYear + 1;
        const { error } = profileValidate(profile);
        expect(error).not.toBeNull();
    });
});

