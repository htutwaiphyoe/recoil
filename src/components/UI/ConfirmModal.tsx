export default function ConfirmModal({
  modalHandlers,
  confirmHandler,
  message,
  description = "",
}: {
  modalHandlers: { isOpen: boolean; setIsOpen: any };
  confirmHandler?: any;
  message?: string;
  description?: string;
}) {
  return (
    <>
      <input
        id="confirm-modal"
        type="checkbox"
        className="modal-toggle"
        checked={modalHandlers.isOpen}
        onChange={(e) => {
          e.stopPropagation();
          modalHandlers.setIsOpen(e.target.checked);
        }}
      />
      <label
        onChange={(e) => e.stopPropagation()}
        className="modal cursor-pointer"
        htmlFor="confirm-modal"
      >
        <label className="modal-box relative">
          <h3 className="text-3xl font-bold">
            {message || "Are you sure that you want to proceed?"}
          </h3>
          {description && <p className="mt-5 text-xl">{description}</p>}
          <div className="mt-10 flex justify-end gap-4">
            <label
              onClick={(e) => {
                modalHandlers.setIsOpen(false);
                e.stopPropagation();
              }}
              className="btn-outline btn-error btn"
            >
              Cancel
            </label>
            <label
              className="btn-primary btn text-white"
              onClick={(e) => {
                confirmHandler();
              }}
            >
              Proceed
            </label>
          </div>
        </label>
      </label>
    </>
  );
}
