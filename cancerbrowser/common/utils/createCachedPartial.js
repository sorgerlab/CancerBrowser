/**
 * Function enables memoization of funcs bound with arguments to
 * enable PureRenderMixin to work effectively. It uses a cache in a
 * closure to memoize the bindings.
 *
 * Typical usage in a React Component:
 *
 * Create the closed cache and partial function stored in this.partial
 * constructor() { this.partial = createCachedPartial(this); }
 *
 * Use it as a handler wrapper:
 * <div onClick={this.partial(this.handleDivClick, filterId, groupId)}> ... </div>
 *
 * @param {Object} context What `this` to bind
 *
 * @return {Function} The function used to create/find memoized bound functions with params:
 *  * @param {Function} func The function to bind
 *  * @param {...} ...keys All remaining parameters are passed as arguments to `func`
 *
 */
function createCachedPartial(context) {
  const cache = {};

  function partial(func, ...keys) {
    /* Ideally we could just use the function and keys straight up as in ImmutableJS
     * but we are not using ImmutableJS, so compromise by stringifying everything.
     * Caveat is that a function written like the following might not work as expected: */
    //     function foo(a /* {bar} */, b) { ... }
    /* Also won't work if you are sharing a cache for multiple functions with the same name
     * in which case, multiple 'createCachedPartial' function calls should be made */
    const funcStr = func.toString();
    const strKey = `${funcStr.substring(9, funcStr.indexOf('{'))}${JSON.stringify(keys)}`;

    let cachedFunc = cache[strKey];
    if (cachedFunc === undefined) {
      cachedFunc = func.bind(context, ...keys);
      cache[strKey] = cachedFunc;
    }

    return cachedFunc;
  }

  return partial;
}

export default createCachedPartial;
