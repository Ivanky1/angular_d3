module.exports = ['d3Factory', 'kitSystemShapeDrawerFactory', '$http',
    function(d3Factory, drawer, $http){

        // DDO - Directive Definition Object
        return {
            scope: true,
            restrict: 'A',
            templateUrl: 'partials/pallete',
            // $scope - модель директивы
            // $element - DOM-элемент с директивой, обернут jqLite
            // $attrs - массив атрибутов на DOM-элементе
            link: function($scope, $element, $attrs){
                d3Factory.d3().then(function(d3) {
                    $scope.toogleCollapsed = function() {
                        d3.select($element[0]).classed('collapsed',
                            !$element.hasClass('collapsed')
                        );
                    }
                    $http.get('/data').then(function successCallback(response) {
                            var elementList = response.data;

                            var area = d3.select($element[0]).select('.element-list');

                            for (var moniker in elementList) {
                                if (elementList.hasOwnProperty(moniker)) {
                                    var method = drawer.getDrawingMethod(moniker);

                                    if (method) {
                                        for (var iii = 0; iii < elementList[moniker].length; iii++) {
                                            var thumbnail = area.append('li').append('div')
                                                .attr('class', 'thumbnail')
                                                .attr('draggable', 'true')
                                                .attr('data-moniker', moniker + '.' + iii)
                                                .on('dragstart', function () {
                                                    var event = d3.event;

                                                    event.dataTransfer.effectAllowed = 'copy';
                                                    // Пример data-moniker - core.rect.0
                                                    event.dataTransfer.setData('text',
                                                        d3.select(this).attr('data-moniker'));
                                                });

                                            var svg = thumbnail.append('svg')
                                                .attr('width', '100%')
                                                .attr('height', '100%');

                                            var holder = svg.append('g');

                                            if (elementList[moniker][iii].length > 0) {
                                                method.apply(this, d3.merge(
                                                    [
                                                        [d3, holder, $scope.editor.features.pixelsPerMmX,
                                                            $scope.editor.features.pixelsPerMmY],
                                                        elementList[moniker][iii]
                                                    ]
                                                ));

                                                var bBox = holder.node().getBBox();

                                                var offset = [
                                                    thumbnail.node().offsetWidth / 2 -
                                                        (bBox.width + 2 * bBox.x) / 2,
                                                    thumbnail.node().offsetHeight / 2 -
                                                        (bBox.height + 2 * bBox.y) / 2
                                                ];

                                                holder.attr('transform', 'translate(' + offset + ')');

                                            }
                                        }

                                    }
                                }
                            }


                    }, function errorCallback(response) {
                            console.log('Error http server!');
                        }
                    )

                })
            }
        }
    }
];


