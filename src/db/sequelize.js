const {Sequelize, DataTypes} = require('sequelize')
const PokemonModel = require('../models/pokemon')
const UserModel = require('../models/User')
const pokemons = require('./mock-pokemon')
const bcrypt = require('bcrypt')

// Je paramètre sequelize

// Moteur Mysql
const sequelize = new Sequelize('pokedex', 'root', 'root', {
    host: 'localhost',
    port: '8889',
    dialect: 'mysql',
    dialectOptions: {
        //timezone: 'Etc/GMT-2',
    },
    logging: false
})

// Moteur MariaDb
/*const sequelize = new Sequelize('pokedex', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
        timezone: 'Etc/GMT-2',
    },
    logging: false
})*/

// Model Pokemon
const Pokemon = PokemonModel(sequelize, DataTypes)
// Model User
const User = UserModel(sequelize, DataTypes)

const initDb = () => {
    return sequelize.sync({force: true}).then(_ => {
        pokemons.map(pokemon => {
            Pokemon.create({
                name: pokemon.name,
                hp: pokemon.hp,
                cp: pokemon.cp,
                picture: pokemon.picture,
                types: pokemon.types
            }).then(pokemon => console.log(pokemon.toJSON()))
        })
        // Création d'un utilisateur
        bcrypt.hash('test', 10)
            .then(hash => {
                User.create({
                    username: 'test',
                    password: hash
                })
            })
            .then(user => console.log(user.toJSON()))
        console.log('La base de donnée a bien été initialisée !')
    })
}


module.exports = {
    initDb, Pokemon, User
}