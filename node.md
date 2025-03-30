## Auth Routes

```
authRouter.post("/sign-up");
authRouter.post("/verify");
authRouter.post("/sign-in");
authRouter.post("/refresh-token");
authRouter.post("/sign-out");
authRouter.get("/profile");
authRouter.get("/profile/:id");
authRouter.post("/verify-token");
authRouter.post("/update-avatar");
authRouter.post("/update-profile");
authRouter.post("/forget-pass");
authRouter.post("/verify-pass-reset-token");
authRouter.post("/reset-pass");
```

- `/sign-up`

1. Đọc dữ liệu đầu vào: tên, email, mật khẩu.
2. Xác thực dữ liệu có hợp lệ hay không.
3. Gửi lỗi nếu không hợp lệ.
4. Kiểm tra xem chúng ta đã có tài khoản với người dùng giống vậy chưa.
5. Gửi lỗi nếu có, nếu không thì tạo tài khoản mới và lưu người dùng vào cơ sở dữ liệu.
6. Tạo và lưu mã xác minh.
7. Gửi liên kết xác minh với mã xác minh đến email đăng ký.
8. Gửi thông báo yêu cầu kiểm tra hộp thư đến.

- `/verify`

1. Đọc dữ liệu: id và token
2. Tìm token trong cơ sở dữ liệu (sử dụng id của người sở hữu).
3. Gửi lỗi nếu không tìm thấy token.
4. Kiểm tra token có hợp lệ hay không (vì chúng ta có giá trị đã mã hóa).
5. Nếu không hợp lệ, gửi lỗi; nếu hợp lệ, cập nhật trạng thái người dùng là đã xác minh.
6. Xóa token khỏi cơ sở dữ liệu.
7. Gửi thông báo thành công.

- `/sign-in`

1. Đọc dữ liệu: email và mật khẩu
2. Tìm người dùng với email đã cung cấp.
3. Gửi lỗi nếu không tìm thấy người dùng.
4. Kiểm tra xem mật khẩu có hợp lệ không.
5. Nếu mật khẩu không hợp lệ, gửi lỗi; nếu hợp lệ, tạo mã truy cập và mã làm mới.
6. Lưu mã làm mới vào cơ sở dữ liệu.
7. Gửi cả hai mã cho người dùng.

- `/profile`

1. Đọc header xác thực (authorization header)
2. Kiểm tra xem ta có token không.
3. Gửi lỗi nếu không có token.
4. Xác thực token (ta phải sử dụng jwt.verify).
5. Lấy id người dùng từ token (ta sẽ có nó dưới dạng payload).
6. Kiểm tra xem ta có người dùng với id này không.
7. Gửi lỗi nếu không tìm thấy người dùng.
8. Gắn thông tin người dùng vào đối tượng req.
9. Gọi hàm next().
10. Xử lý lỗi cho các token đã hết hạn.

- `/verify-token`

1. Kiểm tra xem người dùng đã được xác thực hay chưa.
2. Xóa token cũ (nếu có).
3. Tạo/lưu token mới và gửi phản hồi lại cho người dùng.

- `/refresh-token`

1. Đọc và xác thực refresh token.
2. Tìm người dùng với payload.id và refresh token.
3. Nếu refresh token hợp lệ nhưng không tìm thấy người dùng, token đã bị lộ.
4. Xóa tất cả các token cũ và gửi phản hồi lỗi.
5. Nếu token hợp lệ và người dùng được tìm thấy, tạo mới refresh token và access token.
6. Xóa token cũ, cập nhật người dùng và gửi token mới.

- `/sign-out`

1. Remove the refresh token

- `/forget-pass`

1. Yêu cầu email của người dùng.
2. Tìm người dùng với email đã cung cấp.
3. Gửi lỗi nếu không có người dùng.
4. Nếu có người dùng, tạo mã reset mật khẩu (xóa nếu có mã nào trước đó).
5. Tạo liên kết reset mật khẩu (giống như cách chúng ta đã làm với xác minh).
6. Gửi liên kết vào email của người dùng.
7. Gửi phản hồi trở lại.

- `/verify-pass`

1. Đọc mã token và id.
2. Tìm mã token trong cơ sở dữ liệu với id của chủ sở hữu.
3. Nếu không có mã token, gửi lỗi.
4. Nếu có mã token, so sánh với giá trị đã được mã hóa.
5. Nếu không trùng khớp, gửi lỗi.
6. Nếu trùng khớp, gọi hàm tiếp theo.

- `/reset-pass`

1. Đọc id người dùng, mã reset mật khẩu và mật khẩu.
2. Xác thực tất cả các thông tin này.
3. Nếu hợp lệ, tìm người dùng với id đã cung cấp.
4. Kiểm tra xem người dùng có sử dụng mật khẩu cũ không.
5. Nếu không có người dùng hoặc người dùng đang sử dụng mật khẩu cũ, gửi lỗi.
6. Nếu không, cập nhật mật khẩu mới.
7. Xóa mã reset mật khẩu.
8. Gửi email xác nhận.
9. Gửi phản hồi trở lại.

- `/update-profile`

1. Người dùng phải đăng nhập (đã xác thực).
2. Tên phải hợp lệ.
3. Tìm người dùng và cập nhật tên.
4. Gửi lại hồ sơ mới.

- `/update-avatar`

1. Người dùng phải đăng nhập.
2. Đọc file được gửi lên.
3. Kiểu file phải là hình ảnh.
4. Kiểm tra xem người dùng đã có avatar hay chưa.
5. Nếu có, thì xóa avatar cũ.
6. Tải avatar mới lên và cập nhật người dùng.
7. Gửi phản hồi lại.

## Product Routes

```
productRouter.post("/list");
productRouter.patch("/:id");
productRouter.delete("/:id");
productRouter.delete("/image/:productId/:imageId");
productRouter.get("/:id");
productRouter.get("/by-category/:category");
productRouter.get("/latest");
productRouter.get("/listings");

```

- `/create`

1. Người dùng phải được xác thực.
2. Người dùng có thể tải lên hình ảnh.
3. Xác thực dữ liệu đến.
4. Xác thực và tải lên tệp (hoặc tệp) - lưu ý (giới hạn số lượng hình ảnh).
5. Tạo sản phẩm.
6. Gửi phản hồi trở lại.

- `/:id (update to product by id)`

1. Người dùng phải được xác thực.
2. Người dùng cũng có thể tải lên hình ảnh.
3. Xác thực dữ liệu đầu vào.
4. Cập nhật các thuộc tính thông thường.
5. Tải lên và cập nhật hình ảnh (giới hạn số lượng ảnh).
6. Gửi phản hồi trở lại.

- `/:id (delete single product)`

1. Người dùng phải được xác thực.
2. Xác thực ID của sản phẩm.
3. Chỉ xóa nếu sản phẩm được tạo bởi chính người dùng đó.
4. Xóa luôn các hình ảnh liên quan.
5. Gửi phản hồi trở lại.

- `/:id (delete only images)`

1. Người dùng phải được xác thực.
2. Xác thực ID của sản phẩm.
3. Xoá ảnh khỏi database (chỉ nếu người dùng là người đã tạo sản phẩm).
4. Xoá ảnh khỏi Cloudinary nữa.
5. Gửi phản hồi trở lại.

- `/:id (get details)`

1. Người dùng phải được xác thực (tuỳ chọn).
2. Xác thực ID của sản phẩm.
3. Tìm sản phẩm theo ID.
4. Định dạng lại dữ liệu.
5. Gửi phản hồi trở lại.

- `/by-category/:category`

1. Người dùng phải được xác thực (tuỳ chọn).
2. Xác thực danh mục.
3. Tìm sản phẩm theo danh mục (áp dụng phân trang nếu cần).
4. Định dạng lại dữ liệu.
5. Gửi phản hồi trở lại.
