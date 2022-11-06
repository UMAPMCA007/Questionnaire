$(".instructions-data").hide();
$("#disp_sec_time").hide();

window.set_array = [];
window.sections_arr = [];

window.sections_qus_count = [];
window.section_name = [];
window.section_ids = [];
window.sec_qids = [];
window.section_time_limit = [];
window.test_ids = [];
window.test_name = [];

window.qus_main_arr = [];

window.answer_arr = '';
window.user_responses = [];
window.user_responses_multi = [];
window.user_responses_multi_rank = [];
window.answered_ranks = [];
window.skip_arr = [];
window.next_arr = [];
window.answered_qns = [];
window.answered_choices = [];
window.completed_sec = [];
window.map_ans = {};

window.qn_type_by_qid = [];

set_array['sections_count'] = 0;
set_array['current_section_id'] = 0;
set_array['current_section_time_limit'] = 0;
set_array['current_test_id'] = 0;

set_array['current_qn_index'] = 0;
set_array['current_qn'] = 0;
set_array['current_qn_id'] = 0;
set_array['current_qn_type'] = '';
set_array['max_choice'] = 0;
set_array['choice_length'] = 0;

set_array['total_questions'] = 0;
set_array['questions_counter'] = 0;
set_array['answered_qns_count'] = 0;
set_array['pretty_qn_time'] = 0;
set_array['pretty_time'] = 0;

set_array['survey_id'] = 0;
set_array['is_mandatory'] = 0;

set_array['is_running'] = false;

var paused = 0;
// var my_full_timer = null;
var my_qn_timer = null;
var my_sec_timer = null;
var isAnswered = false;

var current_assessment_index = 1;

var start_enabled = 0;
check_assessments_completed();

function check_assessments_completed() {
    var index = '';
    $(".profile").each(function () {
        var elem = $(this);
        index = $(elem).attr("rel");
        if(index==6){
            var lang_sel = getPreferredLanguage();   
        }
        if (start_enabled == 0) {
            $.ajax({
                type: "POST",
                async: false,
                data: {
                    index: index
                },
                url: "./api/ajax.php?check_assessment_attended",
                dataType: "json",

                success: function (res) {
                    if (res.success == 1) {
                        var response = JSON.parse(res.data);
                        var section_attempt = 0;
                        var sections_count = response.sections.length;
                        var section_name = '';
                        var sec_ref = '';
                        var i = 0;

                      //  $("#sec_based_test").html(JSON.stringify(response)).show();

                        if (sections_count > 1) { 
                            $.each(response.sections, function (key, sec) {
                                if (sec.sectionAttempt > 0) {
                                    section_attempt++;
                                    i++;
                                } else {
                                    i++;
                                    section_name = sec.sectionName;
                                    sec_ref = (section_name.replace(/ /g, "_")).toLowerCase();                                  
                                    if(sec_ref == 'verbal_ability_mal'){
                                        sec_ref = 'verbal_ability';    
                                    }
                                    start_enabled = 1;
                                    return false;
                                }
                            });
                            if (sections_count == section_attempt) {
                                $(elem).find(".buttons").show();
                                $(elem).find(".button-1").html("Completed");
                                $(elem).addClass("completed-sect");
                                $("#tdef_" + index).addClass("completed-sct");
                            } else {
                                var survey = response.surveyName;
                                survey = survey.toLowerCase();  
                                if ((survey == 'aptitude' || survey == 'aptitude-va-mal') && i == 1) {                              
                                    $(elem).find(".button-1").addClass("btn-start").attr("rel", "aptitude");
                                } else {
                                    $(elem).find(".button-1").addClass("btn-start").attr("rel", sec_ref);
                                    if (survey == 'aptitude' || survey == 'aptitude-va-mal') {
                                        $(elem).find(".button-1").addClass("btn-start").attr("item-prop", "1");
                                    }
                                }
                                $(elem).find(".buttons").show();
                                $(elem).addClass("current-sect");
                            }
                        } else {
                            section_attempt = response.sections[0].sectionAttempt;
                            if (section_attempt > 0) {
                                $(elem).find(".buttons").show();
                                $(elem).find(".button-1").html("Completed");
                                $(elem).addClass("completed-sect");
                                $("#tdef_" + index).addClass("completed-sct");
                            } else {
                                section_name = response.sections[0].sectionName;
                                sec_ref = (section_name.replace(/ /g, "_")).toLowerCase();
                                if(sec_ref == 'occupations-female'){
                                    sec_ref = 'occupations';
                                }
                                $(elem).find(".button-1").addClass("btn-start").attr("rel", sec_ref);
                                $(elem).find(".buttons").show();
                                $(elem).addClass("current-sect");
                                start_enabled = 1;
                                return false;
                            }
                        }
                    }
                }
            });
        } else {
            return false;
        }
    });
}

$("#assessments_sect").on("click", ".btn-start", function () {
    var elem = $(this);
    var cur_index = $(elem).parents(".profile").attr("rel");
    var sec_ref = $(elem).attr("rel");
    var i_prop = ($(elem).attr("item-prop")) ? $(elem).attr("item-prop") : '';
    $("#sec_based_test").hide();
    $(".secwise-instructions").hide();
    $(".inner_sec").hide();
    $("#display_instructions").show();
    $("#ins-section-" + cur_index).show();
    $(".cls-" + sec_ref).show();
    if (i_prop == "1") {
        $(".apt-bt-dp").show();
    }
    $(window).scrollTop($('#display_instructions').offset().top);
});


$("#assessments_sect").on("click", ".ibtn-next", function () {
    var elem = $(this);
    var val = $('.pref_lang_sel:visible').val();  
    if(val!=''){
        var opt = (val=='eng') ? 'English' : 'Malayalam';
        var opt1 = (val=='eng') ? 'à´‡à´‚à´—àµà´²àµ€à´·àµ' : 'à´®à´²à´¯à´¾à´³à´‚';
            Swal.fire({
            type: 'info',
            title: 'Are you sure?',
            html: '<div><br>You have selected '+ opt +' as your preferred language for verbal ability section.<br><br>à´¨à´¿à´™àµà´™àµ¾ à´­à´¾à´·à´¾à´¶àµ‡à´·à´¿ à´¸àµ†à´•àµà´·à´¨àµ à´µàµ‡à´£àµà´Ÿà´¿ '+ opt1 +' à´¤à´¿à´°à´žàµà´žàµ†à´Ÿàµà´¤àµà´¤à´¿à´°à´¿à´•àµà´•àµà´¨àµà´¨àµ.</div>',
            showCancelButton: true,
            cancelButtonText: 'GO BACK',
            showConfirmButton: true,
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.value) {
                $("#ibtn_next").html('Please wait..&nbsp;<i class="fas fa-sync fa-spin"></i>').css("pointer-events:none;");
            $.ajax({
                type: "POST",
                data: {
                    lang: val
                },
                url: "./api/ajax.php?store_preferred_language",
                dataType: "json",
                success: function (res) {
            if (res.success == 1) {
                $("#ibtn_next").html("Next").css("pointer-events:initial;");
                $(elem).parents(".sub_1").hide();
                $(elem).parents(".secwise-instructions").find(".sub_2").show();
                $(elem).parents(".secwise-instructions").find(".apt-bt-dp").show();
            }
            else{
                location.href = window.location.href;
            }
        }
    });               
                
            }
        });    
    }
    else{
        mug_alert_lite('error', 'Please select your preferred language for verbal ability section.');
    }
});


$("#assessments_sect").on("click", ".ibtn-start", function () {
    var elem = $(this);
    var cur_index = $(elem).parents(".secwise-instructions").attr("rel");
    if (cur_index > 0) {
        current_assessment_index = parseInt(cur_index);
    } else {
        current_assessment_index = 1;
    }
    start_assessment(current_assessment_index);
});

function start_assessment(cur_index) {
    var elem = $("#ibtn_start_" + cur_index);
    $(elem).html('<i class="fas fa-sync fa-spin"></i>&nbsp;Loading...').css("pointer-events", "none");
    $("#section-" + cur_index).removeClass("start-sect").addClass("current-sect");
    $("#tdef_" + cur_index).addClass("ongoing-sct");
    $("#btn_start_" + cur_index).parent(".buttons").hide();
    $("#btn_start_" + cur_index).removeClass("btn-start");
    $("#sec_based_test").hide();
    $("#info_disp").hide();
    $.ajax({
        type: "POST",
        // async: false,
        data: {
            index: cur_index
        },
        url: "./api/ajax.php?take_assessment",
        dataType: "json",
        success: function (res) {
            if (res.success == 1) {
                $(elem).css("pointer-events", "none");
                $("#display_instructions").hide();
                $(".secwise-instructions").hide();
                $(".inner_sec").hide();
                $("#display_questions").show();
                $("#info_disp").show();
                $("#sec_ques_info").show();

                //   $(".goBackVector").removeClass("btn_prev_pg").addClass("btn_prev");

                var response = JSON.parse(res.data);

                 // $("#sec_based_test").html(JSON.stringify(response)).show();

                sections_arr = response.sections;
                set_array['sections_count'] = sections_arr.length;
                set_array['survey_id'] = response.surveyId;

                if(response.surveyName!='Aptitude-VA-Mal'){
                set_array['survey_name'] = response.surveyName;
                }
                else{
                    set_array['survey_name'] = 'Aptitude';
                }

                set_array['is_mandatory'] = response.mandateAnswer;
                set_array['is_running'] = false;
                // set_array['pretty_time'] = response.timeLimit * 60;
                //  set_array['pretty_time'] = 1 * 60;

                //    alert(response.mandateAnswer);

                var tot_qus_count = set_sections();
                //   set_array['total_questions'] = tot_qus_count;
                set_array['questions_counter'] = 0;
                set_array['answered_qns_count'] = 0;

                isAnswered = false;

                var sec_no = 0;

                var sections_count = response.sections.length;
                if (sections_count > 1) {
                    $.each(response.sections, function (key, sec) {
                        if (sec.sectionAttempt > 0) {
                            sec_no++;
                        }
                    });
                }

                set_array['total_questions'] = sections_qus_count[sec_no];

              
                if (set_array['total_questions'] > 1 && set_array['is_mandatory'] == 0) {
                    set_answered_unanswered_block();
                } else {
                    $("#counter_answers_sect").hide();
                    $("#view_counter_answers").html('');
                }

                set_questions(sec_no, 0);

               // var sec_ref = ((section_name[sec_no]).replace(/ /g, "_")).toLowerCase();
               // $("#disp_test_name h3").html(section_name[sec_no]);


               var sc_nm = section_name[sec_no];
              
               if(sc_nm.toLowerCase()=='occupations-female'){
                    sc_nm = "Occupations";
               }
               else if(sc_nm.toLowerCase() == 'verbal ability mal'){
                    sc_nm = 'Verbal Ability';    
                }

                var sec_ref = (sc_nm.replace(/ /g, "_")).toLowerCase();
                $("#disp_test_name h3").html(sc_nm);

                set_array['current_section_id'] = section_ids[sec_no];
                if (section_time_limit[sec_no] > 0) {
                    //  $("#pretty_qn_time").hide();
                    // $("#disp_sec_time").show();
                    $("#disp_sec_time").addClass("tm-ht").show();
                    // set_array['current_section_time_limit'] = section_time_limit[sec_no] * 60;
                    set_array['current_section_time_limit'] = section_time_limit[sec_no];
                    my_sec_timer = setInterval(my_sec_timer_fn, 1000);
                } else {
                    //  $("#pretty_qn_time").show();
                    $("#disp_sec_time").hide();
                    set_array['current_section_time_limit'] = 0;
                    clearInterval(my_sec_timer);
                }
                set_array['current_test_id'] = test_ids[sec_no];
                if (set_array['is_running'] != true) {
                    my_qn_timer = setInterval(my_qn_timer_fn, 1000);
                    //   my_full_timer = setInterval(my_timer_fn, 1000);
                    set_array['is_running'] = true;
                }

                $(".instructions-data").hide();
                $("#ins-section-" + cur_index).show();
                $(".ins-sec").show();
                $("#btn_" + sec_ref).show();
                $(".cls-" + sec_ref).show();
                if ($("#btn_" + sec_ref).length > 0) {
                    $(".ins-sec").show();
                } else {
                    $(".ins-sec").hide();
                }
                $("#progress_section").show();
                $(".hr").show();
                $("#tbl_info").show();
            } else {
                var url = 'dashboard';
                mug_alert_link('error', res.data, url);
            }
        }
    });
}

function set_sections() {
    // $(".goBackVector").removeClass("btn_prev").addClass("btn_prev_pg"); 
    var tot_qus_count = 0;
    var q_len = 0;
    $.each(sections_arr, function (key, sec) {
        qus_main_arr[key] = sec;
        q_len = qus_main_arr[key].questions.length;
        section_name[key] = sec.sectionName;
        section_ids[key] = sec.sectionID;
        section_time_limit[key] = sec.sectionTimelimit;
        test_ids[key] = sec.testID;
        test_name[key] = sec.testName;
        tot_qus_count += q_len;
        sections_qus_count[key] = q_len;
    });
    if (set_array['is_running'] != true) {
        $("#disp_test_name h3").html(set_array['survey_name']);
        $("#sec_ques_info").html("<p>" + set_array['sections_count'] + " Sections</p>");
        return tot_qus_count;
    }
}


function set_questions(index, qus_no) {
    if (index >= 0) {

        $("#pretty_qn_time").html('<i class="far fa-clock"></i> 00 min 00 sec');

        if (qus_no == 0) {
            sec_qids = [];
            $.each(qus_main_arr[index].questions, function (key, values) {
                sec_qids.push(values.qid);
            });
        }

        set_array['current_qn_index'] = index;
        set_array['current_section_id'] = section_ids[index];

        $("#disp_qus").hide();
        $("#disp_choices").hide();
        $("#disp_button").hide();

        isAnswered = false;
        var html = '';
        var btns = '';
        var q_id = '';
        var cls = '';
        var qus_arr = [];
        var data_qus = '';
        var tr_btn = '';
        var tr_qus = '';
        var graphic_attr = '';
        var graphic_id = '';
        var html_select = '';
        var sel_opt = '';
        var my_sel = '';
        var dis_ref = '';

        var disp = 0;
        qus_arr = qus_main_arr[index].questions[qus_no];
        var q_no = qus_no + 1;
        set_array['current_qn'] = q_no;
        q_id = qus_arr.qid;
        set_array['current_qn_type'] = qus_arr.questionType;
        set_array['current_qn_id'] = q_id;
        qn_type_by_qid[q_id] = qus_arr.questionType;

        set_array['max_choice'] = qus_arr.maxChoice;

        var ch_length = qus_arr.choices.length;
        set_array['choice_length'] = ch_length;

        if ($.inArray(q_id, answered_qns) == -1)
        {
            set_array['questions_counter'] = set_array['questions_counter'] + 1;
        }

        $("#q_no").text(q_no);
       
        data_qus = '<span class="qus-default ch-lang cls-' + qus_arr.language + '">' + qus_arr.question + '</span>';
        var l_btn = '<a class="translate ' + qus_arr.language + ' active" href="javascript:void(0);" rel="' + qus_arr.language + '">' + getLanguage(qus_arr.language) + '</a>';
        $.each(qus_arr.translations, function (t_key, lang) {
            tr_qus += '<span class="ch-lang cls-' + t_key + '" style="display:none;">' + lang + '</span>';
            tr_btn += '<a class="translate ' + t_key + '" href="javascript:void(0);" rel="' + t_key + '">' + getLanguage(t_key) + '</a>';
        });
        if (tr_btn != '') {
            tr_btn = '<div class="tr-btn">' + l_btn + tr_btn + '</div>';
        }
        data_qus = data_qus + tr_qus + tr_btn;

        $("#disp_qus").html(data_qus).removeClass().addClass('qus-' + q_id).show();

        if (qus_arr.questionType == 'SingleChoiceScale') {
            $("#disp_choices").hide();
            $("#display_questions").find(".rating").remove();
            html = '<div class="rating">';
            var choices = qus_arr.choices;
            var ch_len = choices.length;
            var choice = '';
            for (let i = ch_len - 1; i >= 0; i--) {
                choice = qus_arr.choices[i];
                if ($.inArray(choice.cid, answered_choices) == -1) {
                    cls = '';
                } else {
                    cls = 'checked';
                }
                html += '<input type="radio" class="rating_scale" name="rating" id="rata' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" ' + cls + ' ><label for="rata' + choice.cid + '">' + choice.choiceData + '</label>';
            }
            html += '</div>';
            $(html).insertAfter("#disp_choices");
        } else {
           
            $("#display_questions").find(".rating").remove();
            if (qus_arr.questionType == 'SingleChoiceQuesImage' || qus_arr.questionType == 'SingleChoiceQuesAndChoiceImage') {
                paused++;
                graphic_attr = qus_arr.graphicAttr;
                graphic_id = qus_arr.graphicId;
                var loading = '<div class="my-loader">Loading...</div>';
                $("#disp_qus").append(loading);
                disp_qus_image(graphic_id, graphic_attr);                
            }

            var reset_btn = '';
            if (qus_arr.questionType == 'MultiChoiceRanking') {
                reset_btn = '<div class="reset-btn"><a href="javascript:void(0);" class="custom-btn-reset">Reset Selection <i class="fas fa-redo-alt"></i></a></div>';
            }

            $("#disp_choices").html('').show();
            var cur_choice_ids = [];
            var cur_graphic_ids = [];
            var cur_graphic_fmt = [];
            // var cur_graphic_align = [];
            var cur_graphic_cls = [];
            var fmt = '';
            var graphic_split = '';
            var align = ''; 

            var cur_qimg_language = '';
            var cur_qimg_questionType = '';
            var cur_qimg_qid = '';

            var cur_qimg_choiceData = [];
            var cur_qimg_translations_val = [];
            var cur_qimg_translations_lang = '';
            var tr_val_tmp = '';

            $.each(qus_arr.choices, function (key, choice) {
                if ($.inArray(choice.cid, answered_choices) == -1) {
                    cls = '';
                } else {
                    cls = ' selected';
                }
                graphic_attr = choice.graphicAttr;
                graphic_id = choice.graphicId;
                if (graphic_id != '') {                     
                    // if ((key + 1) == qus_arr.choices.length) {
                    //     disp = 1;
                    // }
                    // if (key == 0) {
                    //     var loading = '<div class="my-loader">Loading...</div>';
                    //     $("#disp_choices").html(loading);
                    // }
                   // disp_choice_image(graphic_id, graphic_attr, choice, cls, qus_arr, disp);                     
                    if (key == 0) {
                        cur_qimg_language = qus_arr.language;
                        cur_qimg_questionType = qus_arr.questionType;
                        cur_qimg_qid = qus_arr.qid;
                        var loading = '<div class="my-loader">Loading...</div>';
                        $("#disp_choices").html(loading);
                    }
                    cur_choice_ids.push(choice.cid);
                    cur_graphic_ids.push(graphic_id);              
                    cur_graphic_cls.push(cls);

                    fmt = graphic_attr.split("fmt=");
                    fmt = (fmt[1]) ? 'image/' + fmt[1] : 'image/png';
                    cur_graphic_fmt.push(fmt);

                    // graphic_split = graphic_attr.split("&");
                    // align = (graphic_split[0]) ? graphic_split[0].split("align=") : '';
                    // align = (align[1]) ? align[1] : 'center'; 
                    // cur_graphic_align.push(align);                   
                   
                    cur_qimg_choiceData.push(choice.choiceData);

                    if(Object.keys(choice.translations) != 'undefined'){
                        tr_val_tmp = Object.values(choice.translations);
                        cur_qimg_translations_val.push(tr_val_tmp.toString());
                        if (key == 0) {
                            cur_qimg_translations_lang = (Object.keys(choice.translations)).toString(); 
                        }
                    }

                    if ((key + 1) == qus_arr.choices.length) {
                        paused++;
                        disp_choice_image_multi(cur_choice_ids, cur_graphic_ids, cur_graphic_cls, cur_graphic_fmt, cur_qimg_language, cur_qimg_translations_val, cur_qimg_translations_lang, cur_qimg_questionType, cur_qimg_qid, cur_qimg_choiceData);
                    } 
                } else {
                    if (qus_arr.questionType == 'MultiChoiceRanking') {

                        sel_opt = (answered_ranks[choice.cid]) ? answered_ranks[choice.cid] : '';

                        html_select = '<select class="sel-rank" rel="' + choice.cid + '" data-ref="' + sel_opt + '" ><option value="">-- Select --</option>';
                        for (let i = 1; i <= ch_length; i++) {
                            if (sel_opt == i) {
                                my_sel = 'selected';
                            } else {
                                my_sel = '';
                            }

                            if (sel_opt != '' && my_sel != 'selected') {
                                dis_ref = 'disabled';
                            } else {
                                dis_ref = '';
                            }

                            html_select += '<option value="' + i + '" ' + my_sel + ' ' + dis_ref + ' >' + i + '</option>';
                        }
                        html_select += '</select>';
                        html += '<button class="btn btn-select ch-default ch-lang' + cls + ' cls-' + qus_arr.language + '" id="btn_' + choice.cid + '" name="btn_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" >' + choice.choiceData + html_select + '</button>';
                        $.each(choice.translations, function (c_key, ch_lang) {
                            html += '<button class="btn btn-select ch-lang' + cls + ' cls-' + c_key + '" id="btn_' + c_key + '_' + choice.cid + '" name="btn_' + c_key + '_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" style="display:none;" >' + ch_lang + html_select + '</button>';
                        });
                    } else {
                        html += '<button class="btn btn-select ch-default ch-lang' + cls + ' cls-' + qus_arr.language + '" id="btn_' + choice.cid + '" name="btn_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" >' + choice.choiceData + '</button>';
                        $.each(choice.translations, function (c_key, ch_lang) {
                            html += '<button class="btn btn-select ch-lang' + cls + ' cls-' + c_key + '" id="btn_' + c_key + '_' + choice.cid + '" name="btn_' + c_key + '_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" style="display:none;" >' + ch_lang + '</button>';
                        });
                    }
                    $("#disp_choices").html(reset_btn + html).show();
                }
            });
        }

        if (sections_qus_count[index] == q_no) {
            if (q_no > 1) {
                btns = '<button class="submit btn_prev">Previous</button>';
            }
            btns += '<button class="submit btn_submit">Submit</button>';
        } else {
            if (q_no > 1) {
                btns = '<button class="submit btn_prev">Previous</button>';
            }
            btns += '<button class="submit btn_next">Next</button>';
        }
        $("#disp_button").html(btns).show();

        $(window).scrollTop($('#view_qus_data').offset().top);
        set_array['pretty_qn_time'] = 0;
        change_settings();

        var ht = $(".questionTextWrapper").height();
        $(".vertLine").css("height", (ht - 125));

        if (q_no > 0 && set_array['total_questions'] > 1 && set_array['is_mandatory'] == 0) {
            $("#view_counter_answers").find("#qnn_" + q_no).addClass("current");
        }
    }
}


function set_questions__url(index, qus_no) {
    if (index >= 0) {

        $("#pretty_qn_time").html('<i class="far fa-clock"></i> 00 min 00 sec');

        if (qus_no == 0) {
            sec_qids = [];
            $.each(qus_main_arr[index].questions, function (key, values) {
                sec_qids.push(values.qid);
            });
        }

        set_array['current_qn_index'] = index;
        set_array['current_section_id'] = section_ids[index];

        $("#disp_qus").hide();
        $("#disp_choices").hide();
        $("#disp_button").hide();

        isAnswered = false;
        var html = '';
        var btns = '';
        var q_id = '';
        var cls = '';
        var qus_arr = [];
        var data_qus = '';
        var tr_btn = '';
        var tr_qus = '';
        var graphic_attr = '';
        var graphic_id = '';
        var html_select = '';
        var sel_opt = '';
        var my_sel = '';
        var dis_ref = '';

        var disp = 0;
        qus_arr = qus_main_arr[index].questions[qus_no];
        var q_no = qus_no + 1;
        set_array['current_qn'] = q_no;
        q_id = qus_arr.qid;

        set_array['current_qn_type'] = qus_arr.questionType;
        set_array['current_qn_id'] = q_id;
        qn_type_by_qid[q_id] = qus_arr.questionType;

        set_array['max_choice'] = qus_arr.maxChoice;

        var ch_length = qus_arr.choices.length;
        set_array['choice_length'] = ch_length;

        if ($.inArray(q_id, answered_qns) == -1)
        {
            set_array['questions_counter'] = set_array['questions_counter'] + 1;
        }

        $("#q_no").text(q_no);
       
        data_qus = '<span class="qus-default ch-lang cls-' + qus_arr.language + '">' + qus_arr.question + '</span>';
        var l_btn = '<a class="translate ' + qus_arr.language + ' active" href="javascript:void(0);" rel="' + qus_arr.language + '">' + getLanguage(qus_arr.language) + '</a>';
        $.each(qus_arr.translations, function (t_key, lang) {
            tr_qus += '<span class="ch-lang cls-' + t_key + '" style="display:none;">' + lang + '</span>';
            tr_btn += '<a class="translate ' + t_key + '" href="javascript:void(0);" rel="' + t_key + '">' + getLanguage(t_key) + '</a>';
        });
        if (tr_btn != '') {
            tr_btn = '<div class="tr-btn">' + l_btn + tr_btn + '</div>';
        }
        data_qus = data_qus + tr_qus + tr_btn;

        $("#disp_qus").html(data_qus).removeClass().addClass('qus-' + q_id).show();

        if (qus_arr.questionType == 'SingleChoiceScale') {
            $("#disp_choices").hide();
            $("#display_questions").find(".rating").remove();
            html = '<div class="rating">';
            var choices = qus_arr.choices;
            var ch_len = choices.length;
            var choice = '';
            for (let i = ch_len - 1; i >= 0; i--) {
                choice = qus_arr.choices[i];
                if ($.inArray(choice.cid, answered_choices) == -1) {
                    cls = '';
                } else {
                    cls = 'checked';
                }
                html += '<input type="radio" class="rating_scale" name="rating" id="rata' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" ' + cls + ' ><label for="rata' + choice.cid + '">' + choice.choiceData + '</label>';
            }
            html += '</div>';
            $(html).insertAfter("#disp_choices");
        } 
        else 
        {         
            var g_img = '';
            $("#display_questions").find(".rating").remove();
            if (qus_arr.questionType == 'SingleChoiceQuesImage' || qus_arr.questionType == 'SingleChoiceQuesAndChoiceImage') {
                // graphic_attr = qus_arr.graphicAttr;
                // graphic_id = qus_arr.graphicId;
                var loading = '<div class="my-loader">Loading...</div>';
                $("#disp_qus").append(loading);
                //disp_qus_image(graphic_id, graphic_attr);
                get_images_option(q_id, qus_arr);  
            }
            else{
            var reset_btn = '';
            if (qus_arr.questionType == 'MultiChoiceRanking') {
                reset_btn = '<div class="reset-btn"><a href="javascript:void(0);" class="custom-btn-reset">Reset Selection <i class="fas fa-redo-alt"></i></a></div>';
            }

            $("#disp_choices").html('').show();
            $.each(qus_arr.choices, function (key, choice) {
                if ($.inArray(choice.cid, answered_choices) == -1) {
                    cls = '';
                } else {
                    cls = ' selected';
                }
                graphic_attr = choice.graphicAttr;
                graphic_id = choice.graphicId;           
                if (graphic_id != '') {
                    if ((key + 1) == qus_arr.choices.length) {
                        disp = 1;
                    }
                    if (key == 0) {
                        var loading = '<div class="my-loader">Loading...</div>';
                        $("#disp_choices").html(loading);
                    }
                    disp_choice_image(graphic_id, graphic_attr, choice, cls, qus_arr, disp);
                } else {
                    if (qus_arr.questionType == 'MultiChoiceRanking') {

                        sel_opt = (answered_ranks[choice.cid]) ? answered_ranks[choice.cid] : '';

                        html_select = '<select class="sel-rank" rel="' + choice.cid + '" data-ref="' + sel_opt + '" ><option value="">-- Select --</option>';
                        for (let i = 1; i <= ch_length; i++) {
                            if (sel_opt == i) {
                                my_sel = 'selected';
                            } else {
                                my_sel = '';
                            }

                            if (sel_opt != '' && my_sel != 'selected') {
                                dis_ref = 'disabled';
                            } else {
                                dis_ref = '';
                            }

                            html_select += '<option value="' + i + '" ' + my_sel + ' ' + dis_ref + ' >' + i + '</option>';
                        }
                        html_select += '</select>';
                        html += '<button class="btn btn-select ch-default ch-lang' + cls + ' cls-' + qus_arr.language + '" id="btn_' + choice.cid + '" name="btn_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" >' + choice.choiceData + html_select + '</button>';
                        $.each(choice.translations, function (c_key, ch_lang) {
                            html += '<button class="btn btn-select ch-lang' + cls + ' cls-' + c_key + '" id="btn_' + c_key + '_' + choice.cid + '" name="btn_' + c_key + '_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" style="display:none;" >' + ch_lang + html_select + '</button>';
                        });
                    } else {
                        html += '<button class="btn btn-select ch-default ch-lang' + cls + ' cls-' + qus_arr.language + '" id="btn_' + choice.cid + '" name="btn_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" >' + choice.choiceData + '</button>';
                        $.each(choice.translations, function (c_key, ch_lang) {
                            html += '<button class="btn btn-select ch-lang' + cls + ' cls-' + c_key + '" id="btn_' + c_key + '_' + choice.cid + '" name="btn_' + c_key + '_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" style="display:none;" >' + ch_lang + '</button>';
                        });
                    }
                    $("#disp_choices").html(reset_btn + html).show();
                }
            });
            }
        }

        if (sections_qus_count[index] == q_no) {
            if (q_no > 1) {
                btns = '<button class="submit btn_prev">Previous</button>';
            }
            btns += '<button class="submit btn_submit">Submit</button>';
        } else {
            if (q_no > 1) {
                btns = '<button class="submit btn_prev">Previous</button>';
            }
            btns += '<button class="submit btn_next">Next</button>';
        }
        $("#disp_button").html(btns).show();

        $(window).scrollTop($('#view_qus_data').offset().top);
        set_array['pretty_qn_time'] = 0;
        change_settings();

        var ht = $(".questionTextWrapper").height();
        $(".vertLine").css("height", (ht - 125));

        if (q_no > 0 && set_array['total_questions'] > 1 && set_array['is_mandatory'] == 0) {
            $("#view_counter_answers").find("#qnn_" + q_no).addClass("current");
        }
    }
}


function set_questions_old(index, qus_no) {
    if (index >= 0) {

        $("#pretty_qn_time").html('<i class="far fa-clock"></i> 00 min 00 sec');

        if (qus_no == 0) {
            sec_qids = [];
            $.each(qus_main_arr[index].questions, function (key, values) {
                sec_qids.push(values.qid);
            });
        }

        set_array['current_qn_index'] = index;
        set_array['current_section_id'] = section_ids[index];

        $("#disp_qus").hide();
        $("#disp_choices").hide();
        $("#disp_button").hide();

        isAnswered = false;
        var html = '';
        var btns = '';
        var q_id = '';
        var cls = '';
        var qus_arr = [];
        var data_qus = '';
        var tr_btn = '';
        var tr_qus = '';
        var graphic_attr = '';
        var graphic_id = '';
        var html_select = '';
        var sel_opt = '';
        var my_sel = '';
        var dis_ref = '';

        var disp = 0;
        qus_arr = qus_main_arr[index].questions[qus_no];
        var q_no = qus_no + 1;
        set_array['current_qn'] = q_no;
        q_id = qus_arr.qid;
        set_array['current_qn_type'] = qus_arr.questionType;
        set_array['current_qn_id'] = q_id;
        qn_type_by_qid[q_id] = qus_arr.questionType;

        set_array['max_choice'] = qus_arr.maxChoice;

        var ch_length = qus_arr.choices.length;
        set_array['choice_length'] = ch_length;

        if ($.inArray(q_id, answered_qns) == -1)
        {
            set_array['questions_counter'] = set_array['questions_counter'] + 1;
        }

        $("#q_no").text(q_no);
       
        data_qus = '<span class="qus-default ch-lang cls-' + qus_arr.language + '">' + qus_arr.question + '</span>';
        var l_btn = '<a class="translate ' + qus_arr.language + ' active" href="javascript:void(0);" rel="' + qus_arr.language + '">' + getLanguage(qus_arr.language) + '</a>';
        $.each(qus_arr.translations, function (t_key, lang) {
            tr_qus += '<span class="ch-lang cls-' + t_key + '" style="display:none;">' + lang + '</span>';
            tr_btn += '<a class="translate ' + t_key + '" href="javascript:void(0);" rel="' + t_key + '">' + getLanguage(t_key) + '</a>';
        });
        if (tr_btn != '') {
            tr_btn = '<div class="tr-btn">' + l_btn + tr_btn + '</div>';
        }
        data_qus = data_qus + tr_qus + tr_btn;

        $("#disp_qus").html(data_qus).removeClass().addClass('qus-' + q_id).show();

        if (qus_arr.questionType == 'SingleChoiceScale') {
            $("#disp_choices").hide();
            $("#display_questions").find(".rating").remove();
            html = '<div class="rating">';
            var choices = qus_arr.choices;
            var ch_len = choices.length;
            var choice = '';
            for (let i = ch_len - 1; i >= 0; i--) {
                choice = qus_arr.choices[i];
                if ($.inArray(choice.cid, answered_choices) == -1) {
                    cls = '';
                } else {
                    cls = 'checked';
                }
                html += '<input type="radio" class="rating_scale" name="rating" id="rata' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" ' + cls + ' ><label for="rata' + choice.cid + '">' + choice.choiceData + '</label>';
            }
            html += '</div>';
            $(html).insertAfter("#disp_choices");
        } else {
            $("#display_questions").find(".rating").remove();
            if (qus_arr.questionType == 'SingleChoiceQuesImage' || qus_arr.questionType == 'SingleChoiceQuesAndChoiceImage') {
                graphic_attr = qus_arr.graphicAttr;
                graphic_id = qus_arr.graphicId;
                var loading = '<div class="my-loader">Loading...</div>';
                $("#disp_qus").append(loading);
                disp_qus_image(graphic_id, graphic_attr);
            }

            var reset_btn = '';
            if (qus_arr.questionType == 'MultiChoiceRanking') {
                reset_btn = '<div class="reset-btn"><a href="javascript:void(0);" class="custom-btn-reset">Reset Selection <i class="fas fa-redo-alt"></i></a></div>';
            }

            $("#disp_choices").html('').show();
            $.each(qus_arr.choices, function (key, choice) {
                if ($.inArray(choice.cid, answered_choices) == -1) {
                    cls = '';
                } else {
                    cls = ' selected';
                }
                graphic_attr = choice.graphicAttr;
                graphic_id = choice.graphicId;
                if (graphic_id != '') {
                    if ((key + 1) == qus_arr.choices.length) {
                        disp = 1;
                    }
                    if (key == 0) {
                        var loading = '<div class="my-loader">Loading...</div>';
                        $("#disp_choices").html(loading);
                    }
                    disp_choice_image(graphic_id, graphic_attr, choice, cls, qus_arr, disp);
                } else {
                    if (qus_arr.questionType == 'MultiChoiceRanking') {

                        sel_opt = (answered_ranks[choice.cid]) ? answered_ranks[choice.cid] : '';

                        html_select = '<select class="sel-rank" rel="' + choice.cid + '" data-ref="' + sel_opt + '" ><option value="">-- Select --</option>';
                        for (let i = 1; i <= ch_length; i++) {
                            if (sel_opt == i) {
                                my_sel = 'selected';
                            } else {
                                my_sel = '';
                            }

                            if (sel_opt != '' && my_sel != 'selected') {
                                dis_ref = 'disabled';
                            } else {
                                dis_ref = '';
                            }

                            html_select += '<option value="' + i + '" ' + my_sel + ' ' + dis_ref + ' >' + i + '</option>';
                        }
                        html_select += '</select>';
                        html += '<button class="btn btn-select ch-default ch-lang' + cls + ' cls-' + qus_arr.language + '" id="btn_' + choice.cid + '" name="btn_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" >' + choice.choiceData + html_select + '</button>';
                        $.each(choice.translations, function (c_key, ch_lang) {
                            html += '<button class="btn btn-select ch-lang' + cls + ' cls-' + c_key + '" id="btn_' + c_key + '_' + choice.cid + '" name="btn_' + c_key + '_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" style="display:none;" >' + ch_lang + html_select + '</button>';
                        });
                    } else {
                        html += '<button class="btn btn-select ch-default ch-lang' + cls + ' cls-' + qus_arr.language + '" id="btn_' + choice.cid + '" name="btn_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" >' + choice.choiceData + '</button>';
                        $.each(choice.translations, function (c_key, ch_lang) {
                            html += '<button class="btn btn-select ch-lang' + cls + ' cls-' + c_key + '" id="btn_' + c_key + '_' + choice.cid + '" name="btn_' + c_key + '_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" style="display:none;" >' + ch_lang + '</button>';
                        });
                    }
                    $("#disp_choices").html(reset_btn + html).show();
                }
            });
        }

        if (sections_qus_count[index] == q_no) {
            if (q_no > 1) {
                btns = '<button class="submit btn_prev">Previous</button>';
            }
            btns += '<button class="submit btn_submit">Submit</button>';
        } else {
            if (q_no > 1) {
                btns = '<button class="submit btn_prev">Previous</button>';
            }
            btns += '<button class="submit btn_next">Next</button>';
        }
        $("#disp_button").html(btns).show();

        $(window).scrollTop($('#view_qus_data').offset().top);
        set_array['pretty_qn_time'] = 0;
        change_settings();

        var ht = $(".questionTextWrapper").height();
        $(".vertLine").css("height", (ht - 125));

        if (q_no > 0 && set_array['total_questions'] > 1 && set_array['is_mandatory'] == 0) {
            $("#view_counter_answers").find("#qnn_" + q_no).addClass("current");
        }
    }
}

function get_images_option(q_id, qus_arr){
     var response = '';
     var qus_img = '';
     var align = '';
     var q_choices = '';
     var reset_btn = '';
     var disp = 0;
     var cls = '';
     var graphic_attr = '';
     var graphic_id = '';
     var html = '';
     $.ajax({
        type: "POST",
        async: false,
        data: { 
            q_id: q_id
        },
        url: "./api/ajax.php?load_question_images",
        dataType: "json",
        success: function (res) {
            if (res.success == 1) {
                response = JSON.parse(res.data);
                $("#disp_qus").find(".my-loader").remove();
                $(".imageBasedQuestion").remove();
                // qus_img = '<div class="imageBasedQuestion" style="text-align:' + align + '"><img class="qus-img" src="data:' + fmt + ';base64,' + res.data + '"></div>';
                // $('#disp_qus.qus-' + q_id).append(qus_img);
                align = response.graphic_attr;
                qus_img = '<div class="imageBasedQuestion" style="text-align:' + align + '"><img class="qus-img" src="' + response.graphic_id + '"></div>';
                $('#disp_qus.qus-' + q_id).append(qus_img);
                q_choices = response.choices;
                
            $("#disp_choices").html('').show();
            $.each(qus_arr.choices, function (key, choice) {    
               
                if ($.inArray(choice.cid, answered_choices) == -1) {
                    cls = '';
                } else {
                    cls = ' selected';
                }
                // graphic_attr = choice.graphicAttr;
                // graphic_id = choice.graphicId;
                graphic_attr = q_choices[key].graphic_attr;   
                graphic_id = q_choices[key].graphic_id;   
                if (graphic_id != '') {
                    if ((key + 1) == qus_arr.choices.length) {
                        disp = 1;
                    }
                    if (key == 0) {
                        var loading = '<div class="my-loader">Loading...</div>';
                        $("#disp_choices").html(loading);
                    }

                // disp_choice_image(graphic_id, graphic_attr, choice, cls, qus_arr, disp);

                ch_img = '<img class="ch-img" src="' + graphic_id + '">';
                html = '<button class="btn2 btn-select ch-default ch-lang' + cls + ' cls-' + qus_arr.language + '" id="btn_' + choice.cid + '" name="btn_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" ><div class="btnWrap1">' + ch_img + '<p>' + choice.choiceData + '</p></div></button>';
                $.each(choice.translations, function (c_key, ch_lang) {
                    html += '<button class="btn2 btn-select ch-lang' + cls + ' cls-' + c_key + '" id="btn_' + c_key + '_' + choice.cid + '" name="btn_' + c_key + '_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" style="display:none;" ><div class="btnWrap1">' + ch_img + '<p>' + ch_lang + '</p></div></button>';
                });
                if (disp == 1) {
                    $("#disp_choices").find(".my-loader").remove();
                    $("#disp_choices").append(html).show();
                } else {
                    $("#disp_choices").append(html).hide();
                }

                } else {                   
                        html += '<button class="btn btn-select ch-default ch-lang' + cls + ' cls-' + qus_arr.language + '" id="btn_' + choice.cid + '" name="btn_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" >' + choice.choiceData + '</button>';
                        $.each(choice.translations, function (c_key, ch_lang) {
                            html += '<button class="btn btn-select ch-lang' + cls + ' cls-' + c_key + '" id="btn_' + c_key + '_' + choice.cid + '" name="btn_' + c_key + '_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" style="display:none;" >' + ch_lang + '</button>';
                        });
                    
                    $("#disp_choices").html(reset_btn + html).show();
                }
            });

            }
        }
    });
}

function disp_qus_image(graphic_id, graphic_attr) {
    var qus_img = '';
    var fmt = graphic_attr.split("fmt=");
    fmt = (fmt[1]) ? 'image/' + fmt[1] : 'image/png';
    var graphic_split = graphic_attr.split("&");
    var align = (graphic_split[0]) ? graphic_split[0].split("align=") : '';
    align = (align[1]) ? align[1] : 'center';
    var q_id = set_array['current_qn_id'];
    $.ajax({
        type: "POST",
        // async: false,
        data: {
            graphicId: graphic_id
        },
        url: "./api/ajax.php?get_assessment_image",
        dataType: "json",
        success: function (res) {
            if (res.success == 1) {
                $("#disp_qus").find(".my-loader").remove();
                $(".imageBasedQuestion").remove();
                qus_img = '<div class="imageBasedQuestion" style="text-align:' + align + '"><img class="qus-img" src="data:' + fmt + ';base64,' + res.data + '"></div>';
                $('#disp_qus.qus-' + q_id).append(qus_img);
                paused--;
                // alert(paused);
            }
        }
    });
}

// function disp_choice_image(graphic_id, graphic_attr, choice, cls, qus_arr, disp = 0) {
//     var ch_img = '';
//     var html = '';
//     var fmt = graphic_attr.split("fmt=");
//     fmt = (fmt[1]) ? 'image/' + fmt[1] : 'image/png';
//     var graphic_split = graphic_attr.split("&");
//     var align = (graphic_split[0]) ? graphic_split[0].split("align=") : '';
//     align = (align[1]) ? align[1] : 'center';

//                 ch_img = '<img class="ch-img" src="' + graphic_id + '">';
//                 html += '<button class="btn2 btn-select ch-default ch-lang' + cls + ' cls-' + qus_arr.language + '" id="btn_' + choice.cid + '" name="btn_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" ><div class="btnWrap1">' + ch_img + '<p>' + choice.choiceData + '</p></div></button>';
//                 $.each(choice.translations, function (c_key, ch_lang) {
//                     html += '<button class="btn2 btn-select ch-lang' + cls + ' cls-' + c_key + '" id="btn_' + c_key + '_' + choice.cid + '" name="btn_' + c_key + '_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" style="display:none;" ><div class="btnWrap1">' + ch_img + '<p>' + ch_lang + '</p></div></button>';
//                 });
//                 if (disp == 1) {
//                     $("#disp_choices").find(".my-loader").remove();
//                     $("#disp_choices").append(html).show();
//                 } else {
//                     $("#disp_choices").append(html).hide();
//                 }
        
// }

function disp_choice_image(graphic_id, graphic_attr, choice, cls, qus_arr, disp = 0) {
    var ch_img = '';
    var html = '';
    var fmt = graphic_attr.split("fmt=");
    fmt = (fmt[1]) ? 'image/' + fmt[1] : 'image/png';
    var graphic_split = graphic_attr.split("&");
    var align = (graphic_split[0]) ? graphic_split[0].split("align=") : '';
    align = (align[1]) ? align[1] : 'center';  
    $.ajax({
        type: "POST",
        async: false,
        data: {
            graphicId: graphic_id
        },
        url: "./api/ajax.php?get_assessment_image",
        dataType: "json",
        success: function (res) {
            if (res.success == 1) {
                ch_img = '<img class="ch-img" src="data:' + fmt + ';base64,' + res.data + '">';
                html += '<button class="btn2 btn-select ch-default ch-lang' + cls + ' cls-' + qus_arr.language + '" id="btn_' + choice.cid + '" name="btn_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" ><div class="btnWrap1">' + ch_img + '<p>' + choice.choiceData + '</p></div></button>';
                $.each(choice.translations, function (c_key, ch_lang) {
                    html += '<button class="btn2 btn-select ch-lang' + cls + ' cls-' + c_key + '" id="btn_' + c_key + '_' + choice.cid + '" name="btn_' + c_key + '_' + choice.cid + '" value="' + choice.cid + '" data-qtype="' + qus_arr.questionType + '" data-qid="' + qus_arr.qid + '" style="display:none;" ><div class="btnWrap1">' + ch_img + '<p>' + ch_lang + '</p></div></button>';
                });
                if (disp == 1) {
                    $("#disp_choices").find(".my-loader").remove();
                    $("#disp_choices").append(html).show();
                } else {
                    $("#disp_choices").append(html).hide();
                }
            }
        }
    });
}

function disp_choice_image_multi(cur_choice_ids, cur_graphic_ids, cur_graphic_cls, cur_graphic_fmt, cur_qimg_language, cur_qimg_translations_val, cur_qimg_translations_lang, cur_qimg_questionType, cur_qimg_qid, cur_qimg_choiceData){
     $.ajax({
        type: "POST",
        // async: false,
        data: {
            cur_choice_ids: cur_choice_ids,
            cur_graphic_ids: cur_graphic_ids,
            cur_graphic_cls: cur_graphic_cls,
            cur_graphic_fmt: cur_graphic_fmt, 
            cur_qimg_translations_val: cur_qimg_translations_val, 
            cur_qimg_translations_lang: cur_qimg_translations_lang,
            cur_qimg_questionType: cur_qimg_questionType, 
            cur_qimg_qid: cur_qimg_qid, 
            cur_qimg_choiceData: cur_qimg_choiceData, 
            cur_qimg_language: cur_qimg_language
        },
        url: "./api/ajax.php?get_assessment_image_multi",
        dataType: "json",
        success: function (res) {         
            if (res.success == 1) {         
                $("#disp_choices").html(res.html);  
                paused--;
                // alert(paused);          
            }
        }
    }); 
}

function set_answered_unanswered_block() {
    var html = '';
    for (let i = 1; i <= set_array['total_questions']; i++) {
        html += '<div class="qus-circle" id="qnn_' + i + '" rel="' + i + '">' + i + '</div>';
    }
    $("#view_counter_answers").html(html);
    $("#counter_answers_sect").show();
}

$("#view_counter_answers").on("click", ".qus-circle", function () {
    var elem = $(this);
    var index = set_array['current_qn_index'];
    var no = $(elem).attr("rel");
    var cur_qus = set_array['current_qn'];
    $("#view_counter_answers").find("#qnn_"+cur_qus).removeClass("current");
    set_questions(index, parseInt(no) - 1);
});

function my_timer_fn() {
    var timer1 = set_array['pretty_time'];
    if (timer1 > 0) {
        timer1--;
        set_array['pretty_time'] = timer1;
        set_pretty_time();
    } else {
        // clearInterval(my_full_timer);
        section_score();
    }
}

function my_sec_timer_fn() {
    var timer3 = set_array['current_section_time_limit'];
    if (timer3 > 0) {
        if(paused==0){
        timer3--;
        if (timer3 == 15) {
            mug_alert_lite("info", "Hurry!! Only 15 seconds remaining..")
        }
        set_array['current_section_time_limit'] = timer3;
        set_sec_pretty_time();
        }
    } else {
        clearInterval(my_sec_timer);
        section_score('time-out');
    }
}


function my_qn_timer_fn() {
    var timer2 = set_array['pretty_qn_time'];
    if(paused==0){
    timer2++;
    set_array['pretty_qn_time'] = timer2;
    set_pretty_qn_time();
    }
}

function change_settings() {
    // var questions_counter = set_array['questions_counter'];
    var current_qn = set_array['current_qn'];
    var total_questions = set_array['total_questions']; 
    var answered_qns_count = set_array['answered_qns_count'];
    var ans_percent = ((answered_qns_count / total_questions) * 100).toFixed(1);
    var q_msg = (total_questions == 1) ? ' Question ' : ' Questions ';
    $("#sec_ques_info").html('<p>' + current_qn + ' of ' + total_questions + q_msg + ' </p>');
    $("#sec_ans_info").html('<p>' + answered_qns_count + ' of ' + total_questions + q_msg + ' Answered</p>');
    $("#ans_percent").html(ans_percent + '%');
    if(parseInt(total_questions)>1){
        $("#ans_percent").show();
    }
    else{
        $("#ans_percent").hide();
    }
    $("#progress_sec").css('width', ans_percent + '%');
    set_pretty_qn_time();
    set_pretty_time();
}

function set_pretty_time() {
    var time = set_array['pretty_time'] / 60;
    var minutes = parseInt(time);
    var seconds = Math.round((time - minutes) * 60);
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    $("#pretty_time").html(minutes + " min " + seconds + " sec");
}

function set_sec_pretty_time() {
    var time = set_array['current_section_time_limit'] / 60;
    var minutes = parseInt(time);
    var seconds = Math.round((time - minutes) * 60);
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    $("#sec_pretty_time").html('<i class="far fa-clock"></i> Time Left : ' + minutes + " min " + seconds + " sec");
}


function set_pretty_qn_time() {
    let qtime = set_array['pretty_qn_time'] / 60;
    let minutes = parseInt(qtime);
    let seconds = Math.round((qtime - minutes) * 60);
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    $("#pretty_qn_time").html('<i class="far fa-clock"></i> ' + minutes + " min " + seconds + " sec");
}

function section_score(timeout = '') {
    var section_id = set_array['current_section_id'];
    var qid = set_array['current_qn_id'];
    var tempArr = [];
    var ans_sec_full = [];
    var i = 1;
    var tem_qid = '';
    var cur_index = '';
    var index = '';

    $("#counter_answers_sect").hide();
    $("#view_counter_answers").html();

    if (qn_type_by_qid[qid] == 'MultiChoiceRanking') {
        ans_sec_full = user_responses_multi_rank;
    } else {
        $.each(user_responses_multi, function (key, values) {
            if (tem_qid == values.qid) {
                i++;
            } else {
                tem_qid = values.qid;
                i = 1;
            }
            tempArr.push({"qid": values.qid, "cid": values.cid, "cseq": i});
        });
        ans_sec_full = tempArr.concat(user_responses);

        var qus_temp_arr = [];
        $.each(ans_sec_full, function (key, value) {
            qus_temp_arr.push(value.qid);
        });

        $.each(sec_qids, function (key, qid) {
            if ($.inArray(qid, qus_temp_arr) == -1) {
                ans_sec_full.push({"qid": qid, "cid": "", "cseq": 1});
            }
        });
    }


    if (set_array['sections_count'] > 1) {
        var section_answer_arr = {"answers": ans_sec_full, "surveyid": set_array['survey_id'].toString(), "sectionid": section_id.toString()};
    } else {
        var section_answer_arr = {"answers": ans_sec_full, "surveyid": set_array['survey_id'].toString()};
    }

    // alert(JSON.stringify(user_responses_multi_rank));
    // alert(JSON.stringify(ans_sec_full));

    console.log(section_answer_arr);

    $.ajax({
        type: "POST",
        // async: false,
        data: {
            answers: section_answer_arr,
            sections_count: set_array['sections_count']
        },
        url: "./api/ajax.php?store_answers",
        dataType: "json",
        success: function (res) {
            if (res.success == 1) {
                if (res.data.Message) {
                    if (timeout == 'time-out') {
                        mug_alert_no_confirm('info', 'Time is over', 'à´ˆ à´Ÿàµ†à´¸àµà´±àµà´±à´¿à´¨àµ  à´…à´¨àµà´µà´¦à´¿à´šàµà´š à´¸à´®à´¯à´‚ à´…à´µà´¸à´¾à´¨à´¿à´šàµà´šàµ.');
                    } else {
                        mug_alert_no_confirm('success', 'Success', res.data.Message);
                    }
                } else {
                    mug_alert_no_confirm('info', '', res.data);
                }
                $(".submit.btn_submit").html('Submit').css("pointer-events", "initial");

                $("#tbl_info").hide();
                $("#tdef_" + (parseInt(current_assessment_index))).removeClass("ongoing-sct").addClass("completed-sct");

                if ((set_array['sections_count'] == 1) || ((parseInt(set_array['current_qn_index']) + 1) == set_array['sections_count'])) {
                    cur_index = parseInt(current_assessment_index) + 1;
                    current_assessment_index = cur_index;
                } else {
                    cur_index = parseInt(current_assessment_index);
                    $("#ibtn_start_" + cur_index).html("START ASSESSMENT").css("pointer-events", "initial");
                }


                if (cur_index != 11) {
                    $("#progress_section").hide();
                    $(".hr").hide();
                    $("#info_disp").hide();
                    $("#sec_ques_info").hide();
                    $("#display_questions").hide();
                    $("#sec_based_test").hide();
                    $(".secwise-instructions").hide();
                    $(".ins-sec").hide();
                    $(".instructions-data").hide();
                    $("#disp_sec_time").hide();
                    $(".inner_sec").hide();
                    $("#tbl_info").hide();
                    $("#display_instructions").show();
                    $("#ins-section-" + cur_index).show();
                    $(".sub_1").hide();
                    if (set_array['sections_count'] > 1 && ((parseInt(set_array['current_qn_index']) + 1) != set_array['sections_count'])) {
                        index = parseInt(set_array['current_qn_index']) + 1;
                        var sec_ref = ((section_name[index]).replace(/ /g, "_")).toLowerCase();
                        if(sec_ref == 'verbal_ability_mal'){
                            sec_ref = 'verbal_ability';    
                        }
                        $(".cls-" + sec_ref).show();
                    } else {
                        $(".sub_1").show();
                    }
                    $(window).scrollTop($('#display_instructions').offset().top);
                    all_clear('asm');
                } else {
                    location.href = "dashboard";
                }                
            } else {
                // if (res.data.Message) {
                //     mug_alert_no_confirm('success', 'Success', res.data.Message);
                // } else {
                //     mug_alert_no_confirm('info', '', res.data);
                // }
                // set_sections();
            }
        }
    });

}

function all_clear(opt) {
    sec_qids = [];
    answer_arr = '';
    user_responses = [];
    user_responses_multi = [];
    user_responses_multi_rank = [];
    answered_ranks = [];
    skip_arr = [];
    next_arr = [];
    answered_qns = [];
    answered_choices = [];
    map_ans = {};
    isAnswered = false;
    start_enabled = 0;
    if (opt == 'qus') {
        set_array['questions_counter'] = 0;
        set_array['answered_qns_count'] = 0;
        clearInterval(my_qn_timer);
        clearInterval(my_sec_timer);
    } else {
        set_array = [];
        sections_arr = [];
        sections_qus_count = [];
        section_name = [];
        section_ids = [];
        section_time_limit = [];
        test_ids = [];
        test_name = [];
        qus_main_arr = [];
        completed_sec = [];
        qn_type_by_qid = [];
        // clearInterval(my_full_timer);
        clearInterval(my_qn_timer);
        clearInterval(my_sec_timer);
    }
}


function clear_settings() {
    set_array['current_qn_id'] = 0;
    set_array['survey_id'] = 0;
    set_array['current_qn'] = 0;
    // set_array['total_questions'] = 0;
    // set_array['answered_qns_count'] = 0;
    set_array['pretty_qn_time'] = 0;
    set_array['pretty_time'] = 0;
    set_array['is_running'] = false;
    change_settings();
}

$("#assessments_sect").on("click", ".btn_skip", function () {
    var qid = set_array['current_qn_id'];
    var no = set_array['current_qn'];
    var index = set_array['current_qn_index'];
    skip_sec(qid);
    set_questions(index, no);
});

function skip_sec(qid) {
    var cid = '';
    delete map_ans[qid];
    skip_arr.push(qid);
    if ($.inArray(qid, answered_qns) > -1) {
        answered_qns.splice($.inArray(qid, answered_qns), 1);
        ser_user_responses_arr(qid, cid);
    } else {
        ser_user_responses_arr(qid, cid);
    }
}


function ser_user_responses_arr(qid, cid) {
    var temp_arr = {"qid": qid, "cid": cid, "cseq": "1"};
    const removedItems = user_responses.filter(function (itemm) {
        return itemm.qid !== temp_arr.qid;
    });
    user_responses = removedItems;
    user_responses.push(temp_arr);
    //answer_arr = {"answers": user_responses, "surveyid": set_array['survey_id'].toString()};     
}


$("#assessments_sect").on("click", ".btn_next", function () {
    var qid = set_array['current_qn_id'];
    var cur_qus = set_array['current_qn'];    
    if (qn_type_by_qid[qid] == 'MultiChoice') {
        var len = $("#disp_choices").find('.selected:visible').length;
        if (len > 0 || set_array['is_mandatory'] == 0) {
            isAnswered = true;
        } else {
            isAnswered = false;
        }
        //  if (user_responses_multi.length > 0 && isAnswered == true) {
        if (isAnswered == true) {
            $(this).html('Please Wait!!').css("pointer-events", "none");
            var isFinish = 'no';
            ans_length_settings(qid, isFinish);
            if(set_array['total_questions'] > 1 && set_array['is_mandatory'] == 0){
                $("#view_counter_answers").find("#qnn_"+cur_qus).removeClass("current").addClass("answered");
            }
        } else {
            mug_alert_lite('error', 'Please select a choice');
        }
    } else if (qn_type_by_qid[qid] == 'MultiChoiceRanking') {
        var len = $("#disp_choices").find('.selected:visible').length;
        if (set_array['choice_length'] != len) {
            mug_alert_lite('error', 'Please select all options');
        } else {
            $(this).html('Please Wait!!').css("pointer-events", "none");
            var isFinish = 'no';
            push_rank_answers(qid, isFinish);
            if(set_array['total_questions'] > 1 && set_array['is_mandatory'] == 0){
                $("#view_counter_answers").find("#qnn_"+cur_qus).removeClass("current skipped answered").addClass("answered");
            }
        }
    } else {
        var cid = (map_ans[qid]) ? map_ans[qid] : '';
        if (cid != '' || set_array['is_mandatory'] == 0) {
            $(this).html('Please Wait!!').css("pointer-events", "none");
            var isFinish = 'no';
            push_ans(isFinish, qid, cid);
            if(set_array['total_questions'] > 1 && set_array['is_mandatory'] == 0){
                if(cid==''){
                    $("#view_counter_answers").find("#qnn_"+cur_qus).removeClass("current skipped answered").addClass("skipped");
                }
                else{
                    $("#view_counter_answers").find("#qnn_"+cur_qus).removeClass("current skipped answered").addClass("answered");
                }
            }

        } else {
            mug_alert_lite('error', 'Please select a choice');
        }
    }
});


function push_rank_answers(qid, isFinish) {

    var temp_arr = [];
    var tmp;
    var ans;
    var i;

    $(".btn-select.selected:visible").each(function () {
        ans = $(this).val();
        i = $(this).find(".sel-rank").val();
        tmp = {"qid": qid, "cid": ans, "cseq": i};
        user_responses_multi_rank = user_responses_multi_rank.filter(function (itemm) {
            return itemm.cid !== tmp.cid;
        });
        user_responses_multi_rank.push(tmp);
        answered_ranks[ans] = parseInt(i);
        if ($.inArray(parseInt(ans), answered_choices) == -1) {
            answered_choices.push(parseInt(ans));
        }
    });

    var index = set_array['current_qn_index'];
    var no = set_array['current_qn'];
    next_arr.push(qid);
    if ($.inArray(qid, answered_qns) == -1)
    {
        answered_qns.push(qid);
    }
    set_array['answered_qns_count'] = answered_qns.length;
    if (isFinish == 'no') {
        set_questions(index, no);
    } else {
        Swal.fire({
            type: 'info',
            title: '',
            html: '<div>You have completed this section. If you wish to change any answer in this section, please GO BACK. If there is no change, click SUBMIT.<br><br>à´ˆ à´­à´¾à´—à´‚ à´¨à´¿à´™àµà´™àµ¾ à´ªàµ‚àµ¼à´¤àµà´¤à´¿à´¯à´¾à´•àµà´•à´¿à´¯à´¿à´°à´¿à´•àµà´•àµà´¨àµà´¨àµ. à´à´¤àµ†à´™àµà´•à´¿à´²àµà´‚ à´‰à´¤àµà´¤à´°à´™àµà´™àµ¾ à´®à´¾à´±àµà´±à´¾àµ» à´†à´—àµà´°à´¹à´®àµà´£àµà´Ÿàµ†à´™àµà´•à´¿àµ½ GO BACK à´•àµà´²à´¿à´•àµà´•àµ à´šàµ†à´¯àµà´¯àµà´•. à´®à´¾à´±àµà´±à´™àµà´™àµ¾ à´’à´¨àµà´¨àµà´®à´¿à´²àµà´²àµ†à´™àµà´•à´¿àµ½ SUBMIT à´šàµ†à´¯àµà´¯àµà´•.</div>',
            showCancelButton: true,
            cancelButtonText: 'GO BACK',
            showConfirmButton: true,
            confirmButtonText: 'SUBMIT'
        }).then((result) => {
            if (result.value) {
                $('.btn_submit').html('Please Wait!!').css("pointer-events", "none");
                ans_length_settings(qid, isFinish);
                if ($.inArray(index, completed_sec) == -1) {
                    completed_sec.push(index);
                }
                section_score();
            }
        });
    }
}


$("#assessments_sect").on("click", ".btn_submit", function () {
    var index = parseInt(set_array['current_qn_index']);
    var qid = set_array['current_qn_id'];
    var cur_qus = set_array['current_qn'];
    var isFinish = 'yes';
    var info_html = '<div>You have completed this section. If you wish to change any answer in this section, please GO BACK. If there is no change, click SUBMIT.<br><br>à´ˆ à´­à´¾à´—à´‚ à´¨à´¿à´™àµà´™àµ¾ à´ªàµ‚àµ¼à´¤àµà´¤à´¿à´¯à´¾à´•àµà´•à´¿à´¯à´¿à´°à´¿à´•àµà´•àµà´¨àµà´¨àµ. à´à´¤àµ†à´™àµà´•à´¿à´²àµà´‚ à´‰à´¤àµà´¤à´°à´™àµà´™àµ¾ à´®à´¾à´±àµà´±à´¾àµ» à´†à´—àµà´°à´¹à´®àµà´£àµà´Ÿàµ†à´™àµà´•à´¿àµ½ GO BACK à´•àµà´²à´¿à´•àµà´•àµ à´šàµ†à´¯àµà´¯àµà´•. à´®à´¾à´±àµà´±à´™àµà´™àµ¾ à´’à´¨àµà´¨àµà´®à´¿à´²àµà´²àµ†à´™àµà´•à´¿àµ½ SUBMIT à´šàµ†à´¯àµà´¯àµà´•.</div>';
    var cancel_bt_txt = 'GO BACK';
    var confirm_bt_txt = 'SUBMIT';
    if (qn_type_by_qid[qid] == 'MultiChoice') {
        var len = $("#disp_choices").find('.selected:visible').length;
        if (len > 0 || set_array['is_mandatory'] == 0) {
            isAnswered = true;            
        } else {
            isAnswered = false;
        }

        if(set_array['total_questions'] > 1 && set_array['is_mandatory'] == 0){
                if(cid==''){
                    $("#view_counter_answers").find("#qnn_"+cur_qus).removeClass("current skipped answered").addClass("skipped");
                }
                else{
                    $("#view_counter_answers").find("#qnn_"+cur_qus).removeClass("current skipped answered").addClass("answered");
                }
                var ansd_length = $("#view_counter_answers").find(".answered").length;              
                if(set_array['sections_count']>1 && set_array['total_questions']>ansd_length){
                    info_html = '<div>You have not answered all questions in this sub-section; do you want to check once again?</div>';
                    cancel_bt_txt = 'Yes';
                    confirm_bt_txt = 'No';
                }
        }

        //  if (user_responses_multi.length > 0 && isAnswered == true) {
        if (isAnswered == true) {
            Swal.fire({
                type: 'info',
                title: '',
                html: info_html,
                showCancelButton: true,
                cancelButtonText: cancel_bt_txt,
                showConfirmButton: true,
                confirmButtonText: confirm_bt_txt
            }).then((result) => {
                if (result.value) {
                    $(this).html('Please Wait!!').css("pointer-events", "none");
                    ans_length_settings(qid, isFinish);
                    if ($.inArray(index, completed_sec) == -1) {
                        completed_sec.push(index);
                    }
                    if (user_responses_multi.length == 0) {
                        var tempArr = [];
                        var ans;
                        var i = 0;
                        $(".btn-select.selected:visible").each(function () {
                            i++;
                            ans = $(this).val();
                            tempArr.push({"qid": $(this).attr("data-qid"), "cid": ans, "cseq": i});
                        });
                        user_responses_multi = tempArr;
                    }
                    section_score();
                }
            }); 
        } else {
            mug_alert_lite('error', 'Please select a choice');
        }
    } else if (qn_type_by_qid[qid] == 'MultiChoiceRanking') {
        var len = $("#disp_choices").find('.selected:visible').length;
        if (set_array['choice_length'] != len) {
            mug_alert_lite('error', 'Please select all options');
        } else {
            push_rank_answers(qid, isFinish);
            if(set_array['total_questions'] > 1 && set_array['is_mandatory'] == 0){
                $("#view_counter_answers").find("#qnn_"+cur_qus).removeClass("current skipped answered").addClass("answered");
            }
        }
    } else {
        var cid = (map_ans[qid]) ? map_ans[qid] : '';
        if (cid != '' || set_array['is_mandatory'] == 0) {

            if(set_array['total_questions'] > 1 && set_array['is_mandatory'] == 0){
                if(cid==''){
                    $("#view_counter_answers").find("#qnn_"+cur_qus).removeClass("current skipped answered").addClass("skipped");
                }
                else{
                    $("#view_counter_answers").find("#qnn_"+cur_qus).removeClass("current skipped answered").addClass("answered");
                }
                var ansd_length = $("#view_counter_answers").find(".answered").length;              
                if(set_array['sections_count']>1 && set_array['total_questions']>ansd_length){
                    info_html = '<div>You have not answered all questions in this sub-section; do you want to check once again?</div>';
                    cancel_bt_txt = 'Yes';
                    confirm_bt_txt = 'No';
                }
            }   
            Swal.fire({
                type: 'info',
                title: '',
                html: info_html,
                showCancelButton: true,
                cancelButtonText: cancel_bt_txt,
                showConfirmButton: true,
                confirmButtonText: confirm_bt_txt
            }).then((result) => {
                if (result.value) {
                    $(this).html('Please Wait!!').css("pointer-events", "none");
                    push_ans(isFinish, qid, cid);
                    if ($.inArray(index, completed_sec) == -1) {
                        completed_sec.push(index);
                    }
                    section_score();
                }
            }); 
        } else {
            mug_alert_lite('error', 'Please select a choice');
        }
    }
});

function ans_length_settings(qid, isFinish) {
    var index = set_array['current_qn_index'];
    var no = set_array['current_qn'];
    next_arr.push(qid);
    if ($.inArray(qid, answered_qns) == -1)
    {
        answered_qns.push(qid);
    }
    set_array['answered_qns_count'] = answered_qns.length;
    if (isFinish == 'no') {
        set_questions(index, no);
    }
}

function push_ans(isFinish, qid, cid) {
    if (cid != '' || set_array['is_mandatory'] == 0) {
        ans_length_settings(qid, isFinish);
        ser_user_responses_arr(qid, cid);
    } else {
        skip_sec(qid);
    }
}

$("#assessments_sect").on("click", ".btn_prev", function () {
    var index = set_array['current_qn_index'];
    var no = set_array['current_qn'];
    if (no > 1) {
        $(this).html('Please Wait!!').css("pointer-events", "none");
        if(set_array['total_questions'] > 1 && set_array['is_mandatory'] == 0){
            $("#view_counter_answers").find("#qnn_"+no).removeClass("current");
        }
        no = no - 2;
        set_questions(index, no);
    } else {
        //  set_sections();
    }
});

/*
 $("#assessments_sect").on("click", "#btn_finish", function () {
 //    var qid = set_array['current_qn_id'];
 //    var cid = (map_ans[qid]) ? map_ans[qid] : '';
 //    var isFinish = 'yes';
 //    push_ans(isFinish, qid, cid);
 //score();
 });
 */

$('#assessments_sect').on('click', '.btn-select', function () {
    var elem = $(this);
    var qid = set_array['current_qn_id'];
    var qn_type = set_array['current_qn_type'];
    var max_choice = set_array['max_choice'];
    var ans = $(elem).val();

    if (qn_type == 'MultiChoice') {
        if ($(elem).hasClass('selected')) {
            // $(elem).removeClass('selected');
            $('.btn-select[value="' + ans + '"]').removeClass('selected');
            // map_ans[qid] = '';
            var temp_arr = {"qid": qid, "cid": ans};
            const removedItems = user_responses_multi.filter(function (itemm) {
                return itemm.cid !== temp_arr.cid;
            });
            user_responses_multi = removedItems;
            answered_choices.splice(answered_choices.indexOf(parseInt(ans)), 1);
        } else {
            var len = $(elem).parents('.buttonTop').find('.btn-select.selected:visible').length;
           // if (max_choice > len) {
                //$(elem).addClass('selected');
                if (len >= max_choice){          
                    mug_alert_lite('info', 'Kindly limit your number of selections to '+ max_choice);
                }
                $('.btn-select[value="' + ans + '"]').addClass('selected');
                // map_ans[qid] = ans;        
                var temp_arr = {"qid": qid, "cid": ans};
                user_responses_multi.push(temp_arr);
                answered_choices.push(parseInt(ans));
           // } 
            // else {
            //     var al_msg = 'You can select only ' + max_choice;
            //     if (max_choice == 1) {
            //         al_msg += ' choice ';
            //     } else {
            //         al_msg += ' choices ';
            //     }
            //     al_msg += ' for this question';
            //     mug_alert_lite('info', 'You can select only ' + max_choice + ' choices for this question');
            // }
        }
        var len = $("#disp_choices").find('.selected:visible').length;
        if (len > 0) {
            isAnswered = true;
        } else {
            isAnswered = false;
        }
    } else if (qn_type == 'MultiChoiceRanking') {
        //var sel_rank = $(elem).find(".sel-rank").val();
        //alert(ans+' -- '+sel_rank);
    } else {
        // $(elem).toggleClass('selected');
        $('.btn-select[value="' + ans + '"]').toggleClass('selected');
        $(elem).parents('.buttonTop').find('.btn-select').not($('.btn-select[value="' + ans + '"]')).removeClass('selected');
        if ($(elem).hasClass('selected')) {
            isAnswered = true;
            map_ans[qid] = ans;
            var t_val = '';
            $(".btn-select").each(function () {
                t_val = parseInt($(this).val());
                if ($.inArray(t_val, answered_choices) > -1) {
                    answered_choices.splice(answered_choices.indexOf(parseInt($(this).val())), 1);
                }
            });
            answered_choices.push(parseInt(ans));
        } else {
            isAnswered = false;
            map_ans[qid] = '';
            //delete map_ans[qid];
            answered_choices.splice(answered_choices.indexOf(parseInt(ans)), 1);
        }
    }
    //alert(JSON.stringify(answered_choices));
});

$('#assessments_sect').on('change', '.sel-rank', function () {
    var elem = $(this);
    var sel = $(elem).val();
    var ans = $(elem).attr("rel");
    var old_sel = ($(elem).attr("data-ref")) ? $(elem).attr("data-ref") : '';
    if (sel != '') {
        if (!($('.btn-select[value="' + ans + '"]').hasClass('selected'))) {
            $('.btn-select[value="' + ans + '"]').addClass('selected');
        }
        if (old_sel != '') {
            $('.sel-rank[rel="' + ans + '"]').find('option').removeAttr("selected");
            $('.sel-rank').find('option[value="' + old_sel + '"]').removeAttr("disabled");
        }
        $('.sel-rank[rel="' + ans + '"]').find('option[value="' + sel + '"]').attr("selected", true);
        $('.sel-rank option[value="' + sel + '"]').not($('.sel-rank[rel="' + ans + '"]').find('option:selected')).attr("disabled", true);
        $('.sel-rank[rel="' + ans + '"]').attr('data-ref', sel);
    } else {
        $('.btn-select[value="' + ans + '"]').removeClass('selected');
        $('.sel-rank[rel="' + ans + '"]').find('option').removeAttr("selected");
        $('.sel-rank[rel="' + ans + '"]').prop("selectedIndex", 0);
        $('.sel-rank[rel="' + ans + '"]').attr('data-ref', '');
        $('.sel-rank').find('option[value="' + old_sel + '"]').removeAttr("disabled");
    }
});

$('#assessments_sect').on('click', '.custom-btn-reset', function () {
    Swal.fire({
        type: 'info',
        title: '',
        text: 'Are you sure you want to clear all selections?',
        showCancelButton: true,
        cancelButtonText: 'No',
        showConfirmButton: true,
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            $('.btn-select').removeClass('selected');
            $('.sel-rank').find('option').removeAttr("selected");
            $('.sel-rank').prop("selectedIndex", 0);
            $('.sel-rank').attr('data-ref', '');
            $('.sel-rank').find('option').removeAttr("disabled");
        }
    });
});

$("#assessments_sect").on("click", ".rating_scale", function () {
    var elem = $(this);
    var qid = set_array['current_qn_id'];
    var qn_type = set_array['current_qn_type'];
    var max_choice = set_array['max_choice'];
    var ans = $(elem).val();
    if (ans != '') {
        isAnswered = true;
        map_ans[qid] = ans;
        var t_val = '';
        $(".rating_scale").each(function () {
            t_val = parseInt($(this).val());
            if ($.inArray(t_val, answered_choices) > -1) {
                answered_choices.splice(answered_choices.indexOf(parseInt($(this).val())), 1);
            }
        });
        answered_choices.push(parseInt(ans));
    }
})


$('#display_questions').on('click', '.translate', function () {
    var lang = $(this).attr('rel');
    $(".translate").removeClass('active');
    $(this).addClass('active');
    $(".ch-lang").hide();
    if ($(".btn-select.cls-" + lang).length > 0) {
        $(".cls-" + lang).show();
    } else {
        $(".cls-" + lang).show();
        $(".ch-default").show();
    }
    var ht = $(".questionTextWrapper").height();
    $(".vertLine").css("height", (ht - 125));
});

$("#assessments_sect").on("click", "#btn_complete", function () {
    location.href = 'dashboard';
});

$("#assessments_sect").on("click", ".btn_prev_pg", function () {
    Swal.fire({
        type: 'info',
        title: '',
        text: 'Are you sure you want to go back?',
        showCancelButton: true,
        cancelButtonText: 'No',
        showConfirmButton: true,
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            location.href = 'assessments';
        }
    });
});

// $("#assessments_sect").on("click", ".btn_prev_pg", function () {    
//     $.ajax({
//         type: "POST",  
//         url: "./api/ajax.php?get_assessment_ajax",      
//         success: function (res) {
//             $('#assessments_sect').html(res);
//         }
//     });
// });



$(".close-ins").on("click", function () {
    var elem = $(this).attr("for");
    $("#" + elem).trigger("click");
});


$(".t-lang").on("click", function () {
    if ($(this).hasClass("mal")) {
        $(this).parents(".inner_sec").find(".eng-instruction").hide();
        $(this).parents(".inner_sec").find(".mal-instruction").show();
    } else {
        $(this).parents(".inner_sec").find(".mal-instruction").hide();
        $(this).parents(".inner_sec").find(".eng-instruction").show();
    }
});

$(".translate-bt").on("click", function () {
    var rel = $(this).attr("rel");
    if (rel == "ml") {
        $(".ps-eng").hide();
        $(".ps-mal").show();
    } else {
        $(".ps-mal").hide();
        $(".ps-eng").show();
    }
});

function getPreferredLanguage(){
     $.ajax({
                type: "GET",               
                url: "./api/ajax.php?get_preferred_language_selected",
                dataType: "json",
                success: function (res) {
                    if (res.success == 1) {                        
                        $('.pref_lang_sel option[value="' + res.lang + '"]').prop('selected', true);                        
                    }
        }
    });
}

function getLanguage(lang) {
    if (lang == 'en')
        return 'English';
    else if (lang == 'ml')
        return 'à´®à´²à´¯à´¾à´³à´‚';
    else
        return lang;
}

function mug_alert_confirm(type, title, msg) {
    Swal.fire({
        type: type,
        title: title,
        text: msg,
        showCancelButton: true,
        cancelButtonText: 'GO BACK',
        showConfirmButton: true,
        confirmButtonText: 'SUBMIT'
    }).then((result) => {
        if (result.value) {
            return result.value;
        } else {
            return false;
        }
        //  else if (result.isDenied) {    
        //  }
    });
}

function mug_alert_no_confirm(type, title, msg) {
    Swal.fire({
        type: type,
        title: title,
        text: msg,
        showConfirmButton: false,
        timer: 1500
    });
}

function mug_alert(type, title, msg) {
    Swal.fire({
        type: type,
        title: title,
        text: msg,
        showConfirmButton: true
    });
}

function mug_alert_link(type, msg, url) {
    Swal.fire({
        type: type,
        title: msg,
        showConfirmButton: true,
        //        timer: 2000
    }).then(function () {
        window.location = url;
    });
}

function mug_alert_lite(type, msg) {
    var Toast = Swal.mixin({
        toast: true,
        //        showConfirmButton: true,
        // position: 'top-end',
        showConfirmButton: false,
        timer: 2000
    });
    Toast.fire({
        type: type,
        title: msg
    });
}