import type { NextApiRequest, NextApiResponse } from "next";
import type formidable from "formidable";
import { IncomingForm } from "formidable";
import xlsx from "xlsx";
import fs from "fs";
import pool from "../../../utils/db";

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Validation functions
const validatePAN = (pan: string): boolean =>
  /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

const validatePhone = (phone: string): boolean => /^[0-9]{10}$/.test(phone);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = new IncomingForm({ multiples: false });

  form.parse(
    req,
    async (err, fields: formidable.Fields, files: formidable.Files) => {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(500).json({ message: "File upload error." });
      }

      const file = (files.file?.[0] || files.file) as formidable.File;

      if (!file || !file.filepath) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      try {
        const workbook = xlsx.readFile(file.filepath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        const errors: string[] = [];
        const users: any[] = [];

        data.forEach((row: any, index: number) => {
          const { first_name, last_name, email, phone, pan } = row;

          if (!first_name || !last_name || !email || !phone || !pan) {
            errors.push(`Row ${index + 2}: Missing required fields`);
            return;
          }

          if (!validatePhone(phone)) {
            errors.push(`Row ${index + 2}: Invalid phone`);
          }

          if (!validatePAN(pan)) {
            errors.push(`Row ${index + 2}: Invalid PAN`);
          }

          users.push([first_name, last_name, email, phone, pan]);
        });

        if (errors.length > 0) {
          return res.status(400).json({ message: "Validation errors", errors });
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        for (const user of users) {
          await connection.query(
            "INSERT INTO users (first_name, last_name, email, phone, pan) VALUES (?, ?, ?, ?, ?)",
            user
          );
        }

        await connection.commit();
        connection.release();

        res.status(200).json({ message: "Excel uploaded successfully." });
      } catch (e) {
        console.error("Upload handler error:", e);
        res
          .status(500)
          .json({ message: "Server error while processing Excel." });
      }
    }
  );
}
