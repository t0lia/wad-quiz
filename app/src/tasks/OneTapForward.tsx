type Props = { submitted: boolean; onSubmit: () => void }

export default function OneTapForward({ submitted, onSubmit }: Props) {
  if (submitted) return null
  return (
    <button type="button" className="submit-btn" onClick={onSubmit}>
      Continue →
    </button>
  )
}
