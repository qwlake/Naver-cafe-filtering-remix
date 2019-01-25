function add_key(id, cafe_name, nick) {
    let tableName = 'cfhe_writer';
    chrome.storage.local.get([tableName], function (items) {
        let itemArray = items[tableName] ? items[tableName] : [];
        let temp = itemArray.map(key => key.key);
        if (temp.indexOf(id) !== -1) {
            alert("이미 등록한 ID 입니다.");
            return;
        }
        let key = {key: id, meta: {cafe: cafe_name, nick: nick}};
        itemArray.push(key);
        chrome.storage.local.set({[tableName]: itemArray}, function () {
            window.alert(`${nick} (${id}) 을(를) 필터링 합니다.`)
        });
    });
}

function find(cafe_name, target_nick) {
    // iframe 이라서 그런가, 내용이 변경되어도 iframe src 는 그대로임
    // let href = document.querySelector("#cafe_main").getAttribute('src');
    // if (href.indexOf('/ArticleRead.nhn') !== -1) {
    if (document.querySelector("#cafe_main").contentWindow
        .document.querySelector('.reply-box') !== null) {
        // 댓글 작성자
        let comments = document.querySelector("#cafe_main").contentWindow
            .document.querySelectorAll('.comm.m-tcol-c');
        for (let i = 0; i < comments.length; i++) {
            try {
                let nick = comments[i].parentElement.getElementsByClassName("p-nick")[0].innerText;
                let link = comments[i].parentElement.getElementsByClassName("link_profile")[0].getAttribute("href");
                let id = link.slice(link.indexOf('memberid')).split('&')[0].split('=')[1]
                if (target_nick === nick) {
                    add_key(id, cafe_name, nick);
                    return;
                }
            } catch (e) {

            }
        }
        //} else if (href.indexOf('boardtype=I') !== -1) {
    } else if (document.querySelector("#cafe_main").contentWindow
        .document.querySelector('.article-album-sub') !== null) {
        // image type 게시글 작성자
        let table = document.querySelector("#cafe_main").contentWindow
            .document.querySelectorAll(".article-board");
        let noticeTable = table[0]; // notice table
        let noticeTrs;
        if (noticeTable.querySelector('.board-line')) {
            noticeTrs = noticeTable.querySelectorAll("tr[align='center']._noticeArticle");
        } else {
            noticeTrs = noticeTable.querySelectorAll("tr._noticeArticle");
        }
        let ul = document.querySelector("#cafe_main").contentWindow
            .document.querySelector(".article-album-sub"); // all album lists
        let lis = ul.querySelectorAll('li');

        for (let i = 0; i < noticeTrs.length; i++) {
            let notice_writer_html = noticeTrs[i].querySelector('.m-tcol-c');
            let notice_html_writer = notice_writer_html.getAttribute('onclick');
            let notice_nick = notice_html_writer.split(/[\'\"]/)[3];
            let notice_id = notice_html_writer.split(/[\'\"]/)[1];

            if (target_nick === notice_nick) {
                add_key(notice_id, cafe_name, notice_nick);
                return;
            }
        }
        for (let i = 0; i < lis.length; i++) {
            let writer_html = lis[i].querySelector('.p-nick .m-tcol-c');
            let html_writer = writer_html.getAttribute('onclick');
            let nick = html_writer.split(/[\'\"]/)[3];
            let id = html_writer.split(/[\'\"]/)[1];

            if (target_nick === nick) {
                add_key(id, cafe_name, nick);
                return;
            }
        }
    } else {
        // List type 게시글 작성자
        let noticeTrs;
        let trs;
        let table = document.querySelector("#cafe_main").contentWindow
            .document.querySelectorAll(".article-board");
        let noticeTable = table[0]; // notice table
        table = table[table.length - 1]; // contents table

        if (table.querySelector('.board-line')) {
            noticeTrs = noticeTable.querySelectorAll("tr[align='center']._noticeArticle");
            trs = table.querySelector("tbody").querySelectorAll(":scope > tr[align='center']");
        } else {
            noticeTrs = noticeTable.querySelectorAll("tr._noticeArticle");
            trs = table.querySelector("tbody").querySelectorAll(':scope > tr');
        }
        for (let i = 0; i < noticeTrs.length; i++) {
            let notice_writer_html = noticeTrs[i].querySelector('.m-tcol-c');
            let notice_html_writer = notice_writer_html.getAttribute('onclick');
            let notice_nick = notice_html_writer.split(/[\'\"]/)[3];
            let notice_id = notice_html_writer.split(/[\'\"]/)[1];

            if (target_nick === notice_nick) {
                add_key(notice_id, cafe_name, notice_nick);
                return;
            }
        }
        // 게시글
        for (let i = 0; i < trs.length; i++) {
            let writer_html = trs[i].querySelector('.p-nick .m-tcol-c');
            let html_writer = writer_html.getAttribute('onclick');
            let nick = html_writer.split(/[\'\"]/)[3];
            let id = html_writer.split(/[\'\"]/)[1];

            if (target_nick === nick) {
                add_key(id, cafe_name, nick);
                return;
            }
        }
    }
    alert(`이 페이지에서 '${target_nick}'을 찾을 수 없습니다.`)
}

function input_nick() {
    let cafe_name;
    try { // normal skin
        cafe_name = document.querySelector('.cafe-name .m-tcol-p').innerText;
    } catch (e) { // wide skin
        cafe_name = document.querySelector('.cafe_name').innerText;
    }
    let target_nick = prompt('현재 페이지에 있는 닉네임을 입력하세요.');

    if (target_nick !== '' && target_nick.indexOf('<') === -1) {
        try {
            find(cafe_name, target_nick)
        } catch (e) {
            alert('이런, 에러가 발생했어요.');
        }
    } else {
        alert('잘못 입력하였습니다.');
    }
}

try {
    input_nick();
} catch (e) {
    // console.log(e);
}
