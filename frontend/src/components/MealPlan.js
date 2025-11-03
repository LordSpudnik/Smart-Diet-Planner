// MealPlan.js
import React, { useState } from "react";
import axios from "axios";
import "./MealPlan.css";

function numberFormat(num) {
  if (num === null || num === undefined) return "";
  return Number(num).toFixed(2);
}

const MealPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePlan = async () => {
    setError("");
    setLoading(true);
    setPlan(null);
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        "/api/diet/generate",
        {},
        { headers: { "x-auth-token": token } }
      );
      if (res.data && res.data.plan) {
        setPlan(res.data.plan);
      } else {
        setError("Received unexpected response from server.");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.msg || "Failed to generate meal plan.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!plan) return;
    // Build CSV from plan array
    const headers = Object.keys(plan[0]);
    const rows = plan.map((r) =>
      headers.map((h) =>
        r[h] !== undefined ? `"${String(r[h]).replace(/"/g, '""')}"` : ""
      )
    );
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diet_plan.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mealplan-container">
      <div className="mealplan-header">
        <h3>Your Personalized Meal Plan</h3>
        <div className="mealplan-actions">
          <button
            className="btn-primary"
            onClick={generatePlan}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Meal Plan"}
          </button>
          <button className="btn-ghost" onClick={downloadCSV} disabled={!plan}>
            Download CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mealplan-error">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      )}

      {plan ? (
        <div className="mealplan-table-wrap">
          <table className="mealplan-table">
            <thead>
              <tr>
                {Object.keys(plan[0]).map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plan.map((row, idx) => (
                <tr
                  key={idx}
                  className={row.Meal === "Total" ? "summary-row" : ""}
                >
                  {Object.keys(plan[0]).map((col) => (
                    <td key={col}>
                      {col === "Calories" ||
                      (typeof row[col] === "number" && col !== "Food")
                        ? numberFormat(row[col])
                        : row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mealplan-note">
            Tip: Click "Download CSV" to save the plan offline. You can
            regenerate anytime after updating your health profile.
          </div>
        </div>
      ) : (
        <div className="mealplan-empty">
          <p>
            No plan generated yet. Click the button above to create a custom
            meal plan using your saved health profile.
          </p>
        </div>
      )}
    </div>
  );
};

export default MealPlan;
