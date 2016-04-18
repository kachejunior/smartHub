angular.module('starter.controllers', [])

    .controller('PanelCtrl', function ($scope, $http, $interval) {
        $scope.resultado = {};
        $scope.relay = {result: false};
        $scope.automatico = true;
        $scope.automatico2 = true;
        $scope.load = true;
        $scope.thermostat = {
            temp: 10,
            band: 0,
            current: 0
        };

        $scope.temp = {};

        $scope.getDate = function () {
            $scope.automatico = false;
            $http.get('http://smart.venericameat.com/apis/last_record.json').then(
                function (response) {
                    console.log(response);
                    var thermostat = response.data.thermostat[0].thermostat;
                    $scope.thermostat = {
                        temp: thermostat.temp,
                        band: thermostat.band,
                        current: thermostat.current
                    };
                    $scope.temp = response.data.temp.temp_log;
                    $scope.resultado = response.data.record[0].panel_192_168_1_1;
                    if ($scope.resultado.current == 1) {
                        $scope.relay.result = true;
                    }
                    else {
                        $scope.relay.result = false;
                    }
                    $scope.automatico = true;
                    $scope.load = true;
                },
                function (err) {
                    $scope.automatico = true;
                    $scope.load = true;
                    console.log(err);
                    $scope.resultado = err;
                }
            );
        };

        $interval(function () {
            if ($scope.automatico && $scope.load) {
                $scope.getDate();
            }
        }, 1000);

        $scope.switchButton = function () {
            $scope.load = false;
            if (($scope.resultado.light == 1) && ($scope.resultado.current == 0)) {
                var r = confirm('Enough Light Inside, Are you wants to turn the lamp anyway?');
                if (!r) {
                    $scope.relay.result = false;
                    return false;
                }
            }
            $http.get('http://smart.venericameat.com/apis/add_record.json').then(
                function (response) {
                    console.log(response);
                    if (response.data.msg == 'error') {
                        alert('Error');
                    }
                    $scope.getDate();
                },
                function (err) {
                    console.log(err);
                    $scope.automatico = true;
                }
            );
        };

        $scope.unlock = function () {
            $scope.automatico2 = false;
            $http.get('http://smart.venericameat.com/apis/unlock_door.json').then(
                function (response) {
                    console.log(response);
                    $scope.automatico2 = true;
                },
                function (err) {
                    console.log(err);
                    $scope.automatico2 = true;
                }
            );
        };

        $scope.updateThermostat = function () {
            $scope.automatico = false;
            var temp = $scope.thermostat.temp;
            var band = $scope.thermostat.band;
            $http.get('http://smart.venericameat.com/apis/update_thermostat/' + temp + '/' + band + '.json').then(
                function (response) {
                    console.log(response);
                    $scope.automatico = true;
                },
                function (err) {
                    console.log(err);
                    $scope.automatico = true;
                }
            );
        };

        $scope.upValue = function () {
            $scope.automatico = false;
            $scope.thermostat.band = parseFloat($scope.thermostat.band) + parseFloat(1);
            $scope.updateThermostat();
        };
        $scope.downValue = function () {
            $scope.automatico = false;
            $scope.thermostat.band = parseFloat($scope.thermostat.band) - parseFloat(1);
            $scope.updateThermostat();
        };

        $scope.$watch('thermostat.temp', function (newValue, oldValue) {
            if ((newValue != oldValue)) {
                console.log(newValue);
                $scope.automatico = false;
                $scope.updateThermostat();
            }
        });

    })

    .controller('ConfigCtrl', function ($scope, $sce) {
        $scope.config = {
            sources: [
                {
                    src: $sce.trustAsResourceUrl('http://static.videogular.com/assets/videos/videogular.mp4'),
                    type: 'video/mp4'
                }
            ],
            useNativeControls: true,
            style: 'http://www.videogular.com/styles/themes/default/latest/videogular.css'
        }
    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('CamCtrl', function ($scope) {
        $scope.settings = {
            enableFriends: true
        };
    });
