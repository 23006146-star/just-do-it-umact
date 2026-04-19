import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function POST(req) {
  const input = await req.json();

  // 1. Read files from the PUBLIC folder correctly for Vercel
  const filePath = path.join(process.cwd(), "public", "coefficients.csv");
  const fileContent = fs.readFileSync(filePath, "utf8");
  
  const { data: coeffs } = Papa.parse(fileContent, { header: true });

  // 2. Lasso Logic: Start with the Intercept
  let predictedValue = parseFloat(coeffs.find(c => c.Predictor === '(Intercept)').Estimate);

  // 3. Add demographic impacts (example: Age)
  const ageCoeff = parseFloat(coeffs.find(c => c.Predictor === 'patient_age')?.Estimate || 0);
  predictedValue += (input.age * ageCoeff);

  // 4. Implement the Base MHIT Copayment Logic (20% cap RM3000)
  const copay = Math.min(predictedValue * 0.20, 3000);

  return Response.json({ 
    total_claim: predictedValue.toFixed(2),
    patient_responsibility: copay.toFixed(2),
    status: "Success"
  });
}
