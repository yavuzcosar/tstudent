$(document).ready(function () {
    FixAddon();
    DateAndTimes();
    //console.log("smartadmin.custom");
});
function FixAddon() {
    var maxWidth = Math.max.apply(null, $(".input-group-text").not(".addon-end").map(function () {
        return $(this).outerWidth(true);
    }).get()) + 15;
    if (maxWidth > 200) {
        maxWidth = 200;
    }
    //$(".input-group-addon not:(.fixnot)").css({ minWidth: maxWidth + 'px !important' });
    $(".input-group-text").not(".fixnot").not("input-group-text-val").attr('style', 'min-width: ' + maxWidth + 'px !important');
}
function DateAndTimes() {
    $('.date-picker').datepicker({
        autoclose: true,
        todayHighlight: true,
        format: "dd.mm.yyyy",
        language: "tr"
    });
    //$('.time-picker').timepicker({
    //    minuteStep: 1,
    //    showSeconds: false,
    //    showMeridian: false,
    //    disableFocus: true,
    //    icons: {
    //        up: 'fa fa-chevron-up',
    //        down: 'fa fa-chevron-down'
    //    }
    //});
}