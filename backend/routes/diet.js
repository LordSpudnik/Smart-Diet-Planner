// routes/diet.js
const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const m_auth = require("../middleware/m_auth");
const HealthProfile = require("../models/HealthProfile");

// Detect python binary safely for Windows/Linux/Mac
function getPythonBinary() {
  const candidates = ["python3", "python"];
  for (const cmd of candidates) {
    try {
      require("child_process").execSync(`${cmd} --version`, {
        stdio: "ignore",
      });
      return cmd;
    } catch (e) {}
  }
  return null;
}

router.post("/generate", m_auth, async (req, res) => {
  try {
    const profile = await HealthProfile.findOne({ user: req.user.id });
    if (!profile)
      return res
        .status(400)
        .json({ msg: "No health profile found for this user" });

    const profileObj = {
      age: profile.age,
      weight: profile.weight,
      height: profile.height,
      activityLevel: profile.activityLevel,
      dietaryGoals: profile.dietaryGoals,
      dietaryPreference: profile.dietaryPreference,
    };

    const scriptPath = path.join(
      __dirname,
      "..",
      "ml_service",
      "diet_recommender.py"
    );
    const datasetPath = path.join(
      __dirname,
      "..",
      "ml_service",
      "nutrition.csv"
    );

    // Verify Python + dataset
    const pythonBin = getPythonBinary();
    if (!pythonBin)
      return res.status(500).json({
        msg: "Python not found. Please install Python 3 or set PYTHON_BIN env var.",
      });

    if (!fs.existsSync(datasetPath))
      return res
        .status(500)
        .json({ msg: `Nutrition dataset not found at ${datasetPath}` });

    const py = spawn(pythonBin, [
      scriptPath,
      "--stdin",
      "--dataset",
      datasetPath,
    ]);

    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (data) => (stdout += data.toString()));
    py.stderr.on("data", (data) => (stderr += data.toString()));

    py.on("close", (code) => {
      if (code !== 0) {
        console.error("⚠️ Python exited with code", code);
        console.error("stderr:", stderr);
        console.error("stdout:", stdout);
        return res
          .status(500)
          .json({ msg: "Diet generator failed", error: stderr || stdout });
      }

      try {
        const parsed = JSON.parse(stdout);
        if (parsed.error)
          return res
            .status(500)
            .json({ msg: "Diet generator error", error: parsed.error });
        res.json(parsed);
      } catch (e) {
        console.error("❌ Failed to parse Python output:", e, stdout);
        res.status(500).json({
          msg: "Failed to parse diet generator output",
          error: e.message,
        });
      }
    });

    py.stdin.write(JSON.stringify(profileObj));
    py.stdin.end();
  } catch (err) {
    console.error("Server error in /api/diet/generate:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
