// Show-Messages
$.extend($.gritter.options, {
    position: 'bottom-right', // defaults to 'top-right' but can be 'bottom-left', 'bottom-right', 'top-left', 'top-right' (added in 1.7.1)
    fade_in_speed: 'medium', // how fast notifications fade in (string or int)
    fade_out_speed: 1000, // how fast the notices fade out
    time: 3000 // hang on the screen for...
});
function ShowGritter(title, message, type) {
   /// alert(message);
    try {
        $.gritter.add({
            title: title,
            text: message,
            class_name: 'gritter-' + type //+ ' gritter-light'
        });
    }
    catch (err) {
        alert("Cevap Gönderildi :" + message);
    }
   
}
function ShowError(message) {
    ShowGritter("Hata", message, "error");
}
function ShowInfo(message) {
    ShowGritter("Bildirim", message, "info");
}
function ShowSuccess(message) {
    ShowGritter("Bildirim", message, "success");
}
function ShowLog(message) {
    ShowGritter("Log", message, "default");
}
