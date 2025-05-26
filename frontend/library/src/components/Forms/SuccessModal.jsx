import "./Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

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
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-success"
                size="3x"
              />
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
