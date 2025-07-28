import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Camera, X } from "lucide-react";
import {
    submitReview,
    updateReview,
    getReviewDetail,
} from "../../services/feedbackService";
import styles from "./ReviewModal.module.scss";
import {toast} from "react-toastify";
import { useUser } from "../../context/UserContext";
const starTooltips = ["Tệ", "Không hài lòng", "Bình thường", "Tốt", "Xuất sắc"];

const renderStars = (
    value,
    setValue,
    hoveredIndex,
    setHoveredIndex,
    type,
    readOnly = false
) =>
    Array.from({ length: 5 }, (_, i) => (
        <span
            key={i}
            className={`${styles.star} ${i < value ? styles.active : ""}`}
            onClick={() => {
                if (!readOnly) {
                    setValue(i + 1);
                    setHoveredIndex(i);
                    setTimeout(() => setHoveredIndex(null), 2000);
                }
            }}
            style={{ position: "relative", cursor: readOnly ? "default" : "pointer" }}
        >
      ★
            {hoveredIndex === i && !readOnly && (
                <div className={styles.tooltip}>{starTooltips[i]}</div>
            )}
    </span>
    ));
function ReviewModal({ show, onHide, product, onSuccess }) {
    const [productQuality, setProductQuality] = useState(0);
    const [sellerService, setSellerService] = useState(0);
    const [deliverySpeed, setDeliverySpeed] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [reviewId, setReviewId] = useState(null);
    const [hoveredQuality, setHoveredQuality] = useState(null);
    const [hoveredService, setHoveredService] = useState(null);
    const [hoveredDelivery, setHoveredDelivery] = useState(null);
    const maxImages = 5;
    const isViewOnly = product?.isViewOnly;
    const { setPoints } = useUser();
    useEffect(() => {
        const loadReviewData = async () => {
            if (product?.isEdit) {
                try {
                    const res = await getReviewDetail(product.productId, product.orderId);
                    setReviewId(res.reviewID);
                    setProductQuality(res.productQuality);
                    setSellerService(res.sellerService);
                    setDeliverySpeed(res.deliverySpeed);
                    setComment(res.comment);
                    setOldImages(res.imageList || []);
                } catch (err) {
                }
            }
        };

        if (show) {
            loadReviewData();
        } else {
            setProductQuality(0);
            setSellerService(0);
            setDeliverySpeed(0);
            setComment("");
            setImages([]);
            setOldImages([]);
            setReviewId(null);
            setHoveredQuality(null);
            setHoveredService(null);
            setHoveredDelivery(null);
        }
    }, [show, product]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const total = [...images, ...files].slice(0, maxImages);
        setImages(total);
    };

    const removeImage = (idx) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("productQuality", productQuality);
        formData.append("sellerService", sellerService);
        formData.append("deliverySpeed", deliverySpeed);
        formData.append("comment", comment);
        images.forEach((file) => formData.append("image", file));

        try {
            if (product.isEdit && reviewId) {
                await updateReview(reviewId, formData);
                toast.success("Cập nhật đánh giá thành công!");
            } else {
                formData.append("orderId", product.orderId);
                const response = await submitReview(product.productId, formData);

                if (response?.newPoints !== undefined) {
                    setPoints(response.newPoints);
                }
                toast.success("Đánh giá thành công!");
            }

            onHide();
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi đánh giá.");
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {isViewOnly
                        ? "Xem đánh giá"
                        : product.isEdit
                            ? "Chỉnh sửa đánh giá"
                            : "Đánh giá sản phẩm"}
                    : {product.productName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={styles.reviewForm}>
                    <div className={styles.section}>
                        <label>Chất lượng sản phẩm</label>
                        {renderStars(
                            productQuality,
                            setProductQuality,
                            hoveredQuality,
                            setHoveredQuality,
                            "productQuality",
                            isViewOnly
                        )}
                    </div>

                    <div className={styles.section}>
                        <label>Ảnh đã tải lên</label>
                        <div className={styles.imageWrapper}>
                            {oldImages.map((url, idx) => (
                                <div className={styles.imageBox} key={idx}>
                                    <img src={url} alt="uploaded" className={styles.previewImg} />
                                </div>
                            ))}

                            {images.map((img, idx) => (
                                <div className={styles.imageBox} key={`new-${idx}`}>
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt="preview"
                                        className={styles.previewImg}
                                    />
                                    <span
                                        className={styles.removeBtn}
                                        onClick={() => !isViewOnly && removeImage(idx)}
                                        style={{ display: isViewOnly ? "none" : "inline" }}
                                    >
                    <X size={14} />
                  </span>
                                </div>
                            ))}

                            {!isViewOnly &&
                                images.length + oldImages.length < maxImages && (
                                    <label className={styles.uploadBox}>
                                        <Camera />
                                        <span>
                      {images.length + oldImages.length}/{maxImages}
                    </span>
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
                            placeholder="Mô tả chi tiết trải nghiệm của bạn..."
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={isViewOnly}
                        />
                    </Form.Group>

                    <div className={styles.section}>
                        <label>Dịch vụ người bán</label>
                        {renderStars(
                            sellerService,
                            setSellerService,
                            hoveredService,
                            setHoveredService,
                            "sellerService",
                            isViewOnly
                        )}
                    </div>

                    <div className={styles.section}>
                        <label>Tốc độ giao hàng</label>
                        {renderStars(
                            deliverySpeed,
                            setDeliverySpeed,
                            hoveredDelivery,
                            setHoveredDelivery,
                            "deliverySpeed",
                            isViewOnly
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    {isViewOnly ? "Đóng" : "Hủy"}
                </Button>
                {!isViewOnly && (
                    <Button variant="primary" onClick={handleSubmit}>
                        {product.isEdit ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default ReviewModal;
