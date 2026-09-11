'use client';

import { type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';

const CONTROL =
  'w-full rounded-[var(--radius-sm)] border bg-surface px-4 py-3 text-fg placeholder:text-fg-subtle transition-colors duration-150 focus:border-accent focus:outline-none';

type FieldShellProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
};

function FieldShell({ id, label, error, hint, required, children }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {required ? (
          <span className="ml-1 text-[var(--danger)]" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-[var(--danger)]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-fg-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({ id, label, error, hint, className = '', required, ...rest }: InputProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <input
        id={id}
        className={`${CONTROL} ${error ? 'border-[var(--danger)]' : 'border-border-strong'} ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        required={required}
        {...rest}
      />
    </FieldShell>
  );
}

type TextareaProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({
  id,
  label,
  error,
  hint,
  className = '',
  required,
  rows = 4,
  ...rest
}: TextareaProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <textarea
        id={id}
        rows={rows}
        className={`${CONTROL} resize-y ${error ? 'border-[var(--danger)]' : 'border-border-strong'} ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        required={required}
        {...rest}
      />
    </FieldShell>
  );
}

type CheckboxProps = {
  id: string;
  label: ReactNode;
  error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export function Checkbox({ id, label, error, className = '', ...rest }: CheckboxProps) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-snug">
        <input
          id={id}
          type="checkbox"
          className={`mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--accent)] ${
            error ? 'outline outline-2 outline-offset-2 outline-[var(--danger)]' : ''
          } ${className}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        <span className="text-fg-muted">{label}</span>
      </label>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-[var(--danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type ChoiceProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
};

/** Крупная кнопка-выбор для калькуляторов: радио, оформленное как чип. */
export function Choice({ name, value, checked, onChange, children, className = '' }: ChoiceProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border px-4 py-3 text-[0.9375rem] font-medium transition-colors duration-150 ${
        checked
          ? 'border-accent bg-accent/10 text-fg'
          : 'border-border-strong bg-surface text-fg-muted hover:border-accent/60'
      } ${className}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${
          checked ? 'border-accent' : 'border-border-strong'
        }`}
      >
        <span className={`size-2.5 rounded-full ${checked ? 'bg-accent' : 'bg-transparent'}`} />
      </span>
      <span className="flex-1">{children}</span>
    </label>
  );
}
