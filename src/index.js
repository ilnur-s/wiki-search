import './style.scss';
import axios from 'axios';

const form = document.querySelector('.search-form');
const olElement = document.querySelector('.article-cards');
const input = document.querySelector('.search-form__input');

const database = [];

const render = (state) => {
  while (olElement.firstChild) {
    olElement.removeChild(olElement.firstChild);
  }
  state.forEach((item) => {
    const aElement = document.createElement('a');
    aElement.href = `https://ru.wikipedia.org/?curid=${item.pageid}`;
    aElement.target = '_blank';
    const liElement = document.createElement('li');
    liElement.classList.add('article-card');
    liElement.textContent = item.title;
    aElement.append(liElement);
    olElement.append(aElement);
  });
  input.value = '';
};

const addArticles = async (searchValue) => {
  try {
    const endpoint = `https://ru.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=3&srsearch=${searchValue}`;
    const response = await axios.get(endpoint);
    if (!response.data.query.search.length) {
      input.value = '';
      throw new Error('Ошибка получения данных. Проверьте правильность ввода данных и попробуйте еще раз');
    }
    if (database) {
      database.splice(0, database.length);
    }
    database.push(...response.data.query.search);
    render(database);
  } catch (error) {
    // eslint-disable-next-line no-alert
    alert(error.message);
  }
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const value = formData.get('search-input').trim();
  addArticles(value);
});
