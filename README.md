# Finder UI React components.

Based on:

  * [React](https://facebook.github.io/react/)
  * [Material UI](http://www.material-ui.com/) (material design library implemented in react).
  * for unit tests: [karma](https://karma-runner.github.io/1.0/index.html)/[jasmine](https://jasmine.github.io/)/[enzyme](http://airbnb.io/enzyme/).

## Installation

  * to use it in another package: 
    * npm i --save git+ssh://git@bitbucket.org:xenit/finder-ui.git#\<version-tag>

  * to change/test it:
    * git clone   git@bitbucket.org:xenit/finder-ui.git
    * cd finder-ui
    * npm run install:all
    * npm run test:watch (run all unit tests after each change of sources)

## Implementation notes

### Karma build

  * typescript compilation issue see https://github.com/monounity/karma-typescript/issues/28

