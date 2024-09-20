import {
  FormattedMessage,
  useIntl
} from '../../../runtime';

interface LanguageSelectorProps {
  onSubmit: (languageCode: string) => void,
  options: Array<{
    label: string,
    value: string
  }>,
}

export default function LanguageSelector({
  options, onSubmit, ...props
}: LanguageSelectorProps) {
  const intl = useIntl();
  const handleSubmit = (e) => {
    e.preventDefault();
    const languageCode = e.target.elements['site-footer-language-select'].value;
    onSubmit(languageCode);
  };

  return (
    <form
      className="form-inline"
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="form-group">
        <label htmlFor="site-footer-language-select" className="d-inline-block m-0">
          <FormattedMessage
            id="footer.languageForm.select.label"
            defaultMessage="Choose Language"
            description="The label for the laguage select part of the language selection form."
          />
        </label>
        <select
          id="site-footer-language-select"
          className="form-control-sm mx-2"
          name="site-footer-language-select"
          defaultValue={intl.locale}
        >
          {options.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
        <button data-testid="site-footer-submit-btn" className="btn btn-outline-primary btn-sm" type="submit">
          <FormattedMessage
            id="footer.languageForm.submit.label"
            defaultMessage="Apply"
            description="The label for button to submit the language selection form."
          />
        </button>
      </div>
    </form>
  );
}
