/**
 * Nhận đơn hàng & form liên hệ cho bản tĩnh (GitHub Pages) của the.Meal → ghi vào Google Sheet.
 *
 * Cài đặt (khoảng 5 phút):
 *  1. Tạo một Google Sheet mới → menu Tiện ích mở rộng → Apps Script.
 *  2. Xoá code mẫu, dán toàn bộ file này vào, sửa NOTIFY_EMAIL bên dưới, bấm Lưu.
 *  3. Triển khai → Tùy chọn triển khai mới → Loại: Ứng dụng web
 *       - Thực thi với tư cách: Tôi
 *       - Người có quyền truy cập: Bất kỳ ai
 *     → Triển khai, cấp quyền, sao chép "URL ứng dụng web" (dạng https://script.google.com/macros/s/.../exec).
 *  4. Build lại site với URL đó:
 *       ORDER_ENDPOINT="https://script.google.com/macros/s/XXXX/exec" npm run build
 *     rồi commit & push. Thử đặt 1 đơn để kiểm tra sheet "Đơn hàng" có dòng mới.
 *
 * Lưu ý: giá trong đơn do trình duyệt gửi lên — luôn đối chiếu bảng giá khi gọi chốt đơn.
 */
const NOTIFY_EMAIL = ''; // VD: 'marketing@themeal.vn' — để trống nếu không cần email báo đơn mới

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.consent !== true && d.consent !== 'yes') return json({ ok: false, error: 'consent' });
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const cut = (v, n) => String(v == null ? '' : v).slice(0, n || 300);
    // Chặn chèn công thức vào Sheet từ dữ liệu khách nhập.
    const safe = v => { const t = cut(v, 1000); return /^[=+\-@]/.test(t) ? "'" + t : t; };
    let summary;
    if (d.type === 'order') {
      const c = d.customer || {};
      const items = (d.items || []).slice(0, 20).map(i => `${cut(i.name, 60)} · ${cut(i.colorName, 30)}${i.size ? ' · S' + cut(i.size, 4) : ''} x${Number(i.qty) || 0}`).join('\n');
      const sh = sheet(ss, 'Đơn hàng', ['Thời gian', 'Mã đơn', 'Họ tên', 'SĐT', 'Email', 'Tỉnh/TP', 'Địa chỉ', 'Sản phẩm', 'Tạm tính', 'Thanh toán', 'Ghi chú', 'Trạng thái']);
      sh.appendRow([new Date(), safe(d.code), safe(c.name), safe(c.phone), safe(c.email), safe(c.province), safe(c.address), safe(items), Number(d.total) || 0, d.payment === 'bank' ? 'Chuyển khoản' : 'COD', safe(c.note), 'Mới']);
      summary = `Đơn mới ${cut(d.code, 20)}: ${cut(c.name, 80)} - ${cut(c.phone, 20)}\n${items}`;
    } else {
      const sh = sheet(ss, 'Liên hệ', ['Thời gian', 'Loại', 'Họ tên', 'SĐT', 'Email', 'Doanh nghiệp', 'Loại hình', 'Tỉnh/TP', 'Sản phẩm', 'Nội dung']);
      sh.appendRow([new Date(), d.type === 'partner' ? 'Đối tác' : 'Tư vấn', safe(d.name), safe(d.phone), safe(d.email), safe(d.company), safe(d.bizType), safe(d.province), safe(d.product), safe(d.message)]);
      summary = `${d.type === 'partner' ? 'Đăng ký đối tác' : 'Yêu cầu tư vấn'}: ${cut(d.name, 80)} - ${cut(d.phone, 20)}`;
    }
    if (NOTIFY_EMAIL) MailApp.sendEmail(NOTIFY_EMAIL, '[the.Meal] ' + summary.split('\n')[0], summary);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function sheet(ss, name, header) {
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(header); sh.setFrozenRows(1); }
  return sh;
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
