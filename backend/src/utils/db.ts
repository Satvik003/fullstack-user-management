import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root", // 👈 your MySQL username
  password: "Satvik@123", // 👈 your MySQL password
  database: "user_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
