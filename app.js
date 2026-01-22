const API_BASE = "https://judex-decision.onrender.com";

const statusEl = document.getElementById("status");
const logsEl = document.getElementById("logs");

const textInput = document.getElementById("textInput");
const analyzeTextBtn = document.getElementById("analyzeTextBtn");

const csvFileInput = document.getElementById("csvFile");
const analyzeCsvBtn = document.getElementById("analyzeCsvBtn");

function setStatus(type, message) {
  statusEl.className = `status ${type}`;
  statusEl.textContent = message;
}

function log(msg) {
  logsEl.textContent += `\n${msg}`;
}

/* -------- TEXT → LEADS -------- */
analyzeTextBtn.addEventListener("click", async () => {
  if (!textInput.value.trim()) return;

  setStatus("loading", "Processing text…");
  logsEl.textContent = "Sending text to backend…";

  try {
    const res = await fetch(`${API_BASE}/text-to-leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: textInput.value })
    });

    if (!res.ok) throw new Error("Text analysis failed");

    const blob = await res.blob();
    download(blob, "filtered_leads.csv");

    log("Text processed successfully.");
    setStatus("success", "Text leads ready");
  } catch (err) {
    console.error(err);
    setStatus("error", "Text processing failed");
    log(err.message);
  }
});

/* -------- CSV CLEAN -------- */
analyzeCsvBtn.addEventListener("click", async () => {
  const file = csvFileInput.files[0];
  if (!file) return;

  setStatus("loading", "Cleaning CSV…");
  logsEl.textContent = "Uploading CSV…";

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/clean-leads`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("CSV cleaning failed");

    const blob = await res.blob();
    download(blob, "lead_results.zip");

    log("CSV cleaned successfully.");
    setStatus("success", "CSV results ready");
  } catch (err) {
    console.error(err);
    setStatus("error", "CSV processing failed");
    log(err.message);
  }
});

/* -------- DOWNLOAD -------- */
function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
