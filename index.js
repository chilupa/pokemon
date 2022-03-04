const thisForm = document.getElementById("myForm");
const cardBack = document.querySelector(".flip-card-back");
const pokemonEl = document.createElement("div");
const x = document.querySelector(".flip-card");

thisForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  x.style.display = "block";

  const searchValue = document.getElementById("search").value;

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${searchValue}`
  );

  const result = await response.json();

  document.getElementById("pokemonImage").src = result.sprites.front_default;

  pokemonEl.innerHTML = `
  
        <div class="pokemonName">${result.forms[0].name}</div>
  <div class="stats">
  <div class="title">Stats</div>
      ${result.stats
        .slice(0, 4)
        .map((stat) => {
          return `<div>${stat.stat.name}: ${stat.base_stat}</div>`;
        })
        .join("")}
    </div>

    <div class="abilities">
    <div class="title">Abilities</div>
    ${result.abilities
      .slice(0, 4)
      .map((ability) => {
        return `<div>${ability.ability.name}</div>`;
      })
      .join("")}
    <div>

    <div class="moves">
    <div class="title">Moves</div>
    ${result.moves
      .slice(0, 4)
      .map((move) => {
        return `<div>${move.move.name}</div>`;
      })
      .join("")}
    <div>
  `;

  cardBack.appendChild(pokemonEl);
});

const flipCard = () => {
  console.log("flipped card clicked");
};

// var slideIndex = 1;
// showSlides(slideIndex);

// function plusSlides(n) {
//   showSlides((slideIndex += n));
// }

// function currentSlide(n) {
//   showSlides((slideIndex = n));
// }

// function showSlides(n) {
//   var i;
//   var slides = document.getElementsByClassName("mySlides");
//   var dots = document.getElementsByClassName("dot");
//   if (n > slides.length) {
//     slideIndex = 1;
//   }
//   if (n < 1) {
//     slideIndex = slides.length;
//   }
//   for (i = 0; i < slides.length; i++) {
//     slides[i].style.display = "none";
//   }
//   for (i = 0; i < dots.length; i++) {
//     dots[i].className = dots[i].className.replace(" active", "");
//   }
//   slides[slideIndex - 1].style.display = "block";
//   dots[slideIndex - 1].className += " active";
// }

// const saveToCarousel = () => {
//   console.log("save to carousel");
// };
