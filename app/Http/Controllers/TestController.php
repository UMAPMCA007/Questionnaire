<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Test;
use Illuminate\Http\Request;

class TestController extends Controller
{
      public  $username='midhun';
      public  $emailid = 'midhuntest@yopmail.com';
      public  $assessmentID = 104;

    public function index()
    {  
       
            $error="";
            $subject= Assessment::all()->toArray();
            $client = new \GuzzleHttp\Client(['verify' =>false]);
            $response = $client->request('GET', 'https://assessment.dev.futuremug.com:8089/test/assessment/'.$this->username.'/'.$this->emailid.'/getdetails?assessment='.$this->assessmentID);
            $data = json_decode($response->getBody()->getContents(), true);       
            $data=$data['sub_sections'];
            return view('assessment.index', compact('data','subject','error'));    
    }

    public function test($sessionID,$sessionName,$i,Request $request)
    {
            $k=0;
            $asses= Assessment::all();
            if(count($asses)>0){
                foreach($asses as $asse){
                    $k=$asse->i;
                }
            }

            if($i==$k){
                $subject=new Assessment();
                $subject->section_id=$sessionID;
                $subject->section_name=$sessionName;
                $subject->i=$k+1;
                $subject->save();
                $client = new \GuzzleHttp\Client(['verify' => false]);
                $response = $client->request('GET', 'https://assessment.dev.futuremug.com:8089/test/assessment/sections/'.$this->username.'/'.$this->assessmentID.'/questions?section='.$sessionName);
                $data = json_decode($response->getBody()->getContents(), true);
                $questions=$data[0]['questions'];
                return view('assessment.task',compact('questions','data','sessionID','sessionName','i'));

            }else{
                session()->flash('error', 'PLEASE COMPLETE THE PREVIOUS SECTION');
                return redirect()->route('assessment');
            }

        
       
    }

    public function store(Request $request){

        $request->validate([
            'qid' => 'required',
            'cid' => 'required',
        ]);
        
        if($request->qid && $request->cid){
            $test=new Test();
            $test->qestion_id=$request->qid;
            $test->answer_id=$request->cid;
            $test->save();
            return response()->json(['success'=>'Data is successfully added']);
        }
    
      
    }

    public function submit(Request $request)
    {
        
        $sectionID=$request->sectionID;        
        $data=Test::all();
        $data=$data->map(function($item){
            return [
                'question_id'=>$item->qestion_id,
                'answer_id'=>$item->answer_id
            ];
        });
        
        foreach($data as $ans){
           
               
            $answers[]=['qid'=>$ans['question_id'],'cid'=>$ans['answer_id']];
                     
        }
        $fullAnswer=[
            'answers'=>$answers,
            'assessmentid'=>$this->assessmentID,
            'isDisqualified'=>"",
            'reason'=>"",
            'pageReloadCount'=>"",
            'sectionid'=>$sectionID,
        ];
         
        $body=json_encode($fullAnswer);
       
        $client = new \GuzzleHttp\Client(['verify' =>false]);
        $url= 'https://assessment.dev.futuremug.com:8089/test/assessment/'.$this->username.'/'.$this->emailid.'/submit';
        try{
            $request = $client->request('POST', $url,['body'=> $body]);
                
        }catch(\Exception $e){
          $e->getMessage();
        }
        
        Test::truncate();
        
        return redirect()->route('assessment');
       
       
    }
    
}
