// ModalComponent.tsx
import React from "react";
import Modal from "react-modal";

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Note Modal"
      className="custom-modal"
    >
      {/* Content inside the modal */}
      <div style={{ textAlign: "justify", marginBottom: "20px" }}>
        <h2>Disclaimer:</h2>
        <br />
        <p>
          <ul>
            Content accuracy in this document summarizer is algorithmically
            generated and may not capture the full depth of the original text.
          </ul>
          <ul>
            Users are advised to independently verify crucial information, as
            the summarizer's output may not always be exhaustive or error-free.
          </ul>
          <ul>
            While the technology strives for precision, the summarizer's
            accuracy is contingent on the complexity and context of the input
            text.
          </ul>
        </p>
        <button
          className="btn btn-danger"
          style={{
            marginTop: "20px",
            backgroundColor: "#d9534f",
            border: "1px solid #d9534f",
            marginLeft: "21%",
          }}
          onClick={onClose}
        >
          I Understand
        </button>
      </div>
    </Modal>
  );
};

export default ModalComponent;
