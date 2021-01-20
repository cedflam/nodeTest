// Je récupère le paquet Express
const express = require('express');
// j'importe la méthode success de helper.js
const {success, getUniqueId} = require('./helper');
// J'importe la liste de pokemons
let pokemons = require('./mock-pokemon');
// J'importe le middleware favicon
const favicon = require('serve-favicon');
// J'importe le middleware Morgan
const morgan = require('morgan');
// J'importe le middleware body-parser
const bodyParser = require('body-parser');
// J'importe sequelize
const {Sequelize} = require("sequelize");

// Je crée une instance d'une application Express (Petit serveur web)
const app = express();
// Je définis une constante qui correspond au port
const port = 3000;

// Je paramètre sequelize
// npm install --save mysql2
/**
*const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mysql',
  dialectOptions: {
    // Your mysql2 options here
  }
})
*/
const sequelize = new Sequelize('pokedex', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
        timezone: 'Etc/GMT-2',
    },
    logging: false
})



// Initialisation de la base de données
sequelize.authenticate()
    .then(_ => console.log("La connexion a bien été prise en compte..."))
    .catch(error => console.log(`La connexion à la base de données à échoué ... ${error}`))

// Permet d'appeler le middleware
// L'ordre est important !
// Les middlewares récupérés via npm lance la méthode next() par défaut,
// en revanche dans le cadre d'un middleware codé par nos soins la méthode next est nécessaire pour faire appel aux suivants
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())
;

// 1) '/' -> Route
// 2) req = request ... res = response
app.get('/', (req, res) => res.send('Hello, Express 2 again !'));
app.get('/api/pokemons/:id', (req, res) => {
    //Permet de récupérer l'id passé dans l'URI grace à la propriété params
    const id = parseInt(req.params.id);
    // Je récupère le pokemon passé en paramètre
    const pokemon = pokemons.find(pokemons => pokemons.id === id);
    // Je configure le message du helper
    const message = "Un pokémon a bien été trouvé !";
    // Je retourne une réponse au format json contenant le message et le pokemon
    res.json(success(message, pokemon));
});
// Retourne le nombre total de pokemons présent au format json
app.get('/api/pokemons', (req, res) => {
    const message = `Vous affichez actuellement ${pokemons.length} pokemons`;
    res.json(success(message, pokemons));
})
// Permet de créer un nouveau pokemon
app.post('/api/pokemons', (req, res) => {
    // Appel de la méthode pour obtenir un id unique
    const id = getUniqueId(pokemons);
    // Ajoute le body de la requete...(id et created sont entre accolades car je passe 2 éléments )
    const pokemonCreated = {...req.body, ...{id:id, created: new Date()}}
    // J'ajoute le pokemon crée
    pokemons.push(pokemonCreated);
    // Je paramètre le message
    const message = `Le pokemon ${pokemonCreated.name} a bien été crée !`;
    // Je retourne une réponse au format json
    res.json(success(message, pokemonCreated));
})

// Permet de modifier un pokemon
app.put('/api/pokemons', (req, res) => {
    //j'obtiens un id unique
    const id = getUniqueId(pokemons);
    // J'ajoute le body de la requete
    const pokemonUpdated = {... req.body, id:id};
    // Pour chaque élément de la liste, je retourne un pokemon sauf q'il s'agit du pokemon modifié
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
    });
    // Je paramètre le message
    const message = `Le pokemon ${pokemonUpdated.name} a bien été mis à jour !`;
    // Je retourne une réponse au format json
    res.json(success(message, pokemonUpdated));
});

// Permet de supprimer un pokemon
app.delete('/api/pokemons/:id', (req, res) => {
   const id = parseInt(req.params.id);
   const pokemonDelete = pokemons.find(pokemon => pokemon.id === id);
   pokemons.filter(pokemon => pokemon.id !== id);
   const message = `Le pokemon ${pokemonDelete.name} a bien été supprimé !`;
   res.json(success(message, pokemonDelete));
});
// Je démarre l'api rest sur le port 3000 que je lance grace à la méthode listen
app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost: ${port}`));
