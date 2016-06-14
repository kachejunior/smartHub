angular.module('starter.controllers', [])
    .controller('PanelCtrl', function ($scope, $http, $interval, localStorageService, ConfigLocal) {
        $scope.resultado = {};
        $scope.relay = {result: false};
        $scope.automatico = true;
        $scope.automatico2 = true;
        $scope.load = true;
        $scope.formRoom = {};
        $scope.create = false;
        $scope.thermostat = {
            temp: 10,
            band: 0,
            current: 0
        };
        $scope.temp = {};


        $scope.getData = function () {
            $scope.automatico = false;
            $http.get(ConfigLocal.host+'/apis/last_record.json').then(
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
                $scope.getData();
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
            $http.get(ConfigLocal.host+'/apis/add_record.json').then(
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
            $http.get(ConfigLocal.host+'/apis/unlock_door.json').then(
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

        /*General Thermostate*/
        /**
         * Update de thermostate and band by api server
         */
        $scope.updateThermostat = function () {
            $scope.automatico = false;
            var temp = $scope.thermostat.temp;
            var band = $scope.thermostat.band;
            $http.get(ConfigLocal.host+'/apis/update_thermostat/' + temp + '/' + band + '.json').then(
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

        /**
         * +1 in band control
         */
        $scope.upValue = function () {
            $scope.automatico = false;
            $scope.thermostat.band = parseFloat($scope.thermostat.band) + parseFloat(1);
            $scope.updateThermostat();
        };

        /**
         * -1 in band control
         */
        $scope.downValue = function () {
            $scope.automatico = false;
            $scope.thermostat.band = parseFloat($scope.thermostat.band) - parseFloat(1);
            $scope.updateThermostat();
        };

        /**
         * when the nest themostat control edit, call $scope.updateThermostat()
         */
        $scope.$watch('thermostat.temp', function (newValue, oldValue) {
            if ((newValue != oldValue)) {
                console.log(newValue);
                $scope.automatico = false;
                $scope.updateThermostat();
            }
        });

        /**
         * Edit by keyboard the thermostat
         */
        $scope.promptTemp = function(){
            var temperature = prompt("Please enter your temperature");
            if (temperature != null) {
                $scope.thermostat.temp = temperature;
            }
        };


        /* Create panel options*/
        /**
         * Open form create panel
         */
        $scope.openCreate = function() {
            $scope.create = true;
            console.log('Hola internet');
            $scope.formRoom = {};
        };

        /**
         * Close form create
         */
        $scope.closeCreate = function() {
            $scope.create = false;
            $scope.formRoom = {};
        };


        /**
         * upload form to api serve
         */
        $scope.createPanel = function(){
            if(!$scope.formRoom.name || !$scope.formRoom.ip){
                alert('Required Name and IP');
            }
            else {
                $http.get(ConfigLocal.host+'/apis/create_panel/'+$scope.formRoom.name+'/'+$scope.formRoom.ip+'.json').then(
                    function (response) {
                        alert('Success');
                        $scope.create = false;
                    },
                    function (err) {
                        alert('Error Conection');
                    }
                );
            }
        };
    })

    .controller('ConfigCtrl', function ($scope, $http, localStorageService, ConfigLocal, $cordovaSQLite) {
        $scope.data = {};

        $scope.getConfig = function(){
            $http.get(ConfigLocal.host+'/apis/get_config/' + 1 + '.json').then(
                function (response) {
                    $scope.data = {
                        hour_move_off:response.data.record.panel_config.hour_move_off,
                        hour_move_on:response.data.record.panel_config.hour_move_on
                    };
                    console.log(response);
                },
                function (err) {
                    console.log(err);
                }
            );
        };

        $scope.getConfig();


        $scope.saveHour = function(){
            $http.get(ConfigLocal.host+'/apis/update_hour_move/' + $scope.data.hour_move_off + '/' + $scope.data.hour_move_on + '/' + 1 + '.json').then(
                function (response) {
                    alert('Config Success');
                    console.log(response);
                },
                function (err) {
                    console.log(err);
                }
            );
        }

        
        var db = $cordovaSQLite.openDB({ name: "my.db", bgType: 1 });

        $scope.execute = function() {
            var query = "INSERT INTO users (username) VALUES (?)";
            $cordovaSQLite.execute(db, query, ["user_test"]).then(function(res) {
                console.log("insertId: " + res.insertId);
            }, function (err) {
                console.error(err);
            });
        };

        $scope.test = function() {
            var query = "select * from users";
            $cordovaSQLite.execute(db, query, ["test", 100]).then(function(res) {
                console.log(res);
            }, function (err) {
                console.error(err);
            });
        };
    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('CamCtrl', function ($scope) {
        $scope.settings = {
            enableFriends: true
        };
    });
