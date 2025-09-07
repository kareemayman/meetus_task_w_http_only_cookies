export default function FormInput({ placeholder, type, name, value, onChange, onBlur, icon, error }) {
  return (
    <div className={`form-input ${error ? "input-error" : ""}`}>
      <div className="font-awesome-icon">
        <img src={icon} alt={name} />
      </div>
      <input
        placeholder={placeholder}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  )
}