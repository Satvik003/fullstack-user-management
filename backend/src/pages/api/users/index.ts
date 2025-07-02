import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../utils/db";

const validatePAN = (pan: string): boolean =>
  /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
const validatePhone = (phone: string): boolean => /^[0-9]{10}$/.test(phone);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body, query } = req;

  // GET: Fetch all users
  if (method === "GET") {
    try {
      const [rows] = await pool.query("SELECT * FROM users");
      res.status(200).json({ users: rows });
    } catch (error) {
      console.error("GET error:", error);
      res.status(500).json({ message: "Server error while fetching users" });
    }
  }

  // POST: Create a new user
  else if (method === "POST") {
    const { first_name, last_name, email, phone, pan } = body;

    if (!first_name || !last_name || !email || !phone || !pan) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!validatePhone(phone)) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits." });
    }

    if (!validatePAN(pan)) {
      return res.status(400).json({ message: "PAN format is invalid." });
    }

    try {
      const [result] = await pool.query(
        "INSERT INTO users (first_name, last_name, email, phone, pan) VALUES (?, ?, ?, ?, ?)",
        [first_name, last_name, email, phone, pan]
      );
      res.status(201).json({
        message: "User created successfully.",
        userId: (result as any).insertId,
      });
    } catch (error: any) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Email already exists." });
      }
      console.error("POST error:", error);
      res.status(500).json({ message: "Server error while creating user." });
    }
  }

  // PUT: Update user by ID
  else if (method === "PUT") {
    const { id } = query;
    const { first_name, last_name, email, phone, pan } = body;

    if (!id || !first_name || !last_name || !email || !phone || !pan) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!validatePhone(phone)) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits." });
    }

    if (!validatePAN(pan)) {
      return res.status(400).json({ message: "PAN format is invalid." });
    }

    try {
      const [result] = await pool.query(
        "UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, pan = ? WHERE id = ?",
        [first_name, last_name, email, phone, pan, id]
      );
      res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
      console.error("PUT error:", error);
      res.status(500).json({ message: "Server error while updating user." });
    }
  }

  // DELETE: Remove user by ID
  else if (method === "DELETE") {
    const { id } = query;

    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    try {
      const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
      res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      console.error("DELETE error:", error);
      res.status(500).json({ message: "Server error while deleting user." });
    }
  }

  // Method not allowed
  else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
