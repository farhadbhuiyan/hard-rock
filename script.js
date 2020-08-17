/*===============================================================
Access all necessary elemens
=================================================================*/

const search = document.getElementById('search-key');
const searchButton = document.getElementById('search-button');
const result = document.getElementById('result');
result.innerHTML = '';
const showLyrics = document.getElementById('display-lyrics');

/*===============================================================
Add event listener on search button
=================================================================*/

searchButton.addEventListener('click', e => {
  e.preventDefault();

  const searchKey = search.value.trim();

  if (!searchKey) {
    alert('Please input a key to search...');
  } else {
    searchSongs(searchKey);
  }
  result.innerHTML = '';
  showLyrics.innerHTML = '';
});

/*===============================================================
Add event listener on get lyrics button
=================================================================*/
result.addEventListener('click', e => {
  const clicked = e.target;

  if (clicked.tagName === 'BUTTON') {
    const artistName = clicked.getAttribute('artist-name');
    const songTitle = clicked.getAttribute('song-title');

    displayLyrics(artistName, songTitle);
  }
});


/*===============================================================
function for search Songs
=================================================================*/

function searchSongs() {
  const searchKey = search.value;
  fetch(`https://api.lyrics.ovh/suggest/${searchKey}`)
    .then(res => res.json())
    .then(data => {
      for (let i = 0; i < 10; i++) {
        result.innerHTML += `
        <div class="single-result">
              <div class=" row align-items-center my-3 p-3">
                  <div class="col-md-3">
                      <img class="album-cover" src="${data.data[i].album.cover_small}" alt="" srcset="">
                      <a class="fency-button" href="${data.data[i].artist.link}" target="_blank">
                      <i class="fas fa-headphones"></i>
                        Listen
                      </a>
                  </div>
                  <div class="col-md-6">
                      <h3 class="lyrics-name">${data.data[i].title}</h3>
                      <p class="author lead">Album by <span class="artist-name">${data.data[i].artist.name}</span></p>
                  </div>
                  <div class="col-md-3 text-md-right text-center">
                      <button class="btn btn-success" artist-name="${data.data[i].artist.name}" song-title="${data.data[i].title}">Get Lyrics</button>
                  </div>
              </div>
              <div class="col">
                <div id="display-lyrics">

                </div>
              </div>
            </div>
        `;
      }
    })
}


/*===============================================================
function for display lyrics
=================================================================*/

async function displayLyrics(artist, title) {
  const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
  const data = await res.json();

  const lyrics = data.lyrics;
  if (lyrics === undefined) {
    showLyrics.innerHTML = `<p class="not-found">Sorry..! This Lyric is not available at this moment..!</p>`;
  } else {
    showLyrics.innerHTML = `
    <h2 class="text-success text-center mb-4"><strong>${artist}</strong> - ${title}</h2>
    <pre class="text-center text-white">${lyrics}</pre>
    `;
  }

  result.innerHTML = '';
}
