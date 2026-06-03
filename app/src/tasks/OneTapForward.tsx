type Props = { onSubmit: () => void }

export default function OneTapForward({ onSubmit }: Props) {
  return (
    <button type="button" className="primary-btn" onClick={onSubmit}>
      Tap to continue
    </button>
  )
}
