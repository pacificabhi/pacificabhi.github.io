'use strict';

let lastPage = 0;
const perPage = 20;
const BASE_URL = "https://api.github.com/search/users";
const throttleDelay = 1500;

const searchUsers = () => {
    console.log("searchUsers");
    const query = document.getElementById("id-query-input").value;
    if(query == undefined || query.length == 0) {
        alert("Please enter something");
        return;
    }

    
    if(lastPage == undefined) {
        lastPage = 0;
    }
    lastPage++;
    const params = new URLSearchParams({
        q: query,
        page: lastPage,
        per_page: perPage,
        sort: "followers",
        order: "desc"
      });
    let queryString = params.toString();
    let finalUrl = BASE_URL + "?" + queryString;
    console.log(finalUrl);
    fetchResult(finalUrl, updateSearchResults);
}

const searchHandler = (func, delay) => {
    let timer = null;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(func, delay);
    }
}

const searchHandlerTrigger = searchHandler(searchUsers, throttleDelay);

const initComponents = () => {
    let inputField = document.getElementById("id-query-input");
    inputField.onkeyup = searchHandlerTrigger;
}


const fetchResult = (url, callback) => {
    fetch(url) 
    .then(response => { 
        if (response.ok) { 
            return response.json();
        } else {
            //alert("Something Went Wrong");
            throw new Error('API request failed'); 
        } 
    }) 
    .then(data => { 
        callback(data);
    }) 
    .catch(error => { 
        alert("Something Went Wrong");
        console.error(error);
    });

}

const updateSearchResults = (data) => {
    console.log(data);
    let dataArray = data.items;
    let tBody = document.getElementById("id-table-content");
    tBody.innerHTML = "";
    for(let i = 0; i < dataArray.length; i++) {
        let newRow = getRow(dataArray[i]);
        tBody.appendChild(newRow);
    }
}

const getRow = (rowData) => {
    console.log(rowData);
    let tr = document.createElement("tr");
    let nameCol = document.createElement("td");
    nameCol.innerHTML = rowData.login;
    tr.appendChild(nameCol);

    let linkCol = document.createElement("td");
    let a = document.createElement("a");
    a.href = rowData.html_url;
    a.target = '_blank';
    a.innerHTML = rowData.html_url;
    linkCol.appendChild(a);
    tr.appendChild(linkCol);
    return tr;
}


window.onload = () => {
    console.log("init");
    initComponents();
}
