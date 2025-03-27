# GrantAccessToken

## 1. Đọc và xác thực refresh token:

- Đầu tiên, chúng ta lấy giá trị `refreshToken` từ body của request.
- Nếu không có `refreshToken`, server trả về lỗi với mã 403 (cấm truy cập).

## 2. Xác thực refresh token và lấy payload:

- Sử dụng thư viện `jsonwebtoken` để xác thực `refreshToken`.
- Hàm `jwt.verify()` sẽ giải mã và kiểm tra xem token có hợp lệ không. Nếu token không hợp lệ hoặc đã hết hạn, đoạn mã này sẽ ném ra lỗi.
- Payload sau khi giải mã chứa thông tin người dùng (ở đây là `id`).

## 3. Kiểm tra nếu payload không có id:

- Nếu `id` trong payload không tồn tại, có thể là token bị giả mạo, hoặc bị lỗi.
- Trả về mã lỗi 401 (Unauthorized).

## 4. Tìm người dùng với payload.id và refresh token:

- Chúng ta kiểm tra xem người dùng với `id` có tồn tại trong cơ sở dữ liệu không và nếu `refreshToken` có tồn tại trong danh sách các token của người dùng.
- Nếu không tìm thấy người dùng, token có thể đã bị lộ và sẽ cần phải bị vô hiệu hóa.

## 5. Xóa tất cả các token cũ và gửi phản hồi lỗi:

- Nếu không tìm thấy người dùng (hoặc nếu có sự xâm nhập), chúng ta xóa tất cả các token trong cơ sở dữ liệu của người dùng để bảo mật.

## 6. Tạo mới access token và refresh token:

- Nếu token hợp lệ và người dùng được xác thực, tạo ra một `accessToken` mới (hết hạn trong 15 phút) và một `refreshToken` mới (không có thời gian hết hạn).

## 7. Xóa token cũ và cập nhật người dùng:

- Loại bỏ `refreshToken` cũ khỏi danh sách tokens của người dùng và thêm `refreshToken` mới.
- Sau đó, lưu lại dữ liệu người dùng vào cơ sở dữ liệu.

## 8. Trả về token mới:

- Cuối cùng, gửi response về cho client chứa `accessToken` và `refreshToken` mới để client có thể sử dụng cho các yêu cầu tiếp theo.
