interface PopupProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationPopup({ message, onConfirm, onCancel }: PopupProps) {
  return (
    <div className="z-50 font-pixelify-sans fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black border-white border-2 p-4 flex flex-col gap-2 justify-center items-center">
      <p className="text-white text-base">
        {message}
      </p>
      <div className="flex gap-2 justify-center items-center">
        <button
          onClick={onConfirm}
          className="button-fill"
        >
          Confirmer
        </button>
        <button
          onClick={onCancel}
          className="button-hollow"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
