export function renderHighlightedJson(jsonString: string, variant: 'playground' | 'docs' | 'feature' = 'playground') {
  const colors =
    variant === 'docs'
      ? { key: 'text-[#3291ff]', bool: 'text-[#f81ce5]', num: 'text-[#f5a623]', str: 'text-[#50e3c2]', plain: 'text-[#888888] font-mono text-[13px] leading-relaxed whitespace-pre', row: 'font-mono text-[13px] leading-relaxed' }
      : variant === 'feature'
      ? { key: 'text-slate-400', bool: 'text-violet-300', num: 'text-amber-200', str: 'text-emerald-300', plain: 'text-slate-500 font-mono text-[12.5px] leading-relaxed whitespace-pre', row: 'font-mono text-[12.5px] leading-relaxed' }
      : { key: 'text-textMuted/80', bool: 'text-brand', num: 'text-blue-400', str: 'text-emerald-400/90', plain: 'text-textMuted/60 font-mono', row: 'font-mono' };

  return jsonString.split('\n').map((line, i) => {
    const keyMatch = line.match(/^(\s*)(".*?":)(.*)$/);
    if (!keyMatch) {
      return <div key={i} className={colors.plain}>{line || (variant === 'playground' ? '' : '\u00a0')}</div>;
    }
    const [, indent, keyStr, rest] = keyMatch;
    const trimmed = rest.trim();
    let valueColor = 'text-textMain';
    if (trimmed.startsWith('"')) valueColor = colors.str;
    else if (/^(true|false|null)\b/.test(trimmed)) valueColor = colors.bool;
    else if (/^-?\d/.test(trimmed)) valueColor = colors.num;

    return (
      <div key={i} className={colors.row}>
        <span className="whitespace-pre">{indent}</span>
        <span className={colors.key}>{keyStr}</span>
        <span className={valueColor}>{rest}</span>
      </div>
    );
  });
}
