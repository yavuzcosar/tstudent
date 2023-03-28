$(document).ready(function () {
    PostAndAll();
    DateBind();
    TBind();
    TBindEmtpy();
    TBindChecked();
    UIBind_Choosen();
    FixAddon();
});
function PostAndAll() {
    $('[PostAnd]').click(function (e) {
        e.preventDefault();
        var button = $(this);
        var postAnd = button.attr("PostAnd");
        $("#PostAnd").val(postAnd);
        //alert("Submit:" + postAnd);
        this.form.submit();
    });
}
function UIBind_Choosen() {
    if (!ace.vars['touch']) {
        $('.chosen-select').chosen(
            {
                allow_single_deselect: true,
                placeholder_text_single: "Seçiniz !",
            }
        );
        //resize the chosen on window resize

        $(window)
            .off('resize.chosen')
            .on('resize.chosen', function () {
                $('.chosen-select').each(function () {
                    var $this = $(this);
                    $this.next().css({ 'width': $this.parent().width() });
                })
            }).trigger('resize.chosen');

        $(window).on('resize.chosen', function () {
            //get its parent width
            var w = $('.chosen-select').parent().width();
            $('.chosen-select').siblings('.chosen-container').css({ 'width': w });
        }).triggerHandler('resize.chosen');
        //resize chosen on sidebar collapse/expand
        $(document).on('settings.ace.chosen', function (e, event_name, event_val) {
            if (event_name != 'sidebar_collapsed') return;
            $('.chosen-select').each(function () {
                var $this = $(this);
                $this.next().css({ 'width': $this.parent().width() });
            })
        });
    }
}
function TBind() {
    $('[TIf]').each(function (index) {
        var e = this;
        TRun(e);
        var TIf = $(e).attr("TIf");
        $("#" + TIf).change(function () {
            TRun(e);
        });
    });

}
function TRun(e) {
    var TIf = $(e).attr("TIf");
    var TValues = $(e).attr("TValues").split(',');
    var TValue = $("#" + TIf).val();
    var TVisible = $("#" + TIf).is(':visible');
    var valid = false;
    $.each(TValues, function (index, v) {
        if (v === TValue && TVisible) {
            valid = true;
        }
    });
    TShow(e, valid);
}

function TBindEmtpy() {
    $('[TEmpty]').each(function (index) {
        var e = this;
        TRunEmpty(e);
        var TEmpty = $(e).attr("TEmpty");
        $("#" + TEmpty).change(function () {
            TRunEmpty(e);
        });
    });

}
function TRunEmpty(e) {
    var TEmpty = $(e).attr("TEmpty");
    var TValue = $("#" + TEmpty).val();
    var valid = TValue == null || TValue == "";
    TShow(e, valid);
}

function TBindChecked() {
    $('[TChecked]').each(function (index) {
        var e = this;
        TRunChecked(e);
        var TEmpty = $(e).attr("TChecked");
        $("#" + TEmpty).change(function () {
            TRunChecked(e);
        });
    });

}
function TRunChecked(e) {
    var TChecked = $(e).attr("TChecked");
    var TValue = $('#' + TChecked).is(':checked');
    TShow(e, TValue);
}

function TShow(e, TValue) {
    var id = $(e).attr("id");
    var TRow = $(e).attr("TRow");
    var CKE = $(e).attr("CKE");
    var TInverse = $(e).attr("TInverse");
    if (TInverse) {
        TValue = !TValue;
    }
    if (TValue) {
        console.log("TShow:" + id + "--> " + TValue);
        if (CKE) {
            $("#" + id + "Body").show();
        }
        else {
            if (TRow) {
                $("#" + id).parent().show();
                $("#" + id + "_Space").show();
            }
            else {
                $("#" + id).show();
            }
        }
    }
    else {
        console.log("TShow:" + id + "--> " + TValue);
        if (CKE) {
            //alert("CKE.Hide");
            //REditors.get(id).style("display", "none");
            $("#" + id + "Body").hide();
        }
        else {
            if (TRow) {
                $("#" + id).parent().hide();
                $("#" + id + "_Space").hide();
            }
            else {
                $("#" + id).hide();
            }
        }
    }
}


function FormReadonly() {
    $('form input[type="checkbox"]').prop('disabled', true);
    $('form input[type="radio"]').prop('disabled', true);
    $('form input').prop('readonly', true);
    $('form textarea').prop('readonly', true);
    $('form select').prop('disabled', true).trigger("chosen:updated");
}
// Date-Datetime Binding
function DateBind() {
    $('.date-picker').datetimepicker({
        locale: 'tr',
        format: 'DD.MM.YYYY',
        //autoclose: true,
        //todayHighlight: true,
        icons: {
            time: 'fa fa-clock-o',
            date: 'fa fa-calendar',
            up: 'fa fa-chevron-up',
            down: 'fa fa-chevron-down',
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-arrows ',
            clear: 'fa fa-trash',
            close: 'fa fa-times'
        }
    }).next().on(ace.click_event, function () {
        $(this).prev().focus();
    });

    $('.datetime-picker').datetimepicker({
        locale: 'tr',
        format: 'DD.MM.YYYY HH:mm',
        icons: {
            time: 'fa fa-clock-o',
            date: 'fa fa-calendar',
            up: 'fa fa-chevron-up',
            down: 'fa fa-chevron-down',
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-arrows ',
            clear: 'fa fa-trash',
            close: 'fa fa-times'
        }
    }).next().on(ace.click_event, function () {
        $(this).prev().focus();
    });

    //$('.date-picker').datepicker({
    //    autoclose: true,
    //    todayHighlight: true,
    //    format: "yyyy-mm-dd",
    //    language: "tr"
    //}).next().on(ace.click_event, function () {
    //    $(this).prev().focus();
    //}); 

    $('.date-range-picker').daterangepicker({
        'applyClass': 'btn-sm btn-success',
        'cancelClass': 'btn-sm btn-default',
        autoUpdateInput: false,
        locale: {
            format: "DD.MM.YYYY",
            customRangeLabel: 'Tarih Aralığı',
            applyLabel: 'Uygula',
            cancelLabel: 'İptal',
            fromLabel: 'dan',
            toLabel: 'a',
        },
        ranges: {
            'Bugün': [moment(), moment()],
            'Dün': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Bu Hafta': [moment().startOf('week'), moment().endOf('week')],
            'Bu Ay': [moment().startOf('month'), moment().endOf('month')],
            'Geçen Ay': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
    }, function (start, end, label) {
        // $(this).val(picker.startDate.format('DD.MM.YYYY') + ' - ' + picker.endDate.format('DD.MM.YYYY'));
        console.log("DateRangePicker --->" + start.format("DD.MM.YYYY") + "//" + end.format("DD.MM.YYYY") + " (predefined range: " + label + ")");
    }).prev().on(ace.click_event, function () {
        $(this).next().focus();
    });
    $('.date-range-picker').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
    $('.date-range-picker').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD.MM.YYYY') + ' - ' + picker.endDate.format('DD.MM.YYYY'));
        this.form.submit();
    });


}
function FixAddon() {
    var maxWidth = Math.max.apply(null, $(".input-group-addon").not(".addon-end").map(function () {
        return $(this).outerWidth(true);
    }).get()) + 15;
    if (maxWidth > 200) {
        maxWidth = 200;
    }
    //$(".input-group-addon not:(.fixnot)").css({ minWidth: maxWidth + 'px !important' });
    $(".input-group-addon").not(".fixnot").not(".input-group-addon-val").attr('style', 'min-width: ' + maxWidth + 'px !important');
}