import { NextApiRequest, NextApiResponse } from "next";
import xlsx from "xlsx";
import path from "path";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const worksheetData = [
    {
      first_name: "Amit",
      last_name: "Verma",
      email: "amit.verma@example.com",
      phone: "9876543210",
      pan: "ABCDE1234F",
    },
  ];

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(worksheetData);
  xlsx.utils.book_append_sheet(wb, ws, "Users");

  const filePath = path.join(process.cwd(), "public", "sample_template.xlsx");
  xlsx.writeFile(wb, filePath);

  const fileBuffer = fs.readFileSync(filePath);
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=sample_template.xlsx"
  );
  res.send(fileBuffer);
}
