require('../../vendor/angular/angular'); // CommonJS
require('./modules/d3'); // CommonJS
require('./modules/directives'); // CommonJS

// Dependency injection
// Зависимость модулей d3, kitApp.directives и т.д.
angular.module('kitApp', ['d3', 'kitApp.directives']);