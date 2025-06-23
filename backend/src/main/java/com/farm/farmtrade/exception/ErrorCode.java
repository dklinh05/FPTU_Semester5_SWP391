package com.farm.farmtrade.exception;

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error"),
    INVALID_KEY(1001, "Uncategorized error"),
    USER_EXISTED(1002, "User existed"),
    USERNAME_INVALID(1003, "Username must be at least 3 characters"),
    INVALID_PASSWORD(1004, "Password must be at least 8 characters"),
    UNAUTHENTICATED(1006, "Unauthenticated"),
    USER_UNEXISTED(1007, "User does not exist!"),
    FILE_UPLOAD_FAILED(1014, "Lỗi khi upload file"),
    UNSUPPORTED_MEDIA_TYPE(1015, "Kiểu dữ liệu không được hỗ trợ"),
    REQUEST_NOT_FOUND(1017, "Yêu cầu không tồn tại");
    // <-- THÊM DÒNG NÀY

    ;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    private int code;
    private String message;

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
