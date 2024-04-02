// Імпорт бібліотек та модулів
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import searchImages from './js/pixabay-api';
import { renderGallery } from './js/render-functions';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');
const loader = document.querySelector('.loader');

let query = '';
let page = 1;
const perPage = 15;

let galleryLightbox;

clearGallery();

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

// Загальна обробка даних про зображення
function handleImageData(data) {
  loader.style.display = 'none';

  const hasNoImages =
    data.totalHits === 0 || (data.hits && data.hits.length === 0);

  if (hasNoImages && gallery.innerHTML.trim() === '') {
    alertNoImagesFound();
  } else {
    const totalPages = Math.ceil(data.totalHits / perPage);

    if (page > totalPages) {
      loadMoreBtn.classList.add('is-hidden');
      alertEndOfSearch();
    } else {
      const currentImagesCount =
        gallery.querySelectorAll('.gallery-item').length;

      if (currentImagesCount >= data.totalHits) {
        // Якщо кількість завантажених зображень стає більшою або дорівнює totalHits
        loadMoreBtn.classList.add('is-hidden');
        alertEndOfSearch();
      } else {
        renderGallery(data.hits);
        galleryLightbox = new SimpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionDelay: 250,
        }).refresh();

        loadMoreBtn.classList.remove('is-hidden');
        smoothScrollBy(getCardHeight() * 2);
      }
    }
  }
}

// Пошук та завантаження зображень
function onSearchForm(event) {
  event.preventDefault();
  page = 1;
  query = event.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

  if (query === '') {
    alertNoEmptySearch();
    return;
  }

  // Очищення поля введення
  const searchInput = event.currentTarget.searchQuery;
  if (searchInput) {
    searchInput.value = '';
  }

  searchImages(query, page, perPage)
    .then(({ data }) => {
      handleImageData(data);
    })
    .catch(error => console.log(error));
}

function getCardHeight() {
  const card = document.querySelector('.gallery-item');
  const cardHeight = card ? card.getBoundingClientRect().height : 0;
  return cardHeight;
}

function smoothScrollBy(distance) {
  window.scrollBy({
    top: distance,
    behavior: 'smooth',
  });
}

// Очищення контейнера галереї
function clearGallery() {
  gallery.innerHTML = '';
}

// Завантаження додаткових зображень
function onLoadMoreBtn() {
  loader.style.display = 'block';

  page += 1;
  galleryLightbox.destroy();

  searchImages(query, page, perPage)
    .then(({ data }) => {
      const currentImagesCount =
        gallery.querySelectorAll('.gallery-item').length;

      if (currentImagesCount >= data.totalHits) {
        // Якщо кількість завантажених зображень стає більшою або дорівнює totalHits
        loadMoreBtn.classList.add('is-hidden');
        alertEndOfSearch();
      } else {
        handleImageData(data);
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      loader.style.display = 'none';
    });
}
// Порожнє введення
function alertNoEmptySearch() {
  iziToast.error({
    title: 'Error',
    message:
      'The search string cannot be empty. Please specify your search query.',
  });
}

// Повідомлення про завершення колекції зображень
function alertEndOfSearch() {
  iziToast.error({
    title: '',
    message: "We're sorry, but you've reached the end of search results.",
    position: 'bottomRight',
  });
}

// Зображення не знайдено
function alertNoImagesFound() {
  iziToast.error({
    title: 'Info',
    message:
      'Sorry, there are no images matching your search query. Please try again!',
    position: 'bottomRight',
  });
}
