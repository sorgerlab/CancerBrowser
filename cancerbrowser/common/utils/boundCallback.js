/**
 * Function enables memoization of callbacks bound with arguments to
 * enable PureRenderMixin to work effectively.
 *
 * @param {Object} context What `this` to bind
 * @param {Object} cache An object for memoizing the bindings
 * @param {Function} callback The function to bind
 * @param {...} ...keys All remaining parameters are passed as arguments to `callback`
 * @return {Function} The bound callback
 */
function boundCallback(context, cache, callback, ...keys) {
  const strKey = JSON.stringify(keys);
  let cachedFunc = cache[strKey];
  if (cachedFunc === undefined) {
    cachedFunc = callback.bind(context, ...keys);
    cache[strKey] = cachedFunc;
  }

  return cachedFunc;
}

export default boundCallback;
