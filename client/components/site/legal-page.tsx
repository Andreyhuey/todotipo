interface Props {
  title: string;
  body: string;
  updatedAt?: string;
}

/**
 * Renders plain text from the CMS: blank lines separate paragraphs and lines
 * starting with "## " become headings. No HTML is interpreted.
 */
export default function LegalPage({ title, body, updatedAt }: Props) {
  const blocks = body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <>
      <div className="bg-forest-900 pb-14 pt-36 md:pt-44">
        <div className="container max-w-3xl">
          <h1 className="display-2 text-linen">{title}</h1>
          {updatedAt && <p className="mt-4 text-linen/60">Last updated {updatedAt}</p>}
        </div>
      </div>
      <article className="container max-w-3xl py-16 md:py-24">
        {blocks.map((b, i) =>
          b.startsWith('## ') ? (
            <h2 key={i} className="mb-4 mt-12 font-display text-2xl font-normal first:mt-0">
              {b.slice(3)}
            </h2>
          ) : (
            <p key={i} className="mb-5 whitespace-pre-line leading-[1.8] text-stone-600">
              {b}
            </p>
          )
        )}
      </article>
    </>
  );
}
