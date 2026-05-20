const problemDiv = document.getElementById("problemName");

chrome.storage.local.get(["currentProblem"], (data)=>{

    if(data.currentProblem){
        problemDiv.innerText = data.currentProblem;
    }
});