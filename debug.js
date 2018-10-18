const bcrypt = require('bcrypt');

async function cryptPassword(password){
    const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(password, salt);
    debugger;
    return pwd;
}

cryptPassword('Helloworld');