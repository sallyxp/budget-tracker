function checkForIndexedDb() {
    window.indexedDB =
        window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

    window.IDBTransaction =
        window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || { READ_WRITE: "readwrite" };

    // This line should only be needed if it is needed to support the object's constants for older browsers 
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    if (!window.indexedDB) {
        console.log("Your browser doesn't support a stable version of IndexedDB.");
        return false;
    }
    return true;
}

// create variable to hold db connection
let db;
// establish a connection to IndexedDB database 
const request = indexedDB.open('budget_tracker', 1);

//pending
request.onupgradeneeded = function(event) {
    // create object store called "pending" and set autoIncrement to true
    const db = event.target.result;
    
    db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;

    // check if app is online before reading from db
    if (navigator.onLine) {
        checkDatabase();
    }
};


request.onerror = function(event) {
    console.log("Error! " + event.target.errorCode);
};



function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);
  }

  function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();
    getAll.onsuccess = function() {
      if (getAll.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        })
        .then(response => {        
          return response.json();
        })
        .then(() => {
          // delete records if successful
          const transaction = db.transaction(["pending"], "readwrite");
          const store = transaction.objectStore("pending");
          store.clear();
        });
      }
    };
  }
  // listen for app coming back online
  window.addEventListener("online", checkDatabase) 






