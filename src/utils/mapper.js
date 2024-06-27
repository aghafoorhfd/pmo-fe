import { get, cloneDeep } from 'lodash';

/**
 * generic mapper that can transform any object
 * @param {object} mapping Required -> Schema for required object with mapping of data object
 * @param {object} data Required -> Used for map data attributes
 * @param {object} defaults Optional -> used to get default value if value not found in data object
 * @returns transformedObject
 */

export const mapper = (mapping, data, defaults = {}) => {
  const transformedObject = cloneDeep(mapping);

  const resolver = (path) => {
    let val = null;
    if (typeof path === 'function') {
      val = path(data);
    } else {
      val = get(data, path);
      if (val === undefined) {
        val = Object.prototype.hasOwnProperty.call(defaults, path) ? defaults[path] : path;
      }
    }
    return val;
  };

  (function iterator(_map) {
    const map = _map;
    Object.keys(map).forEach((key) => {
      if (typeof map[key] === 'object') {
        iterator(map[key]);
      } else {
        map[key] = resolver(map[key]);
      }
    });
  }(transformedObject));

  return transformedObject;
};
