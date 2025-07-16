import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function EditProductModal({ product, onClose, onSave }) {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);
    const [stockQuantity, setStockQuantity] = useState(product.stockQuantity);
    const [description, setDescription] = useState(product.description || "");
    const [image, setImage] = useState(null);

    useEffect(() => {
        setName(product.name);
        setPrice(product.price);
        setStockQuantity(product.stockQuantity);
        setDescription(product.description || "");
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedProduct = {
            ...product,
            name,
            price,
            stockQuantity,
            description,
            image,
        };
        onSave(updatedProduct);
    };

    return (
        <Modal show onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên sản phẩm</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập tên sản phẩm"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Giá</Form.Label>
                        <Form.Control
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            placeholder="Nhập giá sản phẩm"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tồn kho</Form.Label>
                        <Form.Control
                            type="number"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(Number(e.target.value))}
                            placeholder="Số lượng tồn kho"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả sản phẩm"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Ảnh sản phẩm mới (nếu muốn thay)</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                            accept="image/*"
                        />
                    </Form.Group>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={onClose}>
                            Huỷ
                        </Button>
                        <Button variant="success" type="submit">
                            Lưu
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EditProductModal;