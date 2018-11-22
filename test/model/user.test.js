const {
    validate
} = require('../../models/user');

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
        const {
            error
        } = validate(user);
        expect(error).toBeNull();
    });

    it('should error when firstName is empty', () => {
        user.firstName = '';
        const {
            error
        } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when firstName is less then 3 characters', () => {
        user.firstName = '12';
        const {
            error
        } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when firstName is less then 50 characters', () => {
        user.firstName = Array(52).join('1');
        const {
            error
        } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when lastName is empty', () => {
        user.lastName = '';
        const {
            error
        } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when lastName is less then 2 characters', () => {
        user.lastName = 'a';
        const {
            error
        } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when lastName is less then 50 characters', () => {
        user.lastName = Array(52).join('1');
        const {
            error
        } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when email is empty', () => {
        user.email = '';
        const {
            error
        } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when email is less then 255 characters', () => {
        user.email = Array(256).join('1');
        const {
            error
        } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when email format is invalid', () => {
        user.email = '111111';
        const {
            error
        } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when password is empty', () => {
        user.password = '';
        const {
            error
        } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when password is less then 5 characters', () => {
        user.password = '1234';
        const {
            error
        } = validate(user);
        expect(error).not.toBeNull();
    });

    it('should error when password is less then 255 characters', () => {
        user.password = Array(257).join('1');
        const {
            error
        } = validate(user);
        expect(error).not.toBeNull();
    });
});