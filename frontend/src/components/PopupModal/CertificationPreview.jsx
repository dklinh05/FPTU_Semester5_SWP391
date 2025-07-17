import React from "react";

const CertificationPreview = ({ imageUrl, isOpen, onClose }) => {
    if (!isOpen || !imageUrl) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0, left: 0,
                width: "100vw", height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10000,
                animation: "fadeIn 0.2s ease-in-out",
            }}
        >
            <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
                <img
                    src={imageUrl}
                    alt="Certification Preview"
                    style={{
                        maxWidth: "90vw",
                        maxHeight: "90vh",
                        borderRadius: "12px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                        backgroundColor: "#fff",
                        padding: "10px",
                        objectFit: "contain",
                    }}
                />
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "-16px",
                        right: "-16px",
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                        fontSize: "20px",
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                >
                    ✕
                </button>
            </div>

            <style>
                {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
            </style>
        </div>
    );
};

export default CertificationPreview;
