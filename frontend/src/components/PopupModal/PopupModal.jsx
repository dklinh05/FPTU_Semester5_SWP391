
import { Modal, Button } from "react-bootstrap";

function PopupModal({ show, onClose, onConfirm, title, body, confirmText = "OK", cancelText = "Cancel" }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      {title && <Modal.Header closeButton><Modal.Title>{title}</Modal.Title></Modal.Header>}
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>
        {onConfirm && (
          <Button variant="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default PopupModal;
