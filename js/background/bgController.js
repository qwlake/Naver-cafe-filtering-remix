chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // console.log(request)
        // console.log(sender)
        // console.log(sendResponse)
        if (request.type === 'set_icon') {
            chrome.browserAction.setIcon({path: request.icon_path})
        }
    });