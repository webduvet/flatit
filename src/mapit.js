
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

module.exports = templateMapper;
