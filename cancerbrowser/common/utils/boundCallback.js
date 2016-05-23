/**
 * Function enables memoization of callbacks bound with arguments to
 * enable PureRenderMixin to work effectively.
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
