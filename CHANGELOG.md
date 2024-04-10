---
title: Alfred Finder - UI - Changelog
date: 15 February 2024
report: true
colorlinks: true
---
<!--
Changelog file.

Template:

## [X.x.x] - yyyy-MM-dd
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

docker run --rm -v "$(pwd):/manual" -w /manual private.docker.xenit.eu/xenit-markdowntopdf:latest --output Alfred_Finder_UI_CHANGELOG.pdf CHANGELOG.md
-->

# Alfred Finder - UI - Changelog

## 2.6.0 (2024-04-04)

### Added
* [XENFIN-1392](https://xenitsupport.jira.com/browse/XENFIN-1392): Allow custom format for string properties

## 2.5.8 (2024-02-15)

### Fixed
* [XENFIN-1390](https://xenitsupport.jira.com/browse/XENFIN-1390): Incorrect locale resolved

## 2.5.7 (2024-02-13)

### Fixed
* [XENFIN-1390](https://xenitsupport.jira.com/browse/XENFIN-1390): fix translation regression

## 2.5.6 (2024-02-06)

### Fixed
* [XENFIN-1381](https://xenitsupport.jira.com/browse/XENFIN-1381): bugfix - update the column set used on click

## 2.5.5 (2023-10-26)

### Added
 * [XENFIN-1381](https://xenitsupport.jira.com/browse/XENFIN-1381): update the column set used on click

## 2.5.0 (2021-11-29)

### Added
 * [XENFIN-1141](https://xenitsupport.jira.com/browse/XENFIN-1141): As a user, I can see when and why an upload failed.
 * [XENFIN-1147](https://xenitsupport.jira.com/browse/XENFIN-1147): Refactor versions panel to use material-ui and to add actions to it
 * [XENFIN-1176](https://xenitsupport.jira.com/browse/XENFIN-1176): Add translation functionality
 * [XENFIN-1184](https://xenitsupport.jira.com/browse/XENFIN-1184): Add upload new version button to version panel
 * [XENFIN-1213](https://xenitsupport.jira.com/browse/XENFIN-1213): Add translations backend to load facet translations from Alfresco
 * [XENFIN-1253](https://xenitsupport.jira.com/browse/XENFIN-1253): Add highlighting of typed-in terms in autocomplete results
 * [XENFIN-1364](https://xenitsupport.jira.com/browse/XENFIN-1364): Collapsable searchbar when Focused/unfocused

### Changed
 * [EF2I-1](https://xenitsupport.jira.com/browse/EF2I-1): Req1 - save the column width
 * [EF2I-3](https://xenitsupport.jira.com/browse/EF2I-3): Req5 - view documents grouped by envelope
 * [XENFIN-1125](https://xenitsupport.jira.com/browse/XENFIN-1125): Create design mockup for upload panel
 * [XENFIN-1128](https://xenitsupport.jira.com/browse/XENFIN-1128): Publish finder-ui to npmjs
 * [XENFIN-1145](https://xenitsupport.jira.com/browse/XENFIN-1145): Move metadata panel to redux-thunk architecture
 * [XENFIN-1146](https://xenitsupport.jira.com/browse/XENFIN-1146): Refactor comments panel to make it usable in redux-thunk architecture
 * [XENFIN-1169](https://xenitsupport.jira.com/browse/XENFIN-1169): Create snackbar component for success and error messages
 * [XENFIN-1178](https://xenitsupport.jira.com/browse/XENFIN-1178): Rebuild explorer panel ui component to be more compact
 * [XENFIN-1208](https://xenitsupport.jira.com/browse/XENFIN-1208): Rebuild facets component using material-ui/core
 * [XENFIN-1233](https://xenitsupport.jira.com/browse/XENFIN-1233): Refactoring searchbox and autocomplete
 * [XENFIN-1235](https://xenitsupport.jira.com/browse/XENFIN-1235): Create inline editable MUI chip
 * [XENFIN-1237](https://xenitsupport.jira.com/browse/XENFIN-1237): Create chip containing other chips (and/or/not)
 * [XENFIN-1240](https://xenitsupport.jira.com/browse/XENFIN-1240): Create global input field and chips combination
 * [XENFIN-1241](https://xenitsupport.jira.com/browse/XENFIN-1241): Create paper overlay element for autocomplete suggestions
 * [XENFIN-1242](https://xenitsupport.jira.com/browse/XENFIN-1242): Create keyboard-navigable list of autocomplete elements
 * [XENFIN-1243](https://xenitsupport.jira.com/browse/XENFIN-1243): Create keyboard-navigable list (horizontal) with chips to click on for autocomplete
 * [XENFIN-1255](https://xenitsupport.jira.com/browse/XENFIN-1255): Update finder-ui with updated components in finder-xenit
 * [XENFIN-1291](https://xenitsupport.jira.com/browse/XENFIN-1291): Automatically create All chip with entered text when enter is pressed in the searchbox.
 * [XENFIN-1336](https://xenitsupport.jira.com/browse/XENFIN-1336): Remove react-table component from finder-ui
 * [XENFIN-996](https://xenitsupport.jira.com/browse/XENFIN-996): Focus & keyboard navigation in searchbar components
 * [XENFIN-1351](https://xenitsupport.jira.com/browse/XENFIN-1351): Make the props.children condition a bit more rigourous


### Fixed
 * [XENFIN-1136](https://xenitsupport.jira.com/browse/XENFIN-1136): Uploaded file actions onclick also triggers parent onclick
 * [XENFIN-1254](https://xenitsupport.jira.com/browse/XENFIN-1254): Searchbox autocomplete dropdown is inline instead of on top of the page
 * [XENFIN-1282](https://xenitsupport.jira.com/browse/XENFIN-1282): Clicking outside of the "search suggestions long box", should close it and just remember what is typed
 * [XENFIN-1294](https://xenitsupport.jira.com/browse/XENFIN-1294): Date-type chips can not be used when modifying an existing chip
 * [XENFIN-1300](https://xenitsupport.jira.com/browse/XENFIN-1300): Chips are not removable while CreateChip is being edited
 * [XENFIN-1345](https://xenitsupport.jira.com/browse/XENFIN-1345): Fixed search button pushed out by search chips

## 2.4.0 (2020-01-24)

### Added
 * [EFUU-28](https://xenitsupport.jira.com/browse/EFUU-28): Add support for async context menu  with plugins

### Changed
 * [EFUU-19](https://xenitsupport.jira.com/browse/EFUU-19): Secure URL functionality


## 2.3.0 (2019-09-09)

### Added
 * Add Spanish translation to Finder

### Changed
 * [XENFIN-1060](https://xenitsupport.jira.com/browse/XENFIN-1060): Better date range labels
 * [XENFIN-1073](https://xenitsupport.jira.com/browse/XENFIN-1073): Refactoring: get global connected components out of global scope.
 * [XENFIN-1078](https://xenitsupport.jira.com/browse/XENFIN-1078): Correctly use content. Size as property

