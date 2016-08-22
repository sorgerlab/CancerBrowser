# HMS LINCS Breast Cancer Browser

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

## Data Processing

Most of the data transformation and processing happens at run time on the client,
however there are a few scripts used to prepare the cell line and drug data for display
and integration into the cancer browser. These scripts are in the `tools` directory,
which includes a separate README and Makefile to describe the pre-processing steps.

## Project Organization

Most of the implementation of this project exists in the `common` sub-directory which can be
shared by both `server` and `client` runtimes.

Here is a quick review of the sub-directories of `common`:

**`actions`**

Redux action creators and action Ids are organized in `actions`. Actions are implemented
at the 'page' level - with separate actions for each of the main data set landing pages as
well as the browser and summary pages for cell lines and drugs.

**`reducers`**

Reducers are likewise organized by page in the `reducers` directory. This page-level
action/reducer pairing allows for the level of customization required for data storage and
UI interaction for each section of this tool. It also ensures individual dataset
landing pages do not interfere with each other when interacted with.

**`api`**

The integration between the redux actions and the underlying data that goes into the storage
is maintained in `api`. Here the raw data from the datasets as well as the processed
cell line and drug data are pulled in and transformed into the data needed for the project.

API integrations exist for most of the main 'entities' of the project:
cell lines, drugs, and datasets.

Here the flat data files and JSON data files serve as the external 'API'. This could
be modified in the future to have the data come from an actual external resource.

In the current implementation, datasets can be imported quickly for visualization.

**`selectors`**

Selectors are implemented using the [Reselect](https://github.com/reactjs/reselect) library.

Generally, a selector is used to compute a derived data state from a sub-set of the redux data store.

In this project, they are used to filter datasets and transform datasets for the different viewby configurations.

**`components` & `containers`**

React components are implemented in `components` and `containers`.

Containers are defined as components with access to dispatch and the data store.

Components only have access to their props.

In most instances, the containers are used to integrate the data store with components
at the page-level.

**`routes`**

Routes are maintained in the `routes` directory.

**`assets`, `config` & `utils`**

Shared resources like global stylings are maintained in `assets`.

Color configuration is in `config`.

Various useful/sharable functions are housed in `utils` - like sort functions and
string formatting.
