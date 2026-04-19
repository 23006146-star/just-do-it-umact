import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function POST(req) {
  const input = await req.json();

  // Load CSV file from /public
  const filePath = path.join(process.cwd(), "public/drg_table.csv");
  const csvFile = fs.readFileSync(filePath, "utf8");

  const drgTable = Papa.parse(csvFile, {
    header: true,
    dynamicTyping: true,
  }).data;

  // Find matching DRG row
  const match = drgTable.find(
    (r) =>
      r.hospital_type === input.hospital_type &&
      r.major_category === input.major_category &&
      r.sub_category === input.sub_category &&
      r.los_tier === input.los_tier
  );

  if (!match) {
    return Response.json({
      error: "No DRG match found",
    });
  }

  return Response.json({
    prediction: match.Expected_Claim_Amount,
    drg: match.Clinical_DRG,
  });
}
