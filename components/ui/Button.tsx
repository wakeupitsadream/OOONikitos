import Link from 'next/link';
import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'md' | 'lg';

// Без whitespace-nowrap: длинные русские подписи («Мне нужна обработка объекта»)
// на узком экране обязаны переноситься, иначе кнопка вылезает из колонки.
const BASE =
  'inline-flex max-w-full items-center justify-center gap-2 text-center font-semibold rounded-[var(--radius-sm)] transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out disabled:opacity-55 disabled:pointer-events-none active:translate-y-px';

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-fg shadow-[0_10px_28px_-12px_var(--accent)] hover:brightness-110 hover:-translate-y-0.5',
  secondary:
    'bg-surface-2 text-fg border border-border-strong hover:border-accent hover:text-accent-ink',
  outline: 'border-2 border-current text-fg hover:text-accent-ink hover:border-accent',
  ghost: 'text-fg-muted hover:text-fg underline-offset-4 hover:underline',
};

const SIZE: Record<Size, string> = {
  md: 'min-h-11 px-5 py-2.5 text-[0.9375rem]',
  lg: 'min-h-14 px-6 py-3.5 text-[1.0625rem] sm:px-7',
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Растянуть на всю ширину контейнера — для мобильных форм. */
  block?: boolean;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  /** Внешние ссылки открываем в новой вкладке. */
  external?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
  download?: boolean;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function classesFor({ variant = 'primary', size = 'md', block, className = '' }: CommonProps) {
  return `${BASE} ${VARIANT[variant]} ${SIZE[size]} ${block ? 'w-full' : ''} ${className}`.trim();
}

export function Button(props: ButtonProps) {
  const { children, variant, size, block, className } = props;
  const classes = classesFor({ children, variant, size, block, className });

  if ('href' in props && props.href !== undefined) {
    const { href, external, onClick, download } = props;
    const isExternal = external ?? /^(https?:|tel:|mailto:)/.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          onClick={onClick}
          aria-label={props['aria-label']}
          {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          {...(download ? { download: '' } : {})}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick} aria-label={props['aria-label']}>
        {children}
      </Link>
    );
  }

  const {
    children: _children,
    variant: _v,
    size: _s,
    block: _b,
    className: _c,
    ...rest
  } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
