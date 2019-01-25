let state = "deactive";
let num_content = 0;
let num_writer = 0;
let num_high = 0;
let high_color = "yellow";
let page_type;

let page_location = window.location.href;
if (page_location.indexOf('BestArticleList.nhn') !== -1)
    page_type = 'best';
else if (page_location.indexOf('ArticleSearchList.nhn') !== -1)
    page_type = 'search';
else page_type = 'default';

/*
"https://cafe.naver.com/ArticleList.nhn?*.boardtype=L*",
"https://cafe.naver.com/ArticleList.nhn?*.boardtype=",
"https://cafe.naver.com/ArticleList.nhn?*.boardtype=&*",
"https://cafe.naver.com/*iframe_url=/ArticleList.nhn*.boardtype=L*",
"https://cafe.naver.com/*iframe_url=/ArticleList.nhn*.boardtype=",
"https://cafe.naver.com/*iframe_url=/ArticleList.nhn*.boardtype=&*",
"https://cafe.naver.com/BestArticleList.nhn?*",
"https://cafe.naver.com/ArticleSearchList.nhn?*",
등등
*/

chrome.storage.local.get(["is_act"], function (is_act) {
    if (is_act["is_act"] === "active") {
        state = "active";
        get_datas();
    }
});

function uncomma(str) {	// 가격 설정 메뉴 추가
    str = String(str);
    return parseInt(str.replace(/[^\d]+/g, ''));
}

function set_info() {
    console.log(num_content + " " + num_writer + " " + num_high);

    var str_filter = "<strong>필터링 : " + (num_content + num_writer) + "</strong>";
    var str_high = "<strong>하이라이트 : " + num_high + "</strong>";

    var table = document.querySelectorAll(".board-box");
    table = table[table.length - 1];  // 공지 포함 2개 -> idx:1, 공지x 1개 -> idx:0
    var filter_info = document.createElement("tr");
    filter_info.innerHTML = "<td></td><td><p>" + str_filter + "</p></td>";
    var high_info = document.createElement("tr");
    high_info.innerHTML = "<td></td><td><p>" + str_high + "</p></td>";
    var hr = document.createElement("tr");
    hr.innerHTML = "<td colspan='5' class='board-line'></td>";
    $(table).prepend(hr);
    $(table).prepend(high_info);
    $(table).prepend(filter_info);
}

function set_state() {
    let table = document.querySelectorAll(".article-board");
    table = table[table.length - 1]; // above contents table
    let newtr = document.createElement("tr");
    let stat = null;
    if (state === "active")
        stat = "활성화";
    else
        stat = "비활성화";
    newtr.innerHTML = `<p style="padding: 5px 30px;"><strong>필터링 ${stat}</strong></p>`;
    chrome.storage.local.get(['cfhe_v200'], function (items) {
        let cfhe_v200 = items.cfhe_v200 ? items.cfhe_v200 : 'false';
        if (cfhe_v200 === 'false') {
            let noticeTr = document.createElement("tr");
            noticeTr.innerHTML = `<p style="padding: 5px 30px; color: green">
                <strong>[필터링] ★ 이제 작성자는 ID 로 필터링합니다. 기존 키워드는 적용되지 않습니다.</strong>
                </p>`;
            chrome.storage.local.set({'cfhe_v200': 'true'}, function () {
            });
            $(table).prepend(noticeTr)
        }
    });
    $(table).prepend(newtr);
}

window.onload = function () {
    setTimeout(function () {
        set_state();
    }, 50);
};

function get_datas() {
    /* 닉네임이 아니라, 아이디를 필터링해야함. confirm 에 닉 + 아이디 보여줌. */
    let page_skin;
    let noticeTrs;
    let trs;
    try {
        let table = document.querySelectorAll(".article-board");
        let noticeTable = table[0]; // notice table
        table = table[table.length - 1]; // contents table

        if (table.querySelector('.board-line')) {
            page_skin = 'normal';
            noticeTrs = noticeTable.querySelectorAll("tr[align='center']._noticeArticle");
            trs = table.querySelector("tbody").querySelectorAll(":scope > tr[align='center']");
        } else {
            page_skin = 'wide';
            noticeTrs = noticeTable.querySelectorAll("tr._noticeArticle");
            trs = table.querySelector("tbody").querySelectorAll(':scope > tr');
        }
    } catch (e) {
        console.log(`ERROR : ${e}`);
        return;
    }
    chrome.storage.local.get(['cfhe_content', 'cfhe_writer', 'cfhe_high', 'cfhe_price_low', 'cfhe_price_high'], function (items) {
        let contentKeywords = items.cfhe_content ? items.cfhe_content : [];
        let writerKeywords = items.cfhe_writer ? items.cfhe_writer : [];
        let highKeywords = items.cfhe_high ? items.cfhe_high : [];
		let priceLowKeywords = items.cfhe_price_low ? items.cfhe_price_low : [];	// 가격 설정 메뉴 추가
		let priceHighKeywords = items.cfhe_price_high ? items.cfhe_price_high : [];
        // 공지
        for (let i = 0; i < noticeTrs.length; i++) {
            try {
				let price_html = noticeTrs[i].querySelector('.price');		// 가격 설정 메뉴 추가
				let html_price = price_html.innerHTML;
				let price = uncomma(html_price);
                let notice_writer_html = noticeTrs[i].querySelector('.m-tcol-c');
                let notice_html_writer = notice_writer_html.getAttribute('onclick');
                let notice_nick = notice_html_writer.split(/[\'\"]/)[3];
                let notice_id = notice_html_writer.split(/[\'\"]/)[1];
                let notice_title_html;

                if (page_skin === 'normal') {
                    notice_title_html = noticeTrs[i].querySelector('.board-list .m-tcol-p');
					if (filter_price_low_v1(priceLowKeywords, noticeTrs[i], price)) continue;	// 가격 설정 메뉴 추가
					if (filter_price_high_v1(priceHighKeywords, noticeTrs[i], price)) continue;
                    if (filter_content_v1(contentKeywords, noticeTrs[i], notice_title_html.innerText)) continue;
                    if (filter_writer_v1(writerKeywords, noticeTrs[i], notice_id, notice_nick)) continue;
                    highlight_v2(highKeywords, noticeTrs[i], notice_title_html, notice_writer_html);
                } else {
                    notice_title_html = noticeTrs[i].querySelector('.board-list a');
					if (filter_price_low_v2(priceLowKeywords, noticeTrs[i], price)) continue;	// 가격 설정 메뉴 추가
					if (filter_price_high_v2(priceHighKeywords, noticeTrs[i], price)) continue;
                    if (filter_content_v2(contentKeywords, noticeTrs[i], notice_title_html.innerText)) continue;
                    if (filter_writer_v2(writerKeywords, noticeTrs[i], notice_id, notice_nick)) continue;
                    highlight_v2(highKeywords, noticeTrs[i], notice_title_html, notice_writer_html);
                }
            } catch (e) {
                console.log(`ERROR : ${e}`);
            }
        }
        // 게시글
        for (let i = 0; i < trs.length; i++) {
            try {
				let price_html = trs[i].querySelector('.price');		// 가격 설정 메뉴 추가
				let html_price = price_html.innerHTML;
				let price = uncomma(html_price);
                let writer_html = trs[i].querySelector('.p-nick .m-tcol-c');
                let html_writer = writer_html.getAttribute('onclick');
                let nick = html_writer.split(/[\'\"]/)[3];
                let id = html_writer.split(/[\'\"]/)[1];
                let title_html;

                if (page_skin === 'normal') {
                    title_html = trs[i].querySelector('.board-list .aaa a');
					if (filter_price_low_v1(priceLowKeywords, trs[i], price)) continue;		// 가격 설정 메뉴 추가
					if (filter_price_high_v1(priceHighKeywords, trs[i], price)) continue;
                    if (filter_content_v1(contentKeywords, trs[i], title_html.innerText)) continue;
                    if (filter_writer_v1(writerKeywords, trs[i], id, nick)) continue;
                    highlight_v2(highKeywords, trs[i], title_html, writer_html);
                } else {
                    title_html = trs[i].querySelector('.board-list a');
					if (filter_price_low_v2(priceLowKeywords, trs[i], price)) continue;		// 가격 설정 메뉴 추가
					if (filter_price_high_v2(priceHighKeywords, trs[i], price)) continue;
                    if (filter_content_v2(contentKeywords, trs[i], title_html.innerText)) continue;
                    if (filter_writer_v2(writerKeywords, trs[i], id, nick)) continue;
                    highlight_v2(highKeywords, trs[i], title_html, writer_html);
                }
            } catch (e) {
                console.log(`ERROR : ${e}`);
            }
        }
    });
}

function filter_price_low_v2(keywords, tr, price) {		// 가격 설정 메뉴 추가
    if (price < parseInt(keywords[0]['key'])) {
        if (page_type === 'best') {
            tr.remove();
        } else if (page_type === 'search') {
            tr.remove();
        } else {
            tr.remove();
        }
        return true;
    }
    return false;
}

function filter_price_high_v2(keywords, tr, price) {	// 가격 설정 메뉴 추가
    if (price > parseInt(keywords[0]['key'])) {
        if (page_type === 'best') {
            tr.remove();
        } else if (page_type === 'search') {
            tr.remove();
        } else {
            tr.remove();
        }
        return true;
    }
    return false;
}

function filter_content_v2(keywords, tr, title) {
    for (let idx = 0; idx < keywords.length; idx++) {
        if (title.indexOf(keywords[idx]) !== -1) {
            if (page_type === 'best') {
                tr.remove();
            } else if (page_type === 'search') {
                tr.remove();
            } else {
                tr.remove();
            }
            return true;
        }
    }
    return false;
}

function filter_writer_v2(keywords, tr, id, nick) {
    for (let idx = 0; idx < keywords.length; idx++) {
        let key = keywords[idx].key;
        if (id === key) {
            if (page_type === 'best') {
                tr.remove();
            } else if (page_type === 'search') {
                tr.remove();
            } else {
                tr.remove();
            }
            return true;
        }
    }
    return false;
}

function highlight_v2(keywords, tr, title_html, user_html) {
    let nick = user_html.innerText;
    let title = title_html.innerText;
    for (let idx = 0; idx < keywords.length; idx++) {
        let high = keywords[idx];
        // 닉네임
        if (nick.indexOf(high) !== -1) {
            user_html.innerHTML = nick.replace(high, `<strong style='background-color:${high_color}'>${keywords[idx]}</strong>`);
        }
        // 제목
        if (title.indexOf(high) !== -1) {
            title_html.innerHTML = title.replace(high, `<strong style='background-color:${high_color}'>${keywords[idx]}</strong>`);
        }
    }
}


function filter_price_low_v1(keywords, tr, price) {		// 가격 설정 메뉴 추가
    if (price < parseInt(keywords[0]['key'])) {
        if (page_type === 'best') {
            // best board
            tr.nextElementSibling.remove();
            tr.remove();
        } else if (page_type === 'search') {
            tr.nextElementSibling.nextElementSibling.remove();
            tr.nextElementSibling.remove();
            tr.remove();
        } else {
            tr.nextElementSibling.remove();
            tr.remove();
        }
        return true;
    }
    return false;
}

function filter_price_high_v1(keywords, tr, price) {	// 가격 설정 메뉴 추가
    if (price > parseInt(keywords[0]['key'])) {
        if (page_type === 'best') {
            // best board
            tr.nextElementSibling.remove();
            tr.remove();
        } else if (page_type === 'search') {
            tr.nextElementSibling.nextElementSibling.remove();
            tr.nextElementSibling.remove();
            tr.remove();
        } else {
            tr.nextElementSibling.remove();
            tr.remove();
        }
        return true;
    }
    return false;
}

function filter_content_v1(keywords, tr, title) {
    for (let idx = 0; idx < keywords.length; idx++) {
        if (title.indexOf(keywords[idx]) !== -1) {
            if (page_type === 'best') {
                // best board
                tr.nextElementSibling.remove();
                tr.remove();
            } else if (page_type === 'search') {
                tr.nextElementSibling.nextElementSibling.remove();
                tr.nextElementSibling.remove();
                tr.remove();
            } else {
                tr.nextElementSibling.remove();
                tr.remove();
            }
            return true;
        }
    }
    return false;
}

function filter_writer_v1(keywords, tr, id, nick) {
    for (let idx = 0; idx < keywords.length; idx++) {
        let key = keywords[idx].key;
        if (id === key) {
            if (page_type === 'best') {
                tr.nextElementSibling.remove();
                tr.remove();
            } else if (page_type === 'search') {
                tr.nextElementSibling.nextElementSibling.remove();
                tr.nextElementSibling.remove();
                tr.remove();
            } else {
                tr.nextElementSibling.remove();
                tr.remove();
            }
            return true;
        }
    }
    return false;
}
