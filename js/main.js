let countries;

/* filter options */
const filter = {
  nameAsc: true,
  capitalAsc: false,
  populationAsc: false
};

const countriesWrapper = document.querySelector(".countries-wrapper");
const searchInput = document.querySelector(".search-input");
const buttons = document.querySelector(".buttons");

/* fetch countries data */
fetch("https://restcountries.eu/rest/v2/all")
  .then(res =>
    res.json().then(response => {
      countries = response;
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

/* filter countries based on search input */
const filterCountries = (arr, search) => {
  search = search.toLowerCase();
  const filteredCountries = arr.filter(country => {
    const { name, capital, languages } = country;
    const isName = name.toLowerCase().includes(search);
    const isCapital = capital.toLowerCase().includes(search);
    const isLanguages = languages
      .map(lang => lang.name)
      .join(" ")
      .toLowerCase()
      .includes(search);
    return isName || isCapital || isLanguages;
  });
  const result = search === "" ? arr : filteredCountries;
  return result;
};

/* sort input by name, capital, language*/
const sortByType = (arr, type) => {
  const countries = [...arr];
  const sortedCountries = countries.sort((a, b) => {
    if (a[type] > b[type]) return -1;
    if (a[type] < b[type]) return 1;
    return 0;
  });
  return sortedCountries;
};

/* sort countries in reverse order */
const reverseCountries = arr => {
  const countries = [...arr];
  return countries.reverse();
};

/* apply new filter and update countries when button is clicked */
buttons.addEventListener("click", e => {
  let type = e.target.className;
  let sortedCountries;

  switch (type) {
    case "name":
      sortedCountries =
        searchInput.value === ""
          ? reverseCountries(countries)
          : sortByType(filterCountries(countries, searchInput.value), type);
      if (filter.nameAsc) {
        filter.nameAsc = false;
        renderCountries(sortedCountries);
      } else {
        const copiedsortedCountries = [...sortedCountries];
        const reversed = reverseCountries(copiedsortedCountries);
        renderCountries(reversed);
        filter.nameAsc = true;
      }
      break;
    case "capital":
      sortedCountries =
        searchInput.value === ""
          ? sortByType(countries, type)
          : sortByType(filterCountries(countries, searchInput.value), type);
      if (filter.capitalAsc) {
        filter.capitalAsc = false;
        renderCountries(sortedCountries);
      } else {
        filter.capitalAsc = true;
        const copiedSortedCountries = [...sortedCountries];
        const reversed = reverseCountries(copiedSortedCountries);
        renderCountries(reversed);
      }
      break;
    case "population":
      sortedCountries =
        searchInput.value === ""
          ? sortByType(countries, type)
          : sortByType(filterCountries(countries, searchInput.value), type);
      if (filter.populationAsc) {
        filter.populationAsc = false;
        renderCountries(sortedCountries);
      } else {
        filter.populationAsc = true;
        let copiedSortedCountries = [...sortedCountries];
        let reversed = reverseCountries(copiedSortedCountries);
        renderCountries(reversed);
      }
      break;
    default:
      sortedCountries = renderCountries(countries);
  }
});

/* apply new search criteria and update countries when search input changes */
searchInput.addEventListener("input", e => {
  let searchTerm = e.target.value;
  renderCountries(filterCountries(countries, searchTerm));
});
