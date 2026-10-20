import { useId, useRef, useState, type SelectHTMLAttributes } from "react";
import { SelectField } from "./SelectField";

export function Select({
  options,
  defaultValue,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string }[];
}) {
  const [inner, setInner] = useState(
    String(defaultValue ?? options[0]?.value ?? ""),
  );
  const selected = String(props.value ?? inner),
    native = useRef<HTMLSelectElement>(null),
    host = useRef<HTMLSpanElement>(null);
  const [validation, setValidation] = useState("");
  return (
    <span ref={host} className={props.className}>
      <select
        {...props}
        hidden
        onInvalid={(event) => {
          event.preventDefault();
          setValidation(event.currentTarget.validationMessage);
          host.current?.querySelector<HTMLButtonElement>("button")?.focus();
          props.onInvalid?.(event);
        }}
        aria-hidden="true"
        tabIndex={-1}
        ref={native}
        value={selected}
        onChange={(event) => {
          setInner(event.target.value);
          props.onChange?.(event);
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <SelectField
        label={props["aria-label"] || props.title || "选择选项"}
        value={selected}
        disabled={props.disabled}
        options={options}
        onChange={(value) => {
          setInner(value);
          setValidation("");
          if (native.current) {
            native.current.value = value;
            native.current.dispatchEvent(
              new Event("change", { bubbles: true }),
            );
          }
        }}
      />
      {validation && (
        <span className="fp-field-error" role="alert">
          {validation}
        </span>
      )}
    </span>
  );
}
export function Combobox({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId(),
    [open, setOpen] = useState(false),
    [active, setActive] = useState(0);
  const choices = options.filter((option) =>
    option.toLowerCase().includes(value.toLowerCase()),
  );
  return (
    <div className="fp-field">
      <label htmlFor={id}>{label}</label>
      <div className="fp-combobox">
        <input
          id={id}
          className="fp-input"
          role="combobox"
          aria-expanded={open}
          aria-controls={id + "-options"}
          aria-autocomplete="list"
          aria-activedescendant={
            open && choices.length ? id + "-" + active : undefined
          }
          value={value}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              return;
            }
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              setActive(
                (index) =>
                  (index +
                    (event.key === "ArrowDown" ? 1 : -1) +
                    choices.length) %
                  Math.max(choices.length, 1),
              );
            }
            if (event.key === "Enter" && open && choices[active]) {
              event.preventDefault();
              onChange(choices[active]);
              setOpen(false);
            }
          }}
        />
        {open && (
          <div
            id={id + "-options"}
            className="fp-combobox-options"
            role="listbox"
            aria-label={label}
          >
            {choices.map((option, index) => (
              <button
                type="button"
                role="option"
                aria-selected={index === active}
                id={id + "-" + index}
                tabIndex={-1}
                key={option}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {option}
              </button>
            ))}
            {!choices.length && <p>没有匹配的选项</p>}
          </div>
        )}
      </div>
    </div>
  );
}
