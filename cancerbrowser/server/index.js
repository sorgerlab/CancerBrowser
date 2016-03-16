// Register babel so that it can process JSX files
require('babel-core/register')({
    presets: ['es2015', 'react', 'stage-0']
});
require('./server');
