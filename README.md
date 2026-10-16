# the.Meal — Website thương mại điện tử

Website bán **Meal Ring Active**, **Meal Ring Active Pro** và **Meal Fit Insight**. Viết bằng Node.js + Express, chỉ phụ thuộc một gói là `express`.

## Chạy thử trên máy
```bash
npm install
npm start            # http://localhost:3000
# hoặc: npm run dev  (tự khởi động lại khi sửa code)
```
Để bật trang quản trị: `ADMIN_USER=admin ADMIN_PASS=<mật-khẩu-mạnh> npm start` rồi mở `/admin`.

## Cấu trúc
```
server.js              Express: các trang, API đặt hàng/liên hệ, admin, sitemap
src/config.js          Thông tin công ty, ngân hàng, phí ship  ← sửa ở đây
src/products.js        Dữ liệu 3 sản phẩm (giá, màu, size, thông số, ảnh)
src/views.js           Giao diện các trang (HTML render phía server, chuẩn SEO)
src/icons.js           Bộ icon SVG
public/css/style.css   Design system + toàn bộ giao diện
public/js/app.js       Giỏ hàng, slider, form, tab… (JS thuần, không thư viện)
public/img, fonts      Ảnh sản phẩm đã tối ưu WebP + font Be Vietnam Pro tự host
data/                  orders.json, contacts.json (tự tạo khi có đơn)
design-system/         MASTER.md — quy tắc màu, chữ, component
```

## Tính năng
- Trang chủ (banner 3 slide, sản phẩm, 6 chỉ số, app the Meal, so sánh Active/Pro, cân, size, chứng nhận, FAQ)
- Danh sách sản phẩm và chi tiết sản phẩm (chọn màu, size, số lượng; tab thông số, hướng dẫn chọn size, hướng dẫn kết nối)
- Giỏ hàng lưu trong trình duyệt → đặt hàng COD hoặc chuyển khoản (có mã VietQR nếu cấu hình ngân hàng)
- Server tính lại giá khi nhận đơn, không tin giá phía trình duyệt; có giới hạn tần suất gửi đơn
- Trang `/admin`: xem đơn, đổi trạng thái, xuất CSV. Có thể báo đơn mới qua Telegram
- SEO: meta/OG, JSON-LD Product/FAQ/Organization, `sitemap.xml`, `robots.txt`
- Chuẩn truy cập: tương phản AA, dùng được bằng bàn phím, nút ≥44px, tôn trọng `prefers-reduced-motion`

## Bản tĩnh cho GitHub Pages
```bash
npm run build        # tạo HTML tĩnh ở thư mục gốc (BASE_PATH=/project20)
```
GitHub Pages không có server nên **không tự lưu được đơn hàng**. Để nhận đơn và form liên hệ:
1. Làm theo hướng dẫn trong `scripts/google-apps-script.gs` (đơn được ghi vào Google Sheet, có thể gửi email báo đơn).
2. Build lại: `ORDER_ENDPOINT="https://script.google.com/macros/s/.../exec" npm run build`, rồi commit & push.

Nếu chưa đặt `ORDER_ENDPOINT`, website **không báo "đặt hàng thành công"** mà soạn sẵn nội dung đơn để khách gọi hotline hoặc nhắn Zalo.
Dùng tên miền riêng: `SITE_URL=https://themeal.vn BASE_PATH= npm run build`.

## Deploy lên Render
1. Đưa thư mục này lên GitHub.
2. Trên Render chọn New → Web Service. Build command: `npm install`, start command: `npm start`.
3. Khai báo biến môi trường theo `.env.example`.
4. Lưu ý: ổ đĩa của Render gói Free sẽ bị xoá khi deploy lại. Để giữ đơn hàng lâu dài, cần gắn Persistent Disk vào thư mục `data/` hoặc bật thông báo Telegram.

## Còn cần bổ sung
Các chỗ đang thiếu dữ liệu hiện bằng nhãn cam khi chạy dev; ở bản thật (`NODE_ENV=production` / bản tĩnh) chúng **được ẩn hẳn** cho tới khi có thông tin:
- Mã số thuế (`TAX_CODE`), giờ làm việc (`WORKING_HOURS`), thông tin ngân hàng (`BANK_*`).
- Nội dung chính sách bảo hành / đổi trả / vận chuyển (`POLICY_BODY` trong `src/views.js`) — chưa có thì không hiện trong footer & sitemap.
- Đánh giá khách hàng (mục "Đánh giá" và menu "Tin tức" đang ẩn ở bản thật).
- "Đã gồm VAT", "Hỗ trợ đổi size": chỉ hiện ở dev cho tới khi xác nhận.
- Chất liệu Active (thép hay titan), màu Active Pro, thời lượng pin của cân (90 hay 120 ngày), số liệu size 7 (đường kính 17.9mm ↔ chu vi 55mm chưa khớp nhau).
