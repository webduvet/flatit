
/**
 * @param {Array} array of string indicated the property path within object
 * @param {Objec}
 * @returns {Any | undefined}
 */
function path(seq, o) {
  if (!seq.length || o == undefined) {
    return o;
  }
  return path(seq.slice(1), o[seq[0]]);
}

module.exports = path;
