const {Pokemon} = require('../db/sequelize')
const {ValidationError, UniqueConstraintError} = require("sequelize");
const auth = require('../auth/auth');

module.exports = (app) => {
    app.put('/api/pokemons/:id', auth, (req, res) => {
        const id = req.params.id
        Pokemon.update(req.body, {
            where: {id: id}
        })
            .then(_ => {
                // Utilisation de return permet de transférer le message d'erreur dans le catch si elle intervient.
                // Coupe l'execution du code serveur en cas d'erreur
                return Pokemon.findByPk(id).then(pokemon => {
                    if (pokemon === null) {
                        const message = "Le pokemon demandé n'existe pas. Essayez avec un autre identifiant.";
                        res.status(404).json({message})
                    }
                    const message = `Le pokémon ${pokemon.name} a bien été modifié.`
                    res.json({message, data: pokemon})
                })
            })
            .catch(error => {
                if (error instanceof ValidationError){
                    return res.status(400).json({message: error.message, data: error})
                }
                const message = "Le pokemon n'a pas pu être modifié. Réessayez dans quelques instants.";
                res.status(500).json({message, data: error});

                if (error instanceof UniqueConstraintError){
                    return res.status(400).json({message: error.message, data: error})
                }
            })
    })
}