# Test Coverage Baseline Report

## 1. Test Coverage Summary Table

| File / Module                        | % Stmts   | % Branch  | % Funcs   | % Lines   | Uncovered Line #s |
| :----------------------------------- | :-------- | :-------- | :-------- | :-------- | :---------------- |
| **All files**                        | **0.00%** | **0.00%** | **0.00%** | **0.00%** | -                 |
| `microservices/audit-service.js`     | 0.00%     | 0.00%     | 0.00%     | 0.00%     | 1-57              |
| `src/db.js`                          | 0.00%     | 0.00%     | 100.00%   | 0.00%     | 1-15              |
| `src/index.js`                       | 0.00%     | 0.00%     | 0.00%     | 0.00%     | 1-506             |
| `src/services/enrichment-service.js` | 0.00%     | 0.00%     | 0.00%     | 0.00%     | 2-31              |
| `src/services/external-api.js`       | 0.00%     | 0.00%     | 0.00%     | 0.00%     | 2-41              |

---

## 2. Uncovered Areas Identification (จุดที่ยังไม่มี Test ครอบคลุม)

จากการรัน Test Baseline พบว่าจุดที่ยังไม่มี Unit Test ครอบคลุมมีดังนี้:

1. **Main Server Endpoints (`src/index.js` - Lines 1-506):**
   - การรัน HTTP Integration Test สำหรับ API CRUD หนังสือ (`GET`, `POST`, `PUT`, `DELETE /api/v1/books`)
   - ระบบการตรวจสอบความถูกต้องของข้อมูล Input (Validation Logic) และการดักจับข้อผิดพลาด (Error Handling)
2. **Audit Microservice (`microservices/audit-service.js` - Lines 1-57):**
   - การทดสอบฟังก์ชันการรับ-ส่งข้อมูล Audit Log ผ่านพอร์ต 3001
3. **External Service & Inter-service Communication (`src/services/` - Lines 2-41):**
   - ระบบ Fallback Handler กรณีที่ Audit Microservice ล่ม หรือปิดการเชื่อมต่อชั่วคราว (Connection Refused)
4. **Client-Facing Frontend Interface (`frontend/app.js`):**
   - การตอบสนองของหน้าจอ UI, การเปิด Modal และระบบแจ้งเตือน Alert บนเบราว์เซอร์

---

## 3. Test Execution Verification

```text
PASS ./app.test.js
  Basic System Check
    ✓ Server environment should be ready (2 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.346 s
```
