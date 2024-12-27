const fs = require("fs");
const path = require("path");
const dataFilePath = path.join(__dirname, "users.json");

if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, "[]", "utf-8");
  console.log("Файл users.json создан.");
}

function readData() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Ошибка чтения файла данных:", error.message);
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = { readData, writeData };
