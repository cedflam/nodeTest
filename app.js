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

// Initialisation de la base de données
sequelize.initDb();

// Ici j'insère mes routes
require('./src/routes/findAllPokemons')(app);
require('./src/routes/findPokemonByPk')(app);
require('./src/routes/createPokemon')(app);
require('./src/routes/updatePokemon')(app);
require('./src/routes/deletePokemon')(app);
require('./src/routes/login')(app);

// Gestion des erreurs
app.use( ( {res} ) => {
    const message = "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL. ";
    res.status(404).json({message});
})

// Je démarre l'api rest sur le port 3000 que je lance grace à la méthode listen
app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost: ${port}`));
