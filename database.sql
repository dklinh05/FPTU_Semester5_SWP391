CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- 1. Bảng Users
CREATE TABLE Users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    fullName VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(50),
    avatar VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    Lat DOUBLE,
    Lng DOUBLE,
    isActive BOOLEAN DEFAULT TRUE,
    isLocked BOOLEAN DEFAULT FALSE,
    address VARCHAR(255),
    rewardPoints INT DEFAULT 0,
    totalSpend DECIMAL(19, 2) DEFAULT 0.00,
    businessName VARCHAR(255),
    certification VARCHAR(255),
    totalRevenue DECIMAL(19, 2) DEFAULT 0.00,
    withdrawn DECIMAL(19, 2) DEFAULT 0.00,
    vehicle VARCHAR(100),
    licensePlate VARCHAR(50)
);

-- 2. Bảng Vouchers
CREATE TABLE Vouchers (
    voucherID INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discountType VARCHAR(20), -- 'AMOUNT' hoặc 'PERCENT'
    discountValue DECIMAL(10, 2),
    minOrderAmount DECIMAL(12, 2) DEFAULT 0.00,
    requiredPoints INT DEFAULT 0,
    maxUsage INT DEFAULT 1,
    expirationDate DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng Conversations
CREATE TABLE Conversations (
    ConversationID BIGINT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255),
    IsGroup BOOLEAN DEFAULT FALSE,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);



-- 4. Bảng Products
CREATE TABLE Products (
    productID INT AUTO_INCREMENT PRIMARY KEY,
    SupplierID INT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    price DECIMAL(19, 2),
    unit VARCHAR(50),
    origin VARCHAR(100),
    imageURL VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    stockQuantity INT DEFAULT 0,
    sales INT DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    rating DOUBLE DEFAULT 0.0,
    FOREIGN KEY (SupplierID) REFERENCES Users(userID)
);

-- 5. Bảng UserVouchers
CREATE TABLE UserVouchers (
    userVoucherID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    voucherID INT NOT NULL,
    isUsed BOOLEAN DEFAULT FALSE,
    redeemedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (voucherID) REFERENCES Vouchers(voucherID)
);

-- 6. Bảng OrderGroups
CREATE TABLE OrderGroups (
    orderGroupID INT AUTO_INCREMENT PRIMARY KEY,
    BuyerID INT,
    totalAmount DECIMAL(19, 2),
    discountAmount DECIMAL(19, 2),
    finalAmount DECIMAL(19, 2),
    status VARCHAR(50),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    userVoucherID INT,
    FOREIGN KEY (BuyerID) REFERENCES Users(userID),
    FOREIGN KEY (userVoucherID) REFERENCES UserVouchers(userVoucherID)
);

-- 7. Bảng Orders
CREATE TABLE Orders (
    orderID INT AUTO_INCREMENT PRIMARY KEY,
    BuyerID INT,
    SupplierID INT,
    ShipperID INT,
    orderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50),
    totalAmount DECIMAL(19, 2),
    orderGroupID INT,
    address VARCHAR(255),
    Lat DOUBLE,
    Lng DOUBLE,
    FOREIGN KEY (BuyerID) REFERENCES Users(userID),
    FOREIGN KEY (SupplierID) REFERENCES Users(userID),
    FOREIGN KEY (ShipperID) REFERENCES Users(userID),
    FOREIGN KEY (orderGroupID) REFERENCES OrderGroups(orderGroupID)
);

-- 8. Bảng OrderItems
CREATE TABLE OrderItems (
    orderItemID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    ProductID INT,
    quantity INT,
    price DECIMAL(19, 2),
    FOREIGN KEY (OrderID) REFERENCES Orders(orderID),
    FOREIGN KEY (ProductID) REFERENCES Products(productID)
);

-- 9. Bảng CartItems
CREATE TABLE CartItems (
    cartItemID INT AUTO_INCREMENT PRIMARY KEY,
    BuyerID INT,
    ProductID INT,
    quantity INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BuyerID) REFERENCES Users(userID),
    FOREIGN KEY (ProductID) REFERENCES Products(productID)
);

-- 10. Bảng Messages
CREATE TABLE Messages (
    MessageID BIGINT AUTO_INCREMENT PRIMARY KEY,
    ConversationID BIGINT NOT NULL,
    SenderID INT NOT NULL,
    Content TEXT NOT NULL,
    SentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsRead BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (ConversationID) REFERENCES Conversations(ConversationID),
    FOREIGN KEY (SenderID) REFERENCES Users(userID)
);

-- 11. Bảng ConversationParticipants
CREATE TABLE ConversationParticipants (
    participantId BIGINT AUTO_INCREMENT PRIMARY KEY,
    ConversationID BIGINT NOT NULL,
    UserID INT NOT NULL,
    Role ENUM('Admin', 'Member') DEFAULT 'Member',
    JoinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ConversationID) REFERENCES Conversations(ConversationID)
);

-- 12. Bảng Payments
CREATE TABLE Payments (
    paymentID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT UNIQUE,
    method VARCHAR(50),
    amount DECIMAL(19, 2),
    status VARCHAR(50),
    paymentDate DATETIME,
    FOREIGN KEY (OrderID) REFERENCES Orders(orderID)
);

-- 13. Bảng Shipments
CREATE TABLE Shipments (
    shipmentID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT UNIQUE,
    deliveryStatus VARCHAR(50),
    deliveryTime DATETIME,
    FOREIGN KEY (OrderID) REFERENCES Orders(orderID)
);


-- 14. Bảng ProductReviews
CREATE TABLE ProductReviews (
    reviewID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT,
    BuyerID INT,
    OrderID INT,
    productQuality INT,
    comment TEXT,
    sellerService INT,
    deliverySpeed INT,
    image TEXT,
    reviewDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ProductID) REFERENCES Products(productID),
    FOREIGN KEY (BuyerID) REFERENCES Users(userID),
    FOREIGN KEY (OrderID) REFERENCES Orders(orderID)
);

-- 15. Bảng OrderConfirmations
CREATE TABLE OrderConfirmations (
    confirmationID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    BuyerID INT,
    isSatisfied BOOLEAN,
    feedback TEXT,
    confirmedAt DATETIME,
    FOREIGN KEY (OrderID) REFERENCES Orders(orderID),
    FOREIGN KEY (BuyerID) REFERENCES Users(userID)
);

-- 16. Bảng withdraw_requests
CREATE TABLE withdraw_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    SupplierID INT,
    amountRequested DECIMAL(19, 2) NOT NULL,
    platformFee DECIMAL(19, 2),
    amountApproved DECIMAL(19, 2),
    status VARCHAR(50), -- PENDING, APPROVED, REJECTED
    requestDate DATETIME,
    processedDate DATETIME,
    bankName VARCHAR(255),
    bankAccountNumber VARCHAR(50),
    note TEXT,
    FOREIGN KEY (SupplierID) REFERENCES Users(userID)
);

-- 17. Bảng RoleUpgradeRequests
CREATE TABLE RoleUpgradeRequests (
    requestID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    requestedRole VARCHAR(50),
    businessName VARCHAR(255),
    certification VARCHAR(255),
    status VARCHAR(20) DEFAULT 'PENDING',
    adminNote TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewedAt DATETIME,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

-- 18. Các bảng còn lại (Notifications, VerificationToken, Return, Dispute, StatusLog)
CREATE TABLE Notifications (
    notificationID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    contentID INT,
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(50),
    isRead BOOLEAN DEFAULT FALSE,
    createdAt DATETIME,
    FOREIGN KEY (UserID) REFERENCES Users(userID)
);

CREATE TABLE VerificationToken (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    expiryDate DATETIME,
    FOREIGN KEY (user_id) REFERENCES Users(userID)
);

CREATE TABLE Returns (
    returnID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    BuyerID INT,
    reason TEXT,
    status VARCHAR(50),
    requestedAt DATETIME,
    FOREIGN KEY (OrderID) REFERENCES Orders(orderID),
    FOREIGN KEY (BuyerID) REFERENCES Users(userID)
);

CREATE TABLE Disputes (
    disputeID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    InitiatorID INT,
    RecipientID INT,
    initiatorRole VARCHAR(50),
    recipientRole VARCHAR(50),
    description TEXT,
    status VARCHAR(50),
    resolution TEXT,
    createdAt DATETIME,
    updatedAt DATETIME,
    FOREIGN KEY (OrderID) REFERENCES Orders(orderID),
    FOREIGN KEY (InitiatorID) REFERENCES Users(userID),
    FOREIGN KEY (RecipientID) REFERENCES Users(userID)
);

CREATE TABLE OrderStatusLogs (
    logID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    status VARCHAR(50),
    updatedAt DATETIME,
    note TEXT,
    FOREIGN KEY (OrderID) REFERENCES Orders(orderID)
);