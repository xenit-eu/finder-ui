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

## Components


#### columns hash description

| Key    | Description                             |  
|--------------|-----------                                |
| name         | name identifying uniquely the column (the alfresco property name)   |
| label        | Label to put on top of the table   |
| alignRight   | (optional) Not used yet (default: false)   |
| sortable     | (optional) boolean indicating if column can be sorted by user (default: false)   |
| sortDirection| (optional) default sort direction : NONE(default), ASC, DESC   |
| format       | (optional) function to call to format the data to be displayed |


#### pager hash description

| Key    | Description                             |  
|--------------|-----------                                |
| totalItems| total number of rows in searched set   |
| pageSize| number of rows to be displayed on the page   |
| selected| selected (active) page (default: 1, starting at 1)   |


#### menu item hash description

| Key    | Description                             |  
|--------------|-----------                                |
| label | label to be displayed for the menu   |
| key | (optional) key of the menu that will be passed to the onMenuSelected callback described above |



### _Facets_

Display alfresco facets in a hierarchical manner.

    Facets({param1: value1, param2: value2, ...})

| Parameter   | Description                             |  
|-------------|-----------                                |
| facets      | facets data to be displayed (see below for more details) |
| onFacetSelected | callback called when a specific facet value has been clicked |

#### facets data structure

| Key    | Description                             |  
|--------------|-----------                                |
| name | internal name of the facet |
| label | displayable name of the facet |
| values | each facet can have a list of values and for each of value we have: count (number of nodes for this facet value), value (value of the facet), label (displayable text for the value) |


### _SearchBox_

Input box allowing the search by terms (node name, creator, ...).

    SearchBox({param1: value1, param2: value2, ...})

| Parameter   | Description                             |  
|-------------|-----------                                |
| searching| flag indicating that search process is busy => activate spinner !| 
| terms| list of existing terms already requested for search.|
| suggestionList | suggestions to be proposed on the drop-down list when entering a term name. |
| onRemove | callback called to remove an existing term. |
| onEnter | callback called when a new text (eventually a term) has been entered. |   

#### Term structure

| Key    | Description                             |  
|--------------|-----------                                |
| name | internal name of the term |
| label | displayable name of the term |
| value | value entered for this term |


### _MetaDataDialog_

Dialog allowing to display and change node metadata (properties).

    MetaDataDialog({param1: value1, param2: value2, ...})


| Parameter   | Description                             |  
|-------------|-----------                                |
| opened   | flag indicating whether the dialog must be shown.     |
| fields   | list of metadata fields.     |
| onClose  | callback called when close/cancel button called (without save)     |
| onSave   | callback called when save button called     |

#### Metadata field structure

| Key    | Description                             |  
|--------------|-----------                                |
| name | internal name of the property (alfresco property name)    |
| label| displayable name of the property    |
| value| current value of the property    |
| type | type : STRING, ...    |


### _DocPreview_

Preview of a document (using the browser capabilities to display PDF, JPG, PNG, Movies, ...)

    DocPreview({param1: value1, param2: value2, ...})

| Parameter   | Description                             |  
|-------------|-----------                                |
| src         | url of the document to be displayed |

### _DocPreviewPdfJs_

Preview of a document (using the PDFJS library).

    DocPreview({param1: value1, param2: value2, ...})

| Parameter   | Description                             |  
|-------------|-----------                                |
| src         | url of the document to be displayed |


Note: To use this component, the pdfjs library should be accessible at the following URL: _/alfresco/finder/pdfjs_

## Implementation notes

### Karma build

  * typescript compilation issue see https://github.com/monounity/karma-typescript/issues/28

