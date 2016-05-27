# HMS Cancer Browser

## About

...

## Building

### Development Instructions

Enter web project: `cd cancerbrowser`

Install dependancies: `npm install`

Serve this on port 8080: `node start`

Goto [localhost:8080](http://localhost:8080)

### Production Instructions

Enter web project: `cd cancerbrowser`

Run build: `npm run build`

Build files will be found in the `dist/`

## Deploying

An npm package for deploying the site to gh-pages, [gh-pages-deploy](https://www.npmjs.com/package/gh-pages-deploy)
has been included in the repo.

It builds the project and deploys the `dist` directory to the `gh-pages` branch of the repo.

To deploy just run: `npm run deploy`

## Testing & Linting

Some basic tests can be run using: `npm run test`.

The ESLint application can also be run on the code using: `npm run lint`.
