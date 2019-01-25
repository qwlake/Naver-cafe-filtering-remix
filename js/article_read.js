/**
 *
 */

window.onload = function () {
    chrome.storage.local.get(["is_act"], function (is_act) {
        if (is_act["is_act"] === "active") {
            // state = "active";
            get_datas();
        }
    });
};

function set_info() {

}

function get_datas() {
    high_color = "yellow";
    // comments = document.getElementsByClassName("comm m-tcol-c");
    let comments = document.querySelectorAll('.comm.m-tcol-c');
    // console.log(comments)
    chrome.storage.local.get(['cfhe_content', 'cfhe_writer', 'cfhe_high', 'cfhe_price_low', 'cfhe_price_high'], function (items) {
        let contentKeywords = items.cfhe_content ? items.cfhe_content : [];
        let writerKeywords = items.cfhe_writer ? items.cfhe_writer : [];
        let highKeywords = items.cfhe_high ? items.cfhe_high : [];
        for (let i = 0; i < comments.length; i++) {
            try {
                if (filter_comm(contentKeywords, comments[i])) continue;
                if (filter_writer(writerKeywords, comments[i])) continue;
                highlight(highKeywords, comments[i]);
            } catch (e) {
                // console.log(comments[i])
                // console.log(e)
            }

        }
    });
}

function filter_comm(keywords, comm) {
    for (let idx = 0; idx < keywords.length; idx++) {
        if (comm.innerText.indexOf(keywords[idx]) !== -1) {
            comm.parentElement.innerHTML = `<div style="color:#797979">필터링 된 댓글입니다.</div>`;
            return true;
        }
    }
    return false;
}

function filter_writer(keywords, comm) {
    let nick = comm.parentElement.getElementsByClassName("p-nick")[0];
    let link = comm.parentElement.getElementsByClassName("link_profile")[0].getAttribute("href");
    let id = link.slice(link.indexOf('memberid')).split('&')[0].split('=')[1]
    for (let idx = 0; idx < keywords.length; idx++) {
        let key = keywords[idx].key;
        // if (nick.innerText === key) {
        if (id === key) {
            comm.parentElement.innerHTML = `<div style="color:#797979">필터링 된 댓글입니다.</div>`;
            return true
        }
    }
    return false;
}

function highlight(keywords, comm) {
    let nick = comm.parentElement.getElementsByClassName("p-nick")[0];
    for (let idx = 0; idx < keywords.length; idx++) {
        let high = keywords[idx];
        // 댓글
        if (comm.innerText.indexOf(high) !== -1) {
            comm.innerHTML = comm.innerHTML.replace(high, `<strong style='background-color:${high_color}'>${keywords[idx]}</strong>`);
        }
        // 작성자
        if (nick.innerText.indexOf(high) !== -1) {
            nick.style.backgroundColor = high_color;
        }
    }
}
