// yarn add express nodemon
// yarn init

// yarn add express nodemon dotenv

/*
console.log(__dirname); // Trả về đường dẫn của file đag đứng hiện tại
console.log(process.cwd()); // Đường dẫn gốc của thư mục


const fs = require("fs"); // File system giúp tương tác với hệ thống
fs.writeFile(process.cwd() + "/text.txt", "Hello world", (err) => {});
*/

const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("./public"));

// yarn add prisma @prisma/client

const rootRoute = require("./routes/rootRoute");
app.use("/api", rootRoute);

// Các hàm thực thi thao tác dữ liệu
// yarn prisma generate

app.listen(8080, () => {
  console.log("Socket listening on");
});
