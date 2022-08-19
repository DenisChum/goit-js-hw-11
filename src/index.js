import './sass/main.scss';
import fetchPix from './js/fetch-pix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import scroll from './js/scroll';
import arrowTop from './js/arrow';

arrowTop();

  const formAdd= document.querySelector('#search-form')
  const gallery= document.querySelector('.gallery')
  const btnLoadMore= document.querySelector('.load-more')
  const endcollectionText= document.querySelector('.end-collection-text')

//==============================================
// очищаем галлерею, при сабмите, запускаем функцию Онформсабмит,при этом убираем кнопку.
formAdd.addEventListener('submit', event => {
  gallery.innerHTML = '';
  onFormSubmit(event);
  btnLoadMore.classList.add('is-hidden');
});

let searchingElem = '';
let page = 1;
let perPage = 0;

async function onFormSubmit(event) {
  event.preventDefault();
  // console.log(event)
// Получаем значение инпута
  searchingElem = event.currentTarget.searchQuery.value;  
  if (searchingElem.trim() === '') {
    Notify.failure('Please enter search parameters');
    return;
  } page = 1;
  const response = await fetchPix(searchingElem, page);
  btnLoadMore.classList.add('is-hidden');
  perPage = response.hits.length;
  // console.log(perPage)
  console.log(page)
  // console.log(response.totalHits)
  if (response.totalHits <= perPage) {   
    addISHidden();
  } else {
    removeIsHidden();
  } 
  if (response.totalHits === 0) {
    clearGalleryHTML();
    endcollectionText.classList.add('is-hidden');
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again!'
    );
  }
  try {
    if (response.totalHits > 0) {
      Notify.info(`Hooray! We found ${response.totalHits} images`);
      clearGalleryHTML();
      renderCard(response.hits);
      // formAdd.reset()
    }
  } catch (error) {
    console.log(error);
  }
}
// =========================================
btnLoadMore.addEventListener('click', loadMore);


async function loadMore() {
  try {
    btnLoadMore.disabled = true;
    pageIncrement();
   console.log(page);
    const response = await fetchPix(searchingElem, page);
    renderCard(response.hits);
    perPage += response.hits.length;
    scroll();

    if (perPage >= response.totalHits) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      addISHidden();
    }  
    btnLoadMore.disabled = false;
  } catch (error) {
    console.log(error);
  }
}

//=======================================
function addISHidden() {
  btnLoadMore.classList.add('is-hidden');
  endcollectionText.classList.remove('is-hidden');
}
function removeIsHidden() {
  btnLoadMore.classList.remove('is-hidden');
  endcollectionText.classList.add('is-hidden');
}
function pageIncrement() {
  page += 1;
}
function clearGalleryHTML() {
  gallery.innerHTML = '';
}
function lightbox() {
  let lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
  lightbox.refresh();
}
function renderCard(array) {
  const cardMarkup = array.map(({ largeImageURL, webformatURL, likes, views, comments, downloads, tags }) => 
  `<div class='photo-card'>
    <a class="gallery__item" href='${largeImageURL}'>
      <img src='${webformatURL}' alt='${tags}' loading="lazy" width="368" height="242"/>
    </a>
    <div class="info">
    <p class="info-item">
      <b>Likes </br><span class='text'>${likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views  </br><span class='text'>${views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments  </br><span class='text'>${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads  </br><span class='text'>${downloads}</span></b>
    </p>
  </div>
</div>`).join('');
  gallery.insertAdjacentHTML('beforeend', cardMarkup);
  lightbox();
}
