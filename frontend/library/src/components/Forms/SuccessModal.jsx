import "./Modal.css";

const SuccessModal = ({ isVisible, onClose, onNavigate }) => {
  if (!isVisible) return null;
  return (
    <div
      className="modal fade show"
      id="successModal"
      tabIndex="-1"
      aria-labelledby="successModalLabel"
      aria-hidden="true"
      style={{
        display: "block",
        paddingRight: "17px",
      }}
    >
      <div className="modal-dialog modal-lg custom-modal">
        <div className="modal-content">
          <div className="modal-body text-center">
            <div id="checkIcon">
              <i className="text-success fa-solid fa-check-circle"></i>
            </div>
            <div className="mt-4 py-2">
              <h2 className="px-4 pb-0 mb-1 text-center">Awesome</h2>
              <h6 className="h5">
                Your submission has been received. Thank you! 😊
              </h6>
            </div>
            <div className="py-1">
              <button
                type="button"
                className="btn btn-sm btn-warning rounded-pill px-5"
                data-bs-dismiss="modal"
                onClick={() => {
                  onClose();
                  onNavigate();
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
