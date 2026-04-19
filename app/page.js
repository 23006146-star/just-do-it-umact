"use client";

import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    hospital_type: "Private",
    major_category: "Surgical",
    sub_category: "Cardiac",
    los_tier: "ShortStay",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const predict = async () => {
    const res = await fetch("/api/predict", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h2>DRG Claim Predictor</h2>

      {/* Dropdowns */}
      <select name="hospital_type" onChange={handleChange}>
        <option>Private</option>
        <option>Government</option>
      </select>

      <select name="major_category" onChange={handleChange}>
        <option>Surgical</option>
        <option>Medical</option>
        <option>Obstetrics</option>
      </select>

      <select name="sub_category" onChange={handleChange}>
        <option>Cardiac</option>
        <option>Orthopedic</option>
        <option>Respiratory</option>
      </select>

      <select name="los_tier" onChange={handleChange}>
        <option>ShortStay</option>
        <option>StandardAdmit</option>
        <option>ProlongedStay</option>
      </select>

      <br /><br />

      <button onClick={predict}>Predict Claim</button>

      {/* Result panel */}
      {result && (
        <div style={{ marginTop: 20, padding: 10, border: "1px solid #ccc" }}>
          <h3>Prediction Result</h3>
          <p><b>Expected Claim:</b> RM {result.prediction}</p>
          <p><b>Matched DRG:</b> {result.drg}</p>
        </div>
      )}
    </div>
  );
}
