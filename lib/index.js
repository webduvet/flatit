'use strict';

function _path(seq, o) {
  if (!seq.length || o == undefined) {
    return o;
  }
  return _path(seq.slice(1), o[seq[0]]);
}

/** *************************************
 *                FLATIT
 **************************************** */
function mapTemplate(template) {
  return function(o) {
    if (!template) {
      return o; 
    }
    return Object.keys(template)
      .reduce((model, prop) => {
        model[prop] = o[prop];
        return Object.assign({}, model);
      }, Object.assign({}, template));
  }
}

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
 * @returns {function} taking object and index to create te variations of
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
    _path(map[0].path, collection)
      .reduce(entryReducer(map, surrogateKey), [])
    :
    [].concat(collection)
      .map(mapSurrogateKey(surrogateKey))
    ;
}

/**
 * maps existing object to given schema which is effectivelly
 * a filter on existing property
 * TODO more advanced mapper possible to actually modify the data
 *
 * @param {Object} template for the new object
 * @returns {Function} mapper function accpeting only the object of the form
 * { key, model }
 */
function templateMapper(schema) {
  if (!schema) {
    return function(el) { return el; };
  }
  return function(el) {
    return Object.assign({}, {
      key: el.key,
      model: mapTemplate(schema)(el.model)
    });
  }
}

/**
 * @param {object} collection, nested object
 * @param {Array`} set of rules how to flatten the data
 * array is to contain information about every property containing data to be flatten
 * e.g. { delegates: [array], conferences: [array]}
 * doc is to contain array of 2 items each describing the individueal data we want to extract
 * doc example
    const schema = [{
      mapper: ssrMap,
      prop: 'ssrs',
    }, {
      mapper: seatMap,
      prop: 'seats',
    }, {
      mapper: checkinMap,
      prop: 'checkin',
    }, {
      mapper: conferenceMap,
      prop: 'days'
    }]
    the above crates 4 arrays of flatten structures and uses 4 different mappers to
    extract data

    path example:
    const checkinMap = [{
      key: [{
        prop: ['num'],
        name: 'delegate',
      }],
      path: ['delegates'],
    }, {
      key: [{
        prop: [],
        name: 'conference',
      }],
      path: ['dayCheckin'],
    }, {
      key: [{
        prop: [],
        name: 'day',
      }],
      path: [],
    }];
 *
 *
 * the above example creates flat structure for checkin even though it only exists
 * as nested property within passenger object
 * each level represent level of nesting in existing object
 * key is the base for crating surrogate key
 *    containing prop which is going property path relative to the level
 *    or emptry array if it is only index
 * path containd the path to the level, if empty it is only nested array
 *
 */
function normalize(collection, doc) {
  return doc
    .map(function(item) {
      return {
        id: item.prop,
        data: [].concat(item.retain ? { model: _path([item.prop], collection) } : flat(collection, item.mapper))
          .map(templateMapper(item.template))
      };
    });
}

module.exports = normalize;
