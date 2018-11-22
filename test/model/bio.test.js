const {
    validate
} = require('../../models/bio');

describe('bio model', () => {
    let bio;
    beforeEach(() => {
        bio = {
            weight: 90,
            bodyFatPercentage: 12,
            chestCircumference: 1200,
            armCircumference: 380,
            waistCircumference: 900
        };
    });

    const expectInvalidBio = (bioObject) => {
        const {
            error
        } = validate(bioObject);
        expect(error).not.toBeNull;
    };

    it('shoulid be valid', () => {
        const {
            error
        } = validate(bio);
        expect(error).toBeNull();
    });

    it('should error when weight is less than 20', () => {
        bio.weight = 19;
        expectInvalidBio(bio);
    });

    it('should error when weight is more than 300', () => {
        bio.weight = 301;
        expectInvalidBio(bio);
    });

    it('should error when bodyFatPercentage is less then 3', () => {
        bio.bodyFatPercentage = 2;
        expectInvalidBio(bio);
    });

    it('should error when bodyFatPercentage is more then 90', () => {
        bio.bodyFatPercentage = 91;
        expectInvalidBio(bio);
    });

    it('should error when chestCircumference is less then 500', () => {
        bio.chestCircumference = 499;
        expectInvalidBio(bio);
    });

    it('should error when chestCirumference is more then 2000', () => {
        bio.chestCircumference = 2001;
        expectInvalidBio(bio);
    });

    it('should error when armCircumference is less then 100', () => {
        bio.armCircumference = 99;
        expectInvalidBio(bio);
    });

    it('should error when armCirumference is more then 1000', () => {
        bio.armCircumference = 1001;
        expectInvalidBio(bio);
    });

    it('should error when waistCircumference is less then 500', () => {
        bio.waistCircumference = 499;
        expectInvalidBio(bio);
    });

    it('should error when waistCirumference is more then 2000', () => {
        bio.waistCircumference = 2001;
        expectInvalidBio(bio);
    });

});