$(document).ready(function () {
    DLog("status:" + status);
    $("#btnEnd").hide();
    try {
        if (status === "0" || status === "1") {
            try {
                SessionStart();
            }
            catch (ex) {
                DLog("SessionStartException");
                //console.log(ex);
                RefreshSession("SessionStartException");
            }

        }
        else {
            try {
                AnswersLoad(duration);
            }
            catch (ex) {
                DLog("AnswersLoad-Exception");
                //console.log(ex);
                RefreshSession("AnswersLoadException");
            }
        }
        HandleFormSubmit();  
    }
    catch (ex) {
        RefreshSession("LoadException");
    }
});
function HandleFormSubmit() {
    $("form").bind("keypress", function (e) {
        var tag = e.target.tagName;
        if (tag != "TEXTAREA") {
            if (e.keyCode == 13) {
                console.log("enter.key.disable");
                return false;
            }
        }
    });
    $("form").submit(function (event) {
        SessionEnding(event);
    });
}
function SessionEnding(event) {
    var defaultAnswers = $(".widget-title > span.label-default").length;
    var warningAnswers = $(".widget-title > span.label-warning").length;
    var dangerAnswers = $(".widget-title > span.label-danger").length; 
    var message = "Sınav oturumunu bitirmek istediğinize emin misiniz"; 
    console.log("defaultAnswers:" + defaultAnswers);
    console.log("warningAnswers:" + warningAnswers);
    console.log("dangerAnswers:" + dangerAnswers);
    if (defaultAnswers > 0 || warningAnswers > 0 || dangerAnswers > 0)
    {
        var answersMessage=""
        if (defaultAnswers > 0 || warningAnswers > 0) {
            answersMessage = (defaultAnswers + warningAnswers) + " boş";
        }
        if (dangerAnswers > 0) {
            answersMessage = answersMessage +  " gönderilemeyen";
        } 
        message = message + "(" + answersMessage + " soru var)";
    }
    message = message + "?";
    if (confirm(message)) {
        return true;
    }
    else {
        event.preventDefault();
        return false;
    } 
}
function SessionStart() {
    DLog("SessionStart-Begin");
    var url = "/Answer/ESessionStart?EnrollmentId=" + eid + "&SessionId=" + sid + "&clientDate=" + new Date().toTimeString() + "&clientDuration=" + duration;
    var send = $.post(url)
        .done(function (data) {
            if (data.IsSuccess) {
                try {
                    AnswersLoad(data.DurationLeft); 
                    console.log("SessionStart", data);
                }
                catch (ex) {
                    DLog("SessionStart-Exception");
                    console.log(ex);
                    RefreshSession("AnswersLoadException");
                }
            }
            else {
                DLog("SessionStart-ServerInvalid");
                RefreshSession("ServerInvalid");
            }
        })
        .fail(function () {
            DLog("SessionStart-ServerFail");
            RefreshSession("ServerFail");
        });
}

function AnswersLoad(DurationLeft) {
    if (Progress === 1) {
        $(".answer").change(function () {
            var rid = $(this).attr("id");
            var aid = $(this).attr("data-id");
            var no = $(this).attr("data-no");
            var ind = $(this).attr("data-ind");
            var answer = $(this).val();
            var answerText = $(this).attr("data-text");
            var index = $(this).attr("data-index");
            $("#Answers_" + index + "__AnswerText").val(answerText);
            //console.log("#Answers_" +  index +"__AnswerText");
            //console.log(answerText);
            $("#" + aid + "_loading").show();
            AnswerSend(eid, sid, aid, no, ind, answer, answerText);
        });
    }
    else {
        $(".answer").change(function () {
            $("#btnSend").show();
        });
        $("#btnPrev").click(function () {
            AnswerPrev();
        });
        $("#btnSend").click(function () {
            AnswerConfirmed();
        });
        //console.log("StartProgress", Progress);
        //console.log("StartIndex", CurrentIndex);
        CurrentQuestion = $("#qu_" + CurrentIndex);
        //console.log("StartQuestion", CurrentQuestion[0]);
        AnswerLoad();
    }
    TimerStart(DurationLeft);
    $("#Loading").hide();
    $("#Questions").show();
    //TextCounter();
}

function AnswerLoad() {
    console.log("AnswerLoad:", CurrentIndex);
    var CurrentQuestion = $("#qu_" + CurrentIndex);
    if (CurrentQuestion) {
        $(CurrentQuestion).removeClass("qu").addClass("qu-current");
        var qtype = $(CurrentQuestion).attr("data-qtype");
        console.log("AnswerLoad.qtype", qtype);
        var rid = $(CurrentQuestion).attr("id");
        var aid = $(CurrentQuestion).attr("data-id");
        var no = $(CurrentQuestion).attr("data-no");
        var ind = $(CurrentQuestion).attr("data-ind");
        if (qtype === "Q1") {
            var SelectedIds = [];
            var SelectedTexts = [];
            $.each($("input[name=" + aid + "]:checked"), function () {
                SelectedIds.push($(this).val());
                SelectedTexts.push($(this).attr("data-text"));
            });
            //console.log("AnswerShow." + ind + "-SelectedIds", SelectedIds);
            //console.log("AnswerShow." + ind + "-SelectedTexts", SelectedTexts);
            if (SelectedIds.length > 0) {
                $("#btnSend").show();
            }
            else {
                $("#btnSend").hide();
            }
        }
        else if (qtype === "Q2") {
            var SelectedIds = [];
            var SelectedTexts = [];
            $.each($("input[name=" + aid + "]:checked"), function () {
                SelectedIds.push($(this).val());
                SelectedTexts.push($(this).attr("data-text"));
            });
            //console.log("AnswerLoad." + ind + "-SelectedIds", SelectedIds);
            //console.log("AnswerLoad." + ind + "-SelectedTexts", SelectedTexts);
            if (SelectedIds.length > 0) {
                $("#btnSend").show();
            }
            else {
                $("#btnSend").hide();
            }
        }
        else if (qtype === "Q7") {
            $("#btnSend").show();
        }

        if (CurrentIndex === AnswersCount) {
            $("#btnSend").html("<i class='fa fa-check mr-1'></i> Soruyu Onayla");
        }
        else {
            $("#btnSend").html("<i class='fa fa-check mr-1'></i> Soruyu Onayla ve Sonraki Soruya Geç");
        }

        if (Progress === 3 && CurrentIndex > 1) {
            $("#btnPrev").show();
        }
        else {
            $("#btnPrev").hide();
        }
    }
}

function TimerStart(DurationLeft) {
    console.log("TimerStart", DurationLeft);
    if (DurationLeft > 0) {

        duration = DurationLeft;
        setInterval(function () {
            //console.log("Duration", duration);
            duration = duration - 1;
            const minutes = Math.floor(duration / (60));
            const seconds = Math.floor((duration % (60)));
            var ttext = minutes.toString();
            if (minutes < 9)
                ttext = "0" + minutes;
            if (seconds < 10)
                ttext = ttext + ":0" + seconds.toString();
            else
                ttext = ttext + ":" + seconds.toString();
            try {
                document.getElementById("clock").innerHTML = ttext;
            }
            catch (err) {
                console.log("Timer.Error", err);
            }
            if (duration <= 0) {
                if (ending == false) {
                    ExamEnded();
                }
            }
            else {
                //KeepSession(duration);
            }
        }, 1000);
    }
    else {
        ExamEnded();
    }

}

function AnswerConfirmed2(CurrentIndex) {

    var CurrentQuestion = $("#qu_" + CurrentIndex);
    if (CurrentQuestion) {

        var qtype = $(CurrentQuestion).attr("data-qtype");
        console.log("qtype", qtype);
        var rid = $(CurrentQuestion).attr("id");
        var aid = $(CurrentQuestion).attr("data-id");
        var no = $(CurrentQuestion).attr("data-no");
        var ind = $(CurrentQuestion).attr("data-ind");
        if (qtype === "Q1") {
            var SelectedIds = [];
            var SelectedTexts = [];
            $.each($("input[name=" + aid + "]:checked"), function () {
                SelectedIds.push($(this).val());
                SelectedTexts.push($(this).attr("data-text"));
            });
            console.log(ind + "-SelectedIds", SelectedIds);
            console.log(ind + "-SelectedTexts", SelectedTexts);
            if (SelectedIds) {
                AnswerSend(eid, sid, aid, no, ind, SelectedIds.join("|"), SelectedTexts.join("|"));
            }
            else {
                AnswerSend(eid, sid, aid, no, ind, null, null);
            }

        }
        else if (qtype === "Q2") {
            var SelectedIds = [];
            var SelectedTexts = [];
            $.each($("input[name=" + aid + "]:checked"), function () {
                SelectedIds.push($(this).val());
                SelectedTexts.push($(this).attr("data-text"));
            });
            console.log(ind + "-SelectedIds", SelectedIds);
            console.log(ind + "-SelectedTexts", SelectedTexts);
            if (SelectedIds) {
                AnswerSend(eid, sid, aid, no, ind, SelectedIds.join("|"), SelectedTexts.join("|"));
            }
            else {
                AnswerSend(eid, sid, aid, no, ind, null, null);
            }
        }
        else if (qtype === "Q7") {
            var answer = $("#" + aid + "_Text").val();
            AnswerSend(eid, sid, aid, no, ind, "", answer);
        }
    }
}

function AnswerConfirmed() {
    console.log("AnswerConfirmed:", CurrentIndex);
    var CurrentQuestion = $("#qu_" + CurrentIndex);
    if (CurrentQuestion) {

        var qtype = $(CurrentQuestion).attr("data-qtype");
        console.log("qtype", qtype);
        var rid = $(CurrentQuestion).attr("id");
        var aid = $(CurrentQuestion).attr("data-id");
        var no = $(CurrentQuestion).attr("data-no");
        var ind = $(CurrentQuestion).attr("data-ind");
        if (qtype === "Q1") {
            var SelectedIds = [];
            var SelectedTexts = [];
            $.each($("input[name=" + aid + "]:checked"), function () {
                SelectedIds.push($(this).val());
                SelectedTexts.push($(this).attr("data-text"));
            });
            console.log(ind + "-SelectedIds", SelectedIds);
            console.log(ind + "-SelectedTexts", SelectedTexts);
            if (SelectedIds) {
                AnswerSend(eid, sid, aid, no, ind, SelectedIds.join("|"), SelectedTexts.join("|"));
            }
            else {
                AnswerSend(eid, sid, aid, no, ind, null, null);
            }

        }
        else if (qtype === "Q2") {
            var SelectedIds = [];
            var SelectedTexts = [];
            $.each($("input[name=" + aid + "]:checked"), function () {
                SelectedIds.push($(this).val());
                SelectedTexts.push($(this).attr("data-text"));
            });
            console.log(ind + "-SelectedIds", SelectedIds);
            console.log(ind + "-SelectedTexts", SelectedTexts);
            if (SelectedIds) {
                AnswerSend(eid, sid, aid, no, ind, SelectedIds.join("|"), SelectedTexts.join("|"));
            }
            else {
                AnswerSend(eid, sid, aid, no, ind, null, null);
            }
        }
        else if (qtype === "Q7")
        {
            var answer = $("#" + aid + "_Text").val();
            AnswerSend(eid, sid, aid, no, ind, "", answer);
        }
    }
}

function AnswerSend(eid, sid, aid, no, ind, answer, answerText) {

    $("#" + aid + "_loading").show();
    if (Progress > 1) {
        // $(".answer").attr("disabled", true);
        //$("#btnSend").hide();
    }
    if (ContinueOnError==true) {
        if (Progress > 1)
        {
            AnswerNext();
        }
    }
    else {
        if (Progress === 3) {
            AnswerNext();
        }
    }
   
    if (aid > 0) {
        var postUrl = "/Answer/Answer?EnrollmentId=" + eid + "&SessionId=" + sid + "&AnswerId=" + aid;
        var data = { answer: answer, answerText: answerText, answerIndex: ind, clientDate: new Date().toTimeString(), clientDuration: duration };
        var send = $.post(postUrl, data)
            .done(function (data) {
                if (data.IsSuccess) {
                    //if (data.DurationLeft) {
                    //    duration = data.DurationLeft;
                    //}
                    if (data.Code != "99") {
                        if (answerText) {
                            $("#" + aid + "_no").removeClass("label-default").removeClass("label-danger").removeClass("label-warning").addClass("label-info");
                            $("#" + aid + "_go").removeClass("badge-default").removeClass("badge-danger").removeClass("badge-warning").addClass("badge-info");
                        }
                        else {
                            $("#" + aid + "_no").removeClass("label-default").removeClass("label-danger").removeClass("label-info").addClass("label-warning");
                            $("#" + aid + "_go").removeClass("badge-default").removeClass("badge-danger").removeClass("badge-info").addClass("badge-warning");
                        }

                        ShowGritter("<span class='label label-info'>" + ind + "</span> : Cevap Gönderildi", answerText, "info");
                        if(ContinueOnError==false &&  Progress == 2)
                        {
                            AnswerNext();
                        }
                    }
                }
                else {
                    $("#" + aid + "_no").removeClass("label-default").removeClass("label-info").removeClass("label-warning").addClass("label-danger");
                    $("#" + aid + "_go").removeClass("badge-default").removeClass("badge-info").removeClass("badge-warning").addClass("badge-danger");
                    ShowError(data.Message);
                    if (data.Code == 2) {
                        ExamEnded();
                    }
                    else if (data.Code == 98) {
                        location.href = "/exam/details/" + eid;
                    }
                    //ShowError("Lütfen tekrar deneyiniz");
                    $("#btnSend").show();
                }
            })
            .fail(function () {
                $("#" + aid + "_no").removeClass("label-default").removeClass("label-info").removeClass("label-warning").addClass("label-danger");
                $("#" + aid + "_go").removeClass("badge-default").removeClass("badge-info").removeClass("badge-warning").addClass("badge-danger");
                ShowError("Lütfen tekrar deneyiniz");
                $("#btnSend").show();
            })
            .always(function () {
                $("#" + aid + "_loading").hide();
                if (Progress > 1) {
                    //$("#btnSend").show();
                    //$(".answer").attr("disabled", false);
                }
            });
    }

}

function AnswerPrev() {
    if (Progress === 3) {
        console.log("AnswerPrev:Current:" + CurrentIndex + "/" + AnswersCount);
        if (CurrentIndex > 1) {
            var CurrentQuestion = $("#qu_" + CurrentIndex);
            $(CurrentQuestion).addClass("qu").removeClass("qu-current");
            CurrentIndex = CurrentIndex - 1;
            AnswerLoad();
        }
        else {
            $("#btnPrev").hide();
        }
    }
}

function AnswerNext() {
    console.log("AnswerNext:Current:" + CurrentIndex + "/" + AnswersCount);
    if (CurrentIndex < AnswersCount) {
        var CurrentQuestion = $("#qu_" + CurrentIndex);
        $(CurrentQuestion).addClass("qu").removeClass("qu-current");
        CurrentIndex = CurrentIndex + 1;
        AnswerLoad();
    }
    else {
        $("#btnEnd").show();
    }
}
function AnswerGo(el, index)
{
    console.log("AnswerGo:" + CurrentIndex + "/" + index); 
    if (ContinueOnError == true) {
        var isWarning = $(el).hasClass("badge-danger"); 
        if (Progress == 2 && !isWarning) {
            ShowError("Soruları sırayla cevaplayabilirsiniz !");
        }
        else {
            var CurrentQuestion = $("#qu_" + CurrentIndex);
            $(CurrentQuestion).addClass("qu").removeClass("qu-current");
            CurrentIndex = index;
            AnswerLoad();
            if (CurrentIndex == AnswersCount) {
                $("#btnEnd").show();
            } 
        }
    }
    else {
        if (Progress == 2) {
            ShowError("Soruları sırayla cevaplayabilirsiniz !");
        }
        else {
            var CurrentQuestion = $("#qu_" + CurrentIndex);
            $(CurrentQuestion).addClass("qu").removeClass("qu-current");
            CurrentIndex = index;
            AnswerLoad();
            if (CurrentIndex == AnswersCount) {
                $("#btnEnd").show();
            } 
        }
    }
   
}
var ending = false;
function ExamEnded() {
    ending = true;
    $("#SessionApp").hide();
    $("#Ended").show();
    $.gritter.add({
        position: 'top-right',
        title: "Bilgi",
        text: "Sınav süresi sona erdi, yönlendiriliyorsunuz",
        class_name: 'gritter gritter-danger gritter-light',
        sticky: true
    });
    location.href = "/Exam/ESessionEnd?EnrollmentId=" + eid + "&SessionId=" + sid + "&m=timeend";
}

function RefreshSession(r) {
    alert("Oturum başlatılamadı :" + r);
    window.location.href = url + "?r=" + r;
}

function DLog(m) {
    console.log(m);
    //alert(m);
}

function TextCounter() {
    $('.countertext').on('keyup propertychange paste', function () {
        var txtVal = $(this).val();
        var chars = 4000 - txtVal.length;
        var id = this.getAttribute("data-id");
        $('#' + id + "_Counter").html(chars);
    });
}

function KeepSession(duration) {
    try {
        var k = duration % 10;
        if (k == 0) {
            jQuery.ajax({
                url: "/Keep/ExamSession?EnrollmentId" + eid + "&SessionId=" + sid,
                success: function (result) {
                    if (result.isOk == false) {
                        console.log("KeepSession", result);
                    }
                    console.log("KeepSession", duration);
                },
                async: true
            });
        }

    }
    catch (err) {

    }
}

(function (global) {

    if (typeof (global) === "undefined") {
        throw new Error("window is undefined");
    }

    var _hash = "!";
    var noBackPlease = function () {
        global.location.href += "#";

        // making sure we have the fruit available for juice....
        // 50 milliseconds for just once do not cost much (^__^)
        global.setTimeout(function () {
            global.location.href += "!";
        }, 50);
    };

    // Earlier we had setInerval here....
    global.onhashchange = function () {
        if (global.location.hash !== _hash) {
            global.location.hash = _hash;
        }
    };

    global.onload = function () {

        noBackPlease();

        // disables backspace on page except on input fields and textarea..
        document.body.onkeydown = function (e) {
            var elm = e.target.nodeName.toLowerCase();
            if (e.which === 8 && (elm !== 'input' && elm !== 'textarea')) {
                e.preventDefault();
            }
            // stopping event bubbling up the DOM tree..
            e.stopPropagation();
        };

    };

})(window);

