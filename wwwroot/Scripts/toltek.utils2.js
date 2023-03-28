//$(document).ready(function () {
//    if (location.hash !== '') $('a[href="' + location.hash + '"]').tab('show');
//    return $('a[data-show="true"]').on('shown', function (e) {
//        return location.hash = $(e.target).attr('href').substr(1);
//    });
//});

//class=CheckHtmlTag olarak işaretlenmiş textboxlarda html tagı olup olmadığını kontrol eder
function CheckHtmlTags(errorMessage) {
    var rval = true;
    var defaultMessage = "Aktivite adında yada açıklamada html etiketleri kullanamazsınız";
    if (errorMessage == null || errorMessage == "")
        errorMessage = defaultMessage;
    $('.CheckHtmlTag').each(function (event) {
        if ($(this).val().match(/<(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/)) {
            rval = false;
        }
    });
    if (!rval) {
        alert(errorMessage);
        event.preventDefault();
    }
}

function NewShowMessage(type, title, message, popClose) {
    $.gritter.add({
        title: title,
        text: message,
        sticky: false,
        time: '',
        class_name: 'gritter-' + type
    });

    if (popClose == "True") {
        //window.opener.location.reload();// = window.opener.location;
        window.close();
    }
}

function ToggleDisplay(itemName, itemId) {
    $(itemName + itemId).toggle();
}


function DataVisibles() {
    $('[data-visible]').each(function (i, tr) {
        var cb = '#' + $(tr).attr("data-visible");
        DataVisible(cb, tr);
        $(cb).change(function () { DataVisible(cb, tr); });
    });
}
function DataVisible(cb, el) {
    if ($(cb).is(':checked')) {
        $(el).show();
    }
    else {
        $(el).hide();
    }
}


function PageContentResize() {
    var nh = $(document).height() - 90;
    if (nh > $(".pColumnLeft").height()) {
        $(".pColumnLeft").height(nh);
    }
    var np = $(document).height() - 180;
    if (np > $(".page_content").height()) {
        $(".page_content").height(np);
    }
    //var pcp = $(".page_content").height() + $(".page_content").position().top;
    //alert(pcp);
    //if (nh > pcp) {
    //    $(".page_content").height($(document).height() - $(".page_content").position().top);
    //}
    //if ($(".page_content").height() + 160 < $(document).height())
    //$(".page_content").height($(document).height() - 160);
    //if ($('.page_content').length > 0) {
    //    var ouWidget = $('.page_content');
    //    var newHeight = $(document).height() - ouWidget.position().top - 33;
    //    if (ouWidget.height() < newHeight)
    //        ouWidget.height(newHeight);

    //}

}

function CheckboxAll(id) {
    var frm = document.forms[0];
    for (i = 0; i < frm.elements.length; i++) {

        if (frm.elements[i].type == "checkbox") {
            frm.elements[i].checked = document.getElementById(id).checked;
        }
    }
}

function CheckAll() {
    if ($('#cboxHeader').is(':checked')) {
        $('.cbox :checkbox').attr("checked", "true");

    }
    else
        $('.cbox :checkbox').removeAttr("checked");
}

