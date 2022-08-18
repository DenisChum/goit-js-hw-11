import axios from 'axios';

export default async function fetchPixabay(data, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '29333326-6fb9af0c3a2e9f9abdbab7a92';
  const PARAMETRES = `key=${KEY}&q=${data}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  return await axios.get(`${BASE_URL}?${PARAMETRES}`).then(res => res.data);
}

