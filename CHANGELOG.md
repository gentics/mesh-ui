# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.2] - 2019-11-11
### Changed

- The number of items displayed per page in the content list is now configurable. Set the `contentItemsPerPage` property in the `mesh-ui-config.js` to do so. By default the number of items is 8.
- The project create dialog will now automatically use the last search term as name for the new project.
- Node browser usability tweaks [#250](https://github.com/gentics/mesh-ui/issues/250)
  - The choose button is disabled if no node has been chosen
  - The checkbox for choosing a node will now appear when hovering the row instead of only when hovering the icon.

## [1.0.1] - 2019-10-08
### Changed
- Update to Angular 8
- Fixed an issue that displayed unassigned schemas when creating a new node. [#254](https://github.com/gentics/mesh-ui/issues/254)
- Fix saving node after changing a number field [#253](https://github.com/gentics/mesh-ui/issues/253)
- Fix reloading of node list view after certain actions [#255](https://github.com/gentics/mesh-ui/issues/255)
- Show a dropdown instead of an input field for string fields with the `allow` property set [#256](https://github.com/gentics/mesh-ui/issues/256)

## [1.0.0] - 2019-10-03
- Public release
