const countriesWrapper = document.querySelector(".countries-wrapper");

/* fetch countries data */
fetch("https://restcountries.eu/rest/v2/all")
  .then(res =>
    res.json().then(response => {
      let countries = response;
      renderCountries(countries);
    })
  )
  .catch(e => console.log(e));

/* create a single country card */
const createCountryCard = ({ name, capital, languages, population, flag }) => {
  const formatedCapital =
    capital.length > 0 ? `<span>Capital: </span>${capital}` : "";
  const formatedLanguage = languages.length > 1 ? `Languages` : `Language`;
  return `<div class="country-card">
              <div class="country-flag">
                <img src="${flag}" />
              </div>
              <h3 class="country-name">${name.toUpperCase()}</h3>
              <div class="country-text">
                <p>${formatedCapital}</p>
                <p><span>${formatedLanguage}: </span>${languages
    .map(lang => lang.name)
    .join(", ")}</p>
                <p><span>Population: </span>${population.toLocaleString()}</p>
              </div>
          </div>`;
};

/* render all country cards */
const renderCountries = arr => {
  let contents = "";
  arr.forEach(country => (contents += createCountryCard(country)));
  countriesWrapper.innerHTML = contents;
};
