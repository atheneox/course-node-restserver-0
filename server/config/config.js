process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/astudios';

} else {

    urlDB = 'mongodb+srv://amint:MindMint@as-1.gmdlg.mongodb.net/astudios?retryWrites=true&w=majority';

}

process.env.URLDB = urlDB;