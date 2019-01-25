function add_content() {
    try {
        let key = prompt("필터링 할 키워드 : ", "").trim();
        if (key !== "" && key != null) {
            insertData("cfhe_content", key);
        }
    } catch (e) {
    }
}

function add_writer() {
    try {
        let key = prompt("필터링 할 작성자(ID) : ", "").trim();
        if (key !== "" && key != null) {
            insertData("cfhe_writer", key);
        }
    } catch (e) {
    }
}

function add_high() {
    try {
        let key = prompt("강조할 키워드 : ", "").trim();
        if (key !== "" && key != null) {
            insertData("cfhe_high", key);
        }
    } catch (e) {
    }
}

function add_price_low() {	// 가격 설정 메뉴 추가
    try {
        let key = prompt("최저가 : ", "").trim();
        if (key !== "" && key != null) {
            insertData("cfhe_price_low", key);
        } else {
			insertData("cfhe_price_low", 0);
		}
    } catch (e) {
    }
}

function add_price_high() {	// 가격 설정 메뉴 추가
    try {
        let key = prompt("최고가 : ", "").trim();
        if (key !== "" && key != null) {
            insertData("cfhe_price_high", key);
        } else {
			insertData("cfhe_price_high", 100000000);
		}
    } catch (e) {
    }
}

function refresh_list(table) {
    refreshData(table);
}

function foo() {
    console.log('foo')
    chrome.storage.local.set({'cfhe_key': 'false'}, function () {
        console.log('did')
    })
    chrome.storage.local.get(['cfhe_key'], function (items) {
        console.log(items);
    })
}

function download(data, filename, type) {
    let file = new Blob([data], {type: type});
    let a = document.createElement("a"),
        url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

function saveFromJson(data) {
    chrome.storage.local.set(data, function () {
        refresh_list("cfhe_content");
        refresh_list("cfhe_writer");
        refresh_list("cfhe_high");
    })
}

function readSingleFile(e) {
    let file = e.target.files[0];
    if (!file) {
        return;
    }
    let reader = new FileReader();
    reader.onload = function (e) {
        let contents = e.target.result;
        let data = JSON.parse(contents)
        saveFromJson(data)
    };
    reader.readAsText(file);
}

function resetAll() {
    if (window.confirm('모든 데이터를 삭제 하시겠습니까?')) {
        deleteAll("cfhe_content");
        refresh_list("cfhe_content");
        deleteAll("cfhe_writer");
        refresh_list("cfhe_writer");
        deleteAll("cfhe_high");
        refresh_list("cfhe_high");
		deleteAll("cfhe_price_low");
        refresh_list("cfhe_price_low");
		deleteAll("cfhe_price_high");
        refresh_list("cfhe_price_high");
    }
}

function copyToClipboard(val) {
    let t = document.createElement("textarea");
    document.body.appendChild(t);
    t.value = val.trim();
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
}
const toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});
let toast_message = function (type, message) {
    toast({
        type: type,
        title: message,
        width: '10rem',
    })
};

window.onload = function () {
    refresh_list("cfhe_content");
    refresh_list("cfhe_writer");
    refresh_list("cfhe_high");
	refresh_list("cfhe_price_low");
	refresh_list("cfhe_price_high");
    $('.foo').click(function (e) {
        foo()
    })
    $(".add-content").click(function (e) {
        e.stopPropagation();
        add_content();
    });
    $(".add-writer").click(function (e) {
        e.stopPropagation();
        add_writer();
    });
    $(".add-high").click(function (e) {
        e.stopPropagation();
        add_high();
    });
	$(".add-price").click(function (e) {	// 가격 설정 메뉴 추가
        e.stopPropagation();
        add_price_low();
		add_price_high();
    });
    $('.export-btn').click(function (e) {
        chrome.storage.local.get(['cfhe_content', 'cfhe_writer', 'cfhe_high'], function (items) {
            let contentKeywords = items.cfhe_content ? items.cfhe_content : [];
            let writerKeywords = items.cfhe_writer ? items.cfhe_writer : [];
            let highKeywords = items.cfhe_high ? items.cfhe_high : [];

            let data = {
                cfhe_content: contentKeywords,
                cfhe_writer: writerKeywords,
                cfhe_high: highKeywords
            };
            let d = new Date();
            let now = `${d.getMonth() + 1}_${d.getDate()}`;
            download(JSON.stringify(data), `카페필터링_${now}.json`, "text/json;charset=utf-8")
        })
    });
    $('#import-file').change(function (e) {
        readSingleFile(e)
    });
    $('.support-btn').click(function (e) {
        let info = window.document.getElementById('support-info');
        if (info.style.display === 'none' || info.style.display === '') {
            info.style.display = 'inline-block';
        } else {
            info.style.display = 'none';
        }
    });
    $('.donate-btn').click(function (e) {
        let info = window.document.getElementById('donate-info');
        if (info.style.display === 'none' || info.style.display === '') {
            info.style.display = 'inline-block';
        } else {
            info.style.display = 'none';
        }
    });
    $('.close-donate-info').click(function (e) {
        let info = window.document.getElementById('donate-info');
        info.style.display = 'none';
    });
    $('.reset-btn').click(function (e) {
        e.stopPropagation();
        resetAll();
    });
    $('.cc-copy').click(function (e) {
        let address = $(this).prev()[0];
        copyToClipboard(address.innerText);
        toast_message('success', '복사 완료');
    })
};