import { useState } from "react";
import { pokemons, getFullPokedexNumber } from "../utils/index";

export default function SideNav({
  selectedPokemon,
  setSelectedPokemon,
  showSideMenu,
  handleCloseMenu,
}) {
  const [searchValue, setSearchValue] = useState("");
  const filteredPokemon = pokemons.filter(
    (pok, pokIndex) =>
      getFullPokedexNumber(pokIndex).includes(searchValue.toLowerCase()) ||
      pok.toLowerCase().startsWith(searchValue.toLowerCase())
  );
  return (
    <nav className={`${showSideMenu ? "open" : ""}`}>
      <div className={`header ${showSideMenu ? "open" : ""}`}>
        <button className="open-nav-button" onClick={handleCloseMenu}>
          <i className="fa-solid fa-arrow-left-long"></i>
        </button>
        <h1 className="text-gradient">Pokédex</h1>
      </div>
      <input
        type="text"
        placeholder="001 or Bulba.."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {filteredPokemon.map((pok, pokIndex) => {
        const truePokIndex = pokemons.indexOf(pok);
        return (
          <button
            onClick={() => {
              setSelectedPokemon(truePokIndex);
              handleCloseMenu();
            }}
            className={`nav-card ${
              pokIndex === selectedPokemon ? "nav-card-selected" : ""
            }`}
            key={pokIndex}
          >
            <p>{getFullPokedexNumber(truePokIndex)}</p>
            <p>{pok}</p>
          </button>
        );
      })}
    </nav>
  );
}
