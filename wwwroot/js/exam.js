var Answer = /** @class */ (function () {
    function Answer() {
    }
    return Answer;
}());
var SessionOptions = /** @class */ (function () {
    function SessionOptions() {
    }
    return SessionOptions;
}());
var SessionApp = /** @class */ (function () {
    function SessionApp() {
        this.Loaded = ko.observable(false);
    }
    SessionApp.prototype.Load = function (options) {
        this.Options = options;
        this.Duration = options.Duration;
        this.CurrentIndex = options.CurrentIndex;
        this.Answers = ko.observableArray([]);
        this.CurrentIndex = this.Options.CurrentIndex;
        Log("Load.Start");
        LogData("Load.Status:", status);
        try {
            if (this.Options.Status === 1) {
                try {
                    this.SessionStart();
                }
                catch (ex) {
                    LogData("SessionStart.Exception", ex);
                    this.RefreshSession("SessionStartException", "Oturum başlatılamadı !");
                }
            }
            else {
                try {
                    this.AnswersLoad();
                }
                catch (ex) {
                    LogData("AnswersLoad.Exception", ex);
                    this.RefreshSession("AnswersLoadException", "Sorular yüklenemedi !");
                }
            }
        }
        catch (ex) {
            LogData("Load.Exception", ex);
            this.RefreshSession("LoadException", "Hata oluştu !");
        }
    };
    SessionApp.prototype.RefreshSession = function (r, m) {
        ShowError(m);
        window.location.href = this.Options.Url + "?r=" + r;
    };
    SessionApp.prototype.SessionStart = function () {
        Log("SessionStart.Begin");
        var nelf = this;
        $.post("/Exam/ESessionStart/" + this.Options.SessionId)
            .done(function (data) {
            if (data.Success) {
                try {
                    nelf.AnswersLoad();
                }
                catch (ex) {
                    LogData("SessionStart-Exception", ex);
                    nelf.RefreshSession("AnswersLoadException", "Sorular yüklenemedi");
                }
            }
            else {
                Log("SessionStart-ServerInvalid");
                nelf.RefreshSession("ServerInvalid", "Oturum başlatılamadı");
            }
        })
            .fail(function () {
            Log("SessionStart-ServerFail");
            nelf.RefreshSession("ServerFail", "Oturum başlatılırken hata oluştu");
        });
    };
    SessionApp.prototype.AnswersLoad = function () {
        Log("AnswersLoad-Begin");
        LogData("StartIndex", this.Options.CurrentIndex);
        this.CurrentQuestion = $("#qu_" + this.CurrentIndex)[0];
        LogData("StartQuestion", this.CurrentQuestion);
        var nelf = this;
        $("#btnSend").click(function () {
            nelf.AnswerConfirmed();
        });
        this.TimerStart();
        this.Loaded(true);
        $("#Loading").hide();
        $("#Questions").show();
    };
    SessionApp.prototype.AnswerNext = function () {
        Log("AnswerNext:Current:" + this.CurrentIndex + "/" + this.Options.AnswersCount);
        if (this.CurrentIndex < this.Options.AnswersCount) {
            this.CurrentQuestion = $("#qu_" + this.CurrentIndex)[0];
            LogData("BeforeQuestion", this.CurrentQuestion);
            $(this.CurrentQuestion).addClass("qu").removeClass("qu-current");
            this.CurrentIndex = this.CurrentIndex + 1;
            this.CurrentQuestion = $("#qu_" + this.CurrentIndex)[0];
            LogData("AfterQuestion", this.CurrentQuestion);
            $(this.CurrentQuestion).removeClass("qu").addClass("qu-current");
            if (this.CurrentIndex == this.Options.AnswersCount) {
                //console.log("Last Question");
                $("#btnSend").html("<i class='fa fa-check'></i> Soruyu Onayla ve Sınavı Tamamla");
            }
        }
        else {
            this.ExamEnded();
        }
    };
    SessionApp.prototype.AnswerConfirmed = function () {
        LogData("AnswerConfirmed:", this.CurrentIndex);
        this.CurrentQuestion = $("#qu_" + this.CurrentIndex);
        if (this.CurrentQuestion) {
            var qtype = $(this.CurrentQuestion).attr("data-qtype");
            LogData("qtype", qtype);
            var rid = $(this.CurrentQuestion).attr("id");
            var aid = $(this.CurrentQuestion).attr("data-id");
            var no = $(this.CurrentQuestion).attr("data-no");
            var ind = $(this.CurrentQuestion).attr("data-ind");
            if (qtype === "Q1") {
                var SelectedIds_1 = [];
                var SelectedTexts_1 = [];
                $.each($("input[name=" + aid + "]:checked"), function () {
                    SelectedIds_1.push($(this).val());
                    SelectedTexts_1.push($(this).attr("data-text"));
                });
                console.log(ind + "-SelectedIds", SelectedIds_1);
                console.log(ind + "-SelectedTexts", SelectedTexts_1);
                if (SelectedIds_1) {
                    this.AnswerSend(this.Options.SessionId, aid, no, ind, SelectedIds_1.join("|"), SelectedTexts_1.join("|"));
                }
                else {
                    this.AnswerSend(this.Options.SessionId, aid, no, ind, null, null);
                }
            }
            else if (qtype === "Q2") {
                var SelectedIds_2 = [];
                var SelectedTexts_2 = [];
                $.each($("input[name=" + aid + "]:checked"), function () {
                    SelectedIds_2.push($(this).val());
                    SelectedTexts_2.push($(this).attr("data-text"));
                });
                console.log(ind + "-SelectedIds", SelectedIds_2);
                console.log(ind + "-SelectedTexts", SelectedTexts_2);
                if (SelectedIds_2) {
                    this.AnswerSend(this.Options.SessionId, aid, no, ind, SelectedIds_2.join("|"), SelectedTexts_2.join("|"));
                }
                else {
                    this.AnswerSend(this.Options.SessionId, aid, no, ind, null, null);
                }
            }
            else if (qtype === "Q7") {
                var answer = $("#" + aid + "_Text").val();
                this.AnswerSend(this.Options.SessionId, aid, no, ind, "", answer);
            }
        }
    };
    SessionApp.prototype.AnswerSend = function (sid, aid, no, ind, answer, answerText) {
        var self = this;
        $(".loading").show();
        $(".answer").attr("disabled", "true");
        var send = $.post("/Exam/Answer/" + sid, { aid: aid, answer: answer, answerText: answerText })
            .done(function (data) {
            if (data.Success) {
                $("#" + aid + "_no").removeClass("label-default").removeClass("label-danger").addClass("label-info");
                TMessage("<span class='label label-info'>" + ind + "</span> : Cevap Gönderildi", answerText, "info");
                self.AnswerNext();
            }
            else {
                $("#" + aid + "_no").removeClass("label-default").removeClass("label-info").addClass("label-danger");
                ShowError("Lütfen tekrar deneyiniz");
                $(".answer").attr("disabled", "false");
                $("#btnSend").show();
            }
        })
            .fail(function () {
            $("#" + aid + "_no").removeClass("label-default").removeClass("label-info").addClass("label-danger");
            ShowError("Lütfen tekrar deneyiniz");
            $(".answer").attr("disabled", "false");
            $("#btnSend").show();
        })
            .always(function () {
            $(".loading").hide();
            $(".answer").attr("disabled", "false");
        });
    };
    SessionApp.prototype.TimerStart = function () {
        LogData("TimerStart", this.Duration);
        if (this.Duration >= 0) {
            var nelf_1 = this;
            setInterval(function () {
                //LogData("Duration", self.Duration);
                nelf_1.Duration = nelf_1.Duration - 1;
                var minutes = Math.floor((nelf_1.Duration % (60 * 60)) / (60));
                var seconds = Math.floor((nelf_1.Duration % (60)));
                var ttext = minutes.toString();
                if (minutes < 9)
                    ttext = "0" + minutes;
                if (seconds < 10)
                    ttext = ttext + ":0" + seconds.toString();
                else
                    ttext = ttext + ":" + seconds.toString();
                document.getElementById("clock").innerHTML = ttext;
                if (nelf_1.Duration < 0) {
                    nelf_1.ExamEnded();
                }
            }, 1000);
        }
        else {
            this.ExamEnded();
        }
    };
    SessionApp.prototype.ExamEnded = function () {
        $("#Questions").hide();
        ShowInfo("Oturum sonlandırıldı, yönlendiriliyorsunuz");
        location.href = "/Exam/ESessionEnd/" + this.Options.SessionId + "?m=timeend";
    };
    return SessionApp;
}());
function TWindowCenter(url, name, popwidth, popheight) {
    //alert(url + "-" + name);
    var left = (screen.width - popwidth) / 2;
    var top = (screen.height - popheight) / 2;
    var params = 'width=' + popwidth + ', height=' + popheight;
    params += ', top=' + top + ', left=' + left;
    params += ', directories=0';
    params += ', location=0';
    params += ', menubar=0';
    params += ', resizable=1';
    params += ', scrollbars=1';
    params += ', status=0';
    params += ', toolbar=0';
    return TWindow(url, name, params);
}
function TWindow(url, name, prms) {
    //alert(name);
    window.open(url, name, prms);
    //if (window.focus) { newwin.focus(); }
    return false;
}
// Message
function TMessage(title, text, type, sticky) {
    if (sticky === void 0) { sticky = false; }
    return THelper.TMessage(title, text, type, sticky);
}
function TMessageClose(id) {
    THelper.TMessageClose(id);
}
function ShowInfo(message) {
    TMessage("Bilgi", message, "info");
}
function ShowError(message) {
    TMessage("Hata", message, "error");
}
function ShowSuccess(message) {
    TMessage("Bilgi", message, "success");
}
//Confirm
function TConfirm(title, callback) {
    THelper.TConfirm(title, callback);
}
// Uploader
function TUploader(selector, url, callback) {
    THelper.TUploader(selector, url, callback);
}
function TimeAgo() {
    THelper.TimeAgo();
}
function LogData(m, d) {
    console.log(m, d);
}
function Log(m) {
    console.log(m);
}
function Countdown(el, duration, ended) {
    THelper.Countdown(el, duration, ended);
}
//# sourceMappingURL=exam.js.map