import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DatePickerInput({
  value,
  onChange,
  name,
  label,
  error = "",
}: DatePickerProps) {
  return (
    <div>
      <label className="label">
        <p className="mb-2 text-sm">{label}</p>
      </label>
      <DatePicker
        dateFormat="dd/MM/yyyy"
        selected={value}
        onChange={onChange}
        name={name}
        className="input-bordered input w-full border-grey-input py-5 text-base"
      />
      {error && (
        <p className="text-xs text-red">
          <>{error}</>
        </p>
      )}
    </div>
  );
}
