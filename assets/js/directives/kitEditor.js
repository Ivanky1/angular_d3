module.exports = ['d3Factory', '$q', '$window', '$compile',
  function(d3Factory, $q, $window, $compile){

    // DDO - Directive Definition Object
    return {
      scope: true,
      restrict: 'A',

      // $scope - модель директивы
      // $element - DOM-элемент с директивой, обернут jqLite
      // $attrs - массив атрибутов на DOM-элементе
      link: function($scope, $element, $attrs){
          d3Factory.d3().then(function(d3) {

              $scope.translateTo = function(pt) {
                  var d = $q.defer();
                  d.notify('About to start translation');
                  d3.transition()
                      .duration(DURATION)
                      .tween('translate', function() {

                          function translateToInterval(x, y) {
                              $scope.editor.behavior.d3.zoom.translate([x, y]);
                              $scope.editor.behavior.d3.zoom.event($scope.editor.svg.container);
                              $scope.editor.position.x = x;
                              $scope.editor.position.y = y;

                          }
                          // Интерполяция вычисления
                            var step = d3.interpolate([$scope.editor.position.x, $scope.editor.position.y], [pt.x, pt.y]);

                          // У возвращенной функции должен быть один параметр
                          return function(t) {
                              translateToInterval(step(t)[0],step(t)[1]);
                          }
                      }).each('end', function() {
                          d.resolve('Translated to ('+pt.x+' '+pt.y+') success');
                      });

                  return d.promise;
              }
              // Отцентровка по кнопке
              $scope.center = function() {
                  var scale = $scope.editor.behavior.d3.zoom.scale();
                  var cord = {
                      x: ($window.innerWidth - 600*scale)/2,
                      y: ($window.innerHeight - 600*scale)/2,
                  }
                  $scope.translateTo(cord);
              }

              $scope.editor = {
                  behavior: {
                      d3: {
                          drag: {
                              dragging: false
                          }
                      }
                  },
                  position: {
                      x: 0,
                      y: 0,
                  },
                  grid: {
                      sizeX: 15,
                      sizeY: 15,
                  },
                  pageProperties: {

                  },
                  svg: {

                  },
                  features: {

                  }
              };
              var posX = '';
              var posY = '';
              d3.select($element[0]).append('button').text('center')
              .on('click', function() {
                      var gridSize = $scope.editor.svg.container.node().getBoundingClientRect();
                      posX = ($window.innerWidth - gridSize.width)/2;
                      posY = ($window.innerHeight - gridSize.height)/2;
                      $scope.editor.svg.container
                          .transition()
                          .duration(DURATION)
                          .attr('transform', 'translate('+posX+','+posY+')scale('+$scope.editor.scale+') ')
                          .each('end', function() {
                              $scope.editor.behavior.d3.zoom.translate([posX, posY]);
                              $scope.editor.behavior.d3.zoom.event($scope.editor.svg.container);
                          })

                  });


              $scope.editor.svg.rootNode = d3.select($element[0]).append('svg').attr('id','svg-editor');

              var g = $scope.editor.svg.rootNode.append('g')
                  .attr('transform', 'translate(0,0)');
              $scope.editor.svg.underlay = g.append('rect')
                  .attr('class', 'underlay')
                  .attr('width', '100%')
                  .attr('height', '100%');

              $scope.editor.svg.container = g.append('g')
                  .attr('class', 'svg-container');

              var gGridX = $scope.editor.svg.container.append('g')
                  .attr('class', 'x axis');

              var gGridY = $scope.editor.svg.container.append('g')
                  .attr('class', 'y axis');

              var borderFrame = $scope.editor.svg.container.append('rect')
                  .attr('class', 'svg-border')
                  .attr('x', 0)
                  .attr('y', 0)
                  .attr('width', 0)
                  .attr('height', 0)

              var DURATION = 800;

              borderFrame
                  .transition()
                  .duration(DURATION)
                  .attr('width', 600)
                  .attr('height', 600)

              var linesX = gGridX.selectAll('line')
                  .data(d3.range(0, 600, $scope.editor.grid.sizeX));

              linesX.enter().append('line')
                  .attr('x1', 0)
                  .attr('x2', 0)
                  .attr('y1', function(d) { return d; })
                  .transition()
                  .duration(DURATION)
                  .attr('y2', function(d) { return d; })
                  .attr('x2', 600)

              var linesY = gGridY.selectAll('line')
                  .data(d3.range(0, 600, $scope.editor.grid.sizeY));

              linesX.enter().append('line')
                  .attr('y1', 0)
                  .attr('y2', 0)
                  .attr('x1', function(d) { return d; })
                  .transition()
                  .duration(DURATION)
                  .attr('x2', function(d) { return d; })
                  .attr('y2', 600);

              $scope.editor.behavior.d3.zoom = d3.behavior.zoom()
                  .scale(1)
                  .scaleExtent([.2, 10])
                  .on('zoom', function() {
                        var t = d3.event.translate;

                        $scope.editor.svg.container
                            .attr('transform', 'translate('+t+') scale('+d3.event.scale+')');
                        t = t.toString().split(',');

                        $scope.editor.scale = d3.event.scale;
                        $scope.editor.position.x = t[0];
                        $scope.editor.position.y = t[1];
                  });

              g.call($scope.editor.behavior.d3.zoom);
              $scope.editor.behavior.d3.zoom.event($scope.editor.svg.container);
              $scope.center();


              $compile(angular.element($scope.editor.svg.container.append('g')
                  .attr('transform', 'translate(0,0)')
                  .attr('kit-custom-shape', '').node()))($scope);
          })


      }
    }
}];