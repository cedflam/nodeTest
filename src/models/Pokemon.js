const validTypes = ['Plante', 'Poison', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik', 'Fée'];

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pokemon', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            // La contrainte unique ne fonctionne pas...
            unique: {msg: "Ce pokémon existe déjà."},
            validate: {
                notEmpty: {msg: "Le nom ne peut pas être vide."},
                notNull: {msg: "Le nom est propriété requise."}
            }
        },
        hp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {msg: "Vous devez utiliser des nombres entiers uniquement."},
                notNull: {msg: "Les points de vie sont obligatoires."},
                min: {
                    args: [0],
                    msg: "Le nombre de points de vie ne peut être inférieur à 0."
                },
                max: {
                    args: [999],
                    msg: "Le nombre de points de vie ne peut excéder 999."
                }
            }
        },
        cp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {msg: "Utilisez des nombres entiers pour les points de dégats."},
                notNull: {msg: "Les points de vie sont une propriété requise."},
                min: {
                    args: [0],
                    msg: "Le nombre de points de dégats ne peut être inférieur à 0."
                },
                max: {
                    args: [99],
                    msg: "Le nombre de points de dégats ne peut excéder 99."
                }
            }
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: {msg: "Utilisez une URL valide pour l'image."},
                notNull: {msg: "L'image est une prorpiété requise."}
            }
        },
        types: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                return this.getDataValue('types').split(',')
            },
            set(types) {
                this.setDataValue('types', types.join())
            },
            validate: {
                isTypesValid(value) {
                    if (!value) {
                        throw new Error('Un pokémon doit doit avoir au moins un type.')
                    }
                    if (value.split(',').length > 3) {
                        throw new Error('Un pokémon ne peut pas avoir plus de trois types.')
                    }
                    value.split(',').forEach(type => {
                        if (!validTypes.includes(type)) {
                            throw new Error(`Le type d'un pokémon doit appartenir à la liste suivannte : ${validTypes}`);
                        }
                    })
                }
            }
        }
    }, {
        timestamps: true,
        createdAt: 'created',
        updatedAt: false,
    })
}