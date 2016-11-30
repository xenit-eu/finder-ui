# Finder UI React components.

Tools:

  * [React](https://facebook.github.io/react/)
  * [Material UI](http://www.material-ui.com/) (material design library implemented in react).
  * for unit tests: [karma](https://karma-runner.github.io/1.0/index.html)/[jasmine](https://jasmine.github.io/)/[enzyme](http://airbnb.io/enzyme/).

## Installation

  * to use it: 
    * npm i --save git+ssh://git@bitbucket.org:xenit/finder-ui.git#<version-tag>

  * to change/test it:
    * git clone   git@bitbucket.org:xenit/finder-ui.git
    * cd finder-ui
    * npm run install:all
    * npm run test:watch

## Usage

### DocList

    DocList({param1: value1, param2: value2, ...})

| Parameter   | Description                             |  
|-------------|-----------                                |
| colummns    | description of columns to be displayed (array of hash, see below for details)   |
| data        | array of hash (name => value) to be displayed. The name here should match the name of the column to be displayed in 'columns' |
| pager       | paging instructions (see below for details) |
| rowMenu     | Array of Menu Item (hash, see below for details) to be displayed on each row. |
| rowSelected | callback function called when a row has been clicked (index of selected row is passed to the callback) |

#### columns hash description

| Key    | Description                             |  
|--------------|-----------                                |
| name         | name identifying uniquely the column (can be the alfresco property name)   |
| label        | Label to put on top of the table   |
| alignRight   | Not used yet   |
| sortable     | boolean indicating if column can be sorted by user   |
| sortDirection| default sort direction : NONE(default), ASC, DESC   |

#### pager hash description

| Key    | Description                             |  
|--------------|-----------                                |
| totalItems| total number of rows in searched set   |
| pageSize| number of rows to be displayed on the page   |
| selected| selected (active) page (default: 1, starting at 1)   |
| pageSelected|  callback which is called when new page selected (idx of page, starting at 1, is passed as parameter)   |

#### menu item hash description


| Key    | Description                             |  
|--------------|-----------                                |
| label | label to be displayed for the menu   |
| onMenuSelected| callback to be called when menu is selected (idx of row passed as parameter) |



### Facets

TBD

### SearchBox

TBD

### MetaDataDialog

TBD

### DocPreview

TBD


## Implementation notes

### Karma build

  * typescript compilation issue see https://github.com/monounity/karma-typescript/issues/28

