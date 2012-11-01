/* Отслеживание событий */

var yandexCounter = null;
function GetYandexCounter() {

    if (yandexCounter != null)
        return yandexCounter;
    
    for (var globalVarName in window)
        if (globalVarName.indexOf('yaCounter') == 0) {
            yandexCounter = window[globalVarName];
        }

    return yandexCounter;
}

function RegisterPageEvent(eventName) {
    $(function () {
        window._gaq = window._gaq || [];
        window._gaq.push(['_trackPageview', eventName]);

        var yaCounter = GetYandexCounter();
        if (yaCounter != null && typeof(yaCounter) != "undefined")
            yaCounter.reachGoal(eventName);
        else {
            window.pageEvents = window.pageEvents || [];
            window.pageEvents.push(eventName);
        }
    });
}

$(function () {
    var yaCounter = GetYandexCounter();

    window.pageEvents = window.pageEvents || [];
    var pageEvents = window.pageEvents;

    if (yaCounter != null && typeof (yaCounter) != "undefined" && typeof (pageEvents) != "undefined")
        for (var i = 0; i < pageEvents.length; i++)
            yaCounter.reachGoal(pageEvents[i]);
});

/* Отслеживание событий */