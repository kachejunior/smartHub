<?php

App::uses('AppController', 'Controller');


class ZonesController extends AppController
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
        $record = $this->Zone->query('select * from panel_192_168_1_1 order by id DESC limit 1');
        $this->set(array(
            'record' => $record,
            '_serialize' => array('record')
        ));
    }

    public function add_record($switch = 0)
    {
        $msg = 'error de insercion';
        $aux = null;
        $this->response->header('Access-Control-Allow-Origin', '*');
        $record = $this->Zone->query('select * from panel_192_168_1_1 order by id DESC limit 1');
        if($record[0]['panel_192_168_1_1']['relay']==1){
            $aux = 0;
        }
        else{
            $aux = 1;
        }
        $sql = 'update panel_192_168_1_1 set relay = '.$aux.' where id='.$record[0]['panel_192_168_1_1']['id'];
        $this->Zone->query($sql);
        $msg = 'ok';
        $this->set(array(
            'sql' => $sql,
            'record' => $record,
            'msg' => $msg,
            '_serialize' => array('msg', 'sql','record')
        ));
    }

    public function unlock_door()
    {
        $msg = 'error de insercion';
        $aux = null;
        $this->response->header('Access-Control-Allow-Origin', '*');
        $this->Zone->query('UPDATE door SET door.lock=1 WHERE (door.lock=0);');
        sleep(3);
        $this->Zone->query('UPDATE door SET door.lock=0 WHERE (door.lock=1);');
        $msg = 'ok';
        $this->set(array(
            'msg' => $msg,
            '_serialize' => array('msg')
        ));
    }
}