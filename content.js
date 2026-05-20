let problemName = "";

if(window.location.hostname.includes("codeforces")){

    let title = document.querySelector(".title");

    if(title){
        problemName = title.innerText;
    }
}

if(window.location.hostname.includes("leetcode")){

    let title = document.querySelector('div[class*="text-title"]');

    if(title){
        problemName = title.innerText;
    }
}

chrome.storage.local.set({
    currentProblem: problemName
});