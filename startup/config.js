const config = require('config');

module.exports = () => {
    if(!config.get('authTokenKey')) {
        throw new Error('Error: authTokenKey is NOT set in your environment variable.');
    }

    if(!config.get('db')) {
        throw new Error('Error: database connectiong string is NOT set in your environment variable.');
    }
}