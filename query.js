let nowAllowed = ['<', '\\'];
let regexChar = /[-[\]{}()*+?.,\\^$|#\s]/g;

function insertData(tableName, key) {
    if (key.indexOf("<") !== -1) {
        alert("'<'가 포함된 단어를 등록할 수 없습니다.");
        return;
    }

    // if (tableName.indexOf('writer') !== -1 && key.match(regexChar) !== null) {
    //     window.alert(`${key.match(regexChar)} 문자는 입력할 수 없습니다.`);
    //     return;
    // }

    chrome.storage.local.get([tableName], function (items) {
        let itemArray = items[tableName] ? items[tableName] : [];
		if (tableName == 'cfhe_price_low' || tableName == 'cfhe_price_high') {
			itemArray = []
            let temp = itemArray.map(key => key.key)
            key = {key: key}
        }
        else if (itemArray.indexOf(key) !== -1) {
            alert("같은 키워드를 입력할 수 없습니다.");c
            return;
        }
        else if (tableName === 'cfhe_writer') {
            let temp = itemArray.map(key => key.key)
            if (temp.indexOf(key) !== -1) {
                alert("이미 등록한 ID 입니다.");
                return;
            }
            key = {key: key, meta: {cafe: '', nick: ''}}
        }
        itemArray.push(key);
        chrome.storage.local.set({[tableName]: itemArray}, function () {
        });
        refreshData(tableName);
    });
}

function modifyData(tableName, key, meta) {
    key.meta = Object.assign({}, key.meta, meta);
    chrome.storage.local.get([tableName], function (items) {
        let itemArray = items[tableName];
        let temp = itemArray.map(item => item.key);
        let idx = temp.indexOf(key.key);
        itemArray.splice(idx, 1, key);
        chrome.storage.local.set({[tableName]: itemArray}, function () {
        });
    })
}

function deleteData(tableName, key) {
    chrome.storage.local.get([tableName], function (items) {
        let itemArray = items[tableName] ? items[tableName] : [];
        let delete_idx;
        if (tableName === 'cfhe_writer') {
            let temp = itemArray.map(key => key.key);
            delete_idx = temp.indexOf(key.key);
        } else {
            delete_idx = itemArray.indexOf(key);
        }
        itemArray.splice(delete_idx, 1);
        chrome.storage.local.set({[tableName]: itemArray}, function () {
            refreshData(tableName);
        })
    });
}

function formatter(tableName, key, idx) {
    if (tableName === 'cfhe_writer') {
        return `<div class="item">
                    <form class="item-meta meta-${idx}" action="#">
                        <div class>카페: <input type="text" name="cafe" value="${key.meta.cafe}" class="input-cafe" autocomplete="off" ></div>
                        <div class="">&nbsp;&nbsp;닉&nbsp;&nbsp;: <input type="text" name="nick" value="${key.meta.nick}" class="input-nick" autocomplete="off" ></div>
                        <div class="save-btn"><button type="submit"><img src="./image/check.png" alt="save"></button></div>
                        <!--<div class="modify-btn"><img src="./image/modify1.png" alt="modify"></div>-->
                    </form>
                    <span class="item-key" id=${tableName}-${idx} >
                        ${key.key}
                    </span>
                </div>`;
    } else
        return `<div id=${tableName}-${idx} class="item"><span class="item-key">${key}</span></div>`;
}

function refreshData(tableName) {
    chrome.storage.local.get([tableName], function (items) {
        let itemArray = items[tableName] ? items[tableName] : [];
        let itemList = $(`.${tableName}-list`);
        itemList.empty();
        for (let idx = 0; idx < itemArray.length; idx++) {
            let key = itemArray[idx];
            itemList.append(
                formatter(tableName, key, idx)
            );
            $(`#${tableName}-${idx}`).click(function () {
                deleteData(tableName, key);
            })
            if (tableName === 'cfhe_writer') {
                $(`.item-meta.meta-${idx}`).on('submit', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    let cafe = $(this).find('[name=cafe]').val();
                    let nick = $(this).find('[name=nick]').val();
                    modifyData('cfhe_writer', key, {cafe: cafe, nick: nick})
                })
            }
        }
    })
}

function deleteAll(tableName) {
    chrome.storage.local.set({[tableName]: []}, function () {
    })
}