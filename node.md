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

# `/sign-up`

1. Đọc dữ liệu đầu vào: tên, email, mật khẩu.
2. Xác thực dữ liệu có hợp lệ hay không.
3. Gửi lỗi nếu không hợp lệ.
4. Kiểm tra xem chúng ta đã có tài khoản với người dùng giống vậy chưa.
5. Gửi lỗi nếu có, nếu không thì tạo tài khoản mới và lưu người dùng vào cơ sở dữ liệu.
6. Tạo và lưu mã xác minh.
7. Gửi liên kết xác minh với mã xác minh đến email đăng ký.
8. Gửi thông báo yêu cầu kiểm tra hộp thư đến.

# `/verify`

1. Đọc dữ liệu: id và token
2. Tìm token trong cơ sở dữ liệu (sử dụng id của người sở hữu).
3. Gửi lỗi nếu không tìm thấy token.
4. Kiểm tra token có hợp lệ hay không (vì chúng ta có giá trị đã mã hóa).
5. Nếu không hợp lệ, gửi lỗi; nếu hợp lệ, cập nhật trạng thái người dùng là đã xác minh.
6. Xóa token khỏi cơ sở dữ liệu.
7. Gửi thông báo thành công.

# `/sign-in`

1. Đọc dữ liệu: email và mật khẩu
2. Tìm người dùng với email đã cung cấp.
3. Gửi lỗi nếu không tìm thấy người dùng.
4. Kiểm tra xem mật khẩu có hợp lệ không.
5. Nếu mật khẩu không hợp lệ, gửi lỗi; nếu hợp lệ, tạo mã truy cập và mã làm mới.
6. Lưu mã làm mới vào cơ sở dữ liệu.
7. Gửi cả hai mã cho người dùng.

# `/profile`

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

# `/verify-token`

1. Kiểm tra xem người dùng đã được xác thực hay chưa.
2. Xóa token cũ (nếu có).
3. Tạo/lưu token mới và gửi phản hồi lại cho người dùng.

# `/refresh-token`

1. Đọc và xác thực refresh token.
2. Tìm người dùng với payload.id và refresh token.
3. Nếu refresh token hợp lệ nhưng không tìm thấy người dùng, token đã bị lộ.
4. Xóa tất cả các token cũ và gửi phản hồi lỗi.
5. Nếu token hợp lệ và người dùng được tìm thấy, tạo mới refresh token và access token.
6. Xóa token cũ, cập nhật người dùng và gửi token mới.

# `/sign-out`

1. Remove the refresh token
