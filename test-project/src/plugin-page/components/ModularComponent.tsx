interface ModularComponentProps {
  content?: {
    title?: string,
    uniqueText?: string,
  },
}

export default function ModularComponent({ content = {} }: ModularComponentProps) {
  return (
    <section className="bg-light p-3">
      {content?.title !== undefined && (
        <h4>{content.title}</h4>
      )}
      <p>
        This is a modular component that lives in the example app.
      </p>
      <p className="mb-0">
        {content?.uniqueText !== undefined && (
          <em>{content.uniqueText}</em>
        )}
      </p>
    </section>
  );
}
