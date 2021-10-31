window.onload = () => {
    let endpoint = 'https://pokeapi.co/api/v2/pokemon/';
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
                        <p id="pokemonType"></p>
                        <p id="pokemonGeneration"></p>
                        <p id="pokemonAbilities"></p>
                        <p id="pokemonFirstFiveMoves"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary">Save changes</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
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
}

