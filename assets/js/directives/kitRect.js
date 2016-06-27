module.exports = ['d3Factory',
    function(d3Factory){

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

                    function drawRectWithHoles(holeRadius, hHoleCount, vHoleCount) {

                        var width = 10 * hHoleCount * $scope.editor.features.pixelsPerMmX,
                            height = 10 * vHoleCount * $scope.editor.features.pixelsPerMmY,
                            borderRadius = 2 * holeRadius,
                            stepH = width / hHoleCount,
                            stepV = height / vHoleCount,
                            pathString;

                        // Параметры команды a:
                        // rx,ry - радиусы сругления дуги по X и Y
                        // x-axis-rotation - угол вращения в градусах относительно текущей СК
                        // large-arc-flag - флаг большой дуги (если 1, то дуга > 180 deg)
                        // sweepflag - направление рисования (если 1, дуга рисуется по часовой стрелке)
                        // x,y - точка назначения
                        pathString = 'M' + borderRadius + ',' + height +
                            'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + -borderRadius + ',' + -borderRadius +

                            'v' + -(height - 2 * borderRadius) +

                            'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + borderRadius + ',' + -borderRadius +

                            'h' + (width - 2 * borderRadius) +

                            'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + borderRadius + ',' + borderRadius +

                            'v' + (height - 2 * borderRadius) +

                            'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + -borderRadius + ',' + borderRadius +

                            'z';

                        for (var j = 0; j < vHoleCount; j++) {
                            for (var i = 0; i < hHoleCount; i++) {

                                pathString += 'M' + (i * stepH + stepH / 2) + ',' +
                                    (j * stepV + stepV / 2 - holeRadius) +

                                    'a' + holeRadius + ',' + holeRadius + ' 0 0 1 0 ' + ',' + (2 * holeRadius) +
                                    'a' + holeRadius + ',' + holeRadius + ' 0 0 1 0 ' + ',' + -(2 * holeRadius) +
                                    'z';

                            }
                        }

                        return pathString;

                    }

                    $scope.shape.svg.shapeObject = $scope.shape.svg.d3Object.append('path')
                        .attr('d', drawRectWithHoles(2.5 * $scope.editor.features.pixelsPerMmX,
                            4,
                            1));
                })
            }
        }
    }
];