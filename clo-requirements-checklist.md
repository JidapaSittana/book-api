# CLO Requirements Checklist

## 1. Summary of CLO Coverage

| CLO / Skill Area | Description                       |    Status    | Evidence / Reference Location                            |
| :--------------- | :-------------------------------- | :----------: | :------------------------------------------------------- |
| **CLO6 (PLO10)** | Client-Facing Frontend            | **COMPLETE** | `frontend/index.html`<br>`frontend/app.js` (Lines 1-350) |
| **CLO7 (PLO13)** | Project Defense & Architecture    |  **READY**   | Live Demonstration & Technical Q&A                       |
| **CLO8 (PLO14)** | Final Integration & Microservices | **COMPLETE** | `src/index.js`<br>`microservices/audit-service.js`       |

---

## 2. Detailed Verification Matrix

### 🔹 CLO6: Client-Facing Frontend (10 Points)

- **API Integration (GET, POST, PUT, DELETE):**
  - `GET /api/v1/books` ➔ `frontend/app.js` (ฟังก์ชัน `loadBooks`)
  - `POST /api/v1/books` ➔ `frontend/app.js` (ฟังก์ชัน `saveBook`)
  - `PUT /api/v1/books/:id` ➔ `frontend/app.js` (ฟังก์ชัน `saveBook` - Edit Mode)
  - `DELETE /api/v1/books/:id` ➔ `frontend/app.js` (ฟังก์ชัน `deleteBook`)
- **UX & Loading Status / Error Handling:**
  - แสดงสถานะ loading/error ชัดเจนเมื่อดึงข้อมูล ➔ `frontend/app.js` (ฟังก์ชัน `showAlert`, `loadBooks`)
- **Form Validation:**
  - ตรวจสอบข้อมูลความถูกต้องก่อนส่ง API ➔ `frontend/app.js` (ตรวจสอบฟิลด์ title, price, isbn ก่อนยิง API)

### 🔹 CLO8: Final Integration & Microservices (5 Points)

- **Decoupled Architecture & Multi-port Execution:**
  - Main Backend รันบน Port `3000` ➔ `src/index.js`
  - Audit Log Microservice รันบน Port `3001` ➔ `microservices/audit-service.js`
- **Swagger / Code Alignment:**
  - อัปเดตไฟล์ OpenAPI Spec ครบทุก Endpoint ➔ `openapi.yaml`
- **Test Coverage Baseline:**
  - จัดทำสรุปผล coverage และ Uncovered Areas ➔ `coverage-report.md`

### 🔹 CLO7: Project Defense (5 Points)

- **Live Demo Readiness:**
  - สาธิตการทำงาน CRUD หนังสือ และการสลับเรียกใช้งาน Audit Microservice ผ่าน UI สด
- **Resilience Showcase:**
  - พร้อมทดสอบกรณีปิด Audit Service (Port 3001) เพื่อโชว์ระบบ Fallback บน Frontend
