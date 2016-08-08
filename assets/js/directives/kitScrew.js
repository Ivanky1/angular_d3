module.exports = ['d3Factory', 'kitSystemShapeDrawerFactory',
    function(d3Factory, drawer){

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
                    $scope.shape.moniker = 'core.screw';

                    $scope.shape.svg.shapeObject = drawer.drawScrew(
                        d3,
                        $scope.shape.svg.d3Object,
                        $scope.editor.features.pixelsPerMmX,
                        $scope.editor.features.pixelsPerMmY,
                        4,
                        2
                    );

                })
            }
        }
    }
];


