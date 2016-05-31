// This handles excluding certain imports when running the mocha test suite
// This currently includes scss files but could also later include images and
// the like.

function noop() {
  return null;
}
require.extensions['.scss'] = noop;
require.extensions['.css'] = noop;
