# Authoring Custom Widgets

(**Name?** Widget / component / block / other? I'll use "widget" for now for lack of another term.)

## Overview

Custom widgets allow microschemas to have their own custom editing interface.

A custom widget is an AngularJS directive, and must be part of the module 'meshAdminUi.widgets'.

It is paired with a microschema by naming convention. Example:

- microschema "gallery"
- widget "galleryWidget".

When rendering the editor form, if the node contains a microschema type, the app will look for
a matching widget and use it if found.

While user-created custom widgets are not an initial goal for the Mesh Admin UI, here is described 
the API and conventions to be used when developing any widgets, including those that end up being
built-in and bundled with Mesh.

## Basic Form

Each widget should be contained in folder which has the same name as the microschema it is designed to render.

This folder should contain at least a javascript file which is the definition of the widget directive.

The folder can also contain any other assets required by the widget (e.g. template HTML, CSS, images etc.) Lazy loading
of these assets will have to be figured out.

```JavaScript
angular.module('meshAdminUi.widgets')
    .directive('galleryWidget', galleryWidgetDirective);
    
function galleryWidgetDirective() {

  function linkFn(scope) {
    // custom logic here.
  }
  
  return {
    link: linkFn,
    // directive definition object
  }
```

## API

