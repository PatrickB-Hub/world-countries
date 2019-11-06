let countries;
let totalPopulation = 0;

/* filter options */
const filter = {
  nameAsc: true,
  capitalAsc: false,
  populationAsc: false
};

const countriesWrapper = document.querySelector(".countries-wrapper");
const searchInput = document.querySelector(".search-input");
const buttons = document.querySelector(".buttons");
const graphWrapper = document.querySelector(".graph-wrapper");
const graphTitle = document.querySelector(".graph-title");
const graphButtons = document.querySelector(".graph-buttons");
const totalCountries = document.querySelector(".total-countries");
const matches = document.querySelector(".matches");
const scrollToTopButton = document.querySelector(".scroll-top-button");

/* fetch countries data */
fetch("https://restcountries.eu/rest/v2/all")
  .then(res =>
    res.json().then(response => {
      countries = response;
      totalPopulation = countries
        .map(country => country.population)
        .reduce((sum, current) => {
          console.log(sum, current);
          return sum + current;
        });
      console.log(totalPopulation);

      totalCountries.textContent = `Currently, there are ${countries.length} countries`;
      renderCountries(filterCountries(countries, searchInput.value));

      graphTitle.textContent = "10 Most populated countries in the world";
      renderPopulationGraph(mostPopulatedCountries());
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
    case "statistics":
      break;
    default:
      sortedCountries = renderCountries(countries);
  }
});

/* apply new search criteria and update countries when search input changes */
searchInput.addEventListener("input", e => {
  let searchTerm = e.target.value;
  let country =
    filterCountries(countries, searchTerm).length > 1 ? "countries" : "country";
  matches.innerHTML =
    searchInput.value != ""
      ? `<strong><b>${
          filterCountries(countries, searchTerm).length
        }</b></strong> ${country} satisified the search criteria`
      : "";
  renderCountries(filterCountries(countries, searchTerm));
  if (searchInput.value != "") {
    graphTitle.textContent = "World Population";
    renderPopulationGraph(filterCountries(countries, searchTerm));
  } else {
    graphTitle.textContent = "10 Most populated countries";
    renderPopulationGraph(mostPopulatedCountries());
  }
});

/* sort by ten most populated countries */
const mostPopulatedCountries = () =>
  sortByType(countries, "population").slice(0, 10);

/* sort by ten most spoken languages */
const mostSpokenLanguages = () =>
  sortByType(countLanguages(countries), "countries").slice(0, 10);

/* attach countries to their spoken languages */
const countLanguages = arr => {
  const langList = [];
  const langObjs = [];
  const langSet = new Set();
  arr.forEach(country => {
    let { languages } = country;
    for (const language of languages) {
      langList.push(language.name);
      langSet.add(language.name);
    }
  });
  for (const language of langSet) {
    const countries = langList.filter(lang => lang === language).length;
    langObjs.push({ language, countries });
  }
  return langObjs;
};

const createPopulationBar = ({ name, population }) => {
  let formatedName;
  /* use shorter names for usa and russia */
  if (name === "Russian Federation") formatedName = "Russia";
  else if (name === "United States of America") formatedName = "USA";
  else formatedName = name;

  const width = Math.ceil((population / totalPopulation) * 100);
  return `<div class="bars" >
              <div>${formatedName}</div>
              <div class="bar" style="width:${width}%;height:35px;"></div>
              <div>${population.toLocaleString()}</div>
            </div>`;
};

const renderPopulationGraph = arr => {
  let content = "";
  arr.forEach(country => (content += createPopulationBar(country)));
  graphWrapper.innerHTML = content;
};

const createLanguageBar = ({ language, countries }) => {
  return `<div class="bars">
              <div>${language}</div>
              <div class="bar" style="width:${countries}%;height:35px;"></div>
              <div>${countries}</div>
            </div>`;
};

const renderLanguagesGraph = arr => {
  let content = "";
  arr.forEach(country => (content += createLanguageBar(country)));
  graphWrapper.innerHTML = content;
};

graphButtons.addEventListener("click", e => {
  const type = e.target.className;
  if (type === "population") {
    graphTitle.textContent =
      "Ten countries with the highest population in the world";
    renderPopulationGraph(mostPopulatedCountries());
  } else {
    graphTitle.textContent = "Ten most widely spoken languages in the world";
    renderLanguagesGraph(mostSpokenLanguages());
  }
});

window.onscroll = () => scrollHandler();

/* show scrollToTopButton when user scrolls down 20px from top */
function scrollHandler() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)
    scrollToTopButton.style.display = "block";
  else scrollToTopButton.style.display = "none";
}

/* when the user clicks on the button, scroll to the top of the document */
scrollToTopButton.addEventListener("click", e => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});
