
//PORT
process.env.PORT = process.env.PORT || 3000;

//ENVIROMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//TOKEN EXPIRY
process.env.TOKEN_EXPIRY = '48h'; //60 * 60 * 24 * 30;

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
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;