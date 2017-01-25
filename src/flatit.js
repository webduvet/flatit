
/** *************************************
 *                FLATIT
 **************************************** */

var _path = require('./path.js');

function mapSurrogateKey(key) {
  return function (model, index) {
    return {
      model,
      key: Object.assign({}, key)
    };
  };
}
/**
 * @param {Object} surrogate key inheritted from parent level or undefined
 * @param {Object} keymap or array of keys to create surrogate key
 * @returns {function} taking object and index to create the variations of
 * surrogate key for individuals entries in the collection
 */
function combineSurrogateKey(surrogateKey, keyMap) {
  return function (index, object) {
    return keyMap.reduce((combined, k) => {
      const combinedKey = Object.assign({}, combined);
      if (!k.prop.length) {
        combinedKey[k.name] = index;
      } else {
        combinedKey[k.name] = _path(k.prop, object);
      }
      return combinedKey;
    }, surrogateKey);
  };
}

/**
 * @returns {function} reducer function for individual levels from nesting
 */
function entryReducer(map, surrogateKey) {
  const createEntryKey = combineSurrogateKey(surrogateKey, _path(['0', 'key'], map));
  return function (result, entry, index) {
    //return result.concat(flat(
          //entry,
          //map.slice(1),
          //createEntryKey(index, entry)));
    return [
      ...result,
      ...flat(
          entry,
          map.slice(1),
          createEntryKey(index, entry))
    ];
  };
};

/**
 * recursivly is called on each level of the object
 * depending on the map
 * @param {array} collection to be falttened
 * @param {objec} map for the level
 * @param {Object} surrogate key, not mandatory
 *
 * @returns {Array} new flatten collectio 
 */
function flat(collection, map, surrogateKey) {
  return map.length
    ?
    [].concat(_path(map[0].path, collection))
      .reduce(entryReducer(map, surrogateKey), [])
    :
    [].concat(collection)
      .map(mapSurrogateKey(surrogateKey))
    ;
}

module.exports = flat;
