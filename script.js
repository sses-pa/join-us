const button = document.querySelector('.menu-button');
const nav = document.querySelector('#main-nav');
button?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  button.setAttribute('aria-expanded', String(isOpen));
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  button?.setAttribute('aria-expanded', 'false');
}));

const albums = Object.fromEntries((window.ALBUMS || []).map((album) => [album.id, album]));
const meetingPhotos = ['handover', 'semester-end', 'committee-meeting'].flatMap((id) => albums[id]?.photos || []);
albums.meetings = { id: 'meetings', title: '家委們的討論時光', photos: meetingPhotos };
const dialog = document.querySelector('#album-dialog');
const albumTitle = document.querySelector('#album-title');
const albumCount = document.querySelector('#album-count');
const albumPhotos = document.querySelector('#album-photos');
const exchangeGrid = document.querySelector('#exchange-grid');
const exchangeAlbumIds = new Set(['houfeng', 'dakeng', 'garden-resort', 'blue-magpie', 'outing']);

function openAlbum(id) {
  const album = albums[id];
  if (!album || !dialog) return;
  albumTitle.textContent = album.title;
  albumCount.textContent = `共 ${album.photos.length} 張照片`;
  albumPhotos.innerHTML = album.photos.map((photo, index) => `
    <figure><img src="./${photo.src}" alt="${album.title}活動照片 ${index + 1}" loading="lazy" decoding="async"></figure>
  `).join('');
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  albumPhotos.scrollTop = 0;
}

function closeAlbum() {
  dialog?.close();
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-album]').forEach((card) => {
  card.addEventListener('click', () => openAlbum(card.dataset.album));
});

if (exchangeGrid) {
  exchangeGrid.innerHTML = (window.ALBUMS || []).filter((album) => exchangeAlbumIds.has(album.id)).map((album) => `
    <button class="exchange-card" type="button" data-album="${album.id}">
      <img src="./${album.photos[0].src}" alt="${album.title}相簿封面" loading="lazy">
      <span><strong>${album.title}</strong><small>${album.photos.length} 張照片</small></span>
    </button>
  `).join('');
  exchangeGrid.querySelectorAll('[data-album]').forEach((card) => card.addEventListener('click', () => openAlbum(card.dataset.album)));
}

document.querySelector('.close-album')?.addEventListener('click', closeAlbum);
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) closeAlbum();
});
dialog?.addEventListener('close', () => { document.body.style.overflow = ''; });
