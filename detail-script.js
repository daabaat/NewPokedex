document.addEventListener("DOMContentLoaded", () => {
  const pokemonData = JSON.parse(localStorage.getItem("selectedPokemon"));
  if (pokemonData) {
    document.getElementById("pokemon-name").textContent =
      pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
    document.getElementById("pokemon-img").src =
      pokemonData.sprites.front_default;
    document.getElementById("pokemon-height").textContent =
      pokemonData.height / 10;
    document.getElementById("pokemon-weight").textContent =
      pokemonData.weight / 10;

    const types = pokemonData.types
      .map((typeInfo) => typeInfo.type.name)
      .join(", ");
    document.getElementById("pokemon-types").textContent = types;

    const abilities = pokemonData.abilities
      .map((abilityInfo) => abilityInfo.ability.name)
      .join(", ");
    document.getElementById("pokemon-abilities").textContent = abilities;
  } else {
    document.body.innerHTML = "<h1>No Pokémon data available</h1>";
  }
});
