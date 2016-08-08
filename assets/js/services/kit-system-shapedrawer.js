module.exports = function() {
    return {
        /**
         *
         * @param d3
         * @param holder
         * @param mmPerX
         * @param mmPerY
         * @param teeth
         * @param radiusInner
         * @param radiosOuter
         * @param tootHeight
         * @param innerAnnulus - внутренний кольцо радиус
         * @param outerAnnulus - внешний кольцо радиус
         */
        drawGearWheel : function(d3, holder, mmPerX, mmPerY,
                                 teeth, radiusInner, radiosOuter, tootHeight,
                                 innerAnnulus, outerAnnulus) {
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
                .innerRadius(outerAnnulus.innerRadius * mmPerX)
                .outerRadius(outerAnnulus.innerRadius * mmPerX)
                .startAngle(0)
                .endAngle(Math.PI * 2);

            var _innerAnnulus = d3.svg.arc()
                .innerRadius(innerAnnulus.innerRadius * mmPerX)
                .outerRadius(innerAnnulus.outerRadius * mmPerX)
                .startAngle(0)
                .endAngle(Math.PI * 2);

            holder.append('path')
                .attr('class', 'gear-outer-circle')
                .attr('d',_outerAnnulus);

            holder.append('path')
                .attr('class', 'gear-inner-circle')
                .attr('d',_innerAnnulus);

            return holder.append('path')
                .attr('class', 'gear')
                .attr('d', drawGearWheel(
                    teeth,
                    radiusInner * mmPerX,
                    radiosOuter * mmPerX,
                    tootHeight * mmPerX
                ));
        },
        /**
         *
         * @param d3
         * @param holder
         * @param mmPerX
         * @param mmPerY
         * @param holeRadius
         * @param hHoleCount
         * @param vHoleCount
         * @returns {*}
         */
        drawRect: function(d3, holder, mmPerX, mmPerY,
                           holeRadius, hHoleCount, vHoleCount) {
            function drawRectWithHoles(holeRadius, hHoleCount, vHoleCount) {
                var width = 10 * hHoleCount * mmPerX,
                    height = 10 * vHoleCount * mmPerY,
                // двойной радиус от маленьких
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

            return holder.append('path')
                .attr('d',drawRectWithHoles(holeRadius*mmPerX, hHoleCount, vHoleCount) )
        },
        drawTriangle: function() {

        },
        drawTShape: function() {

        },
        drawScrew: function (d3, holder, mmPerX, mmPerY,
                             outerHexSize, innerHexSize) {

            function hexagon(size) {

                var path = ["M0", -size],
                    i    = -1;

                while (++i < 7) {
                    var angle = Math.PI / 3 * i + Math.PI / 2;
                    path.push("L", size * Math.cos(angle), ",", size * Math.sin(angle));
                }

                path.push("z");
                return path.join("");

            }

            holder.append("path")
                .attr("class", "screw outer-hex")
                .attr("d", hexagon(outerHexSize * mmPerX));

            holder.append("path")
                .attr("class", "screw inner-hex")
                .attr("d", hexagon(innerHexSize * mmPerX));

        },

        getDrawingMethod: function(moniker) {
            switch (moniker) {
                case 'core.gear':
                    return this.drawGearWheel; break;
                case 'core.rect':
                    return this.drawRect; break;
                case 'core.triangle':
                    return this.drawTriangle; break;
                case 'core.shape':
                    return this.drawTShape; break;
                case 'core.screw':
                    return this.drawScrew; break;
            }
        }

    };
};