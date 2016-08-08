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
                    $scope.shape.moniker = 'core.triangle';

                    function drawTriangle(holeRadius) {
                        var borderRadius = holeRadius* 2,
                            width = 40 * $scope.editor.features.pixelsPerMmX,
                            step = width / 4,
                            a = Math.SQRT1_2,
                            pathString = [];

                        pathString.push(
                            'M',borderRadius * (1 - a), ',', borderRadius * (1 + a),
                            'a',borderRadius, ",", borderRadius, " 0 0 1 ", -borderRadius * (1 - a), ",", -(borderRadius * a),
                            'a',borderRadius, ",", borderRadius, " 0 0 1 ", borderRadius, ",", -borderRadius,
                            'h',(width - 2*borderRadius),
                            'a',borderRadius, ",", borderRadius, " 0 0 1 ", borderRadius, ",", borderRadius,
                            'v',(width - 2*borderRadius),
                            'a',borderRadius, ",", borderRadius, " 0 0 1 ", -borderRadius, ",", borderRadius,
                            'a',borderRadius, ",", borderRadius, " 0 0 1 ", -borderRadius * a, ",", -borderRadius * (1 - a),
                            'z'
                        )

                        pathString = pathString.join('');

                        for (var i=0; i < 4; i++) {
                            pathString += "M" + (step * i + step /2) + "," + (borderRadius / 2)
                                + "a" + holeRadius + "," + holeRadius + " 0 0 1 0 " + "," +
                                (2 * holeRadius)
                                + "a" + holeRadius + "," + holeRadius + " 0 0 1 0" + "," +
                                -(2 * holeRadius)
                                + "z";
                        }
                        for (i=1; i < 4; i++) {
                            pathString += "M" + (width - borderRadius) + "," +
                                (step * i + step /2 - borderRadius / 2)
                                + "a" + holeRadius + "," + holeRadius + " 0 0 1 0 " + "," +
                                (2 * holeRadius)
                                + "a" + holeRadius + "," + holeRadius + " 0 0 1 0" + "," +
                                -(2 * holeRadius)
                        }

                        pathString += "M" + (step * 1.5) + "," + (1.5 * step - borderRadius / 2)
                            + "a" + holeRadius + "," + holeRadius + " 0 0 1 0 " + "," + (2 * holeRadius)
                            + "a" + holeRadius + "," + holeRadius + " 0 0 1 0" + "," + -(2 * holeRadius)
                            + "z";
                        pathString += "M" + (step * 2.5) + "," + (2.5 * step - borderRadius / 2)
                            + "a" + holeRadius + "," + holeRadius + " 0 0 1 0 " + "," + (2 * holeRadius)
                            + "a" + holeRadius + "," + holeRadius + " 0 0 1 0" + "," + -(2 * holeRadius)
                            + "z";

                        return pathString;
                    }

                    $scope.shape.svg.shapeObject = $scope.shape.svg.d3Object.append('path')
                        .attr('d', drawTriangle(2.5 * $scope.editor.features.pixelsPerMmX));

                })
            }
        }
    }
];


