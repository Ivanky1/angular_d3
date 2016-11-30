angular.module('kitApp.directives', [])
    .directive('kitEditor',require('../directives/kitEditor'))
    .directive('kitCustomShape',require('../directives/kitCustomShape'))
    .directive('kitRect',require('../directives/kitRect'))
    .directive('kitShape',require('../directives/kitShape'))
    .directive('kitGear',require('../directives/kitGear'))
    .directive('kitTriangle',require('../directives/kitTriangle'))
    .directive('kitScrew',require('../directives/kitScrew'))
    .directive('kitPallete',require('../directives/kitPallete'));

