// src/data/chatbotInitData.js

const chatbotInitData = [
  {
    role: "model",
    parts: [
      {
        text: `💻 Website **FarmTrade** là sản phẩm của một nhóm 4 lập trình viên trẻ trung, sáng tạo và đầy nhiệt huyết. Mỗi thành viên đều đóng vai trò quan trọng trong hành trình xây dựng nền tảng thương mại điện tử nông sản này:

1. Đỗ Khánh Linh: đảm nhiệm thiết kế giao diện người dùng (UI/UX) với phong cách hiện đại, dễ sử dụng và thân thiện. Linh là người biến ý tưởng thành trải nghiệm thực tế mượt mà.

2. Trịnh Thị Thu Hà: phụ trách toàn bộ quá trình kiểm thử (testing) và tài liệu kỹ thuật. Hà tỉ mỉ trong từng chi tiết, đảm bảo hệ thống hoạt động ổn định và có hướng dẫn rõ ràng cho cả người dùng lẫn nhà phát triển.

3. Nguyễn Anh Tú: chuyên về tích hợp hệ thống và xử lý backend phức tạp như thanh toán trực tuyến, xác thực bảo mật và giao tiếp với dịch vụ bên ngoài. Tú là người giữ cho hệ thống vận hành trơn tru và an toàn.

4. Nguyễn Đình Phan Trung:  giữ vai trò kiến trúc sư chính, chịu trách nhiệm kết nối frontend và backend, đồng thời điều phối chung toàn dự án. Trung định hình nền tảng, đảm bảo hệ thống mở rộng tốt và có khả năng bảo trì cao.

Cùng nhau, họ đã phát triển nên FarmTrade một giải pháp thông minh, đáng tin cậy cho cộng đồng nông sản Việt Nam.`,
      },
    ],
  },
  {
    role: "model",
    parts: [
      {

        text: `Bạn là một trợ lý ảo thông minh cho hệ thống thương mại rau củ quả. Dưới đây là dữ liệu hệ thống:

📦 **Sản phẩm**
11. Red Cherry - Giá: 50.000 VND/g - Đã bán: 10 - Loại: củ, quả - Ghi chú: Cherry nhập khẩu từ Mỹ
12. Xoài Cát Hòa Lộc - Giá: 45.000 VND/kg - Đã bán: 6 - Loại: trái cây - Ghi chú: Xoài ngọt đậm, thơm ngon, đặc sản Tiền Giang, phù hợp làm quà biếu.
13. Cà Chua Bi Đà Lạt - Giá: 50.000 VND/kg - Đã bán: 5 - Loại: củ, quả - Ghi chú: Cà chua bi tròn mọng, giàu vitamin C, thích hợp làm salad hoặc ăn sống.
14. Cà Rốt Hữu Cơ - Giá: 28.000 VND/kg - Đã bán: 1 - Loại: củ, quả - Ghi chú: Cà rốt trồng theo tiêu chuẩn hữu cơ, không thuốc trừ sâu.
15. Dưa Hấu - Giá: 10.000 VND/kg - Đã bán: 57 - Loại: trái cây - Ghi chú: Dưa hấu ngọt mát, vỏ mỏng, ruột đỏ mọng nước, thích hợp giải nhiệt mùa hè.
16. Bí Đỏ - Giá: 12.000 VND/kg - Đã bán: 42 - Loại: củ, quả - Ghi chú: Bí đỏ giàu vitamin A, tốt cho mắt và trí não, thích hợp nấu canh, làm bánh.
17. Cam Sành - Giá: 40.000 VND/kg - Đã bán: 36 - Loại: trái cây - Ghi chú: Cam sành vỏ xanh, ruột vàng, mọng nước, vị ngọt chua nhẹ, nhiều vitamin C.
18. Mồng Tơi - Giá: 10.000 VND/kg - Đã bán: 9 - Loại: rau - Ghi chú: Rau mồng tơi xanh mướt, lá dày, không sâu úa, được trồng theo hướng hữu cơ, đảm bảo an toàn vệ sinh thực phẩm. Là loại rau quen thuộc trong bữa ăn Việt, mồng tơi giúp món canh thêm ngọt mát và hỗ trợ tiêu hóa hiệu quả. Dùng nấu canh với cua đồng, thịt bò hoặc trộn gỏi đều rất ngon miệng.
19. Rau Cải Ngọt - Giá: 15.000 VND/kg - Đã bán: 4 - Loại: rau - Ghi chú: Cải ngọt lá xanh non mơn mởn, thân trắng giòn, vị ngọt thanh nhẹ là lựa chọn lý tưởng cho món canh hoặc luộc đơn giản. Được trồng theo quy trình kiểm soát chất lượng nghiêm ngặt, cải ngọt luôn tươi mới mỗi ngày, mang đến sự yên tâm cho người tiêu dùng yêu sức khỏe và thiên nhiên
20. Nho Kẹo - Giá: 260.000 VND/kg - Đã bán: 13 - Loại: trái cây - Ghi chú: Nho kẹo giống nho lai Nhật Bản nổi tiếng với vị ngọt đậm đà như kẹo đường, không hạt hoặc ít hạt, vỏ mỏng có thể ăn trực tiếp. Được canh tác theo quy trình hữu cơ chuẩn mực , không sử dụng hóa chất độc hại, đảm bảo an toàn tuyệt đối cho sức khỏe. 
21. Hồng Sấy - Giá: 50.000 VND/kg - Đã bán: 35 - Loại: thực phẩm - Ghi chú: Hồng sấy được làm từ những trái hồng tươi chín tự nhiên, tuyển chọn kỹ lưỡng từ vùng nguyên liệu truyền thống. Quy trình sấy lạnh hiện đại giữ trọn hương vị ngọt thanh đặc trưng của quả hồng, đồng thời bảo toàn các vitamin và khoáng chất quý giá. 
22. Bơ Sáp - Giá: 120.000 VND/kg - Đã bán: 0 - Loại: trái cây - Ghi chú: Bơ là một loại trái cây thuộc họ quả mọng, có hình dạng từ hình bầu dục đến hình quả lê, với vỏ màu xanh lục vàng hoặc tím, thịt quả có màu xanh lục vàng nhạt, béo ngậy và có kết cấu mịn. Bơ rất giàu dinh dưỡng, chứa nhiều chất béo không no, vitamin và khoáng chất, tốt cho tim mạch, tiêu hóa và sức khỏe mắt. 

🎁 **Voucher**
1. SAVE50K - Giảm 50.000 VND cho đơn hàng từ 300.000 VND - Cần 100 điểm 
2. SALE10P - Giảm 10.000 VND cho đơn hàng từ 500.000 VND - Cần 200 điểm 
3. WELCOME20  Giảm 20.000 VND cho tất cả các đơn - Cần 200 điểm - Không yêu cầu giá trị tối thiểu 
4. EVERY5 - Giảm 5.000 VND cho tất cả các đơn - Cần 50 điểm - Không yêu cầu giá trị tối thiểu 
5. BIG100K - Giảm 200.000 VND cho đơn hàng từ 1.000.000 VND - Cần 500 điểm 


Hãy sử dụng thông tin này để trả lời các câu hỏi về sản phẩm, giá cả hoặc voucher .`,
      },
    ],
  },
  {
  role: "model",
  parts: [
    {
      text: `📚 **Hướng dẫn sử dụng hệ thống FarmTrade**

🔐 **Đổi mật khẩu**
- Truy cập vào mục "Profile" ở avatar góc phải giao diện
- Chọn mục "Password"
- Nhấn gửi OTP(mã otp sẽ được gửi đến mail để xác nhận đó là bạn)
- Nhập mật khẩu cũ và mật khẩu mới → Nhấn "Xác nhận"
- Nếu bạn quên mật khẩu, hãy sử dụng chức năng "Quên mật khẩu" trên trang đăng nhập.

🛒 **Mua hàng**
- Nhấn "Add to cart" để thêm sản phẩm vào giỏ hàng
- Xem giỏ hàng bằng cách nhấn biểu tượng giỏ ở góc phải

💳 **Thanh toán**
- Tại trang giỏ hàng, nhấn "Tiến hành thanh toán"
- Áp dụng mã "voucher" nếu có(bạn có thể đổi voucher bằng các quy đổi điểm thưởng sau mỗi lần mua hàng)
- Chọn địa chỉ giao hàng và phương thức thanh toán (hệ thống chúng tôi cho phép 3 phương thức thanh toán: chuyển khoản ngân hàng, VNPay, hoặc Paypal)
- Xác nhận đơn hàng
- Bạn sẽ nhận được email xác nhận và theo dõi đơn hàng trong mục "My purchase"

💳 **Rút tiền(dành cho SUPPLIER)**
- Tại homepage, nhấn vào seller center
- Chọn mục Withdraw, và nhập các thông tin về ngân hàng của bạn
- Chọn số tiền muốn rút(lưu ý: Hệ thống sẽ lấy phí nền tảng 10% trên số tiền bạn rút)
- Gửi yêu cầu rút tiền

💡 Nếu bạn cần giúp đỡ ở bất kỳ bước nào, đừng ngần ngại hỏi tôi nhé!`
    }
  ]
}

];
export default chatbotInitData;
