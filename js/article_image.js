let high_color = "yellow";
let page_type = 'image';

function uncomma(str) {	// 가격 설정 메뉴 추가
    str = String(str);
    return parseInt(str.replace(/[^\d]+/g, ''));
}

function get_datas() {
    //m-tcol-c width_comment

    let table = document.querySelectorAll(".article-board");
    let noticeTable = table[0]; // notice table
    let page_skin;
    let noticeTrs;
    if (noticeTable.querySelector('.board-line')) {
        page_skin = 'normal';
        noticeTrs = noticeTable.querySelectorAll("tr[align='center']._noticeArticle");
    } else {
        page_skin = 'wide';
        noticeTrs = noticeTable.querySelectorAll("tr._noticeArticle");
    }

    let ul = document.querySelector(".article-album-sub"); // all album lists
    let lis = ul.querySelectorAll('li');

    chrome.storage.local.get(['cfhe_content', 'cfhe_writer', 'cfhe_high', 'cfhe_price_low', 'cfhe_price_high'], function (items) {
            let contentKeywords = items.cfhe_content ? items.cfhe_content : [];
            let writerKeywords = items.cfhe_writer ? items.cfhe_writer : [];
            let highKeywords = items.cfhe_high ? items.cfhe_high : [];
			let priceLowKeywords = items.cfhe_price_low ? items.cfhe_price_low : [];	// 가격 설정 메뉴 추가
			let priceHighKeywords = items.cfhe_price_high ? items.cfhe_price_high : [];
            // 공지
            for (let i = 0; i < noticeTrs.length; i++) {
                try {
					let price_html = lis[i].querySelector('.price');		// 가격 설정 메뉴 추가
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
                        notice_title_html = noticeTrs[i].querySelector('.board-tit-noti');
						if (filter_price_low_v2(priceLowKeywords, noticeTrs[i], price)) continue;	// 가격 설정 메뉴 추가
						if (filter_price_high_v2(priceHighKeywords, noticeTrs[i], price)) continue;
                        if (filter_content_v2(contentKeywords, noticeTrs[i], notice_title_html.innerText)) continue;
                        if (filter_writer_v2(writerKeywords, noticeTrs[i], notice_id, notice_nick)) continue;
                        highlight_v2(highKeywords, noticeTrs[i], notice_title_html, notice_writer_html);
                    }
                }
                catch (e) {
                    continue;
                }
            }

            for (let i = 0; i < lis.length; i++) {
				let price_html = lis[i].querySelector('.price');		// 가격 설정 메뉴 추가
				let html_price = price_html.innerHTML;
				let price = uncomma(html_price);
                let writer_html = lis[i].querySelector('.p-nick .m-tcol-c');
                let html_writer = writer_html.getAttribute('onclick');
                let nick = html_writer.split(/[\'\"]/)[3];
                let id = html_writer.split(/[\'\"]/)[1];
                let title_html;

                title_html = lis[i].querySelector('dt > a');
				if (filter_price_low_v2(priceLowKeywords, lis[i], price)) continue;		// 가격 설정 메뉴 추가
				if (filter_price_high_v2(priceHighKeywords, lis[i], price)) continue;
                if (filter_content_v2(contentKeywords, lis[i], title_html.innerText)) continue;
                if (filter_writer_v2(writerKeywords, lis[i], id, nick)) continue;
                highlight_v2(highKeywords, lis[i], title_html, writer_html);
            }
        }
    )
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
            tr.remove();
            return true;
        }
    }
    return false;
}

function filter_writer_v2(keywords, tr, id, nick) {
    for (let idx = 0; idx < keywords.length; idx++) {
        let key = keywords[idx].key;
        if (id === key) {
            tr.remove();
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
            tr.nextElementSibling.remove();
            tr.remove();
            return true;
        }
    }
    return false;
}

function filter_writer_v1(keywords, tr, id, nick) {
    for (let idx = 0; idx < keywords.length; idx++) {
        let key = keywords[idx].key;
        if (id === key) {
            tr.nextElementSibling.remove();
            tr.remove();
            return true;
        }
    }
    return false;
}

window.onload = function () {
    chrome.storage.local.get(["is_act"], function (is_act) {
        if (is_act["is_act"] === "active") {
            state = "active";
            get_datas();
        }
    });
}
