interface PopupProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  dangerous?: boolean;
}

export default function ConfirmationPopup({ message, onConfirm, onCancel, dangerous }: PopupProps) {
  return (
    <div className="z-50 font-pixelify-sans fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 generic-bordered-container flex flex-col gap-2 justify-center items-center">
      <p className="text-foreground text-base">
        {message}
      </p>
      <div className="flex flex-col md:flex-row gap-2 justify-center items-center w-full">
        <button
          onClick={onConfirm}
          className={dangerous ? "button-danger responsive-width" : "button-fill responsive-width"}
        >
          Confirmer
        </button>
        <button
          onClick={onCancel}
          className="button-hollow responsive-width"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
