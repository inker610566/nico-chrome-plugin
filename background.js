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

function Post3(title, sm)
{
    $.ajax({
        url: "http://www.nicozon.net/mp4/"+sm,
        dataType: "html",
        crossDomain: true,
        success: function(a, b, xhr){
            console.log(a);
            chrome.downloads.download({
              url: a,
              filename: title+".mp4"
            });
        }
    }).fail(function(error){
        console.log("Server Unreachable nicozon");
    });
}


function Post2(title, sm, accessFromHash, thumbPlayKey)
{
    console.log("accessFromHash="+accessFromHash+"; thumbPlayKey="+thumbPlayKey);
    $.ajax({
        url: "http://ext.nicovideo.jp/thumb_watch?as3=1&v=" + sm + "&k=" + thumbPlayKey + "&accessFromHash=" + accessFromHash + "&accessFromDomain=undefined",
        dataType: "html",
        crossDomain: true,
        success: function(a, b, xhr){
            console.log('Assert False');
            console.log(xhr.getResponseHeader('Set-Cookie'));
            Post3(title, sm);
        }
    }).fail(function(error){
        console.log("Post2 Status: "+error.status);
        console.log(document.cookie);
    });
}

function Post1(title, sm)
{
    console.log(document.cookie);
    $.ajax({
        url: "http://ext.nicovideo.jp/thumb_watch/" + sm + "?w=1&h=1&n=1",
        dataType: "xml",
        success: function(i){
            //console.log('success');
            console.log('Assert False');
        }
    }).fail(function(error) {
        if(error.status == 200)
        {
            var res1 = error.responseText.match(/'accessFromHash':\s*'([^']*)'/),
                res2 = error.responseText.match(/'thumbPlayKey': '([^']*)'/);
            if(res1 && res2)
            {
                Post2(title, sm, res1[1], res2[1]);
            }
            else
            {
                console.log('Server Response Error?');
            }
        }
        else
        {
            console.log('Server Unreachable?');
        }
    });
}

function InstallButton(title, sm)
{
    download1.disabled = false;
    download1.onclick = function()
    {
        download1.onclick = null;
        Post1(title, sm);
    };

}

chrome.extension.onRequest.addListener(function(req) {
    if(req.title)
    {
        $("#title").text(req.title);
        $("#download1").text(req.sm);
        InstallButton(req.title, req.sm);
    }
});

window.onload = function()
{
    //$("#title").text("Fake Title");
    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({active: true, windowId: currentWindow.id},
        function(activeTabs) {
        chrome.tabs.executeScript(
            activeTabs[0].id, {file: 'foreground.js', allFrames: true});
        });
    });

};
