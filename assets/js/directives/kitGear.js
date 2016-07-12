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
                    $scope.shape.moniker = 'core.gear';

                    function drawGearWheel(teeth, radiusInner, radiosOuter, tootHeight) {
                        var rOuter = Math.abs(radiosOuter),
                            rInner = Math.abs(radiusInner),
                            rTooth = rOuter + tootHeight,
                            step = 2 * Math.PI / (2*teeth),
                            s = step / 3,
                            i = -1,
                            a0 = -(Math.PI / 2);
                            // cos - x, sin - y
                            pathString = ["M0", rOuter * Math.sin(a0)];

                        while (++i < teeth) {
                            pathString.push("A", rOuter, ",", rOuter, " 0 0 1 ",
                                rOuter* Math.cos(a0+= step), ",", rOuter* Math.sin(a0),
                                "L", rTooth * Math.cos(a0+= s), ",", rTooth * Math.sin(a0),
                                "A", rOuter, ",", rOuter, " 0 0 1 ",
                                rTooth* Math.cos(a0+= s), ",", rTooth* Math.sin(a0),
                                "L", rOuter * Math.cos(a0+= s), ",", rOuter * Math.sin(a0)
                            );
                        }

                        pathString.push(
                            "M0", -rInner,
                            "A", rInner, ",", rInner, " 0 0 0 0,", rInner,
                            "A", rInner, ",", rInner, " 0 0 0 0,", -rInner,
                            "z"
                        );



                        return pathString.join('');
                    }

                    var _outerAnnulus = d3.svg.arc()
                        .innerRadius(2.5 * $scope.editor.features.pixelsPerMmX)
                        .outerRadius(8 * $scope.editor.features.pixelsPerMmX)
                        .startAngle(0)
                        .endAngle(Math.PI * 2);

                    var _innerAnnulus = d3.svg.arc()
                        .innerRadius(2.5 * $scope.editor.features.pixelsPerMmX)
                        .outerRadius(5 * $scope.editor.features.pixelsPerMmX)
                        .startAngle(0)
                        .endAngle(Math.PI * 2);

                    $scope.shape.svg.d3Object.append('path')
                        .attr('class', 'gear-outer-circle')
                        .attr('d',_outerAnnulus);

                    $scope.shape.svg.d3Object.append('path')
                        .attr('class', 'gear-inner-circle')
                        .attr('d',_innerAnnulus);

                    $scope.shape.svg.shapeObject = $scope.shape.svg.d3Object.append('path')
                        .attr('class', 'gear')
                        .attr('d', drawGearWheel(
                            8,
                            5 * $scope.editor.features.pixelsPerMmX,
                            9 * $scope.editor.features.pixelsPerMmX,
                            2 * $scope.editor.features.pixelsPerMmX

                        ));

                    var speed = 0.05;
                    var start = Date.now();

                    d3.timer(function() {
                        $scope.shape.svg.shapeObject.attr('transform', 'rotate('+(Date.now() - start)*speed +')')
                    })


                })
            }
        }
    }
];


