$("#frmRegister").validate({
    rules: {
        txt_first_name: {
            required: true,
            maxlength: 50
        },
        txt_last_name: {
            required: true,
            maxlength: 50
        },
        txt_email: {
            required: true,
            email: true,
            maxlength: 50,
            minlength: 6
        },
        sel_gender: {
            required: true
        },
        txt_school: {
            required: true,
            maxlength: 100
        },
        txt_password: {
            required: true,
            maxlength: 20,
            minlength: 6
        },
        txt_confirm_password: {
            required: true,
            equalTo: txt_password,
            maxlength: 20
        }
    },
    messages: {
        txt_first_name: {
            required: "First name field is required"
        },
        txt_last_name: {
            required: "Last name field is required"
        },
        txt_email: {
            required: "Email address field is required",
            email: "Please enter a valid email address"
        },
        txt_school: {
            required: "School name field is required"
        },
        txt_password: {
            required: "Password field is required"
        },
        txt_confirm_password: {
            required: "Please re-enter your password",
            equalTo: "Please re-enter the same password as above"
        }
    },
    submitHandler: function () {
        submit_reg_data();
    }
});

function submit_reg_data() {
    $("#btn_signup").html('Please Wait !!').css("pointer-events", "none");
    $.ajax({
        type: "POST",
        data: {
            first_name: $("#txt_first_name").val(),
            last_name: $("#txt_last_name").val(),
            email: $("#txt_email").val(),
            gender: $("#sel_gender").val(),
            password: $("#txt_password").val(),
            school: $("#txt_school").val()
        },
        url: "./api/ajax.php?submit_reg_data",
        dataType: "json",
        success: function (response) {
            if (response.success > 0) {
                $("#frmRegister")[0].reset();
                if (response.msg != '') {
                    mug_alert_data_link('success', 'Thank You', response.msg, response.url);
                }
            } else
            {
                var msg = "Something went wrong. Please try again later!!";
                if (response.msg != '') {
                    msg = response.msg;
                }
                mug_alert('error', 'Error', msg);
            }
            $("#btn_signup").html('GET STARTED').css("pointer-events", "initial");
        }
    });
}

$("#frmLogin").validate({
    rules: {
        txt_email: {
            required: true,
            email: true,
            maxlength: 50
        },
        txt_password: {
            required: true,
            maxlength: 20
        }
    },
    submitHandler: function () {
        validate_login();
    }
});

function validate_login() {
    $("#btn_login").html('Please Wait !!').css("pointer-events", "none");
    $.ajax({
        type: "POST",
        data: {
            email: $("#txt_email").val(),
            password: $("#txt_password").val()
        },
        url: "./api/ajax.php?validate_user_login",
        dataType: "json",
        success: function (response) {
            if (response.success > 0) {
                location.href = response.url;
            } else
            {
                if (response.msg != '') {
                    mug_alert('error', 'Error', response.msg);
                }
                else{
                    mug_alert('error', 'Login Failed', 'Incorrect Email or Password!!');
                }
            }
            $("#btn_login").html('LOGIN').css("pointer-events", "initial");
        }
    });
}

$(".cls-pwd").on("keyup paste blur", function () {
    hide_eye();
});

function hide_eye(){
    var val='';
    $(".cls-pwd").each(function () {
        val = $(this).val();
        if (val != '')
        {
            $(this).parents(".pass-fld").find(".eye-dv").show();
        } else
        {
            $(this).parents(".pass-fld").find(".eye-dv").hide();
        }
    });
}

$("input[type='password'][data-eye]").each(function (i) {
    var $this = $(this),
            id = 'eye-password-' + i,
            el = $('#' + id);

    $this.wrap($("<div/>", {
        style: 'position:relative',
        id: id
    }));

    $this.css({
        paddingRight: 72
    });
    
    $this.after($("<div/>", {
        html: 'Show',
        class: 'btn-sm eye-dv',
        id: 'passeye-toggle-' + i
    }).css({
        position: 'absolute',
        right: 28,
        top: ($this.outerHeight() / 2) - 10,
        padding: '2px 0px',
        fontSize: 12,
        cursor: 'pointer'
    }));

    $this.after($("<input/>", {
        type: 'hidden',
        id: 'passeye-' + i
    }));

    $this.on("keyup paste", function () {
        $("#passeye-" + i).val($(this).val());
    });
    
    $("#passeye-toggle-" + i).on("click", function () {
        if ($this.hasClass("show")) {
            $this.attr('type', 'password');
            $(this).html('Show');
            $this.removeClass("show");
            $(this).removeClass("");
        } else {
            $(this).html('Hide');
            $this.attr('type', 'text');
            $this.val($("#passeye-" + i).val());
            $this.addClass("show");
            $(this).addClass("");
        }
    });
});

hide_eye();

function mug_alert(type, title, msg) {
    Swal.fire({
        type: type,
        title: title,
        text: msg,
        showConfirmButton: true
    });
}

function mug_alert_data_link(type, title, msg, url) {
    Swal.fire({
        type: type,
        title: title,
        text: msg,
        showConfirmButton: true
    }).then(function () {
        window.location = url;
    });
}

function mug_alert_link(type, msg, url) {
    Swal.fire({
        type: type,
        title: msg,
        showConfirmButton: true
    }).then(function () {
        window.location = url;
    });
}

function mug_alert_lite(type, msg) {
    var Toast = Swal.mixin({
        toast: true,
        showConfirmButton: true
    });
    Toast.fire({
        type: type,
        title: msg
    });
}

$('#myModal').modal({backdrop:'static',keyboard:false, show:true});