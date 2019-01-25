function filter_this_writer() {

    let cafe_name;
    try { // normal skin
        cafe_name = document.querySelector('.cafe-name .m-tcol-p').innerText;
    } catch (e) { // wide skin
        cafe_name = document.querySelector('.cafe_name').innerText;
    }
    let id_link_onclick = document.querySelector("#cafe_main").contentWindow
        .document.querySelector("div.etc-box .p-nick .m-tcol-c").getAttribute("onclick");

    let nick = id_link_onclick.split(/[\'\"]/)[3];
    let id = id_link_onclick.split(/[\'\"]/)[1];

    let tableName = 'cfhe_writer';
    chrome.storage.local.get([tableName], function (items) {
        let itemArray = items[tableName] ? items[tableName] : [];
        let temp = itemArray.map(key => key.key);
        if (temp.indexOf(id) !== -1) {
            alert(`이미 등록한 ID 입니다. (${nick})`);
            return;
        }
        let key = {key: id, meta: {cafe: cafe_name, nick: nick}};
        itemArray.push(key);
        chrome.storage.local.set({[tableName]: itemArray}, function () {
            alert(`${nick} (${id}) 을(를) 필터링 합니다.`)
        });
    });
}

try {
    filter_this_writer();
} catch (e) {
    // console.log(e);
}
