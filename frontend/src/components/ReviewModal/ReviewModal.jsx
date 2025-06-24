import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Camera } from "lucide-react";
import { submitReview } from "../../services/feedbackService";
import styles from "./ReviewModal.module.scss";
import selectedImages from "lodash";

const renderStars = (value, setValue) =>
    Array.from({ length: 5 }, (_, i) => (
        <span
            key={i}
            className={`${styles.star} ${i < value ? styles.active : ""}`}
            onClick={() => setValue(i + 1)}
        >
      ★
    </span>
    ));

function ReviewModal({ show, onHide, product, onSuccess }) {
    const [productQuality, setProductQuality] = useState(0);
    const [sellerService, setSellerService] = useState(0);
    const [deliverySpeed, setDeliverySpeed] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState([]);
    const maxImages = 5;

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length <= maxImages) {
            setImages((prev) => [...prev, ...files]);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("productQuality", productQuality);
        formData.append("sellerService", sellerService);
        formData.append("deliverySpeed", deliverySpeed);
        formData.append("comment", comment);
        formData.append("orderId", product.orderId);
        selectedImages.slice(0, 5).forEach(file => {
            formData.append("image[]", file);
        });

        try {
            await submitReview(product.productId, formData);
            alert("Đánh giá thành công!");
            onHide();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            alert("Lỗi khi gửi đánh giá.");
        }
    };

    useEffect(() => {
        if (!show) {
            setProductQuality(0);
            setSellerService(0);
            setDeliverySpeed(0);
            setComment("");
            setImages([]);
        }
    }, [show]);

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Đánh giá sản phẩm: {product.productName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={styles.reviewForm}>
                    <div className={styles.section}>
                        <label>Product quality</label>
                        {renderStars(productQuality, setProductQuality)}
                    </div>
                    <div className={styles.section}>
                        <label>Upload images</label>
                        <div className={styles.imageWrapper}>
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={URL.createObjectURL(img)}
                                    alt="preview"
                                    className={styles.previewImg}
                                />
                            ))}
                            {images.length < maxImages && (
                                <label className={styles.uploadBox}>
                                    <Camera />
                                    <span>{images.length}/5</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        hidden
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Control
                            as="textarea"
                            placeholder="Description"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </Form.Group>
                    <div className={styles.section}>
                        <label>Seller service</label>
                        {renderStars(sellerService, setSellerService)}
                    </div>
                    <div className={styles.section}>
                        <label>Delivery speed</label>
                        {renderStars(deliverySpeed, setDeliverySpeed)}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Gửi đánh giá
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ReviewModal;
