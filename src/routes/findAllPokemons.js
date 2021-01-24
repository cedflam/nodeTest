const {Pokemon} = require('../db/sequelize');
const {Op} = require('sequelize');
const auth = require('../auth/auth');

module.exports = (app) => {
    app.get('/api/pokemons', auth, (req, res) => {
        if (req.query.name) {
            // Permet d'extraire name
            const name = req.query.name;
            // Je récupère la limite saisie par l'utilisateur ou je me positionne sur celle par défaut
            const limit = parseInt(req.query.limit) || 5;
            // Je limite le nombre de caractères de recherche à 2 caractères.
            if (name.length < 2){
                const message = "Vous devez entrer au moins deux caractères pour effectuer la recherche.";
                res.status(400).json({message});
            }
            // La clause where permet de récupérer tout ce qui porte le name
            return Pokemon.findAndCountAll({
                where: {
                    name: { // name est la propriété du model Pokemon
                        [Op.like]: `%${name}%` //name est le critère de recherche
                    }
                },
                order: ['name'], // Propriété à ordonner
                limit: limit // Déclarée plus haut
            })
                .then(({count, rows}) => {
                    const message = `Il y a ${count} pokemons qui correspondent au terme de recherche ${name}.`;
                    res.json({message, data: rows})
                })
        } else {
            Pokemon.findAll({order: ['name']})
                .then(pokemons => {
                    const message = 'La liste des pokémons a bien été récupérée.';
                    res.json({message, data: pokemons});
                })
                .catch(error => {
                    const message = "La liste des pokemons n'a pas pu être récupérée. Réessayez dans quelques instants.";
                    res.status(500).json({message, data: error});
                })
        }

    })
}