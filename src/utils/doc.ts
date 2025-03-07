export function jsDoc(
  {
    description,
    deprecated,
    summary,
  }: {
    description?: string[] | string;
    deprecated?: boolean;
    summary?: string;
  },
  tryOneLine = false,
): string {
  // Ensure there aren't any comment terminations in doc
  const lines = (
    Array.isArray(description) ? description : [description || '']
  ).map((line) => line.replace('*/', '*\\/'));

  const count = [description, deprecated, summary].reduce(
    (acc, it) => (it ? acc + 1 : acc),
    0,
  );

  if (!count) {
    return '';
  }

  const oneLine = count === 1 && tryOneLine;
  let doc = '/**';

  if (description) {
    if (!oneLine) {
      doc += `\n${tryOneLine ? '  ' : ''} *`;
    }
    doc += ` ${lines.join('\n * ')}`;
  }

  if (deprecated) {
    if (!oneLine) {
      doc += `\n${tryOneLine ? '  ' : ''} *`;
    }
    doc += ' @deprecated';
  }

  if (summary) {
    if (!oneLine) {
      doc += `\n${tryOneLine ? '  ' : ''} *`;
    }
    doc += ` @summary ${summary.replace('*/', '*\\/')}`;
  }

  doc += !oneLine ? `\n ${tryOneLine ? '  ' : ''}` : ' ';

  doc += '*/\n';

  return doc;
}
