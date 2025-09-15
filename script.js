const pokemonList = document.querySelector('#pokemonList');
const pokemonCard = document.querySelector('pokemon');
let pokemonPage = 1;

const pokemonBase = 18;
const baseURL = 'https://pokeapi.co/api/v2'

fetchPokemon();

async function fetchPokemon() {
    try {
        for (let i = 1; i <= pokemonBase; i++) {
            const response = await fetch(baseURL + `/pokemon/${i}`);
            const data = await response.json();

            showPokemon(data);
        } 
    }
    catch (error) {
        console.log(error);
    }
}

async function fetchMorePokemon(pokePage) {
    try {
        for (let i = (pokePage * pokemonBase) + 1; i < (pokePage*pokemonBase) + 19; i++) {
            const response = await fetch(baseURL + `/pokemon/${i}`);
            const data = await response.json();

            showPokemon(data);
        }
    } catch (error) {
        console.log(error);
    }
}

// Show initial info of the Pokémon
function showPokemon(data) {
    const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    let types = data.types.map(type => `<p class="${type.type.name} type">${type.type.name.toUpperCase()}</p>`);
    types = types.join('');

    const mainType = data.types[0].type.name;
    const cssColorName = `--type-${mainType}`;
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue(cssColorName).trim() || '#000';

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.style.border = `solid ${borderColor}`;
    div.innerHTML = `
        <p class="pokemon-name">${name}</p>
        <div class="pokemon-image">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png" 
            alt=${data.name}>
        </div>
        <div class="pokemon-info">
            <p class="pokemon-id">#${data.id}</p>
        </div>
        <div class="pokemon-types">
            ${types}
        </div>
    </div>`;
    pokemonList.appendChild(div);
}

// Pagination buttons
let ifFirstPrevClick = true;

function showPreviousPokemonList() {
    pokemonList.innerHTML = '';

    if (pokemonPage == 1) {
        fetchPokemon();
        return;
    }

    if (ifFirstPrevClick) {pokemonPage = pokemonPage - 2; 
        ifFirstPrevClick = false;
    }
    else { pokemonPage = pokemonPage - 1 }

    console.log(pokemonPage);

    fetchMorePokemon(pokemonPage);
}

function showNextPokemonList() {
    pokemonList.innerHTML = '';

    fetchMorePokemon(pokemonPage);
    ifFirstPrevClick = true;

    pokemonPage = pokemonPage + 1;
}

document.querySelector('#previous-btn').addEventListener('click', showPreviousPokemonList);
document.querySelector('#next-btn').addEventListener('click', showNextPokemonList);

// Interaction with 'Types' button
function displayType() {

}