import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => setCountries(response.data));
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredCountries([]);
      return;
    }

    const filtered = countries.filter(country =>
      country.name.common.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [search, countries]);

  return (
    <div>
      <h1>Buscador de Países</h1>
      <input
        type="text"
        placeholder="Buscar país..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredCountries.length > 10 ? (
        <p>Demasiadas coincidencias, especifica más la búsqueda.</p>
      ) : filteredCountries.length > 1 ? (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.cca2}>{country.name.common}</li>
          ))}
        </ul>
      ) : filteredCountries.length === 1 ? (
        <CountryDetail country={filteredCountries[0]} />
      ) : (
        <p>No se encontraron países.</p>
      )}
    </div>
  );
}

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p><strong>Capital:</strong> {country.capital}</p>
      <p><strong>Área:</strong> {country.area} km²</p>
      <p><strong>Idiomas:</strong></p>
      <ul>
        {Object.values(country.languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.svg} alt={`Bandera de ${country.name.common}`} width="200" />
    </div>
  );
}

export default App;
