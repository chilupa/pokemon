const thisForm = document.getElementById("myForm");
const inputSearch = document.getElementById("search");
const cardBack = document.querySelector(".flip-card-back");
const carousel = document.querySelector(".carousel");
const carouselContainer = document.querySelector(".carouselContainer");
const card = document.querySelector(".flip-card");

const pokemonEl = document.createElement("div");
const saveBtn = document.createElement("div");
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

  const result = await response.json();

  localStorage.setItem("searchedPokemon", JSON.stringify(result));

  searchedPokemons.push(result);

  const uniqueSearchedPokemons = getUniqueListBy(searchedPokemons, "id");

  localStorage.setItem(
    "uniqueSearchedPokemons",
    JSON.stringify(uniqueSearchedPokemons)
  );

  localStorage.setItem("searchValue", JSON.stringify(inputSearch.value));

  const searchedPokemonImg = result.sprites.front_default;
  const searchedPokemonId = result.id;

  setInnerHtmlOfCard(result);

  saveBtn.innerHTML = `
   <div>
   <button style="margin-top: 24px" onclick="saveToCarousel('${searchedPokemonImg}', '${searchedPokemonId}')">Save</button>
   </div>
   `;

  card.appendChild(saveBtn);
});

const saveToCarousel = (img, id) => {
  carouselContainer.style.display = "block";
  pokemons.push({ id, img });

  const uniquePokemons = getUniqueListBy(pokemons, "id");

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

const setInnerHtmlOfCard = (pokemon) => {
  document.getElementById("pokemonImage").src = pokemon.sprites.front_default;

  pokemonEl.innerHTML = `

      <div class="pokemonName">${pokemon.forms[0].name}</div>
          <div class="stats">
  <div class="title">Stats</div>
    ${pokemon.stats
      .slice(0, 3)
      .map((stat) => {
        return `<div>${stat.stat.name}: ${stat.base_stat}</div>`;
      })
      .join("")}
  </div>

  <div class="abilities">
  <div class="title">Abilities</div>
  ${pokemon.abilities
    .slice(0, 3)
    .map((ability) => {
      return `<div>${ability.ability.name}</div>`;
    })
    .join("")}
  <div>

  <div class="moves">
  <div class="title">Moves</div>
  ${pokemon.moves
    .slice(0, 3)
    .map((move) => {
      return `<div>${move.move.name}</div>`;
    })
    .join("")}
  <div>
`;

  cardBack.appendChild(pokemonEl);
};
