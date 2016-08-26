angular.module('starter.controllers', [])
    .controller('PanelCtrl', function ($scope, $http, $interval, localStorageService, ConfigLocal, $ionicPopup) {
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
        $scope.records = [];


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

        $scope.getRecords = function(){
            $scope.automatico = false;
            $http.get(ConfigLocal.host+'/apis/get_tables_records.json').then(
                function (response) {
                    //console.log(response);
                    var thermostat = response.data.thermostat[0].thermostat;
                    $scope.thermostat = {
                        temp: thermostat.temp,
                        band: thermostat.band,
                        current: thermostat.current
                    };
                    $scope.temp = response.data.temp.temp_log;

                    $scope.records = response.data.record;
                    console.log($scope.records);
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
                $scope.getRecords();
            }
        }, 1000);

        $scope.switchButton = function (record) {
            $scope.load = false;
            if ((record.last_record.light == 1) && (record.last_record.current == 0)) {
                var r = confirm('Enough Light Inside, Are you wants to turn the lamp anyway?');
                if (!r) {
                    $scope.load = true;
                    $scope.relay.result = false;
                    return false;
                }
            }
            $http.get(ConfigLocal.host+'/apis/get_switch_light/'+record.zone.table_name+'.json').then(
                function (response) {
                    console.log(response);
                    if (response.data.msg == 'error') {
                        alert('Error');
                    }
                    $scope.load = true;
                    $scope.getRecords();
                },
                function (err) {
                    console.log(err);
                    $scope.load = true;
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
                    $scope.load = true;
                },
                function (err) {
                    console.log(err);
                    $scope.automatico = true;
                    $scope.load = true;
                }
            );
        };


        /**
         * +1 in temp control
         */
        $scope.upTemp = function () {
            $scope.automatico = false;
            $scope.load = false;
            $scope.thermostat.temp = parseFloat($scope.thermostat.temp) + parseFloat(1);
            $scope.updateThermostat();
        };

        /**
         * -1 in temp control
         */
        $scope.downTemp = function () {
            $scope.automatico = false;
            $scope.load = false;
            $scope.thermostat.temp = parseFloat($scope.thermostat.temp) - parseFloat(1);
            $scope.updateThermostat();
        };

        $scope.$watch('thermostat.band', function(newValue, oldValue) {
            if(newValue != oldValue){
                $scope.automatico = false;
                $scope.load = false;
                $scope.updateThermostat();
            }
        });

        /**
         * Edit by keyboard the thermostat
         */
        $scope.promptTemp = function(){
            //var temperature = prompt("Please enter your temperature");
            /*if (temperature != null) {
                $scope.thermostat.temp = temperature;
            }*/
            // An elaborate, custom popup
            $scope.automatico = false;
            console.log($scope.automatico);
            $scope.load = false;
            $scope.data = {};

            var myPopup = $ionicPopup.show({
                template: '<input type="number" ng-model="data.temp">',
                title: 'Please enter your temperature',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.temp) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                $scope.thermostat.temp = angular.copy($scope.data.temp);
                                $scope.updateThermostat();
                                $scope.load = true;
                                return $scope.data.temp;
                            }
                        }
                    }
                ]
            });

            console.log(myPopup);
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
    })

    .controller('LoginCtrl', function ($http,$location, ConfigLocal, $state, $scope, $ionicPopup, $cordovaSQLite) {
        console.log('login');
        $scope.formLogin = {};

        $scope.login = function(){
            $http.get(ConfigLocal.host+'/apis/login/' + $scope.formLogin.username + '/'+$scope.formLogin.password+'.json').then(
                function(res){
                    console.log(res);
                    if(res.data.msg == 'ok'){
                        $ionicPopup.alert({
                            title: 'Alert!',
                            template: 'Successful'
                        });
                        $state.go('tab.panel')
                    }
                    if(res.data.msg == 'error'){
                        $ionicPopup.alert({
                            title: 'Alert!',
                            template: 'Login or Password Incorrect'
                        });
                    }
                },
                function(err){
                $ionicPopup.alert({
                    title: 'Alert!',
                    template: 'Problem with the conection'
                });
            });
        }
        //var db = $cordovaSQLite.openDB({ name: "my.db" });

        // for opening a background db:
        /*var db = $cordovaSQLite.openDB({ name: "my.db", bgType: 1 });

        $scope.execute = function() {
            var query = "INSERT INTO test_table (data, data_num) VALUES (?,?)";
            $cordovaSQLite.execute(db, query, ["test", 100]).then(function(res) {
                console.log("insertId: " + res.insertId);
            }, function (err) {
                console.error(err);
            });
        };*/

    })

    .controller('HostingCtrl', function ($scope, $cordovaSQLite) {
        console.log('login');
        $scope.create = false;
        $scope.listHost = [
            {name:'venerica', host:'http://smart.venericameat.com'},
            {name:'Mi Casa', host:'172.168.12.123'}
        ];
        $scope.formHost = {};

        /**
         * Open form create panel
         */
        $scope.openCreate = function() {
            $scope.create = true;
            $scope.formHost = {};
        };

        /**
         * Close form create
         */
        $scope.closeCreate = function() {
            $scope.create = false;
            $scope.formHost = {};
        };
    })

    .controller('CamCtrl', function ($scope) {
        $scope.settings = {
            enableFriends: true
        };
    });
