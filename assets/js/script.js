window.onload = () => {
    let endpoint = 'https://pokeapi.co/api/v2/pokemon?limit=21';
    fetchPokemons();

    // Adding the click event to the next 20 pokemons
    document.getElementById('next').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('pokemons').innerHTML = '';
        fetchPokemons();
    })

    function fetchPokemons() {
        fetch(endpoint)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // To check the json in the console
            console.log(data);
            endpoint = data.next;
            data.results.forEach(function (pokemon) {
                // Pokemon id
                let id = pokemon.url.split('/')[6];
                // Adding Bootstrap card
                let cardPokemon = 
                `
                <div class="card img-fluid col-4">
                <div class="card-body">
                    <h5 class="card-title text-center">${pokemon.name}</h5>
                    <img class="card-img-top" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt="Card image cap">
                    <a id="${pokemon.name}" href="#" class="btn btn-success">¡Quiero saber más de este pokémon!</a>
                </div>
                </div>
                `
                // Adding the card to the div id="pokemons"
                document.getElementById('pokemons').insertAdjacentHTML('beforeend', cardPokemon);

                // Adding the Bootstrap modal 
                let modalPokemon = 
                `
                <div id="modal" class="modal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <img id='modalImg' class="card-img-top" src="..." alt="Card image cap">
                    <div class="modal-header">
                        <h3 id="namePokemon" class="modal-title">Modal title</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <h5 id="pokemonName"></h5>
                        <p id="pokemonType"></p><button id="damageRelations" href="#" class="btn btn-info">Ver relaciones de daño</button>
                        <p id="pokemonGeneration"></p>
                        <p id="pokemonAbilities"></p><button id="equalAbilities" href="#" class="btn btn-info">Otros pokémon que tienen esta habilidad</button>
                        <p id="pokemonFirstFiveMoves"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
                </div>
                `
                // Adding the modal to the div id="pokemons"
                document.getElementById('pokemons').insertAdjacentHTML('beforeend', modalPokemon);

                document.querySelector(`#${pokemon.name}`).addEventListener('click', (event) => {
                    event.preventDefault();
                    // Showing modal with jQuery
                    $('#modal').modal('show');
                    // new Modal({ el: document.querySelector('#modal') }).show();
                    // Adding name of pokemon
                    document.getElementById('namePokemon').innerHTML = pokemon.name;
                    document.getElementById('pokemonName').innerHTML = 'Name: ' + pokemon.name;
                    // To fetch information of each pokemon through the url
                    fetch(pokemon.url)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(data) {
                        // To check the information of each pokemon 
                        console.log(data);
                        // Adding image to the modal
                        document.getElementById("modalImg").src = data.sprites.front_default;

                        // Adding type, generation, abilities and 5 first movements to the modal body 
                        document.getElementById('pokemonType').innerHTML = pokemonType(data);
                        document.getElementById('pokemonAbilities').innerHTML = pokemonAbilities(data);
                        document.getElementById('pokemonFirstFiveMoves').innerHTML = pokemonFirstFiveMoves(data);

                        // Damage relations modal
                        let modalDamageRelation = 
                        `
                        <div id="damageRelation" class="modal" tabindex="-1" role="dialog">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h3 id="nameTitle" class="modal-title">Modal title</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <h5>Double damage from:</h5>
                                <p id="double_damage_from"></p>
                                <h5>Double damage to:</h5>
                                <p id="double_damage_to"></p>
                                <h5>Half damage from:</h5>
                                <p id="half_damage_from"></p>
                                <h5>Half damage to:</h5>
                                <p id="half_damage_to"></p>
                                <h5>No damage from:</h5>
                                <p id="no_damage_from"></p>
                                <h5>No damage to:</h5>
                                <p id="no_damage_to"></p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            </div>
                            </div>
                        </div>
                        </div>
                        `
                        document.getElementById('pokemons').insertAdjacentHTML('beforeend', modalDamageRelation);

                        // Adding the damage relations at the click event
                        document.getElementById('damageRelations').addEventListener('click', (event) => {
                            event.preventDefault();
                            $('#damageRelation').modal('show');
                            document.getElementById('nameTitle').innerHTML = `${pokemon.name}'s` + ' Damage Relation';

                            fetch(urlDamageRelation(data))
                            .then(function(response) {
                                return response.json();
                            })
                            .then(function(response) {
                                console.log(response.damage_relations);
                                damageRelation(response);
                            })
                        })

                        // Adding the pookemons with the same abilities

                        // Equal ability modal
                        let modalEqualAbility = 
                        `
                        <div id="equalAbility" class="modal" tabindex="-1" role="dialog">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h3 id="nameTitle" class="modal-title">What pokemon has the same ability?</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <h5>Has this hability:</h5>
                                <p id="double_damage_from"></p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            </div>
                            </div>
                        </div>
                        </div>
                        `
                        document.getElementById('pokemons').insertAdjacentHTML('beforeend', modalEqualAbility);

                        document.getElementById('equalAbilities').addEventListener('click', (event) => {
                            event.preventDefault();
                            $('#equalAbility').modal('show');

                            let endpointAllAbilities = 'https://pokeapi.co/api/v2/ability?limit=327';
                            fetch(endpointAllAbilities)
                            .then(function(response) {
                                return response.json();
                            })
                            .then(function(response) {
                                console.log(response);
                                response.results.forEach(function(ability) {
                                    // console.log(ability.name)

                                    // function equalAbility(ability) {
                                    //     let arrAbilities = ability.name;

                                    //     let arrPokemonAbilities = ability.ability.name;

                                    //     for (let i = 0; i < arrAbilities.length; i++) {
                                    //         console.log(arrAbilities);
                                    //         for (let j = 0; j < arrPokemonAbilities.length; j++) {
                                    //             return console.log(arrPokemonAbilities);
                                                
                                    //         }
                                    //     }

                                    
                                    // }
                                    // equalAbility(data)

                                    console.log(pokemon.name)

                                })
                            })

                            // function countRepeatedLetters(text) {
                            //     let arrayLetters = addLettersToArray(text);
                            //     let findMatchedLetters = [];
                            //     let repeatedLetters = [];
                            //     for (let i = 0; i < arrayLetters.length; i++) {
                            //         let letter = 0;
                            //         for (let j = 0; j < arrayLetters.length; j++) {
                            //             if (arrayLetters[i] === arrayLetters[j] && !findMatchedLetters.includes(arrayLetters[i])) {
                            //                 letter++; // letter++ or letter = letter + 1
                            //             }
                            //         }
                            //         findMatchedLetters.push(arrayLetters[i]);
                            //         if (letter > 1) {
                            //             repeatedLetters.push(`${arrayLetters[i]}: ${letter}`);
                            //         }
                            //     }
                            //     return repeatedLetters;
                            // }





                        })
                          
                    })
                })
            })
        })
    }

    function pokemonType(data) {
        let types = 'Types: ';
        data.types.forEach(function(type, index) {
            types += (index + 1) + ') ' + `${type.type.name}` + ' ';
        })
        console.log(types);
        return types;
    }

    function pokemonAbilities(data) {
        let abilities = 'Abilities: ';
        data.abilities.forEach(function(ability, index) {
            abilities += (index + 1) + ') ' + `${ability.ability.name}` + ' ';
        })
        return abilities;
    }

    function pokemonFirstFiveMoves(data) {
        let moves = 'Moves: ';
        data.moves.forEach(function(move, index) {
            if (index < 5) {
                moves += (index + 1) + ') ' + `${move.move.name}` + ' ';
            }
        })
        return moves;
    }

    function urlDamageRelation(data) {
        let urlDamageRel;
        data.types.forEach(function(type) {
            urlDamageRel = type.type.url;
        })
        console.log(urlDamageRel);
        return urlDamageRel;
    }

    function damageRelation(response) {
        for (let key in response.damage_relations) {
            let relation = '';
            let damageRel = response.damage_relations[key];
            damageRel.forEach(function(damage) {
                console.log(`${key}: ${damage.name}`)
                relation += `${damage.name}` + ', ';
            })
        document.querySelector(`#${key}`).innerHTML = relation;
        }
    }
}

