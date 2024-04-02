import axios from 'axios';

// Встановлюємо базову URL для всіх запитів Axios
axios.defaults.baseURL = 'https://pixabay.com/api/';

const API_KEY = '42552421-44c442bdd9fc0080a82eeb482';

async function searchImages(query, page, perPage) {
  const response = await axios.get(
    `?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response;
}
export default searchImages;
