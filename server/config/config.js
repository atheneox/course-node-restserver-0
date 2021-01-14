
//PORT
process.env.PORT = process.env.PORT || 3000;

//ENVIROMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//TOKEN EXPIRY
process.env.TOKEN_EXPIRY = 60 * 60 * 24 * 30;

//AUTHENTICATION SEED
process.env.SEED = process.env.SEED || 'AmatVictoriaCuram';

let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/astudios';

} else {

    urlDB = process.env.MONGO_URI;

}

process.env.URLDB = urlDB;

// GOOGLE CLIENT ID
process.env.CLIENT_ID = process.env.CLIENT_ID || "450051229221-7otsbbfgt0jtc779su521ljdrk8f2kk9.apps.googleusercontent.com";