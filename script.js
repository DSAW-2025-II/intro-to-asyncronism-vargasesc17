const mainContainer = document.querySelector('#main-container');
const pokemonList = document.querySelector('#pokemonList');
const typesButtons = document.querySelectorAll('.list-element.type');
const searchButton = document.querySelector('#search-button');
const paginationControls = document.querySelector('.control-pagination');
const typesList = document.querySelector('.types-page');
const previousBtn = document.querySelector('#previous-btn');
const nextBtn = document.querySelector('#next-btn');
const pokemonBase = 18;
const nameId = document.querySelector('#pokemonNameID');
const typesMainBtn = document.querySelector('#button-types');
const surpriseBtn = document.querySelector('#button-random');
const closeHomeBtn = document.querySelector('#main-close-btn');
const homeBtns = document.querySelectorAll('.home');
const errorMessage = document.querySelector('#error-msg');
const modal = document.querySelector('#modal');

const baseURL = 'https://pokeapi.co/api/v2';

const typesArray = [
    {name: 'normal', idPokemon: 143},
    {name: 'fire', idPokemon: 6},
    {name: 'water', idPokemon: 130},
    {name: 'grass', idPokemon: 3},
    {name: 'electric', idPokemon: 25},
    {name: 'ice', idPokemon: 144},
    {name: 'fighting', idPokemon: 68},
    {name: 'poison', idPokemon: 429},
    {name: 'ground', idPokemon: 95},
    {name: 'flying', idPokemon: 18},
    {name: 'psychic', idPokemon: 150},
    {name: 'bug', idPokemon: 123},
    {name: 'rock', idPokemon: 74},
    {name: 'ghost', idPokemon: 94},
    {name: 'dark', idPokemon: 149},
    {name: 'dragon', idPokemon: 197},
    {name: 'steel', idPokemon: 208},
    {name: 'fairy', idPokemon: 700},
];

let typesPage = document.querySelector('.types-page');
let pokemonPage = 0;
let currentArray = []
let allPokemons = [];

// Initialize the Pokédex
fetchAllPokemons();

// Home Button
homeBtns.forEach(homeBtn => homeBtn.addEventListener('click', () => {
    pokemonPage = 0;

    pokemonList.innerHTML = "";
    paginationControls.style.display = 'flex';
    pokemonList.style.display = 'grid';
    errorMessage.style.display = 'none';
    console.clear();
    fetchAllPokemons();
})
);


// Some previous considerations
errorMessage.style.display = 'none';
typesPage.style.display = 'none';
previousBtn.disabled = true;

async function fetchPokemonCard(pokemonId) {
    try {
        const response = await fetch(baseURL + `/pokemon/${pokemonId}`);
        const data = await response.json();

        showPokemonCard(data);
    } catch (error) {
        console.log(error);
    }
}

async function fetchAllPokemons() {
    try {
        const response = await fetch(baseURL + `/pokemon/?limit=1025`);
        const data = await response.json();

        allPokemons = data.results;
        currentArray = allPokemons;

        fetchPokemons();
    } 
    catch (error) {
        console.log(error);
    }
}

async function fetchPokemons() {
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
    const totalPages = Math.ceil(currentArray.length / 18);

    if (pokemonPage < 1) {
        previousBtn.disabled = true;
        fetchPokemons();
        return;
    }

    if (pokemonPage == totalPages - 1) {
        nextBtn.disabled = true;
    }

    try {
        const end = (pokemonBase * pokemonPage) + pokemonBase;

        for (let i = (pokemonPage * pokemonBase); i < end && i < currentArray.length; i++) {
            
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
    errorMessage.style.display = 'none';

    const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    let types = data.types.map(type => `<p class="${type.type.name} type">${type.type.name.toUpperCase()}</p>`).join('');
    const mainType = data.types[0].type.name;
    const cssColorName = `--type-${mainType}`;
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue(cssColorName).trim() || '#000';

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.style.border = `solid ${borderColor}`;

    div.dataset.id = data.id;
    
    div.addEventListener('click', () => {
        const pokemonId = div.dataset.id;
        modal.classList.add('active');
        fetchPokemonCard(pokemonId);
    });


    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;
    img.alt = data.name;

    img.onerror = () => {
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;
    };

    div.innerHTML = `
        <p class="pokemon-name">${name}</p>
        <div class="pokemon-image"></div>
        <div class="pokemon-info">
            <p class="pokemon-id">#${data.id}</p>
        </div>
        <div class="pokemon-types">
            ${types}
        </div>
    `;

    div.querySelector('.pokemon-image').appendChild(img);

    const pokeName = div.querySelector('.pokemon-name');
    if (name.length > 20) {
        pokeName.style.fontSize = '0.8rem';
    }

    pokemonList.appendChild(div);

    
}

// Pagination buttons

// Previous Button
function showPreviousPokemonList() {
    pokemonList.innerHTML = '';
    pokemonPage -= 1;
    nextBtn.disabled = false;
    fetchMorePokemon();
}

previousBtn.addEventListener('click', showPreviousPokemonList);
nextBtn.addEventListener('click', showNextPokemonList);

// Next Button
function showNextPokemonList() {
    previousBtn.disabled = false;
    pokemonList.innerHTML = '';
    
    pokemonPage += 1;
    
    fetchMorePokemon();
}

// Show Pokémon Card
function showPokemonCard(data) {
    const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    let types = data.types.map(type => `<p class="${type.type.name} type">${type.type.name.toUpperCase()}</p>`).join('');
    const mainType = data.types[0].type.name;
    const cssColorName = `--type-${mainType}`;
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue(cssColorName).trim() || '#000';

    const div = document.createElement("div");
    div.classList.add("pokemon-information-container");
    div.style.border = `solid ${borderColor}`;
    
    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${data.id}.gif`;
    img.alt = data.name;

    img.onerror = () => {
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;
    };

    div.innerHTML = `
        <button class="close-btn" id="close-pokemon-card" >X</button>

        <p class="pokemon-id card">#${data.id}</p>
        <h2 class="pokemon-name title">${name}</h2>
        
        <div class="images"></div>

        <div class="general-info">
            <p>Height: ${data.height}m</p>
            <p>Weight: ${data.weight}kg</p>
        </div>
        <div class="pokemon-types">
            ${types}
        </div>

        <div class="stats">
            <ul class="stats-list">
                <li class="stat-item" id="hp">
                    <p class="stat-name">HP</p>
                    <p class="stat-num">${data.stats[0].base_stat}</p>
                </li>
                <li class="stat-item" id="attack">
                    <p class="stat-name">Attack</p>
                    <p class="stat-num">${data.stats[1].base_stat}</p>
                </li>
                <li class="stat-item" id="defense">
                    <p class="stat-name">Defense</p>
                    <p class="stat-num">${data.stats[2].base_stat}</p>
                </li>
                <li class="stat-item" id="special-attack">
                    <p class="stat-name">Special Attack</p>
                    <p class="stat-num">${data.stats[3].base_stat}</p>
                </li>
                <li class="stat-item" id="special-defense">
                    <p class="stat-name">Special Defense</p>
                    <p class="stat-num">${data.stats[4].base_stat}</p>
                </li>
                <li class="stat-item" id="speed">
                    <p class="stat-name">Speed</p>
                    <p class="stat-num">${data.stats[5].base_stat}</p>
                </li>
            </ul>
        </div>
    `;

    const closeBtn = div.querySelector('#close-pokemon-card');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        div.remove();
    });

    div.querySelector('.images').appendChild(img);

    const pokeName = div.querySelector('.pokemon-name');
    if (name.length > 18 || name.includes('-')) {
        pokeName.style.fontSize = '1rem';
    }

    pokemonList.appendChild(div);
}

// Interaction with 'Types' button
function generateTypes() {
    const typesListUl = document.querySelector('.types-list');
    typesListUl.innerHTML = ''; // limpiamos el contenido previo

    typesArray.forEach(type => {
        const li = document.createElement('li');
        li.classList.add('type-item');

        const div = document.createElement('div');

        div.classList.add('list-element', 'type', type.name);
        div.id = `${type.name}-blk`;

        div.innerHTML = `
        <div class="type-image">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${type.idPokemon}.png" 
        alt="${type.name}">
        </div>
        <div class="type-info">
        <p class="type-name">${type.name.charAt(0).toUpperCase() + type.name.slice(1)}</p>
        </div>
        `;
        
        li.appendChild(div);
        typesListUl.appendChild(li);

        div.addEventListener('click', fetchPokemonByType);
    });
}

function displayType() {
    document.querySelector('.logo-title').style.display = 'none';
    document.querySelector('.search-buttons-container').style.display = 'none';
    document.querySelector('.control-pagination').style.display = 'none';
    pokemonList.innerHTML = '';

    typesPage.style.display = 'flex';

    generateTypes();
}

async function fetchPokemonByType(event) {
    pokemonList.innerHTML = '';

    const goBackBtn = document.createElement('button');
    goBackBtn.id = 'go-back-btn';
    goBackBtn.classList.add('close-btn');
    goBackBtn.innerHTML = "<- <u>Go Back</u>";
    goBackBtn.style.display = 'block';
    goBackBtn.style.marginTop = '1rem';
    goBackBtn.style.marginBottom = '1rem';

    goBackBtn.addEventListener('click', () => {
        pokemonList.innerHTML = '';
        typesPage.style.display = 'flex';
        goBackBtn.style.display = 'none';
        paginationControls.style.display = 'none';

        generateTypes();
    });

    mainContainer.prepend(goBackBtn);

    const id = event.currentTarget.id;
    const buttonType = id.replace('-blk', '');

    const response = await fetch(baseURL + `/type/${buttonType}`);
    const data = await response.json();
    
    typesPage.style.display = 'none';
    paginationControls.style.display = 'flex';
    paginationControls.style.justifyContent = 'center';
    
    try {
        const fetchPromises = data.pokemon.map(p => fetch(p.pokemon.url).then(response => response.json()));
        
        const pokemonsType = await Promise.all(fetchPromises);
        
        currentArray = pokemonsType;
        pokemonPage = 0;              
        
        for (let i = 0; i < pokemonBase && i < currentArray.length; i++) {
            showPokemon(currentArray[i]);
        }
    } catch (error) {
        console.log(error);
    }
}

typesButtons.forEach(button => button.addEventListener('click', fetchPokemonByType));

let input = '';

function saveInput() {
    input = nameId.value.trim().toLowerCase();
    nameId.value = '';
    return input;
}

searchButton.addEventListener('click', searchNameId);
nameId.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchNameId();
    }
});

async function searchNameId() {
    paginationControls.style.display = 'none';

    saveInput();

    if (input === '') {
        return;
    }

    try {
        const response = await fetch(baseURL + `/pokemon/${input}`);

        if(!response.ok) {
            pokemonList.innerHTML = '';
            errorMessage.style.display = 'block';
            console.error(`Error ${response.status}: Pokémon not found.`);
            return;
        }

        const data = await response.json();

        pokemonList.innerHTML = '';
        showPokemon(data);

    }
    catch (error) {
        console.log(error);
    }
}

closeHomeBtn.addEventListener('click', () => {
    document.querySelector('.logo-title').style.display = 'flex';
    document.querySelector('.search-buttons-container').style.display = 'flex';
    document.querySelector('.control-pagination').style.display = 'flex';

    typesPage.style.display = 'none';

    fetchAllPokemons();
});

surpriseBtn.addEventListener('click', async () => {
    paginationControls.style.display = 'none';
    pokemonList.innerHTML = "";
    
    const newId = Math.floor(Math.random() * 1025) + 1;

    try {
        const response = await fetch(baseURL + `/pokemon/${newId}`);
        const data = await response.json();

        pokemonList.innerHTML = '';
        showPokemon(data);
    }
    catch (error) {
        console.log(error);
    }

    const message = document.createElement('p');
    message.textContent = '¡Eureka! A random Pokémon just for you :)';
    message.classList.add('surprise-message');
    pokemonList.appendChild(message);
})


