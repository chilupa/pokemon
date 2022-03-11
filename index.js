const thisForm = document.getElementById("myForm");
const inputSearch = document.getElementById("search");
const cardBack = document.querySelector(".flip-card-back");
const carousel = document.querySelector(".carousel");
const carouselContainer = document.querySelector(".carouselContainer");
const card = document.querySelector(".flip-card");

const stats = document.createElement("div");
const abilities = document.createElement("div");
const moves = document.createElement("div");
const slide = document.createElement("div");

const pokemons = [];
const searchedPokemons = [];

const geyPokemonByNameOrId = async (searchValue) => {
  return await fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`);
};

function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

const initialLoad = () => {
  const searched = localStorage.getItem("searchedPokemon");
  const searchValue = localStorage.getItem("searchValue");

  const searchedPokemon = JSON.parse(searched);

  inputSearch.value = JSON.parse(searchValue);

  if (searchedPokemon) {
    card.style.display = "block";
    setInnerHtmlOfCard(searchedPokemon);
  }
};

thisForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  card.style.display = "block";

  const searchValue = document.getElementById("search").value;

  const response = await geyPokemonByNameOrId(searchValue);

  if (response.status === 200) {
    const result = await response.json();

    localStorage.setItem("searchedPokemon", JSON.stringify(result));

    searchedPokemons.push(result);

    const uniqueSearchedPokemons = getUniqueListBy(searchedPokemons, "id");

    localStorage.setItem(
      "uniqueSearchedPokemons",
      JSON.stringify(uniqueSearchedPokemons)
    );

    localStorage.setItem("searchValue", JSON.stringify(inputSearch.value));

    setInnerHtmlOfCard(result);
  }

  if (response.status === 404) {
    alert("Pokemon not found. Please try again.");
  }
});

const saveToCarousel = () => {
  carouselContainer.style.display = "block";
  const id = document.getElementById("search").value;
  const img = document.getElementById("pokemonImage").src;

  pokemons.push({ id, img });

  const uniquePokemons = getUniqueListBy(pokemons, "img");

  localStorage.setItem("savedPokemons", uniquePokemons);

  slide.innerHTML = `
  ${uniquePokemons
    .map((pokemon) => {
      return `<img class="carouselImg" onclick="displayOnDeck('${pokemon.id}')" src="${pokemon.img}"/>`;
    })
    .join("")}
    `;

  carousel.appendChild(slide);
};

const displayOnDeck = (pokemonId) => {
  const pokemons = localStorage.getItem("uniqueSearchedPokemons");
  const parsedPokemons = JSON.parse(pokemons);

  const selectedPokemon = parsedPokemons.find(
    (val) => val.id === JSON.parse(pokemonId)
  );

  setInnerHtmlOfCard(selectedPokemon);
};

const renderPokemonName = (pokemon) => {
  const pokemonNameEl = document.querySelector(".pokemonName");
  pokemonNameEl.textContent = pokemon.forms[0].name;
};

const renderStats = (pokemon) => {
  stats.innerHTML = `
          <div class="stats">
  <div class="title">Stats</div>
    ${pokemon.stats
      .slice(0, 3)
      .map((stat) => {
        return `<div>${stat.stat.name}: ${stat.base_stat}</div>`;
      })
      .join("")}
  </div>`;

  cardBack.appendChild(stats);
};

const renderAbilities = (pokemon) => {
  abilities.innerHTML = `  <div class="abilities">
  <div class="title">Abilities</div>
  ${pokemon.abilities
    .slice(0, 3)
    .map((ability) => {
      return `<div>${ability.ability.name}</div>`;
    })
    .join("")}
  <div>`;

  cardBack.appendChild(abilities);
};

const renderMoves = (pokemon) => {
  moves.innerHTML = `   <div class="moves">
  <div class="title">Moves</div>
  ${pokemon.moves
    .slice(0, 3)
    .map((move) => {
      return `<div>${move.move.name}</div>`;
    })
    .join("")}
  <div>`;

  cardBack.appendChild(moves);
};

const setInnerHtmlOfCard = (pokemon) => {
  document.getElementById("pokemonImage").src = pokemon.sprites.front_default;

  renderPokemonName(pokemon);
  renderStats(pokemon);
  renderAbilities(pokemon);
  renderMoves(pokemon);
};
