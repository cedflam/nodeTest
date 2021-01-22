// Je récupère le paquet Express
const express = require('express');
// J'importe le middleware favicon
const favicon = require('serve-favicon');
// J'importe le middleware Morgan
const morgan = require('morgan');
// J'importe le middleware body-parser
const bodyParser = require('body-parser');
// J'importe sequelize
const sequelize = require('./src/db/sequelize');

// Je crée une instance d'une application Express (Petit serveur web)
const app = express();
// Je définis une constante qui correspond au port
const port = 3000;

// Permet d'appeler le middleware
// L'ordre est important !
// Les middlewares récupérés via npm lance la méthode next() par défaut,
// en revanche dans le cadre d'un middleware codé par nos soins la méthode next est nécessaire pour faire appel aux suivants
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())
;

// Ici j'insère mes routes
require('./src/routes/findAllPokemons')(app);

// Je démarre l'api rest sur le port 3000 que je lance grace à la méthode listen
app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost: ${port}`));
