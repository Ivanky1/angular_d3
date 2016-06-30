module.exports = ['d3Factory',
    function(d3Factory){

        // DDO - Directive Definition Object
        return {
            scope: true,
            restrict: 'A',
            priority: 3,

            // $scope - модель директивы
            // $element - DOM-элемент с директивой, обернут jqLite
            // $attrs - массив атрибутов на DOM-элементе
            link: function($scope, $element, $attrs){
                d3Factory.d3().then(function(d3) {
                    $scope.shape.moniker = 'core.shape';

                    function drawRectWithHoles(holeRadius, hHoleCount, vHoleCount) {

                        var width = 10 * hHoleCount * $scope.editor.features.pixelsPerMmX,
                            height = 10 * vHoleCount * $scope.editor.features.pixelsPerMmY,
                            // двойной радиус от маленьких
                            borderRadius = 2 * holeRadius,
                            stepH = width / hHoleCount,
                            stepV = height / vHoleCount,
                            pathString;

                        pathString = 'M ' + borderRadius + ',' + height +
                            'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + -borderRadius + ',' + -borderRadius +
                            'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + borderRadius + ',' + -borderRadius +
                            'h' + (width - 4 * borderRadius) +
                            'v' + -(height - borderRadius*3) +
                            'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + borderRadius + ',' + -borderRadius +
                            'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + borderRadius + ',' + borderRadius +
                            'v' + (height -  borderRadius*3) +
                            'h' + (width - 4 * borderRadius) +
                            'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + borderRadius + ',' + borderRadius +
                            'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + -borderRadius + ',' + borderRadius +
                            'z';

                        for (var j = 0; j < vHoleCount; j++) {
                            for (var i = 0; i < hHoleCount; i++) {
                                if (j == 2 || (j < 2 && i == 1) ) {
                                    pathString += 'M' + (i * stepH + stepH ) + ',' +
                                        (j * stepV + stepV / 2 - holeRadius) +
                                        'a' + holeRadius + ',' + holeRadius + ' 0 0 1 0 ' + ',' + (2 * holeRadius) +
                                        'a' + holeRadius + ',' + holeRadius + ' 0 0 1 0 ' + ',' + -(2 * holeRadius) +
                                        'z';
                                }
                            }
                        }


                        return pathString;
                    }

                    $scope.shape.svg.shapeObject = $scope.shape.svg.d3Object.append('path')
                        .attr('d', drawRectWithHoles(2.5 * $scope.editor.features.pixelsPerMmX, 3, 3));

                })
            }
        }
    }
];


