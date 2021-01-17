/**
 * Permet de formater le tableau json avec un message en encapsulant les datas dabs data
 * @param message
 * @param data
 * @returns {{data, message}}
 */
exports.success = (message, data) => {
    return { message, data }
}

/**
 * Permet de retourner un id unique
 * @param pokemons
 * @returns {*}
 */
exports.getUniqueId = (pokemons) => {
    // Je boucle sur les pokemons et je stocke chaque id dans un tableau
    const pokemonsIds = pokemons.map(pokemon => pokemon.id);
    // Permet de stocker l'id le plus grand dans une variable
    const maxId = pokemonsIds.reduce((a, b) => Math.max(a, b));
    // Je mets en place mon id en incrémentant maxId +1
    const uniqueId = maxId + 1;
    // Je retourne mon id unique
    return uniqueId;
}



