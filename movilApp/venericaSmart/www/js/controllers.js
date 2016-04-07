angular.module('starter.controllers', [])

    .controller('PanelCtrl', function ($scope, $http, $interval) {
        $scope.resultado = {};
        $scope.relay = {result: false};
        $scope.automatico = true;
        $scope.automatico2 = true;

        $scope.getDate = function () {
            $http.get('http://smart.venericameat.com/apis/last_record.json').then(
                function (response) {
                    $scope.resultado = response.data.record[0].panel_192_168_1_1;
                    console.log($scope.resultado.current);
                    if ($scope.resultado.current == 1) {
                        $scope.relay.result = true;
                    }
                    else {
                        $scope.relay.result = false;
                    }
                    $scope.automatico = true;
                    console.log($scope.relay.result);
                },
                function (err) {
                    $scope.automatico = true;
                    console.log(err);
                    $scope.resultado = err;
                }
            );
        };

        $interval(function () {
            if ($scope.automatico) {
                $scope.getDate();
            }
        }, 1000);

        function jsonToQueryString(json) {
            return '?' +
            Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
            }).join('&');
        }

        $scope.switchButton = function () {
            $scope.automatico = false;
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
        }

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
