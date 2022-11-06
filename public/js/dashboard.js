$("#agree_check").on("click", function () {
    if (this.checked == true) {
        $("#btn_db_start_assm").removeClass("btn-disabled");
    } else {
        $("#btn_db_start_assm").addClass("btn-disabled");
    }
});

$("#agree_check1").on("click", function () {
    if (this.checked == true) {
        $("#btn_db_start_assm1").removeClass("btn-disabled");
    } else {
        $("#btn_db_start_assm1").addClass("btn-disabled");
    }
});

$(".translate").on("click", function () {
    var ref = $(this).attr("rel");
    $(".main-instruction").hide();
    $("#"+ref+"_disp").show();
});

$(".r-translate").on("click", function () {
    var ref = $(this).attr("rel");
    if(ref=='ml'){
        $(".ml-shw").show();
        $(".en-shw").hide();
    }
    else{
        $(".en-shw").show();
        $(".ml-shw").hide();
    }
    
});

$(".start-btn-assm").on("click", function () {
    location.href = "sections.html";
});
// $(".start-btn-assm").on("click", function () {
//     location.href = "assessments";
// });