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
3. Khoai tây sạch - Giá: 20.000 VND/kg - Đã bán: 55 - Loại: củ - Ghi chú: không hóa chất
4. Banana - Giá: 20.000 VND/kg - Đã bán: 10 - Loại: trái cây - Ghi chú: Africa Banana
5. Khoai lang thang - Giá: 100.000 VND/kg - Đã bán: 4 - Loại: thực phẩm - Ghi chú: sấy giòn
6. Dưa Hấu - Giá: 10.000 VND/kg - Đã bán: 10 - Loại: trái cây - Ghi chú: Dưa hấu tươi ngon, ruột đỏ mọng nước, vị ngọt thanh mát, thích hợp giải khát trong ngày hè. Trồng theo phương pháp tự nhiên, đảm bảo an toàn và chất lượng.
7. Cà rốt Đà Lạt - Giá: 15.000 VND/kg - Đã bán: 3 - Loại: củ, quả - Ghi chú: giàu beta-carotene
8. Cam Sành - Giá: 40.000 VND/kg - Đã bán: 2 - Loại: trái cây - Ghi chú: Cam sành mọng nước, vị ngọt xen lẫn chút chua nhẹ. Thích hợp làm nước ép hoặc ăn tươi, cung cấp nhiều vitamin C.
9. Bí đỏ - Giá: 25.000 VND/kg - Đã bán: 30 - Loại: củ, quả - Ghi chú: Bí đỏ chín già, ruột vàng đậm, dẻo bùi, giàu dinh dưỡng. Phù hợp nấu canh, cháo hoặc hấp.
10. Cải Thìa - Giá: 49.000 VND/kg - Đã bán: 1 - Loại: rau - Ghi chú: Cải thìa có lá xanh mướt, thân trắng giòn, vị ngọt nhẹ và dễ ăn. Thường được dùng trong món xào, luộc hoặc nấu canh thanh mát. Rau chứa nhiều vitamin A, C và chất xơ, tốt cho tiêu hóa.


🎁 **Voucher**
1. SAVE50K - Giảm 50.000 VND cho đơn hàng từ 300.000 VND - Cần 100 điểm 
2. SALE10P - Giảm 10.000 VND cho đơn hàng từ 500.000 VND - Cần 200 điểm 
3. WELCOME20  Giảm 20.000 VND cho đơn hàng đầu tiên - Cần 1000 điểm - Không yêu cầu giá trị tối thiểu 
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

💡 Nếu bạn cần giúp đỡ ở bất kỳ bước nào, đừng ngần ngại hỏi tôi nhé!`
    }
  ]
}
  
  
];
export default chatbotInitData;
