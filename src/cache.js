const CacheTTL = 12 * 3600 * 1000;
const MaxCacheSize = 3000;

const cacheStore = new Map();

function trimCache() {
  const tobeRemoved = [];
  const now = Date.now();
  for (var [key, value] of cacheStore) {
    if (now - value.time >= CacheTTL) {
      tobeRemoved.push(key);
    }
  }
  tobeRemoved.forEach(function (key) {
    cacheStore.delete(key);
  });
}

exports.getCache = function (url) {
  const item = cacheStore.get(url);
  if (item && Date.now() - item.time < CacheTTL) {
    return item.data;
  }
  return null;
}

exports.setCache = function (url, data) {
  cacheStore.set(url, {
    time: Date.now(),
    data
  });
  if (cacheStore.size > MaxCacheSize) {
    trimCache();
  }
}

