import React, {
  FC,
  FormEvent,
  FormHTMLAttributes,
  useId,
  useReducer,
  useState,
} from "react";
import { Promisable } from "type-fest";
import "./ReplyForm.css";

export type ValidatableElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

interface AnnounceError {
  name: string;
  label: string;
  inputElement: ValidatableElement;
}

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  defaultValue: string;
  onSubmit?: (
    event: FormEvent<HTMLFormElement>
  ) => Promisable<void | Record<string, string>>;
}

export const ReplyForm: FC<FormProps> = ({ onSubmit, defaultValue }) => {
  const [announceErrors, setAnnounceErrors] = useState<AnnounceError[]>();
  const id = useId();

  // We increment this each time a submission is attempted and it fails.
  // Attaching this key to the live region element ensures we re-announce errors each time a
  // submission is attempted.
  const [announceKey, incrementAnnounceKey] = useReducer(
    (s: number) => s + 1,
    0
  );
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    //@ts-expect-error -- FIXME ts config issue
    const formInputs = [...form.elements].filter(
      (el): el is ValidatableElement =>
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement ||
        el instanceof HTMLTextAreaElement
    );

    const extractInputLabel = (input: ValidatableElement): string => {
      // useId on the fields should guarantee unique IDs.
      return (
        form.querySelector(`label[for="${input.id}"]`)?.textContent ||
        input.name
      );
    };

    if (form.checkValidity()) {
      setAnnounceErrors(undefined);
      onSubmit?.(event);
    } else {
      // Abort the submit and announce the errors.
      event.preventDefault();

      const errorsToAnnounce: AnnounceError[] = formInputs
        .filter((input) => !input.validity.valid)
        .map((input) => ({
          name: input.name,
          label: extractInputLabel(input),
          inputElement: input,
        }));

      if (errorsToAnnounce.length > 0) {
        setAnnounceErrors(errorsToAnnounce);
      }
    }

    // Increment after we've set all the other states.
    incrementAnnounceKey();
  };

  const resolveValidity = (err: AnnounceError) => {
    if (err.inputElement.validity.valueMissing) {
      return "is required";
    }
  };

  return (
    <form noValidate onSubmit={(e) => handleSubmit(e)} className="reply-form">
      <div className="form-field-wrapper">
        <div className="form-field">
          <input
            type="text"
            name="reply"
            id={id}
            defaultValue={defaultValue}
            required
          />
          <label htmlFor={id}>Text Reply</label>
        </div>
        {announceErrors?.map((err: AnnounceError) => {
          const errorMessage = resolveValidity(err);
          return (
            <p key={err.inputElement.id} className="field-error">
              {err.label} {errorMessage}
            </p>
          );
        })}
      </div>
      <input type="hidden" name="id" value={id} />
      <input
        type="hidden"
        name="action"
        value={defaultValue ? "edit" : "add"}
      />
      <button type="submit">{defaultValue ? "Edit" : "Send"}</button>
      {announceErrors?.length ? (
        <ul
          key={announceKey}
          role="status"
          aria-live="polite"
          aria-label="Validation Errors"
          className="visuallyHidden"
        >
          {announceErrors.map((err: AnnounceError) => {
            const errorMessage = resolveValidity(err);
            return (
              <li key={err.inputElement.id}>
                {err.label} {errorMessage}
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
};
