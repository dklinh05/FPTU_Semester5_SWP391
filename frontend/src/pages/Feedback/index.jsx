import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import styles from "./Feedback.module.scss";
import { Camera } from "lucide-react";

function Feedback() {
    const location = useLocation();
    const productId = location.state?.productId;

    const [productQuality, setProductQuality] = useState(0);
    const [sellerService, setSellerService] = useState(0);
    const [deliverySpeed, setDeliverySpeed] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState([]);
    const maxImages = 5;

    const rawToken = localStorage.getItem("token") || "";

    const accessToken = rawToken.startsWith("Bearer ")
        ? rawToken
        : `Bearer ${rawToken}`;

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > maxImages) return;
        setImages((prev) => [...prev, ...files]);
    };

    const handleSubmit = async () => {
        if (!productId) {
            alert("Product ID not found.");
            return;
        }

        const formData = new FormData();
        formData.append("productQuality", productQuality);
        formData.append("sellerService", sellerService);
        formData.append("deliverySpeed", deliverySpeed);
        formData.append("comment", comment);
        images.forEach((img) => formData.append("images", img));

        try {
            await axios.post(`/reviews?productId=${productId}`, formData, {
                headers: {
                    Authorization: accessToken,
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Review submitted successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to submit review.");
        }
    };

    const [tooltipIndexQuality, setTooltipIndexQuality] = useState(null);
    const [tooltipIndexService, setTooltipIndexService] = useState(null);
    const [tooltipIndexDelivery, setTooltipIndexDelivery] = useState(null);
    const [timeoutQuality, setTimeoutQuality] = useState(null);
    const [timeoutService, setTimeoutService] = useState(null);
    const [timeoutDelivery, setTimeoutDelivery] = useState(null);
    const renderStars = (
        value, setValue, tooltips,
        tooltipIndex, setTooltipIndex,
        timeout, timeoutSetter
    ) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                className={`${styles.star} ${i < value ? styles.active : ""}`}
                onClick={() => {
                    setValue(i + 1);
                    setTooltipIndex(i);

                    //Clear old timeout
                    if (timeout) {
                        clearTimeout(timeout);
                    }

                    const timeoutId = setTimeout(() => {
                        setTooltipIndex(null);
                    }, 2000);

                    timeoutSetter(timeoutId);
                }}
                style={{ position: "relative" }}
            >
            ★
                {tooltipIndex === i && (
                    <span className={styles.tooltip}>{tooltips[i]}</span>
                )}
        </span>
        ));
    };

    return (
        <div className={styles.container}>
            {/* Value của đơn hàng sẽ cập nhật sau*/}
            <hr className={styles.section} />

            <div>
                <label className={styles.label}>Product quality</label>
                {renderStars(
                    productQuality, setProductQuality,
                    ["Poor", "Too bad", "Average", "Nice", "Excellent"],
                    tooltipIndexQuality, setTooltipIndexQuality,
                    timeoutQuality, setTimeoutQuality
                )}
            </div>

            <div className={styles.section}>
                <label className={styles.label}>Upload Images</label>

                <div className={styles.imagesWrapper}>
                    {images.map((img, idx) => (
                        <div key={idx} className={styles.imageBox}>
                            <img
                                src={URL.createObjectURL(img)}
                                alt={`preview-${idx}`}
                                className={styles.image}
                            />
                        </div>
                    ))}

                    {images.length < maxImages && (
                        <label htmlFor="image-upload" className={styles.imageUpload}>
                            <Camera size={20} />
                            <span>{images.length}/5</span>
                        </label>
                    )}
                </div>

                <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
            </div>

            <div>
                <label className={styles.label}>Comment</label>
                <textarea
                    rows="3"
                    className={styles.textarea}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>

            <div className={styles.section}>
                <label className={styles.label}>Seller service</label>
                {renderStars(
                    sellerService, setSellerService,
                    ["Terrible", "Bad", "Okay", "Good", "Excellent"],
                    tooltipIndexService, setTooltipIndexService,
                    timeoutService, setTimeoutService
                )}

            </div>

            <div className={styles.section}>
                <label className={styles.label}>Delivery speed</label>
                {renderStars(
                    deliverySpeed, setDeliverySpeed,
                    ["Very slow", "Slow", "Average", "Fast", "Very fast"],
                    tooltipIndexDelivery, setTooltipIndexDelivery,
                    timeoutDelivery, setTimeoutDelivery
                )}
            </div>

            <button className={styles.submitButton} onClick={handleSubmit}>
                Send
            </button>
        </div>
    );
}
export default Feedback;