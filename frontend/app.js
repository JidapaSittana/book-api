// กำหนด URL ของ Backend API
const API_BASE = "http://localhost:3000/api/v1";

const statusEl = document.getElementById("status");
const listEl = document.getElementById("book-list");
const form = document.getElementById("add-book-form");
const alertBox = document.getElementById("alert-box");

// Modal Elements
const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-book-form");

function showAlert(message, type = "success") {
  if (!alertBox) return;
  alertBox.className = `alert alert-${type}`;
  alertBox.innerText = message;
  alertBox.style.display = "block";
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 4000);
}

// 1. GET: ดึงข้อมูลสำนักพิมพ์มาใส่ใน Dropdown
async function loadPublishers() {
  try {
    const res = await fetch(`${API_BASE}/publishers`);
    const result = await res.json();
    const publishers = result.data || [];

    const selectAdd = document.getElementById("publisherId");
    const selectEdit = document.getElementById("edit-publisherId");

    if (selectAdd)
      selectAdd.innerHTML =
        '<option value="">-- กรุณาเลือกสำนักพิมพ์ --</option>';
    if (selectEdit)
      selectEdit.innerHTML =
        '<option value="">-- กรุณาเลือกสำนักพิมพ์ --</option>';

    publishers.forEach((pub) => {
      const option1 = new Option(`${pub.publisherName}`, pub.id);
      const option2 = new Option(`${pub.publisherName}`, pub.id);
      if (selectAdd) selectAdd.add(option1);
      if (selectEdit) selectEdit.add(option2);
    });
  } catch (err) {
    console.error("โหลดข้อมูลสำนักพิมพ์ไม่สำเร็จ:", err);
  }
}

// 2. GET: ดึงข้อมูลหมวดหมู่มาใส่ใน Dropdown
async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const result = await res.json();
    const categories = result.data || [];

    const selectAdd = document.getElementById("categoryId");
    const selectEdit = document.getElementById("edit-categoryId");

    if (selectAdd)
      selectAdd.innerHTML =
        '<option value="">-- กรุณาเลือกหมวดหมู่ --</option>';
    if (selectEdit)
      selectEdit.innerHTML =
        '<option value="">-- กรุณาเลือกหมวดหมู่ --</option>';

    categories.forEach((cat) => {
      const option1 = new Option(
        `${cat.categoryName} (${cat.categoryCode})`,
        cat.id,
      );
      const option2 = new Option(
        `${cat.categoryName} (${cat.categoryCode})`,
        cat.id,
      );
      if (selectAdd) selectAdd.add(option1);
      if (selectEdit) selectEdit.add(option2);
    });
  } catch (err) {
    console.error("โหลดข้อมูลหมวดหมู่ไม่สำเร็จ:", err);
  }
}

// 3. GET: ดึงรายการหนังสือทั้งหมด (GET /api/v1/books)
async function loadBooks() {
  if (statusEl) statusEl.textContent = "กำลังโหลดข้อมูล...";
  if (listEl) listEl.innerHTML = "";

  try {
    const res = await fetch(`${API_BASE}/books`);
    if (!res.ok) {
      throw new Error(`เซิร์ฟเวอร์ตอบกลับผิดพลาด: ${res.status}`);
    }
    const result = await res.json();
    const books = result.data || [];

    if (statusEl) statusEl.textContent = "";
    if (books.length === 0) {
      if (listEl)
        listEl.innerHTML = `<tr><td colspan="6" style="text-align:center;">ไม่พบข้อมูลหนังสือ</td></tr>`;
      return;
    }

    books.forEach((book, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
  <td>${index + 1}</td>
  <td><strong>${book.title}</strong></td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td style="white-space: nowrap;">${Number(book.price).toFixed(2)} ฿</td>
  <td style="text-align: center; white-space: nowrap;"></td>
`;

      const actionTd = tr.querySelector("td:last-child");

      // ปุ่มดูประวัติ Log ของเล่มนี้
      const enrichBtn = document.createElement("button");
      enrichBtn.type = "button";
      enrichBtn.className = "btn-warning";
      enrichBtn.style.backgroundColor = "#2563eb"; // สีฟ้า
      enrichBtn.style.color = "#fff";
      enrichBtn.textContent = "ประวัติ";
      enrichBtn.onclick = () => loadBookEnrichment(book.id);

      // ปุ่มแก้ไข
      const editBtn = document.createElement("button");
      editBtn.className = "btn-warning";
      editBtn.textContent = "แก้ไข";
      editBtn.onclick = () => openEditModal(book.id);

      // ปุ่มลบ
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn-danger";
      deleteBtn.textContent = "ลบ";
      deleteBtn.onclick = () => deleteBook(book.id);

      actionTd.appendChild(enrichBtn);
      actionTd.appendChild(editBtn);
      actionTd.appendChild(deleteBtn);
      listEl.appendChild(tr);
    });
  } catch (err) {
    if (statusEl) statusEl.textContent = `โหลดข้อมูลไม่สำเร็จ: ${err.message}`;
  }
}

// 4. GET Audit Log Data ของหนังสือเล่มนั้นๆ (ตัดส่วนแจ้งเตือน Success ออก)
async function loadBookEnrichment(id) {
  const modal = document.getElementById("enrichment-modal");
  const content = document.getElementById("enrichment-content");

  if (!modal || !content) return;

  // แสดง Loading State
  content.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <p style="color: #2563eb; font-weight: bold; margin: 0;">กำลังดึงข้อมูลประวัติกิจกรรมจาก Audit Microservice (Port 3001)...</p>
    </div>
  `;
  modal.style.display = "flex";

  try {
    const res = await fetch(`${API_BASE}/books/${id}/enrichment`);
    const result = await res.json().catch(() => ({}));

    const data = result.data || {};
    const isFallback = !result.success;

    // แสดงผลข้อมูลสรุปประวัติกิจกรรม
    content.innerHTML = `
      <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #cbd5e1;">
        <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 16px;"> ${data.title || "ไม่พบชื่อเรื่อง"}</h4>
        <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>ISBN:</strong> ${data.isbn || "-"}</p>
        <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>สำนักพิมพ์:</strong> ${data.publisher || "ระบบคลังหนังสือดิจิทัล"}</p>
        <p style="margin: 0 0 4px 0; font-size: 14px; color: #0f172a; font-weight: 600;"><strong>ประวัติกิจกรรมทั้งหมด:</strong> ${data.pageCount || "0 กิจกรรม"}</p>
        <p style="margin: 6px 0 0 0; font-size: 12px; color: #2563eb;"><strong>แหล่งที่มาข้อมูล:</strong> ${result.source || "Microservice Integration"}</p>
      </div>

      <!-- รายละเอียดสรุปสถานะ Audit Log -->
      <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #2563eb;">
        <h5 style="margin: 0 0 6px 0; color: #2563eb; font-size: 14px;">สถานะประวัติในระบบ</h5>
        <p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.6;">
          ${data.description || "พบการบันทึกประวัติกิจกรรมในระบบ Audit Microservice เรียบร้อยแล้ว"}
        </p>
      </div>

      <!-- แสดงเตือนเฉพาะกรณีเกิด Fallback (เชื่อมต่อ Port 3001 ไม่ได้) เท่านั้น -->
      ${
        isFallback
          ? `
        <div style="margin-top: 12px; padding: 8px 12px; background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; border-radius: 4px; font-size: 12px;">
          ⚠️ <strong>Fallback Notice:</strong> ${result.message || "ใช้ข้อมูลสำรองเนื่องจาก Audit Service ไม่พร้อมใช้งาน"}
        </div>
      `
          : ""
      }
    `;
  } catch (err) {
    content.innerHTML = `
      <div style="padding: 15px; background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca; border-radius: 4px;">
        <strong>เกิดข้อผิดพลาด:</strong> ${err.message}
      </div>
    `;
  }
}

// 5. POST: เพิ่มหนังสือใหม่
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const isbn = document.getElementById("isbn").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const publisherId = parseInt(document.getElementById("publisherId").value);
    const categoryId = parseInt(document.getElementById("categoryId").value);

    if (
      !title ||
      !author ||
      !isbn ||
      isNaN(price) ||
      isNaN(publisherId) ||
      isNaN(categoryId)
    ) {
      showAlert("กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          isbn,
          price,
          publisherId,
          categoryIds: [categoryId],
        }),
      });

      const resData = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMessage =
          resData.error?.message ||
          resData.message ||
          `เซิร์ฟเวอร์ตอบกลับผิดพลาด: ${res.status}`;
        throw new Error(errorMessage);
      }

      showAlert("เพิ่มหนังสือใหม่เข้าสู่ระบบสำเร็จ!", "success");
      form.reset();
      loadBooks();
    } catch (err) {
      showAlert(`บันทึกไม่สำเร็จ: ${err.message}`, "error");
    }
  });
}

// 6. GET Single Book & Open Modal
async function openEditModal(id) {
  try {
    const res = await fetch(`${API_BASE}/books/${id}`);
    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg =
        result.error?.message ||
        result.message ||
        `เซิร์ฟเวอร์ตอบกลับผิดพลาด: ${res.status}`;
      throw new Error(errorMsg);
    }

    const book = result.data;
    if (!book) {
      throw new Error("ไม่พบข้อมูลหนังสือ");
    }

    document.getElementById("edit-id").value = book.id;
    document.getElementById("edit-title").value = book.title || "";
    document.getElementById("edit-author").value = book.author || "";
    document.getElementById("edit-isbn").value = book.isbn || "";
    document.getElementById("edit-price").value = book.price || 0;
    document.getElementById("edit-publisherId").value = book.publisherId || "";

    if (book.categories && book.categories.length > 0) {
      document.getElementById("edit-categoryId").value = book.categories[0].id;
    }

    if (editModal) editModal.style.display = "flex";
  } catch (err) {
    showAlert(`เกิดข้อผิดพลาด: ${err.message}`, "error");
  }
}

function closeEditModal() {
  if (editModal) editModal.style.display = "none";
}

// 7. PUT: บันทึกการแก้ไขหนังสือ
if (editForm) {
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("edit-id").value;
    const title = document.getElementById("edit-title").value.trim();
    const author = document.getElementById("edit-author").value.trim();
    const isbn = document.getElementById("edit-isbn").value.trim();
    const price = parseFloat(document.getElementById("edit-price").value);
    const publisherId = parseInt(
      document.getElementById("edit-publisherId").value,
    );
    const categoryId = parseInt(
      document.getElementById("edit-categoryId").value,
    );

    try {
      const res = await fetch(`${API_BASE}/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          isbn,
          price,
          publisherId,
          categoryIds: [categoryId],
        }),
      });

      const resData = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMessage =
          resData.error?.message ||
          resData.message ||
          `แก้ไขไม่สำเร็จ: ${res.status}`;
        throw new Error(errorMessage);
      }

      showAlert("แก้ไขข้อมูลหนังสือเรียบร้อยแล้ว!", "success");
      closeEditModal();
      loadBooks();
    } catch (err) {
      showAlert(`แก้ไขไม่สำเร็จ: ${err.message}`, "error");
    }
  });
}

// 8. DELETE: ลบข้อมูลหนังสือ
async function deleteBook(id) {
  if (!confirm("ยืนยันการลบหนังสือเล่มนี้?")) return;

  try {
    const res = await fetch(`${API_BASE}/books/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error?.message || `ลบไม่สำเร็จ: ${res.status}`);
    }

    showAlert("ลบข้อมูลหนังสือเรียบร้อยแล้ว", "success");
    loadBooks();
  } catch (err) {
    showAlert(`ลบไม่สำเร็จ: ${err.message}`, "error");
  }
}

// เรียกดึงข้อมูลทั้งหมดเมื่อเริ่มโหลดหน้าเว็บ
loadPublishers();
loadCategories();
loadBooks();
