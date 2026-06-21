import { TIMEOUT_THRESHOLD_SECONDS } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJson = async url => {
  try {
    const fetchPromise = fetch(url);
    const response = await Promise.race([
      fetchPromise,
      timeout(TIMEOUT_THRESHOLD_SECONDS),
    ]);
    const { message, data } = await response.json();
    if (!response.ok) throw new Error(`${message} (${response.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJson = async (url, body) => {
  try {
    const fetchPromise = fetch(url, {
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });
    const response = await Promise.race([
      fetchPromise,
      timeout(TIMEOUT_THRESHOLD_SECONDS),
    ]);
    const { message, data } = await response.json();
    if (!response.ok) throw new Error(`${message} (${response.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

class LocalStorage {
  getBookmarks() {
    if (!localStorage.getItem('bookmarks')) return [];
    return JSON.parse(localStorage.getItem('bookmarks'));
  }

  addBookmark(recipe) {
    const bookmarks = this.getBookmarks();
    this.setBookmarks([...bookmarks, recipe]);
    return;
  }

  removeBookmark(recipe) {
    const bookmarks = this.getBookmarks().filter(r => r.id !== recipe.id);
    this.setBookmarks(bookmarks);
    return;
  }

  setBookmarks(bookmarks) {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    return;
  }
}

export const localStorageInstance = new LocalStorage();
