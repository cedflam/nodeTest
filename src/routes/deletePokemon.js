const {Pokemon} = require('../db/sequelize')
const auth = require('../auth/auth');

module.exports = (app) => {
    app.delete('/api/pokemons/:id', auth, (req, res) => {
        Pokemon.findByPk(req.params.id).then(pokemon => {
            const pokemonDeleted = pokemon;
            // Utilisation de return permet de transférer le message d'erreur dans le catch si elle intervient.
            // Coupe l'execution du code serveur en cas d'erreur.
            return Pokemon.destroy({
                where: {id: pokemon.id}
            })
                .then(_ => {
                    const message = `Le pokémon avec l'identifiant n°${pokemonDeleted.id} a bien été supprimé.`
                    res.json({message, data: pokemonDeleted})
                })
        })
            .catch(error => {
                const message = "Le pokemon n'a pas pu être supprimé. Réessayez dans quelques instants.";
                res.status(500).json({message, data: error})
            })
    })
}