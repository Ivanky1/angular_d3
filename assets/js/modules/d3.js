angular.module('d3', []).factory('d3Factory',
    ['$document', '$rootScope', '$window', '$q',
        function ($document, $rootScope, $window, $q) {

            // $$ - приватные переменные Angular
            // Логика работы тут
            // $document - это обертка над window.document
            // $window - это обертка над window
            // $rootScope - корневая модель приложения
            // $q - обещания (Promises)

            // Асинхронизм в JS:
            // Callback's - ES5
            // Promises - в ES2015
            // Generators - в ES2015
            // Async/await - в ES7 - пришел из C#, babel.js

            // d - deferred - отложенный (результат будет в будущем)
            var d = $q.defer();

            var scriptTag =  $document[0].createElement('script');


            scriptTag.async = true;
            scriptTag.type = 'text/javascript';
            scriptTag.src = '../../vendor/d3/d3.js';

            scriptTag.onload = function(){
                $rootScope.$apply(function(){d.resolve($window.d3)});
            };

            var b = $document[0].getElementsByTagName('body')[0];

            b.appendChild(scriptTag);


            return {
                d3: function () {
                    return d.promise;
                }
            }
        }
    ]);

// Module recipes - средства структуризации кода:
// Поддерживаются на уровне модуля
// возвращают объекты

// angular.module.value
// angular.module.factory
// angular.module.service
// angular.module.provider
// Дополнительно: constant