@extends('layouts.app')
@section('content')
<div class="assessment-progress" id="assessment-prgs" style="">
  <div class="navigation">
      <div class="assesmentWrap" id="" style="">
          <div class="assesmentName mt-5" id="disp_test_name">
              <h3  id='quest1'>   </h3>
          </div>
      </div>
  </div>
  <div class="text-center">
    
    @if (session('error'))
      <div class=" col-md-6 offset-md-3 text-center alert alert-danger">
        {{ session('error') }}
      </div>
    @endif
      <h3>Question 1</h3>
  </div> 
  <div id="progress_section" style="">
      <!-- line starts -->
      <div class="progressBar">
          <div class="time" id="pretty_qn_time"><i class="far fa-clock"></i> 00 min 00 sec</div>             
          
          <div class="question-progress" id="tbl_info" style="">
            @foreach($questions as $key => $question)
              <div class="circle " id='key{{$key}}' id="tdef_1">{{$key+1}}</div>
            @endforeach  
          </div>

          <div class="answered" id="sec_ans_info"><p>0 of {{$key+1}} Answered</p></div>
      </div>           
  </div>

 

  <div class="hr" style=""></div>


  
</div>                            
          </div>

          <div id="disp_sec_time" class="timer_div timer" style="display:none;">
              <div class="time" id="sec_pretty_time"></div>
          </div>

          <!--"Assesment hero" starts here-->
          <div class="assesmentHeroWrapper">
              <div class="heroQuestions1">

                  <div class="questionNumbers" id="sec_qus_no"> 
                      <div class="numbers">
                          <h3 id="q_no">1</h3>
                      </div>
                      <div class="vertLineWrapper">
                          <div class="vertLine" style="height: 990.33px;"></div>
                      </div>  
                  </div>

                  <div class="mainTextWrap">
                      <div class="questionTextWrapper">
                          <div class="questionText">
                              <p id="disp_qus" tabindex="1" class="qus-1228" style="">
                                <span class="qus-default ch-lang cls-en" id="quest2"> </span>
                              </p>                                
                          </div>
                          <div class="questionButton">   
                              <div class="questionButtonWrapper">

                              </div> 
                                  <button class="submit" id='next'>Next</button>
                                  
                              </div>                                
                          </div>
                      </div>
                  </div>

              </div>
          </div>
</div>
</div>
</div>
@endsection
@section('js')
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

<script>
 
 $(document).ready(function () {
      
      var questions= <?php echo json_encode($questions); ?>;
      var sectionID = <?php echo json_encode($data); ?>;
      var sectionID = sectionID[0].sectionID;
      
      var questionLength = questions.length;
      questionLength= questionLength;
     
      var question=$('#quest2');
      var choice=$('#btn_choice');
      var ansered=$('#sec_ans_info');
      var i=0;
      var choiceData='';
      var qValue=questions[i].qid;
      var choiceVal=questions[i].choices.cid;
      
      var q=questions[i];
      var ans=questions[i].choices;
      question.text(q.question);
      question.attr('value',qValue);
      $('#submit').hide();
      
      
      
      $.ajaxSetup({
      headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      }
     });
      
      basic();
      function basic(){
          choice.text(q.choice);
          $('#key'+i).addClass('ongoing-sct');
          questionShow();
          
          
          var valueBtn=document.querySelectorAll("#btn_choice");
              valueBtn.forEach(function(btn){
                btn.addEventListener('click',function(e){
                   var choiceVal=e.currentTarget.value; 
                    e.currentTarget.classList.add('selected');
                    
                    valueBtn.forEach(function(btn){
                      if(btn.value!=choiceVal){
                        btn.classList.remove('selected');
                      }
                    });
                    });
                });
      }
       
      function questionShow(){
        var i=1;
        var j=0;
        var k=0;
        $.each(ans, function (index, value) { 
                choiceData+='<button class="btn btn-select ch-default ch-lang cls-en" id="btn_choice"  value='+value.cid +'>'+value.choiceData +'</button>';
              });

          $('.questionButtonWrapper').html(choiceData); 
          
        var valueBtn=document.querySelectorAll("#btn_choice");
              valueBtn.forEach(function(btn){
                btn.addEventListener('click',function(e){
                    choiceVal=e.currentTarget.value; 
                    e.currentTarget.classList.add('selected');
                    
                    valueBtn.forEach(function(btn){
                      if(btn.value!=choiceVal){
                        btn.classList.remove('selected');
                      }
                    });
                    });
                });

        var qId=$('#disp_qus').children('#quest2').attr('value');
       
      
        
        $('#next').on('click',function(){


          var qId=$('#disp_qus').children('#quest2').attr('value');
          
          var choiceData='';
          
            ansered.text(i +' of '+questionLength+' Answered');
           
          if(questionLength>i){
            var q=questions[i];
             qValue=questions[i].qid;
             
            var ans=questions[i].choices;
             
            question.text(q.question); 
            question.attr('value',qValue);
              $.each(ans, function (index, value) { 
                choiceData+='<button class="btn btn-select ch-default ch-lang cls-en" id="btn_choice"  value='+value.cid +'  >'+value.choiceData +'</button>';
                
              });
               $('.questionButtonWrapper').html(choiceData); 
              keys(i);
              

              var valueBtn=document.querySelectorAll("#btn_choice");
              valueBtn.forEach(function(btn){
                btn.addEventListener('click',function(e){
                   choiceVal=e.currentTarget.value; 
                    e.currentTarget.classList.add('selected');
                    
                    valueBtn.forEach(function(btn){
                      if(btn.value!=choiceVal){
                        btn.classList.remove('selected');
                      }
                    });
                    });
                });
                i++; 
             }
           
           

             $.ajax({
                    url:"{{url('/store')}}",
                    type:"POST",
                    data:{
                      "qid":qId,
                     "cid":choiceVal,
                    },
                    success:function(response){
                      console.log(response);
                    }
                  });

             if(questionLength==i){
                $('#next').text('submit');
                $('#next').addClass('completed');
                 $('.completed').on('click',function(){
                      submit();
                     $(this).hide();
                 }); 
             }
             choiceVal='';  
        });
        
      }
      console.log(i);


        function keys(i)
        {
          var key=$('#key'+i).html();
         
            $('#key'+i).addClass('ongoing-sct');
            $('#q_no').html(key);
        }
            
        
        function btnChoice(){ 
          var valueBtn=document.querySelectorAll("#btn_choice");
          valueBtn.forEach(function(btn){
            btn.addEventListener('click',function(e){
                ChoiceVal=e.currentTarget.value; 
                e.currentTarget.classList.add('selected');
                
                valueBtn.forEach(function(btn){
                  if(btn.value!=ChoiceVal){
                    btn.classList.remove('selected');
                  }
                });
                });
            });
           
          
        }
        
              function submit()
              {
                $.ajax({
                    url:"{{url('/submit')}}",
                    type:"POST",
                    data:{
                      "sectionID":sectionID,
                    },
                    success:function(response){
                      
                      window.location.href = "{{url('/assessment')}}";
  
                    }
                  });
                  
              }
              timer();
              function timer(){
                var timeleft = questionLength * 60;
                var downloadTimer = setInterval(function(){
                if(timeleft <= 0){
                  clearInterval(downloadTimer);
                  document.getElementById("pretty_qn_time").innerHTML = "Finished";
                  window.location.href = "{{url('/assessment')}}";
                } else {
                  document.getElementById("pretty_qn_time").innerHTML = secondToMinute(timeleft) + " remaining";
                }
                timeleft -= 1;
                }, 1000);
              }

              function secondToMinute(second){
                var minute=second/60;
                var min=parseInt(minute);
                var sec=second%60;
                return min+' Minute: '+sec+' Second'; 
              }

              
 });
 
</script>

@endsection

