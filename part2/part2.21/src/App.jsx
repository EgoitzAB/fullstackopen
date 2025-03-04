import { useState, useEffect } from "react";
import axios from "axios";

const api_key = import.meta.env.VITE_SOME_KEY;

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => setCountries(response.data));
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredCountries([]);
      setSelectedCountry(null);
      return;
    }

    const filtered = countries.filter(country =>
      country.name.common.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCountries(filtered);
    setSelectedCountry(filtered.length === 1 ? filtered[0] : null);
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

      {selectedCountry ? (
        <CountryDetail country={selectedCountry} />
      ) :
        filteredCountries.length > 10 ? (
        <p>Demasiadas coincidencias, especifica más la búsqueda.</p>
      ) : filteredCountries.length > 1 ? (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.cca2}>{country.name.common}
              <button onClick={() => setSelectedCountry(country)}>Mostrar</button>
            </li>
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
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (country.capital) {
      const capital = country.capital[0];
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
        .then(response => setWeather(response.data));
    }
  }, [country]);

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
   
      {weather && (
        <div>
          <h3>Clima en {country.capital[0]}</h3>
          <p><strong>Temperatura:</strong> {weather.main.temp}°C</p>
          <p><strong>Viento:</strong> {weather.wind.speed} m/s</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Icono del clima" />
        </div>
      )}
   
    </div>
  );
}

export default App;
