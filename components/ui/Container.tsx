import { type ElementType, type ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

/** Ограничивает ширину контента и держит боковые поля на всех экранах. */
export function Container({ children, className = '', as: Tag = 'div' }: ContainerProps) {
  return <Tag className={`container-page ${className}`}>{children}</Tag>;
}
