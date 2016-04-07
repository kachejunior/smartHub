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
        $this->set(array(
            'record' => $record,
            '_serialize' => array('record')
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
        sleep(3);
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

    public function unlock_door()
    {
        $msg = 'error de insercion';
        $aux = null;
        $this->response->header('Access-Control-Allow-Origin', '*');
        $this->Api->query('UPDATE door SET door.lock=1 WHERE (door.lock=0);');
        sleep(3);
        $this->Api->query('UPDATE door SET door.lock=0 WHERE (door.lock=1);');
        $msg = 'ok';
        $this->set(array(
            'msg' => $msg,
            '_serialize' => array('msg')
        ));
    }
}