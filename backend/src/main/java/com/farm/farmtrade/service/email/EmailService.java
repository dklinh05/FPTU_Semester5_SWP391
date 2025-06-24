package com.farm.farmtrade.service.email;


import com.farm.farmtrade.entity.Order;
import com.farm.farmtrade.entity.OrderItem;
import com.farm.farmtrade.entity.Product;
import com.farm.farmtrade.enums.NotificationType;
import com.farm.farmtrade.repository.OrderItemRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private OrderItemRepository orderItemRepository;


    public void sendVerificationEmail(String toEmail, String userName, String token) throws MessagingException {
        String verifyUrl = "http://localhost:8080/farmtrade/auth/verify?token=" + token;
        String htmlContent = buildVerificationEmail(userName, verifyUrl);

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setSubject("Please verify your account!");
        helper.setFrom("farmtrade43@gmail.com");
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }

    public void sendResetPasswordEmail(String toEmail, String userName, String token) throws MessagingException {
        String resetUrl = "http://localhost:8080/farmtrade/auth/reset-password?token=" + token;
        String htmlContent = buildResetPasswordEmail(userName, resetUrl);

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setSubject("Reset your password");
        helper.setFrom("farmtrade43@gmail.com");
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }

    public void sendResetOTP(String toEmail, String userName, String token) throws MessagingException {
        String resetUrl = token;
        String htmlContent = buildOTPEmail(userName, resetUrl);

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setSubject("Reset your password");
        helper.setFrom("farmtrade43@gmail.com");
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }

    public void sendOrderPaymentSuccessEmail(String toEmail, String userName, Integer orderGroupId, BigDecimal amountPaid, List<Order> orders) throws MessagingException {
        String htmlContent = buildOrderPaymentSuccessEmail(userName, orderGroupId, amountPaid, orders);

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setSubject(NotificationType.ORDER_CONFIRMED.getMessage());
        helper.setFrom("farmtrade43@gmail.com");
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }


    private String buildVerificationEmail(String userName, String verifyUrl) {
        String template = """
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2 style="color: #2e6da4;">Chào %s,</h2>
            <p>Bạn đã đăng ký tài khoản thành công tại hệ thống của chúng tôi.</p>
            <p>Vui lòng nhấn vào nút bên dưới để xác minh email và kích hoạt tài khoản:</p>
            <a href='%s'
               style='display: inline-block; padding: 10px 20px; background-color: #28a745; color: white;
                      text-decoration: none; border-radius: 5px; margin-top: 10px;'>
               Xác minh tài khoản
            </a>
            <p style='margin-top: 20px;'>Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.</p>
            <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
        </div>
        """;
        return String.format(template, userName, verifyUrl);
    }

    private String buildResetPasswordEmail(String userName, String resetUrl) {
        String template = """
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2 style="color: #2e6da4;">Chào %s,</h2>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
            <p>Vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
            <a href='%s'
               style='display: inline-block; padding: 10px 20px; background-color: #dc3545; color: white;
                      text-decoration: none; border-radius: 5px; margin-top: 10px;'>
               Đặt lại mật khẩu
            </a>
            <p style='margin-top: 20px;'>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
            <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
        </div>
        """;
        return String.format(template, userName, resetUrl);
    }

    private String buildOTPEmail(String userName, String otp) {
        String template = """
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2 style="color: #2e6da4;">Chào %s,</h2>
            <p>Bạn đã yêu cầu đổi mật khẩu cho tài khoản của mình.</p>
            <p>Đây là mã OTP của bạn:</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                <h1 style="color: #28a745; letter-spacing: 5px; font-size: 32px;">%s</h1>
            </div>
            <p>Mã OTP này sẽ hết hạn sau 5 phút.</p>
            <p>Nếu bạn không yêu cầu đổi mật khẩu, hãy bỏ qua email này.</p>
            <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
        </div>
        """;
        return String.format(template, userName, otp);
    }

    private String buildOrderPaymentSuccessEmail(String userName, Integer orderGroupId, BigDecimal amountPaid, List<Order> orders) {
        StringBuilder productDetails = new StringBuilder();

        for (Order order : orders) {
            productDetails.append("<p><strong>Nhà cung cấp:</strong> ").append(order.getSupplier().getFullName()).append("</p>");
            productDetails.append("<ul>");
            List<OrderItem> orderItemList= orderItemRepository.findByOrderOrderID(order.getOrderID());
            for (OrderItem item : orderItemList) {
                Product product = item.getProduct();
                productDetails.append("<li>")
                        .append(product.getName())
                        .append(" - SL: ").append(item.getQuantity())
                        .append(" - Đơn giá: ").append(String.format("%,.0f", product.getPrice()))
                        .append(" VND</li>");
            }
            productDetails.append("</ul>");
        }

        String template = """
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2 style="color: #28a745;">Xin chào %s,</h2>
        <p>Bạn đã thanh toán thành công cho đơn hàng nhóm <strong>#%d</strong>.</p>
        <p>Số tiền đã thanh toán: <strong>%,.0f VND</strong></p>
        <p>Chi tiết sản phẩm:</p>
        %s
        <p>Chúng tôi sẽ sớm xử lý và giao hàng cho bạn trong thời gian sớm nhất.</p>
        <p>Cảm ơn bạn đã sử dụng dịch vụ FarmTrade!</p>
        <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
    </div>
    """;

        return String.format(template, userName, orderGroupId, amountPaid, productDetails.toString());
    }

}
