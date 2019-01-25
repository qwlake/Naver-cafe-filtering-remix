function changeKeyName() {
    chrome.storage.sync.get(['cfhe_key'], function (items) {
        let status = items.cfhe_key;
        if (status !== 'true') {
            chrome.storage.sync.get(['content', 'writer', 'high'], function (items) {
                let contentKeywords = items.content ? items.content : [];
                let writerKeywords = items.writer ? items.writer : [];
                let highKeywords = items.high ? items.high : [];
				let priceLowKeywords = items.cfhe_price_low ? items.cfhe_price_low : [];	// 가격 설정 메뉴 추가
				let priceHighKeywords = items.cfhe_price_high ? items.cfhe_price_high : [];

                chrome.storage.sync.set({
                    'cfhe_content': contentKeywords,
                    'cfhe_writer': writerKeywords,
                    'cfhe_high': highKeywords,
					'cfhe_price_low': priceLowKeywords,		// 가격 설정 메뉴 추가
					'cfhe_price_high': priceHighKeywords
                }, function () {
                });

                chrome.storage.sync.get(['cfhe_content', 'cfhe_writer', 'cfhe_high', 'cfhe_price_low', 'cfhe_price_high'], function (items) {
                    chrome.storage.sync.set({'cfhe_key': 'true'}, function () {
                    })
                })
            })
        }
    })

}

function changeWriterFormat() {
    chrome.storage.sync.get(['cfhe_w_f'], function (items) {
        let status = items.cfhe_w_f;
        if (status !== 'true') {
            chrome.storage.sync.get(['cfhe_writer'], function (items) {
                let writerKeywords = items.cfhe_writer ? items.cfhe_writer : [];
                // [ {key: 1234, meta: {cafe: ㅁㄴㅇ, nick: qwer}} , ... ]
                let newKeyworkds = [];
                for (let i = 0; i < writerKeywords.length; i++) {
                    let tmp = {key: writerKeywords[i], meta: {cafe: '', nick: writerKeywords[i]}};
                    newKeyworkds.push(tmp)
                }

                chrome.storage.sync.set({
                    'cfhe_writer': newKeyworkds,
                }, function () {
                    chrome.storage.sync.set({'cfhe_w_f': 'true'}, function () {
                    })
                });
            })
        }
    })
}

function changeSyncToLocal() {
    chrome.storage.local.get(['cfhe_to_local'], function (items) {
        let status = items.cfhe_to_local;
        if (status !== 'true') {
            chrome.storage.sync.get(['cfhe_content', 'cfhe_writer', 'cfhe_high'], function (items) {
                let contentKeywords = items.cfhe_content ? items.cfhe_content : [];
                let writerKeywords = items.cfhe_writer ? items.cfhe_writer : [];
                let highKeywords = items.cfhe_high ? items.cfhe_high : [];
				let priceLowKeywords = items.cfhe_price_low ? items.cfhe_price_low : [];	// 가격 설정 메뉴 추가
				let priceHighKeywords = items.cfhe_price_high ? items.cfhe_price_high : [];

                chrome.storage.local.set({
                    'cfhe_content': contentKeywords,
                    'cfhe_writer': writerKeywords,
                    'cfhe_high': highKeywords,
					'cfhe_price_low': priceLowKeywords,		// 가격 설정 메뉴 추가
					'cfhe_price_high': priceHighKeywords
                }, function () {
                    chrome.storage.local.set({'cfhe_to_local': 'true'}, function () {
                        window.location.reload()
                    });
                })
            });
        }
    });
}


function act_deact() {
    chrome.storage.local.get(["is_act"], function (item) {
        let status = item["is_act"];
        if (status === "deactive")
            chrome.runtime.sendMessage({'type': 'set_icon', 'icon_path': '/image/off.png'});
        else if (status === 'active')
            chrome.runtime.sendMessage({'type': 'set_icon', 'icon_path': '/image/on.png'});
        else {
            chrome.storage.local.set({"is_act": "active"}, function () {
                chrome.runtime.sendMessage({'type': 'set_icon', 'icon_path': '/image/on.png'});
            })
        }

    });
}

// changeKeyName();
// changeWriterFormat();
// changeSyncToLocal();

act_deact();
