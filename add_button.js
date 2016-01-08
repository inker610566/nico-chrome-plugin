var SERVER_PREFIX = "http://www.nicozon.net/downloader.html?video_id="
var SERVER_REQUEST1 = "http://www.nicozon.net/mp4/"
function DownloadError()
{
    console.log('Cannot download!');
}

function LoadScript(path, callback) {
    var done = false;
    var scr = document.createElement('script');

    scr.onload = handleLoad;
    scr.onreadystatechange = handleReadyStateChange;
    scr.onerror = handleError;
    scr.src = path;
    document.body.appendChild(scr);

    function handleLoad() {
        if (!done) {
            done = true;
            callback(path, "ok");
        }
    }

    function handleReadyStateChange() {
        var state;

        if (!done) {
            state = scr.readyState;
            if (state === "complete") {
                handleLoad();
            }
        }
    }
    function handleError() {
        if (!done) {
            done = true;
            callback(path, "error");
        }
    }
}

function WriteScript(scr)
{
    var sss = document.createElement('script');
    sss.textContent = scr;
    $("body").append(sss);
    return sss;
}

// prepare UI
function NewButton()
{
    //WriteScript('document.write = function(s){$("body").append(s);};alert("");'); // hook document.write
    var button = document.createElement("div");
    button.contentText = "Download";
    button.style.background = "gold";
    button.style.cursor = "pointer";
    button.style.margin = "0 auto";
    button.style.width = "auto";
    button.style.height = "20px";
    button.onclick = function()
    {
        // disable this
        button.onclick = null;

        var Nicovideo, param, query, _i, _len, _ref;
        Nicovideo = {
                Global: {
                    playerCount: 0,
                    embedMode: window.ActiveXObject ? "object" : "embed"
                }
            };
        var p, sm;
        p = location.pathname;
        sm = p.substring(p.lastIndexOf("/")+1);
        query = {video_id: sm};

        if(query.video_id)
        {
            $.get("http://ext.nicovideo.jp/thumb_watch/" + query.video_id + "?w=1&h=1&n=1",
                function(i){
                    //if(result === 'ok')
                    i = "document.write = function(s){$('body').append(s);};"+i;
                    console.log('OK1');
                    WriteScript(i);
                    //$(WriteScript(i);).load(function()
                    {
                        console.log('OK');
                        var r, t, f, n, e, u, o, i;
                        r = document.getElementById("external_nico_0");
                        t = $(r);
                        switch (r.tagName) {
                            case "EMBED":
                            f = t.attr("flashvars");
                            break;
                            case "OBJECT":
                            f = t.find("param[name=flashvars]").val()
                        }
                        for (n = {}, e = f.split("&"), u = 0, o = e.length; u < o; u++) i = e[u], i = i.split("="), n[i[0]] = decodeURIComponent(i[1]);
                        $.get(SERVER_REQUEST1+ n.v, function(i) {
                            var u, r;
                            u = {
                                m: "mp4",
                                v: "flv",
                                s: "swf"
                            }[i.match(/\/smile\?(\w)=/)[1]];
                            r = n.thumbTitle + "." + u;
                            //document.title = r;
                            t.replaceWith(
                                $("<iframe>", {
                                    src: "http://ext.nicovideo.jp/thumb_watch?as3=1&v=" + n.v + "&k=" + n.thumbPlayKey + "&accessFromHash=" + n.accessFromHash + "&accessFromDomain=" + n.accessFromDomain,
                                id: "external_nico_0",
                                width: "0",
                                height: "0"
                            }));
                            $("#external_nico_0").load(
                                function() {
                                    chrome.downloads.download({
                                      url: i,
                                      filename: n.thumbTitle
                                    });
                                }
                            );
                        });
                    };
                });
        }
        else
        {
            DownloadError();
        }
    };
    return button;
}

playerContainer.appendChild(NewButton());
/*
 *
 * document.write('<script type="text/javascript" src="http://ext.nicovideo.jp/thumb_watch/' + query.video_id + '?w=1&h=1&n=1"><\/script>'),
 */
