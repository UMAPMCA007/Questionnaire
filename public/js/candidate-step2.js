$("#goToNextStep").click(function() {
    $("#overlay-next-question").show();
    $("#submit").hide();
});
$("#home_btn").click(function() {
    $(".screen-2").show();
    $(".screen-1").hide();
});
$(".begin_btn").click(function() {
    $(".screen-3").show();
    $(".screen-2").hide();
});
$(".start_record").click(function() {
    $(".screen-4").show();
    $(".screen-3").hide();
});
$("#start_record2").click(function() {
    $(".screen-6").show();
    $(".screen-5").hide();
});
$("#start_record3").click(function() {
    $(".screen-8").show();
    $(".screen-7").hide();
});
$("#start_record4").click(function() {
    $(".screen-10").show();
    $(".screen-9").hide();
});
$("#start_record5").click(function() {
    $(".screen-12").show();
    $(".screen-11").hide();
});
$("#myint-widget-start-recording-screen5").click(function() {
    $(".screen-6").show();
    $(".screen-5").hide();
});
$("#retakeRecording").click(function() {
    $(".screen-3").show();
    $(".screen-4").hide();
});
$(".next_screen5").click(function() {
    $(".screen-5").show();
    $(".screen-4").hide();
});
$("#next_screen7").click(function() {
    $(".screen-7").show();
    $(".screen-6").hide();
});
$("#next_screen9").click(function() {
    $(".screen-9").show();
    $(".screen-8").hide();
});
$("#next_screen11").click(function() {
    $(".screen-11").show();
    $(".screen-10").hide();
});
$("#finish_btn").click(function() {
    $(".screen-13").show();
    $(".screen-12").hide();
});
$(".retakebtn-screen5").click(function() {
    $(".screen-5").show();
    $(".screen-6").hide();
});
$("#cancelGoNextQuestion").click(function() {
    $("#overlay-next-question").hide();
});
$("#submit_btn").click(function() {
    $("#overlay-next-question").show();
    $("#submit").show();
    $("#goNextQuestion").hide();
});
$("#submit").click(function() {
    $(".screen-6").hide();
    $(".screen-7").css("display","flex");
    $("#overlay-next-question").hide();
});
$("#goNextQuestion").click(function() {
    $(".screen-5").show();
    $(".screen-4").hide();
    $("#overlay-next-question").hide();
});
$(".stop-btn").click(function() {
    $(".retake-btn").show();
    $(".video_playbtn").show();
    $(".stop-btn").hide();
});
$(".retake-btn").click(function() {
    $(".retake-btn").hide();
    $(".video_playbtn").hide();
    $(".stop-btn").show();
});
$("#retake_1").click(function() {
    $(".screen-4").show();
    $(".screen-13").hide();
    $(".stop-btn").hide();
    $(".retake-btn").show();
    $(".video_playbtn").show();
});
$("#retake_2").click(function() {
    $(".screen-6").show();
    $(".screen-13").hide();
    $(".stop-btn").hide();
    $(".retake-btn").show();
    $(".video_playbtn").show();
});
$("#retake_3").click(function() {
    $(".screen-8").show();
    $(".screen-13").hide();
    $(".stop-btn").hide();
    $(".retake-btn").show();
    $(".video_playbtn").show();
});
$("#retake_4").click(function() {
    $(".screen-10").show();
    $(".screen-13").hide();
    $(".stop-btn").hide();
    $(".retake-btn").show();
    $(".video_playbtn").show();
});
$("#retake_5").click(function() {
    $(".screen-12").show();
    $(".screen-13").hide();
    $(".stop-btn").hide();
    $(".retake-btn").show();
    $(".video_playbtn").show();
});
$("#back_1").click(function() {
    $(".screen-3").show();
    $(".screen-5").hide();
});
$("#back_2").click(function() {
    $(".screen-5").show();
    $(".screen-6").hide();
});
$("#back_3").click(function() {
    $(".screen-6").show();
    $(".screen-7").hide();
});
$(".backto_s2").click (function(){
    $(".screen-2").show();
    $(".screen-3").hide();
});
$(".backto_s3").click (function(){
    $(".screen-3").show();
    $(".screen-4").hide();
});

  $("#gdpr-consent").click(function() {
    var checked_status = this.checked;
    if (checked_status == true) {
       $("#home_btn").removeClass("disabled");
    }else{
        $("#home_btn").addClass("disabled");
       }
});


