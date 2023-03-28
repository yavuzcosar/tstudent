function THelper() {
    var self = this;
    // TMessage
    self.TMessage = function (title, text, type, sticky = false) {
        return $.gritter.add({ sticky: false, title, text, class_name: 'gritter-' + type });
    };
    self.TMessageClose = function (id) {
        $.gritter.remove(id, {
            fade: true, // optional
            speed: 'fast' // optional
        });
    };

    // TConfirm
    self.TConfirm = function (title, callback) {
        bootbox.confirm({
            message: title,
            buttons: {
                confirm: {
                    label: 'Evet',
                    className: 'btn-danger'
                },
                cancel: {
                    label: 'Hayır',
                    className: 'btn-success'
                }
            },
            callback: callback
        });
    };

    // TUploader
    self.TUploader = function (selector, url, callback) {
        //alert(selector + ":" + url);
        $(selector).fileupload(
            {
                dataType: 'json',
                url: url,
                autoUpload: true,
                done: function (e, data) {
                    var tip = data.result.ftype;
                    if (tip == "upload_filenotfound") {
                        ShowError("Dosya Seçiniz.")
                    }
                    else if (tip == "upload_fileexist") {
                        ShowError("Bu Dosya Sunucuda Var.")
                    }
                    else if (tip == "upload_fileformat") {
                        ShowError("Desteklenmeyen Uzantı...")
                    }
                    else {
                        callback(data.result.fid);
                    }
                    $(".r-progress").hide();
                },
            }).on('fileuploadprogressall', function (e, data) {
                $(".r-progress").show();
                var progress = Number(data.loaded) / Number(data.total) * 100;
                $('.progress .progress-bar').css('width', progress + '%');
                $('.progress .progress-bar').attr('aria-valuenow', progress);
            });
    };

    self.TScreenId = function (callback) {
        getScreenId(callback);
    };

    self.TimeAgo = function () {
        $("time.timeago").timeago();
    };

    self.Countdown = function (el, duration,ended) {
        let endDate = new Date().getTime() + this.Duration;
        var $clock = $(el);
        $clock.countdown(endDate, function (event) {
            $(this).html(event.strftime('%H:%M:%S'));
        }).on('finish.countdown', function (event) {
            eval(ended);
        });
    }
}

$.extend($.gritter.options, {
    position: 'bottom-right', // defaults to 'top-right' but can be 'bottom-left', 'bottom-right', 'top-left', 'top-right' (added in 1.7.1)
    fade_in_speed: 'medium', // how fast notifications fade in (string or int)
    fade_out_speed: 1000, // how fast the notices fade out
    time: 3000 // hang on the screen for...
});
var THelper = new THelper();