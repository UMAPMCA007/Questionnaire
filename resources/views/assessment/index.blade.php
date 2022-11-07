@extends('layouts.app')   
@section('content')
<div id="assessments_sect">  
 <div class="sections" id="sec_based_test">
        <div class="title ps-eng">ASSESSMENTS</div>   
        <div class="cardsWrap-1" >
            @foreach($data as  $key=>$value)
                <div class="col-md-2 profile"   rel="1" data-ref="{{$value['section_Name']}}">
                    <span class="name ps-eng">{{$value['section_Name']}}</span>
                    <div class="">
                        <div class="section-timer">
                            <i class="fi fi-rr-clock"></i>
                            <span>Approx. {{$value['Question_Count']}} mins</span>
                        </div>
                        <div class="buttons" style="" >
                             <a href="/test/{{$value['section_ID']}}/{{$value['section_Name']}}/{{$key}}" class="btn btn-primary col-md-10">START</a>
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
    <script src="{{ asset('js/sweetalert2.js')}}"></script>
    <script src="{{ asset('js/assesment-new.js') }}"></script>
    {{-- <script src="{{ asset('js/test.js') }}"></script> --}}
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    {{-- <script>
        $(document).ready(function () {
            var data=<?php echo json_encode($data); ?>;
            var subject=<?php echo json_encode($subject); ?>;
           
            
            $.each(data, function (i, value) {
                $('#div').append(
                    '<div class="col-md-2 profile"   rel="1" data-ref='+value.section_Name+'>'+
                    '<span class="name ps-eng">'+value.section_Name+'</span>'+
                    '<div class="">'+
                        '<div class="section-timer">'+
                            '<i class="fi fi-rr-clock"></i>'+
                            '<span>Approx. '+value.Question_Count+' mins</span>'+
                        '</div>'+
                       '<div class="buttons" style="" id="btn">'+
                           '<a href="/test/'+value.section_ID+'/'+value.section_Name+'/'+i +'" class="btn btn-primary col-md-10"'+ if(subject[i].section_id==value.section_ID){'completed';} +' " id="btn'+i+'" >START</a>'+
                      '</div> '+
                    '</div>'+
                '</div>'

                );    
            });
          
           

           
              

        });
    </script> --}}
@endsection