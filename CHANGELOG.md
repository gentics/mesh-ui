# MeshAdminUI Changelog

## Version 0.8.2 (2017-12-14)
* Nodes in the "Select Node..." dialog are now sorted by their display name. (#15)
* The "Select Node..." dialog now remembers the last position it was opened. (#12)
* Add multi binary upload dialog. Users can now upload multiple files at once by clicking the button next to the create node button.
* The dropdown for list types in the schema editor now only shows valid list types.

## Version 0.8.1 (2017-11-29)
* Fix trying to publish after failed save. This has been hiding the error message of the failed save.
* Fix dropdown positioning in IE

## Version 0.8.0 (2017-11-11)
* Add urlField handling to schema editor
* Remove obsolete binary property from schema editor

## Version 0.7.7 (2017-10-18)
* Fix user detail page when creating a new user

## Version 0.7.5 (2017-09-01)
* Add support for Gentics Mesh 0.10.4
* Add button for unpublishing node

## Version 0.7.4 (2017-09-01)
* Add support for Gentics Mesh 0.10.0

## Version 0.7.3 (2017-08-10)
* Add CORS support. Previously CORS was not supported by the UI.
* Fix translation action. Previously a error prevented translations from being executed.
* Fix image handling for binary fields. Previously only the default language image was displayed in the edit view. This has been fixed.

## Version 0.7.2 (2017-07-31)
* Date fields now work with ISO 8601 strings rather than unix timestamps
* Fix bugs with lists of microschemas (SUP-4712)
* Fix mouse clicks not working in lists in FF and (partially) in IE/Edge (SUP-4717)

## Version 0.7.1 (2017-07-07)
* Synchronize version with maven

## Version 0.6.7 (2017-07-06)
* Fix adding node to node list
* Change downloaded thumbnail width to 200

## Version 0.6.6 (2017-06-20)
* Replace version references with simple strings (fix for mesh update)

## Version 0.6.5 (2017-06-08)
* Fix image upload when updating nodes

## Version 0.6.4 (2017-05-22)

#### Fixes
* Schema & Microschema description is no longer a required field

## Version 0.6.3 (2017-05-16)

#### Fixes
* Send a header to prevent being logged in as anonymous user

## Version 0.6.2 (2017-05-08)

#### Features
* Microschemas can now be assigned to projects
* Descriptions can now be assigned to schemas & microschemas

#### Fixes
* Remove the "binary" option from micronode editor

## Version 0.6.1 (2017-04-13)

#### Fixes
* Fix project creation
* Fix error when attempting to translate a node
* Fix incorrect search query
* Display error when attempting to publish a node with an unpublished ancestor

## Version 0.6.0 (2017-03-15)

#### Features
* Updated to work with latest Mesh APIs as of Mesh **v0.8.x**
* Add paging to nodeSelector dialog
* Add list/grid view toggle to nodeSelector dialog
* Automatically logs user out when session has expired
* Simple draft/published handling
* Numerous styling improvements
