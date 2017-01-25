'use strict';
var flatit = require('./flatit.js');
var mapit = require('./mapit.js');
var _path = require('./path.js');


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
function normalize(collection, doc, type) {
  function identityMapper(prop) {
    return el => Object.assign(el, {
      identity: prop
    });
  }
  function propReducer(acc, level) {
    const mapIdentity = identityMapper(level.prop);
    let mapped = flatit(collection, level.mapper)
      .map(mapit(level.template))
      .map(mapIdentity); 
    return acc.concat(mapped);
  }
  return doc
    .reduce(propReducer, []);
}

module.exports = normalize;
