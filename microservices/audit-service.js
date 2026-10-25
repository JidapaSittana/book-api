const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

// เปิดใช้งาน CORS และ JSON Parser
app.use(cors());
app.use(express.json());

// ตัวแปรสำหรับเก็บรายการ Audit Log ใน Memory
const auditLogs = [];

// ==========================================
// 1. POST /api/v1/logs - รับบันทึก Log ใหม่จาก Main Service (Port 3000)
// ==========================================
app.post("/api/v1/logs", (req, res) => {
  const { action, bookTitle, timestamp } = req.body;

  const logEntry = {
    id: auditLogs.length + 1,
    action: action || "UNKNOWN_ACTION",
    bookTitle: bookTitle || "ไม่ระบุชื่อหนังสือ",
    timestamp: timestamp || new Date().toISOString(),
    service: "Notification & Audit Service",
  };

  auditLogs.push(logEntry);

  console.log(
    `[Audit Service Port 3001] 🟢 บันทึก Log ใหม่: [${logEntry.action}] - หนังสือ: "${logEntry.bookTitle}"`,
  );

  return res.status(201).json({
    success: true,
    message: "บันทึก Audit Log สำเร็จ",
    data: logEntry,
  });
});

// ==========================================
// 2. GET /api/v1/logs - ดึงประวัติ Log ทั้งหมดในระบบ
// ==========================================
app.get("/api/v1/logs", (req, res) => {
  res.json({
    success: true,
    count: auditLogs.length,
    data: auditLogs,
  });
});

// เริ่มต้นเปิด Server ที่ Port 3001
app.listen(PORT, () => {
  console.log(`==========================================================`);
  console.log(`Audit Log Microservice กำลังทำงานที่: http://localhost:${PORT}`);
  console.log(`==========================================================`);
});
