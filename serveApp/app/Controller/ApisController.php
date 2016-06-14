<?php

App::uses('AppController', 'Controller');


class ApisController extends AppController
{

    /**
     * Components
     *
     * @var array
     */
    public $components = array('RequestHandler');


    /**
     * Devuelve el ultimo registro
     */
    public function last_record()
    {
        $this->response->header('Access-Control-Allow-Origin', '*');
        $record = $this->Api->query('select * from panel_192_168_1_1 order by id DESC limit 1');
        $thermostat = $this->Api->query('select * from thermostat order by id DESC limit 1');
        $temp = $this->Api->query('select * from temp_log order by id DESC limit 1');
        $this->set(array(
            'record' => $record,
            'thermostat' => $thermostat,
            'temp' => $temp[0],
            '_serialize' => array('record', 'thermostat', 'temp')
        ));
    }

    public function add_record()
    {
        $msg = 'error de insercion';
        $aux = null;
        $this->response->header('Access-Control-Allow-Origin', '*');
        $record = $this->Api->query('select * from panel_192_168_1_1 order by id DESC limit 1');
        $current = $record[0]['panel_192_168_1_1']['current'];
        $sql = 'update panel_192_168_1_1 set relay = 1 where id=' . $record[0]['panel_192_168_1_1']['id'];
        $this->Api->query($sql);

        $aux = false;
        sleep(1);
        $record2 = $this->Api->query('select * from panel_192_168_1_1 order by id DESC limit 1');
        if ($record2[0]['panel_192_168_1_1']['current'] != $current) {
            $aux = true;
        }

        $sql2 = 'update panel_192_168_1_1 set relay = 0 where id=' . $record[0]['panel_192_168_1_1']['id'];
        $this->Api->query($sql2);

        if ($aux) {
            $msg = 'ok';
        } else {
            $msg = 'error';
        }


        $msg = 'ok';
        $this->set(array(
            'sql' => $sql,
            'record' => $record,
            'msg' => $msg,
            '_serialize' => array('msg', 'sql', 'record')
        ));
    }

    public function update_thermostat($temp, $band)
    {
        $msg = 'error de insercion';
        $aux = null;
        $this->response->header('Access-Control-Allow-Origin', '*');
        $thermostat = $this->Api->query('select * from thermostat order by id DESC limit 1');
        $id = $thermostat[0]['thermostat']['id'];
        $this->Api->query("UPDATE thermostat SET temp='" . $temp . "', band='" . $band . "' WHERE (id='" . $id . "');");
        $msg = 'ok';
        $this->set(array(
            'msg' => $msg,
            '_serialize' => array('msg')
        ));
    }

    public function unlock_door()
    {
        $msg = 'error de insercion';
        $aux = null;
        $this->response->header('Access-Control-Allow-Origin', '*');
        $this->Api->query('UPDATE door SET door.lock=1 WHERE (door.lock=0);');
        sleep(1);
        $this->Api->query('UPDATE door SET door.lock=0 WHERE (door.lock=1);');
        $msg = 'ok';
        $this->set(array(
            'msg' => $msg,
            '_serialize' => array('msg')
        ));
    }

    public function create_panel($name, $ip)
    {
        $this->response->header('Access-Control-Allow-Origin', '*');

        $name_table = 'panel_'.str_replace('.','_',$ip);

        $sql = "CREATE TABLE ".$name_table." (" .
            " id int(11) NOT NULL AUTO_INCREMENT," .
            " temperature varchar(255) COLLATE utf8_bin DEFAULT NULL," .
            " humidity varchar(255) COLLATE utf8_bin DEFAULT NULL," .
            " movement int(11) DEFAULT NULL," .
            " current int(11) DEFAULT NULL," .
            " relay int(11) DEFAULT NULL," .
            " date_time timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," .
            " light int(11) DEFAULT NULL," .
            " PRIMARY KEY (id)" .
            " ) ENGINE=InnoDB AUTO_INCREMENT=318 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;";
        $this->Api->query($sql);

        $this->Api->query("insert into zones (name, ip, table_name) values ('".$name."', '".$ip."', '".$name_table."')");

        $msg = 'ok';
        $this->set(array(
            'msg' => $msg,
            '_serialize' => array('msg')
        ));
    }

    public function get_config ($id){
        $msg = 'error de insercion';
        $aux = null;
        $this->response->header('Access-Control-Allow-Origin', '*');
        $record = $this->Api->query('select * from panel_config where zone_id ='.$id);
        $msg = 'ok';
        $this->set(array(
            'record' => $record[0],
            '_serialize' => array('record')
        ));
    }


    public function update_hour_move ($hour_move_off, $hour_move_on, $id){
        $msg = 'error de insercion';
        $aux = null;
        $this->response->header('Access-Control-Allow-Origin', '*');
        $this->Api->query('UPDATE panel_config SET hour_move_off = '.$hour_move_off.' , hour_move_on = '.$hour_move_on.' WHERE zone_id = '.$id);
        $msg = 'ok';
        $this->set(array(
            'msg' => $msg,
            '_serialize' => array('msg')
        ));
    }
}