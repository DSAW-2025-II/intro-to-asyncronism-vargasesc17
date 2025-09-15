const pokemonList = document.querySelector('#pokemonList');
const pokemonCard = document.querySelector('pokemon');
const typesButtons = document.querySelectorAll('.list-element.type');
const paginationControls = document.querySelector('.control-pagination');
const typesList = document.querySelector('.types-page');
const previousBtn = document.querySelector('#previous-btn');

previousBtn.disabled = true;

let typesPage = document.querySelector('.types-page');
typesPage.style.display = 'none';

let pokemonPage = 0;

const pokemonBase = 18;
const baseURL = 'https://pokeapi.co/api/v2';

let currentArray = []
let allPokemons = [];

fetchAllPokemons();

async function fetchAllPokemons() {
    try {
        const response = await fetch(baseURL + `/pokemon/?limit=1025`);
        const data = await response.json();

        allPokemons = data.results;
        currentArray = allPokemons

        fetchPokemon();

    } 
    catch (error) {
        console.log(error);
    }
}

async function fetchPokemon() {
    for (let i = 0; i <= pokemonBase - 1; i++) {
        try {
            if(currentArray[i].url) {
                const response = await fetch(currentArray[i].url);
                const data = await response.json();

                showPokemon(data);
            } else {
                showPokemon(currentArray[i]);
            }
        } 
        catch (error) { 
            console.log(error);
        }
    }
}

async function fetchMorePokemon() {
    if (pokemonPage < 1) {
        previousBtn.disabled = true;
        fetchPokemon();
        return;
    }

    try {
        const end = (pokemonBase * pokemonPage) + pokemonBase;

        for (let i = (pokemonPage * pokemonBase); i < end && currentArray.length; i++) {
            
            if(currentArray[i].url) {
                const response = await fetch(currentArray[i].url);
                const data = await response.json();

                showPokemon(data);
            } else {
                showPokemon(currentArray[i]);
            }

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

// Previous Button
function showPreviousPokemonList() {
    pokemonList.innerHTML = '';
    
    pokemonPage -= 1;

    fetchMorePokemon();
}

// Next Button
function showNextPokemonList() {
    previousBtn.disabled = false;
    pokemonList.innerHTML = '';
    
    pokemonPage += 1;
    
    fetchMorePokemon();
}

previousBtn.addEventListener('click', showPreviousPokemonList);
document.querySelector('#next-btn').addEventListener('click', showNextPokemonList);

// Interaction with 'Types' button
function displayType() {
    document.querySelector('.logo-title').style.display = 'none';
    document.querySelector('.search-buttons-container').style.display = 'none';
    document.querySelector('.control-pagination').style.display = 'none';
    pokemonList.innerHTML = '';

    typesPage.style.display = 'flex';
}

async function fetchPokemonByType(event) {
    const id = event.currentTarget.id;
    const buttonType = id.replace('-blk', '');

    const response = await fetch(baseURL + `/type/${buttonType}`);
    const data = await response.json();

    typesList.innerHTML = "";
    typesPage.style.display = 'none';
    paginationControls.style.display = 'flex';
    paginationControls.style.justifyContent = 'center';

    try {
        const fetchPromises = data.pokemon.map(p => fetch(p.pokemon.url).then(response => response.json()));

        const pokemonsType = await Promise.all(fetchPromises);

        currentArray = pokemonsType;
        pokemonPage = 0;              

        pokemonList.innerHTML = '';

        for (let i = 0; i < pokemonBase && i < currentArray.length; i++) {
            showPokemon(currentArray[i]);
        }
    } catch {
        console.log(error);
    }
}

typesButtons.forEach(button => button.addEventListener('click', fetchPokemonByType));