function BindPopbox() {
    $('.popbox').bind('click', function (e) {
        e.preventDefault();
        var thref = $(this).attr("href").replace(/#/, '');
        var tname = "popbox";
        if (thref != "") {
            var queryString = thref.replace(/^[^\?]+\??/, '');
            var params = QueryStrings(queryString);
            var popwidth = (params['popwidth'] * 1) + 30 || 630; //defaults to 630 if no paramaters were added to URL
            var popheight = (params['popheight'] * 1) + 40 || 440; //defaults to 440 if no paramaters were added to URL
            //window.open(thref, tname, 'height=' + popwidth + ',width=' + popheight + ',location=0,status=1,scrollbars=1,menubar=0,resizable=1');
            PopWindowCenter(thref, tname, popwidth, popheight);

        }
    });
    $('.popfull').bind('click', function (e) {
        e.preventDefault();
        var thref = $(this).attr("href").replace(/#/, '');
        var tname = "popfull";
        if (thref != "") {
            PopWindowFull(thref, tname);
        }
    });
}
function WOpen(tname, turl) {
    var queryString = turl.replace(/^[^\?]+\??/, '');
    var params = QueryStrings(queryString);
    var popwidth = (params['popwidth'] * 1) + 30 || 630; //defaults to 630 if no paramaters were added to URL
    var popheight = (params['popheight'] * 1) + 40 || 440; //defaults to 440 if no paramaters were added to URL
    //window.open(thref, tname, 'height=' + popwidth + ',width=' + popheight + ',location=0,status=1,scrollbars=1,menubar=0,resizable=1');
    PopWindowCenter(turl, tname, popwidth, popheight);
}
function WOpen(turl) {
    WOpen("ToltekLMS", turl);
}
function WRedirect(url) {
    window.location = url;
}
function PopWindow(url, name, prms) {
    //alert(name);
    window.open(url, name, prms);
    //if (window.focus) { newwin.focus(); }
    return false;
}
function PopWindowFull(url, name) {

    var params = 'width=' + (screen.width - 40);
    params += ', height=' + (screen.height - 60);
    params += ', top=0, left=0'
    params += ', fullscreen=1';
    newwin = window.open(url, name, params);
    newwin.moveTo(0, 0);
    newwin.resizeTo(screen.width, screen.height);
    if (window.focus) { newwin.focus() }
    return false;
}
function PopWindowCenter(url, name, popwidth, popheight) {
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
    return PopWindow(url, name, params);
}