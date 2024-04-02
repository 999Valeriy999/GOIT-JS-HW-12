import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

export const renderGallery = images => {
  const gallery = document.querySelector('.gallery');

  // Перевіряємо, чи є зображення
  if (images.length === 0) {
    // Виводимо повідомлення, якщо масив порожній
    iziToast.info({
      title: 'Info',
      message:
        'Sorry, there are no images matching your search query. Please try again!',
    });
  }

  // Створюємо розмітку для галереї
  const markup = images
    .map(
      ({
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <a class="gallery__link" href="${largeImageURL}">
        <div class="gallery-item" id="${id}">
          <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item"><b>Likes</b>${likes}</p>
            <p class="info-item"><b>Views</b>${views}</p>
            <p class="info-item"><b>Comments</b>${comments}</p>
            <p class="info-item"><b>Downloads</b>${downloads}</p>
          </div>
        </div>
      </a>`
    )
    .join('');

  // Вставляємо розмітку у контейнер галереї
  gallery.insertAdjacentHTML('beforeend', markup);

  // Створюємо об'єкт SimpleLightbox
  const lightbox = new SimpleLightbox('.gallery-item', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  // Оновлюємо SimpleLightbox для обліку нових зображень
  lightbox.refresh();
};
