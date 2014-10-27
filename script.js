        var app = angular.module("nvd3TestApp", ['nvd3ChartDirectives']);

        app.controller('ExampleCtrl', function($scope, $log, $interval){
            $scope.dataCounter = 0;

            $scope.keys = [];
            $scope.graphData = [];

            $scope.calculateKeys = function () {
                $scope.keys.push("foo");
                $scope.keys.push("bar");

                $scope.graphData.push({ "key": "foo", "values": [] });
                $scope.graphData.push({ "key": "bar", "values": [] });
            };

            $scope.dataCounter = 0;

            $scope.graphs = [
                {
                    "name": "Foos Only",
                    "height": 300,
                    "series": [ { label: 'Foo', key: 'foo', enabled: true } ]
                },
                {
                    "name": "Bars Only",
                    "height": 300,
                    "series": [ { label: 'Bar', key: 'bar', enabled: true } ]
                }
            ];

            $scope.fetchData = function(){
                if ($scope.keys.length === 0) {
                    $scope.calculateKeys();
                }

                $scope.dataCounter = $scope.dataCounter + 1;

                $log.debug('setInterval counter is now at : ' + $scope.dataCounter);

                $scope.graphData[0].values.push([$scope.dataCounter, Math.floor((Math.random() * 100) + 1)])
                $scope.graphData[1].values.push([$scope.dataCounter, Math.floor((Math.random() * 100) + 1)]);

                $log.debug('setInterval finished ', $scope.graphData);     
            };

            var stop;

            $scope.clear = function(){
                $scope.dataCounter = 0;
                $scope.keys = [];
                $scope.graphData = [];

                $scope.calculateKeys();
            };

            $scope.start = function() {
                // Don't start again
                if ( angular.isDefined(stop) ) return;

                stop = $interval(function() {
                    $scope.fetchData();
                }, 1000);
            };

            $scope.stop = function() {
                if (angular.isDefined(stop)) {
                    $interval.cancel(stop);
                    stop = undefined;
                }
            };

            $scope.$on('$destroy', function() {
                // Make sure that the interval is destroyed too
                $scope.stop();
            });
        });

        app.filter('graphDataFilter', function () {
            return function (data, series) {
                var r = [];

                for (var s = 0; s < series.length; s++) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].key == series[s].key) {
                            r.push({ key: series[s].label, values: data[i].values, disabled: !series[s].enabled });
                        }
                    }
                }

                return r;
            };
        })

        app.directive('extendedChart', function () {
            return {
                restrict: 'E',
                link: function ($scope) {
                    $scope.d3Call = function (data, chart) {
                        var svg = d3.select('#' + $scope.id + ' svg').datum(data);

                        var path = svg.selectAll('path');

                        path.data(data)
                            .transition()
                            .ease("linear")
                            .duration(300);

                        return svg.transition()
                            .duration(300)
                            .call(chart);
                    };
                }
            };
        })


