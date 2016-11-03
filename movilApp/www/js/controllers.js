angular.module('starter.controllers', [])
    .controller('LoginCtrl', function ($http, $location, ConfigLocal, $state, $scope, $ionicPopup, $cordovaSQLite) {
        console.log('login');
        $scope.formLogin = {};

        $scope.login = function () {
            $http.get(ConfigLocal.host + '/apis/login/' + $scope.formLogin.username + '/' + $scope.formLogin.password + '.json').then(
                function (res) {
                    console.log(res);
                    if (res.data.msg == 'ok') {
                        $state.go('tab.panel')
                    }
                    if (res.data.msg == 'error') {
                        $ionicPopup.alert({
                            title: 'Alert!',
                            template: 'Login or Password Incorrect'
                        });
                    }
                },
                function (err) {
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
            {name: 'venerica', host: 'http://smart.venericameat.com'},
            {name: 'Mi Casa', host: '172.168.12.123'}
        ];
        $scope.formHost = {};

        /**
         * Open form create panel
         */
        $scope.openCreate = function () {
            $scope.create = true;
            $scope.formHost = {};
        };

        /**
         * Close form create
         */
        $scope.closeCreate = function () {
            $scope.create = false;
            $scope.formHost = {};
        };
    })
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
            $http.get(ConfigLocal.host + '/apis/last_record.json').then(
                function (response) {
                    console.log(response);
                    var thermostat = response.data.thermostat[0].thermostat;
                    $scope.thermostat = {
                        temp: thermostat.temp,
                        band: thermostat.band,
                        current: thermostat.current,
                        cooler: thermostat.cooler,
                        heater: thermostat.heater
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

        $scope.getRecords = function () {
            $scope.automatico = false;
            $http.get(ConfigLocal.host + '/apis/get_tables_records.json').then(
                function (response) {
                    //console.log(response);
                    var thermostat = response.data.thermostat[0].thermostat;
                    $scope.thermostat = {
                        temp: thermostat.temp,
                        band: thermostat.band,
                        current: thermostat.current,
                        cooler: thermostat.cooler,
                        heater: thermostat.heater
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
            $http.get(ConfigLocal.host + '/apis/get_switch_light/' + record.zone.table_name + '.json').then(
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
            $http.get(ConfigLocal.host + '/apis/unlock_door.json').then(
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
            $http.get(ConfigLocal.host + '/apis/update_thermostat/' + temp + '/' + band + '.json').then(
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

        $scope.$watch('thermostat.band', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $scope.automatico = false;
                $scope.load = false;
                $scope.updateThermostat();
            }
        });

        /**
         * Edit by keyboard the thermostat
         */
        $scope.promptTemp = function () {
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
                    {text: 'Cancel'},
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
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
        $scope.openCreate = function () {
            $scope.create = true;
            console.log('Hola internet');
            $scope.formRoom = {};
        };

        /**
         * Close form create
         */
        $scope.closeCreate = function () {
            $scope.create = false;
            $scope.formRoom = {};
        };


        /**
         * upload form to api serve
         */
        $scope.createPanel = function () {
            if (!$scope.formRoom.name || !$scope.formRoom.ip) {
                alert('Required Name and IP');
            }
            else {
                $http.get(ConfigLocal.host + '/apis/create_panel/' + $scope.formRoom.name + '/' + $scope.formRoom.ip + '.json').then(
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
    .controller('ConfigPanelCtrl', function (ConfigLocal, $scope, $http, $ionicPopup, $stateParams, $httpParamSerializerJQLike) {
        console.log($stateParams.id);

        /**
         * Config Movement
         * @type {{}}
         */
        $scope.config = {};

        $scope.getConfig = function () {
            $http.get(ConfigLocal.host + '/apis/get_config_panel/' + $stateParams.id + '.json').then(
                function (res) {
                    console.log(res);
                    $scope.config = res.data.config.panel_config;
                    if($scope.config.mon_stat == 1){
                        $scope.config.mon_stat = true;
                    }
                    else {
                        $scope.config.mon_stat = false;
                    }
                    if($scope.config.tue_stat == 1){
                        $scope.config.tue_stat = true;
                    }
                    else {
                        $scope.config.tue_stat = false;
                    }
                    if($scope.config.wed_stat == 1){
                        $scope.config.wed_stat = true;
                    }
                    else {
                        $scope.config.wed_stat = false;
                    }
                    if($scope.config.thu_stat == 1){
                        $scope.config.thu_stat = true;
                    }
                    else {
                        $scope.config.thu_stat = false;
                    }
                    if($scope.config.fri_stat == 1){
                        $scope.config.fri_stat = true;
                    }
                    else {
                        $scope.config.fri_stat = false;
                    }
                    if($scope.config.sat_stat == 1){
                        $scope.config.sat_stat = true;
                    }
                    else {
                        $scope.config.sat_stat = false;
                    }
                    if($scope.config.sun_stat == 1){
                        $scope.config.sun_stat = true;
                    }
                    else {
                        $scope.config.sun_stat = false;
                    }

                },
                function (err) {
                    console.log(err);
                    $ionicPopup.alert({
                        title: 'Alert!',
                        template: 'Connect Error'
                    });
                }
            )
        }

        $scope.getConfig();

        $scope.save = function(){
            var json = angular.copy($scope.config);
            if($scope.config.mon_stat){
                json.mon_stat = 1;
            }
            else {
                json.mon_stat = 0;
            }
            if($scope.config.tue_stat){
                json.tue_stat = 1;
            }
            else {
                json.tue_stat = 0;
            }
            if($scope.config.wed_stat){
                json.wed_stat = 1;
            }
            else {
                json.wed_stat = 0;
            }
            if($scope.config.thu_stat){
                json.thu_stat = 1;
            }
            else {
                json.thu_stat = 0;
            }
            if($scope.config.fri_stat){
                json.fri_stat = 1;
            }
            else {
                json.fri_stat = 0;
            }
            if($scope.config.sat_stat){
                json.sat_stat = 1;
            }
            else {
                json.sat_stat = 0;
            }
            if($scope.config.sun_stat){
                json.sun_stat = 1;
            }
            else {
                json.sun_stat = 0;
            }
            $http.get(ConfigLocal.host + '/apis/put_config_panel/' + $stateParams.id + '.json?'+$httpParamSerializerJQLike(json)).then(
                function(res){
                    $ionicPopup.alert({
                        title: 'Alert!',
                        template: 'Update Success'
                    });
                },
                function(err){
                    console.log(err);
                    $ionicPopup.alert({
                        title: 'Alert!',
                        template: 'Connect Error'
                    });
                }
            );
        }


        /**
         * Config cam
         */
        $scope.listCam = [];
        $scope.formCam = {};

        $scope.getList = function(){
            $http.get(ConfigLocal.host + '/apis/get_cam_list/' + $stateParams.id + '.json').then(
                function (res) {
                    console.log(res);
                    $scope.listCam = res.data.cams;
                },
                function (err) {
                    console.log(err);
                    $ionicPopup.alert({
                        title: 'Alert!',
                        template: 'Connect Error'
                    });
                }
            )
        }

        $scope.getList();

        $scope.deleteCam = function(id){
            $http.get(ConfigLocal.host + '/apis/delete_cam/' + id + '.json').then(
                function (res) {
                    $ionicPopup.alert({
                        title: 'Alert!',
                        template: 'Delete Success'
                    });
                    $scope.getList();
                },
                function (err) {
                    console.log(err);
                    $ionicPopup.alert({
                        title: 'Alert!',
                        template: 'Connect Error'
                    });
                }
            )
        }

        $scope.saveCam = function(){
            console.log($scope.formCam);
            var json = {
                zone_id:$stateParams.id,
                name:$scope.formCam.name,
                host:$scope.formCam.host
            }
            $http.get(ConfigLocal.host + '/apis/post_cam.json?'+$httpParamSerializerJQLike(json)).then(
                function (res) {
                    $ionicPopup.alert({
                        title: 'Alert!',
                        template: 'Create Success'
                    });
                    $scope.closeCreate();
                    $scope.getList();
                },
                function (err) {
                    console.log(err);
                    $ionicPopup.alert({
                        title: 'Alert!',
                        template: 'Connect Error'
                    });
                }
            )
        }

        $scope.updateCam = function(cam){
            var json = {
                zone_id:$stateParams.id,
                name:cam.name,
                host:cam.host
            }
            $http.get(ConfigLocal.host + '/apis/put_cam/'+cam.id+'.json?'+$httpParamSerializerJQLike(json)).then(
                function (res) {
                    $ionicPopup.alert({
                        title: 'Alert!',
                        template: 'Update Success'
                    });
                },
                function (err) {
                    console.log(err);
                    $ionicPopup.alert({
                        title: 'Alert!',
                        template: 'Connect Error'
                    });
                }
            )
        }

        $scope.openCreate = function () {
            $scope.create = true;
            $scope.formCam = {};
        };

        $scope.closeCreate = function () {
            $scope.create = false;
            $scope.formCam = {};
        };

    })
    .controller('CamCtrl', function (ConfigLocal, $scope, $http, $stateParams, $ionicPopup) {
        $scope.listCam = [];
        $scope.formCam = {};

        $scope.getList = function(){
            $http.get(ConfigLocal.host + '/apis/get_cam_list/' + $stateParams.id + '.json').then(
                function (res) {
                    console.log(res);
                    $scope.listCam = res.data.cams;
                    $ionicPopup.alert({
                        title: 'Alert!',
                        template: 'Wait a Moment'
                    });
                },
                function (err) {
                    console.log(err);
                    $ionicPopup.alert({
                        title: 'Alert!',
                        template: 'Connect Error'
                    });
                }
            )
        }

        $scope.getList();
    });
