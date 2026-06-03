type Props = { onSubmit: () => void }

export default function OneTapForward({ onSubmit }: Props) {
  return (
    <button type="button" className="submit-btn" onClick={onSubmit}>
      Continue →
    </button>
  )
}
