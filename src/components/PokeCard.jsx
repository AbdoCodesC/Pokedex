import { useState, useEffect } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";

export default function PokeCard({ selectedPokemon }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false); // Changed from null to false

  const { name, height, abilities, stats, types, moves, sprites } = data || {};

  const imgList = Object.keys(sprites || {}).filter((val) => {
    if (!sprites[val]) return false;
    if (["versions", "other"].includes(val)) return false;
    return true;
  });

  async function fetchMoveData(move, moveUrl) {
    if (loadingSkill || !moveUrl) return;
    setLoadingSkill(true);

    try {
      // Check cache for move
      let cache = {};
      if (localStorage?.getItem("pokemon-moves")) {
        cache = JSON.parse(localStorage.getItem("pokemon-moves"));

        if (move in cache) {
          setSkill(cache[move]);
          console.log("Found move in cache!");
          return;
        }
      }

      const res = await fetch(moveUrl);
      const moveData = await res.json();

      // Fixed the comparison operator
      const description = moveData?.flavor_text_entries?.find(
        (val) => val.version_group?.name === "firered-leafgreen"
      )?.flavor_text;

      const skillData = {
        name: move,
        description: description,
      };

      setSkill(skillData);
      cache[move] = skillData;
      localStorage.setItem("pokemon-moves", JSON.stringify(cache));
    } catch (err) {
      console.error("Error fetching move data:", err);
    } finally {
      setLoadingSkill(false);
    }
  }

  useEffect(() => {
    if (loading) return;

    async function fetchPokemonData() {
      try {
        // Check cache first
        let cache = {};
        if (localStorage?.getItem("pokedex")) {
          cache = JSON.parse(localStorage.getItem("pokedex"));

          if (selectedPokemon in cache) {
            setData(cache[selectedPokemon]);
            console.log("Found pokemon in cache!");
            return;
          }
        }

        setLoading(true);
        const baseUrl = "https://pokeapi.co/api/v2/";
        const suffix = `pokemon/${getPokedexNumber(selectedPokemon)}`;
        const finalUrl = baseUrl + suffix;

        const res = await fetch(finalUrl);
        const pokemonData = await res.json();

        setData(pokemonData);
        console.log("Fetched pokemon data!");

        cache[selectedPokemon] = pokemonData;
        localStorage.setItem("pokedex", JSON.stringify(cache));
      } catch (err) {
        console.error("Error fetching Pokemon data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemonData();
  }, [selectedPokemon]);

  if (loading || !data) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="poke-card">
      {skill && (
        <Modal handleCloseModal={() => setSkill(null)}>
          <div>
            <h6>Name</h6>
            <h2 className="skill-name">{skill.name.replaceAll("-", " ")}</h2>
          </div>
          <div>
            <h6>Description</h6>
            <p>{skill.description}</p> {/* Fixed spelling */}
          </div>
        </Modal>
      )}
      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>
      <div className="type-container">
        {types.map((type, index) => (
          <TypeCard type={type.type.name} key={index} />
        ))}
      </div>
      <img
        src={`/pokemon/${getFullPokedexNumber(selectedPokemon)}.png`}
        alt={`${name}-large-img`}
        className="default-img"
      />
      <div className="img-container">
        {imgList.map((spriteUrl, spriteIndex) => {
          const imgUrl = sprites[spriteUrl];
          return (
            <img
              src={imgUrl}
              key={spriteIndex}
              alr={`${name}-img-${spriteUrl}`}
            />
          );
        })}
      </div>
      <h3>Stats</h3>
      <div className="stats-card">
        {stats.map((statObj, statIndex) => {
          const { stat, base_stat } = statObj;
          return (
            <div key={statIndex} className="stat-item">
              <p>{stat?.name.replaceAll("-", " ")}</p>
              <p>{base_stat}</p>
            </div>
          );
        })}
      </div>
      <h3>Moves</h3>
      <div className="pokemon-move-grid">
        {moves.map((moveObj, movIndex) => {
          return (
            <button
              className="button-card pokemon-move"
              key={movIndex}
              onClick={() => {
                fetchMoveData(moveObj?.move?.name, moveObj?.move?.url);
              }}
            >
              <p>{moveObj?.move?.name.replaceAll("-", " ")}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
