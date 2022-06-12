import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import fetchCountryByName from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const BASE_URL = 'https://restcountries.com/v3.1';

function fetchCountryByName(countryName) {
  const url = `${BASE_URL}/name/${countryName}`;
  return fetch(url).then(response => response.json());
}

const refs = {
    searchInput: document.querySelector('#search-box'),
    countriesList: document.querySelector('.country-list'),
    countriesInfo: document.querySelector('.country-info')
}

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  const inputValue = event.target.value;

  fetchCountryByName(inputValue)
    .then(country => {
      if (country.message === 'Page Not Found') {
        refs.countriesList.innerHTML = '';
        refs.countriesInfo.innerHTML = '';
      }
      console.log(country);
      if (inputValue.length > 0 && inputValue.length < 2) {
        Notify.info(`Too many matches found. Please enter a more specific name.`);
        return;
      };
      if (country.status === 404) {
        Notify.failure(`Oops, there is no country with that name`);
        refs.countriesList.innerHTML = '';
        refs.countriesInfo.innerHTML = '';
        return;
      }
      if (country.length > 2) {
        console.log(country);
        renderCountryList(country);
          
      } else {
        renderCountryCard(country[0]);
        refs.countriesList.innerHTML = '';
      }
    })
    .catch(error => {
      console.log(error);
    })
}

function renderCountryList (data) {
  data.map(country => {
    const li = document.createElement('li');
    li.innerHTML = `<img src="${country.flags.svg}" alt="flag" class="flag" width=30px>
        <a href="#" class="country-list__link" data-name="${country.name.official}">${country.name.official}</a>
        `;
    li.classList.add('country-list__item');
    refs.countriesList.append(li);
    })
};

function renderCountryCard({flags, name, capital, population, languages}) {
  const div = document.createElement('div');
          div.innerHTML = `<div class="wrapper">
          <img src="${flags.svg}" alt="flag" class="flag" width=50px></img>
          <h1 class="country">${name.official} </h1>
      </div>
      <p class="capital">Capital: ${capital}</p>
      <p class="population">Population: ${population}</p>
      <p class="language">Language: ${Object.values(languages)}</p>`;
  div.classList.add('card');
  refs.countriesInfo.append(div);
}
