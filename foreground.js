(function()
{
    function GetTitle()
    {
        var titles = document.getElementsByClassName("videoHeaderTitle");
        return titles.length>0?titles[0].textContent:null;
    }
    function GetSM()
    {
        return window.location.pathname.match(/[^\/]+$/);
    }
    chrome.extension.sendRequest({title: GetTitle(), sm: GetSM()});
})();
