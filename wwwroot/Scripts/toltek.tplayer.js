jwplayer.key = "BC9ahgShNRQbE4HRU9gujKmpZItJYh5j/+ltVg==";

function TPlayers() {
    //console.log("TPlayers");
    $(".TPlayer").each(function (index) {
        var el = $(this);
        var s = {
            Id: el.attr("id"),
            Url: el.attr("Url"),
            Logo: el.attr("Logo"),
            Link: el.attr("Link"),
            PWidth: el.attr("PWidth"),
            PHeight: el.attr("PHeight"),
            SeekingEnable: el.attr("SeekingEnable"),
            AutoPlay: el.attr("AutoPlay"),
        };
        TPlayer(s);
    });
}
function TPlayer(con) {
    //console.log(con);
    jwplayer(con.Id).setup({
        file: con.Url,
        //skin: 'skins/agreen.xml', // html5 only
        //primary: 'html5',  // flash-html5
        width: con.PWidth,
        aspectratio: '16:9',
        autoplay: false,
        //height: con.PHeight,
        logo: {
            file: con.Logo,
            link: con.Link
        },
        events: {
            onReady: function () {
                $(".copybox").show();
            }
        }
    });
}

$(document).ready(function () {
    TPlayers();
});