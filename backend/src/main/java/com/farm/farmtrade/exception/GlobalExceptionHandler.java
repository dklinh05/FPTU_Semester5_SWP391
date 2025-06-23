package com.farm.farmtrade.exception;


import com.farm.farmtrade.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse> handlingUncategorizedException(Exception exception){
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiResponse.setMessage(exception.getMessage());
        return ResponseEntity.status(500).body(apiResponse);
    }


    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handlingAppException(AppException exception){
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse apiResponse = new ApiResponse();

        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(RuntimeException.class)
    ResponseEntity<ApiResponse> handlingRuntimeException(RuntimeException exception) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(ErrorCode.FILE_UPLOAD_FAILED.getCode());
        apiResponse.setMessage(exception.getMessage());
        return ResponseEntity.status(500).body(apiResponse);
    }
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiResponse> handleUnsupportedMediaType(HttpMediaTypeNotSupportedException ex) {
        ApiResponse response = new ApiResponse();
        response.setCode(ErrorCode.UNSUPPORTED_MEDIA_TYPE.getCode());
        response.setMessage(ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(response);
    }

}




//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    ResponseEntity<ApiResponse> handlingValidation(MethodArgumentNotValidException exception) {
//        String enumKey = exception.getFieldError().getDefaultMessage();
//        ErrorCode errorCode = ErrorCode.INVALID_KEY;
//
//        try {
//            errorCode = ErrorCode.valueOf(enumKey);
//        } catch (IllegalArgumentException e) {
//            // Nếu enum không tồn tại, giữ nguyên INVALID_KEY
//        }
//
//        ApiResponse apiResponse = new ApiResponse();
//        apiResponse.setCode(errorCode.getCode());
//        apiResponse.setMessage(errorCode.getMessage());
//
//        return ResponseEntity.badRequest().body(apiResponse);
//    }
//    @ExceptionHandler(value = MethodArgumentNotValidException.class)
//    ResponseEntity<String> handlingMethodArgumentNotValidExceptionHandler(MethodArgumentNotValidException exception) {
//        return ResponseEntity.badRequest().body(exception.getFieldError().getDefaultMessage());
//    }
//    ResponseEntity<ApiResponse> handlingValidation(MethodArgumentNotValidException exception){
//        String enumKey = exception.getFieldError().getDefaultMessage();
//        ErrorCode errorCode = ErrorCode.INVALID_KEY;
//
//        try {
//            errorCode = ErrorCode.valueOf(enumKey);
//        } catch (IllegalArgumentException e) {}
//
//        ApiResponse apiResponse = new ApiResponse();
//        apiResponse.setCode(errorCode.getCode());
//        apiResponse.setMessage(errorCode.getMessage());
//
//        return ResponseEntity.badRequest().body(apiResponse);
//    }

//    @ExceptionHandler(value = Exception.class)
//    ResponseEntity<ApiResponse> handlingRuntimeException(RuntimeException exception){
//        ApiResponse apiResponse = new ApiResponse();
//
//        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
//        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());
//
//        return ResponseEntity.badRequest().body(apiResponse);
//    }