import { pokemons, getFullPokedexNumber } from "../utils/index";

export default function SideNav() {
  return (
    <nav>
      <div className="header">
        <h1 className="text-gradient">Pokédex</h1>
      </div>
      <input type="text" />
      {pokemons.map((pok, pokIndex) => (
        <button className={"nav-card"} key={pokIndex}>
          <p>{getFullPokedexNumber(pokIndex)}</p>
          <p>{pok}</p>
        </button>
      ))}
    </nav>
  );
}
