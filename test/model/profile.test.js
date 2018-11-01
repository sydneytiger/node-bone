const {validate} = require('../../models/profile');

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
        const {error} = validate(profile);
        expect(error).toBeNull();
    });

    it('should error when dateOfBirth is greater then now', () => {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        profile.dateOfBirth = now;
        const { error } = validate(profile);
        expect(error).not.toBeNull();
    });

    it('should error when dateOfBrith is empty', () => {
        profile.dateOfBirth = '';
        const { error } = validate(profile);
        expect(error).not.toBeNull();
    });

    it('should error when gender is empty', () => {
        profile.gender = '';
        const { error } = validate(profile);
        expect(error).not.toBeNull();
    });

    it('should be valid when gender is male', () => {
        profile.gender = 'male';
        const { error } = validate(profile);
        expect(error).toBeNull();
    });

    it('should be valid when gender is female', () => {
        profile.gender = 'female';
        const { error } = validate(profile);
        expect(error).toBeNull();
    });

    it('should error when gender is not male or female', () => {
        profile.gender = 'mala';
        const { error } = validate(profile);
        expect(error).not.toBeNull();
    });

    it('should error when year starts more then 40 years ago', () => {
        const thisYear = new Date().getFullYear();
        profile.yearStart = thisYear - 41;
        const { error } = validate(profile);
        expect(error).not.toBeNull();
    });

    it('should error when year starts from next year', () => {
        const thisYear = new Date().getFullYear();
        profile.yearStart = thisYear + 1;
        const { error } = validate(profile);
        expect(error).not.toBeNull();
    });
});