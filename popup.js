/* 활성화, 정지 폰트, 색 설정
 * 현재 상태 value act/deact 설정*/

// 페이지 로드 후, act/deact 를 보여줌.
function act_deact() {
    chrome.storage.local.get(["is_act"], function (item) {
        let status = item["is_act"];
        if (status === "deactive")
            click_deact();
        else if (status === 'active')
            click_act();
        else
            createKey();
    });
}

function createKey() {
    chrome.storage.local.set({"is_act": "active"}, function () {
        click_act();
    })
}

function click_act() {
    let act = document.getElementById("act");
    let deact = document.getElementById("deact");
    $("#act").unbind("mouseenter mouseleave");
    $("#act").css("color", "red");

    $("#deact").hover(function () {
        $(this).css("color", "red");
    }, function () {
        $(this).css("color", "black");
    });
    act.style.font = "1.5em bold";
    act.style.color = "red";
    deact.style.font = "1em normal";
    deact.style.color = "black";


    chrome.storage.local.set({
        "is_act": "active"
    }, function () {
        chrome.browserAction.setIcon({path: "/image/on.png"})
    });
}

function click_deact() {
    let act = document.getElementById("act");
    let deact = document.getElementById("deact");

    $("#deact").unbind("mouseenter mouseleave");
    $("#deact").css("color", "red");
    $("#act").hover(function () {
        $(this).css("color", "red");
    }, function () {
        $(this).css("color", "black");
    });
    deact.style.font = "1.5em bold";
    deact.style.color = "red";
    act.style.font = "1em normal";
    act.style.color = "black";

    chrome.storage.local.set({
        "is_act": "deactive"
    }, function () {
        chrome.browserAction.setIcon({path: "/image/off.png"})
    });
}

function add_content() {
    let key = prompt("필터링 할 키워드 : ", "").trim();
    if (key !== "" && key != null) {
        insertData("cfhe_content", key);
    }
}

function add_writer() {
    let key = prompt("필터링 할 작성자(ID) : ", "").trim();
    if (key !== "" && key != null) {
        insertData("cfhe_writer", key);
    }
}

function add_high() {
    let key = prompt("강조할 키워드 : ", "").trim();
    if (key !== "" && key != null) {
        insertData("cfhe_high", key);
    }
}

function add_price_low() {	// 가격 설정 메뉴 추가
    try {
        let key = prompt("최저가 : ", "").trim();
        if (key !== "" && key != null) {
            insertData("cfhe_price_low", key);
        } else {
			replace("cfhe_price_low", 0);
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
			replace("cfhe_price_high", 100000000);
		}
    } catch (e) {
    }
}

function filter_this_writer() {
    chrome.tabs.executeScript({file: '/js/background/add_filter_writer.js'});
}

function filter_by_nick() {
    chrome.tabs.executeScript({file: '/js/background/add_by_nickname.js'});
}

window.onload = function () {
    $("#act").click(function () {
        click_act();
    });
    $("#deact").click(function () {
        click_deact();
    });
    $("#setting").click(function () {
        window.open("setting.html");
    });
    $("#add_content").click(function () {
        add_content();
    });
    $("#add_writer").click(function () {
        add_writer();
    });
    $("#add_high").click(function () {
        add_high();
    });
	$("#add_price").click(function () {	// 가격 설정 메뉴 추가
        add_price_low();
		add_price_high();
    });
    $('#filter-this').click(function () {
        filter_this_writer();
    });
    $('#filter-by-nick').click(function () {
        filter_by_nick();
    });
    act_deact();
};
