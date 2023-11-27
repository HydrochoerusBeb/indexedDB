const request = indexedDB.open("databaseName", 1);
request.onupgradeneeded = function (event) {
  const db = event.target.result;
  if (!db.objectStoreNames.contains("tableName")) {
    const objectStore = db.createObjectStore("tableName", {
      keyPath: "id",
      autoIncrement: true,
    });
  }
};

let db;
request.onsuccess = function (event) {
  db = event.target.result;
};

request.onerror = function (event) {
  console.error("Ошибка:", event.target.errorCode);
};

function updateTable() {
  const table = document.getElementById("yourTableId");
  table.innerHTML = "";

  const transaction = db.transaction(["tableName"], "readonly");
  const objectStore = transaction.objectStore("tableName");

  objectStore.openCursor().onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      const row = table.insertRow();
      const cell1 = row.insertCell();
      const cell2 = row.insertCell();
      const cell3 = row.insertCell();

      cell1.textContent = cursor.value.property1;
      cell2.textContent = cursor.value.property2;

      const editButton = document.createElement("span");
      editButton.className = "action";
      editButton.textContent = "Изменить ";
      editButton.onclick = function () {
        updateItem(cursor.key);
      };
      cell3.appendChild(editButton);

      const deleteButton = document.createElement("span");
      deleteButton.className = "action";
      deleteButton.textContent = "Удалить";
      deleteButton.onclick = function () {
        deleteItem(cursor.key);
      };
      cell3.appendChild(deleteButton);

      cursor.continue();
    }
  };
}

function saveItem() {
  const value1 = document.getElementById("input1").value;
  const value2 = document.getElementById("input2").value;

  const transaction = db.transaction(["tableName"], "readwrite");
  const objectStore = transaction.objectStore("tableName");

  const newItem = { property1: value1, property2: value2 };

  const request = objectStore.add(newItem);
  request.onsuccess = function () {
    alert("Запись успешно добавлена");
    updateTable();
  };

  request.onerror = function () {
    alert("Ошибка при добавлении записи");
  };
}

function updateItem(key) {
  const newValue1 = prompt("Введите новое значение property1");
  const newValue2 = prompt("Введите новое значение property2");

  const transaction = db.transaction(["tableName"], "readwrite");
  const objectStore = transaction.objectStore("tableName");

  const request = objectStore.get(key);
  request.onsuccess = function (event) {
    const data = event.target.result;

    if (data) {
      data.property1 = newValue1;
      data.property2 = newValue2;

      const updateRequest = objectStore.put(data);
      updateRequest.onsuccess = function () {
        alert("Запись успешно изменена");
        updateTable();
      };

      updateRequest.onerror = function () {
        alert("Ошибка при изменении записи");
      };
    }
  };
}

function deleteItem(key) {
  const transaction = db.transaction(["tableName"], "readwrite");
  const objectStore = transaction.objectStore("tableName");

  const request = objectStore.delete(key);
  request.onsuccess = function () {
    alert("Запись успешно удалена");
    updateTable();
  };

  request.onerror = function () {
    alert("Ошибка при удалении записи");
  };
}

