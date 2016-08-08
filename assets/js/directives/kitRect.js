module.exports = ['d3Factory', 'kitSystemShapeDrawerFactory', '$http',
    function(d3Factory, drawer, $http){

        // DDO - Directive Definition Object
        return {
            scope: true,
            restrict: 'A',
            priority: 2,

            // $scope - модель директивы
            // $element - DOM-элемент с директивой, обернут jqLite
            // $attrs - массив атрибутов на DOM-элементе
            link: function($scope, $element, $attrs){
                d3Factory.d3().then(function(d3) {
                    $scope.shape.moniker = 'core.rect';

                    $http.get('/data').then(function (response) {
                        var list = response.data;
                        var data = list[$scope.shape.moniker][$attrs.id];
                            console.log(list[$scope.shape.moniker])

                        $scope.shape.svg.shapeObject = drawer.drawRect.apply(this,
                            d3.merge(
                                [
                                    [d3, $scope.shape.svg.d3Object, $scope.editor.features.pixelsPerMmX,
                                        $scope.editor.features.pixelsPerMmY],
                                    data
                                ]
                            ));

                    });
                /*
                    $scope.shape.svg.shapeObject = drawer.drawRect(
                        d3,
                        $scope.shape.svg.d3Object,
                        $scope.editor.features.pixelsPerMmX,
                        $scope.editor.features.pixelsPerMmY,
                        2.5,
                        4,
                        1
                    ); */
                    //$scope.shape.svg.shapeObject = $scope.shape.svg.d3Object.append('path')
                     //   .attr('d', drawRectWithHoles(2.5 * $scope.editor.features.pixelsPerMmX, 4, 1));

                })
            }
        }
    }
];

