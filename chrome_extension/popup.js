var currentURL = "";

var button = document.getElementById('button');
var text = document.getElementById('text');

button.addEventListener('click', update);

function updateUrl() {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    currentURL = url;
    chrome.runtime.sendMessage({currentActiveURL: url});
  });
}

setInterval(updateUrl, 200);

function update() {
  if (!(currentURL.includes("https://mybackpack.punahou.edu" || currentURL.includes("localhost") || currentURL.includes("hartzell")))) {
    goto("https://mybackpack.punahou.edu/SeniorApps/logOff.do?dispatch=logOff");
  } else {
    // If not logged in yet
    if (currentURL.includes("loginCenter")) {
      updateMessage("Please log in with the proper information. This is not tracked.");
    } else if (currentURL.includes("SeniorApps/facelets/home/home.xhtml")) {
      goto("https://mybackpack.punahou.edu/SeniorApps/studentParent/schedule.faces?selectedMenuId=true");
    } else if (currentURL.includes("schedule.faces?selectedMenuId=true")) {
      scrape();
      // Here is the fun part

    }
  }
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.scraped) {
    chrome.tabs.create({url: "http://localhost:9001/?sched=" + request.scraped});
  }
  if (request.scrape) {
    scrape();
  }
})

function goto(URL) {
  chrome.tabs.update({
     url: URL
   });
  setTimeout(function() {
    updateUrl()
  }, 30);
}


function scrape() {
  if (currentURL === "https://mybackpack.punahou.edu/SeniorApps/studentParent/schedule.faces?selectedMenuId=true") {
    console.log("Scraping...")
    chrome.tabs.executeScript({
      file: "scrape.js"
    })
  }
}
