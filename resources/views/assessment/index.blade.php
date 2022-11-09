@extends('layouts.app')   
@section('content')
<div id="assessments_sect">  
 <div class="sections" id="sec_based_test">
        <div class="title ps-eng">ASSESSMENTS</div>
        @if (session('error'))
                <div class=" col-md-6 offset-md-3 text-center alert alert-danger">
                    {{ session('error') }}
                </div>
              @endif   
        <div class="cardsWrap-1" id="div">
            @foreach($data as  $key=>$value)
                <div class="col-md-2 profile"   rel="1" data-ref="{{$value['section_Name']}}">
                    <span class="name ps-eng">{{$value['section_Name']}}</span>
                    <div class="">
                        <div class="section-timer">
                            <i class="fi fi-rr-clock"></i>
                            <span>Approx. {{$value['Question_Count']}} mins</span>
                        </div>
                        <div class="buttons" style=""  >
                            @if($value['section_ID']==isset($subject[$key]['section_id']) )
                             <a  href="javascript:void(0);"  class="btn btn-primary col-md-11" id="btnStart" key="{{$key}}"> COMPLETED </a>
                           @else
                            <a  href="{{url('/test/'.$value["section_ID"].'/'.$value["section_Name"].'/'.$key)}}" class="btn btn-primary col-md-10" id="btnStart" key="{{$key}}">START</a>
                           @endif  
                        </div> 
                    </div>
                </div>
            @endforeach    

        </div>

        <div class="bk-sec">
            <a href="/" class="bk-btn">Back</a>
            <a id="nxt-btn" class="nxt-btn">Next</a>
        </div>

    </div>        
</div>
@endsection
 @section('js')
    {{-- <script src="{{ asset('js/sweetalert2.js')}}"></script>
    <script src="{{ asset('js/assesment-new.js') }}"></script> --}}
    {{-- <script src="{{ asset('js/test.js') }}"></script> --}}
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
   <script>
    
        $(document).ready(function () {
            var data=<?php echo json_encode($data); ?>;
            var subject=<?php echo json_encode($subject); ?>;
            
            // $('#btnStart').on('click',function(e){
            //     e.preventDefault();
            //     var k=0;
            //     var key=$(this).attr('key');
               
            //     if($key!=k){
            //         $(this).attr('href',javascript:void(0));
            //         $('#error').html('Please complete previous section');
            //     }
            // })
            
            
            // $.each(data, function (i, value) {
            //      btnVal=$("btn"+i).attr('value');
            //     $('#div').append(
            //         '<div class="col-md-2 profile"   rel="1" data-ref='+value.section_Name+'>'+
            //         '<span class="name ps-eng">'+value.section_Name+'</span>'+
            //         '<div class="">'+
            //             '<div class="section-timer">'+
            //                 '<i class="fi fi-rr-clock"></i>'+
            //                 '<span>Approx. '+value.Question_Count+' mins</span>'+
            //             '</div>'+
            //            '<div class="buttons" style="" id="btnDiv">'+
                       
            //                '<a href="/test/'+value.section_ID+'/'+value.section_Name+'/'+i +'" value="'+value.section_ID+'" class="btn btn-primary col-md-10" id="btn'+i+'" ></a>'+
                       
            //           '</div> '+
            //         '</div>'+
            //     '</div>'

            //     ); 
                
                
                     
            //     $.each(subject, function (i, value) {
                
            //         if(value.section_id==btnVal){
            //             $('#btnDiv').children('#btn'+i).attr('disabled',true);
            //             $(this).children('#btn'+i).text('COMPLETED');
            //         }else{
            //             $('#btnDiv').children('#btn'+i).attr('disabled',false);
            //             $('#btnDiv').children('#btn'+i).text('START');
            //         }
           
            //     });

            // });
          
           

           

           
              

        });
    </script>
@endsection 