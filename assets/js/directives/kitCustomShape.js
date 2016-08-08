module.exports = ['d3Factory', '$q', '$window',
    function(d3Factory, $q, $window){
    // DDO - Directive Definition Object
        return {
            scope: true,
            restrict: 'A',
            priority: 1,

            // $scope - модель директивы
            // $element - DOM-элемент с директивой, обернут jqLite
            // $attrs - массив атрибутов на DOM-элементе
            link: function($scope, $element, $attrs){
                d3Factory.d3().then(function(d3) {

                    $scope.shape = {
                        dragBehavior: {
                            dragOrigin: {
                                x: 0,
                                y: 0,
                            },
                            snapFactor: 2
                        },
                        svg: {
                            rootNode: $element[0],
                            d3Object: d3.select($element[0])
                        }
                    }

                    $scope.snapToGrid = function(editor, coords, factor) {
                        if (editor) {
                            factor = Math.abs(factor) || 2;
                            var a = editor.grid.sizeX / factor,
                                b = editor.grid.sizeY / factor;

                            return {
                                x: Math.round(coords.x / a) * a,
                                y: Math.round(coords.y / b) * b
                            }

                        } else {
                            return coords;
                        }
                    }

                    $scope.setDragOrigin = function(x,y) {
                        $scope.shape.dragBehavior.dragOrigin.x = x;
                        $scope.shape.dragBehavior.dragOrigin.y = y;
                    }

                    $scope.moveTo = function(x, y, shouldSnap) {
                        $scope.setDragOrigin(x, y);
                        var coords = {
                            x: x,
                            y: y,
                        };

                        if (shouldSnap) {
                            coords = $scope.snapToGrid($scope.editor, coords, $scope.shape.dragBehavior.snapFactor);
                        }
                            $scope.shape.svg.d3Object.attr('transform', 'translate(' +coords.x+ ',' +coords.y+ ')');

                    }

                    $scope.doSingleRotate = function() {
                        if ($scope.shape.moniker != 'core.gear' && $scope.shape.moniker != 'core.screw') {
                            var path =  $scope.shape.svg.d3Object.selectAll('path');
                            var oldRotate = d3.transform(path.attr('transform')).rotate;
                            var bBox = $scope.shape.svg.d3Object.node().getBBox();
                            var centroid = [bBox.x + bBox.width/2, bBox.y + bBox.height/2].join(',');
                            path.attr('transform', 'rotate('+(oldRotate + 90)+','+centroid+')');
                            //path.attr('transform', 'rotate('+(oldRotate + 90)+',75,75)');
                        }
                    }

                    var dragInitiated = false

                    $scope.shape.dragBehavior.dragObject = d3.behavior.drag()
                        .origin(function() {
                            return $scope.shape.dragBehavior.dragOrigin
                        })
                        .on('dragstart', function() {
                            var e = d3.event.sourceEvent; //mousedown touchstart
                            e.stopPropagation();

                            if (e.which == 1) {
                                dragInitiated = true;
                                $scope.editor.behavior.d3.drag.dragging = true;

                            }
                        })
                        // двигаем фигуру
                        .on('drag', function() {
                            //d3.event.x и d3.event.y получаем координаты с помощью "д3" (могут быть так получены только в событии "drag")
                            var coords = {x: d3.event.x, y: d3.event.y};
                            if (dragInitiated) {
                                $scope.moveTo(coords.x, coords.y, true);
                                $scope.shape.svg.d3Object.classed('dragging', true);
                            }
                        })
                        .on('dragend', function() {
                            dragInitiated = false;
                            $scope.editor.behavior.d3.drag.dragging = false;
                            $scope.shape.svg.d3Object.classed('dragging', false);
                        })

                    $scope.shape.svg.d3Object.call($scope.shape.dragBehavior.dragObject);

                    var t = d3.transform($scope.shape.svg.d3Object.attr('transform'));
                    var tSnapped = $scope.snapToGrid(
                        $scope.editor,
                        $scope.snapToGrid($scope.editor, {x: t.translate[0], y: t.translate[1]}),
                        $scope.shape.dragBehavior.snapFactor);

                    $scope.setDragOrigin(tSnapped.x, tSnapped.y);
                    $scope.shape.svg.d3Object.attr('transform', 'translate(' +tSnapped.x+ ',' +tSnapped.y+ ')' );

                    $scope.shape.svg.d3Object.on('mousedown', function() {
                        var e = d3.event;

                        if (e.ctrlKey && e.button == 0) {
                            $scope.doSingleRotate();
                        }
                        var colors = d3.scale.category10().domain(d3.range(10));
                        if (e.button == 1) {
                            d3.select(this).select('path').style('fill', colors(Math.floor(Math.random() * 9)));
                        }
                        if (e.altKey && e.button == 0) {
                            $element.remove();
                            $scope.$destroy();
                        }
                    })

                })
            }
        }
    }
];







