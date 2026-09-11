import { OblastOutline, OBLAST_CITIES } from '@/components/brand/OblastOutline';

type CoverageMapProps = {
  className?: string;
  /** Подписывать ли крупные города рядом с точками. */
  withLabels?: boolean;
};

/**
 * Карта зоны выезда: контур области плюс точки опорных городов.
 * Контур — отдельный компонент айдентики, точки накладываются поверх,
 * поэтому карту легко расширить новым городом без правки path.
 */
export function CoverageMap({ className = '', withLabels = true }: CoverageMapProps) {
  return (
    <figure className={`relative ${className}`}>
      <OblastOutline
        className="h-auto w-full text-accent"
        strokeWidth={2}
        animated
        decorative={false}
      />
      {OBLAST_CITIES.map((city) => (
        <span
          key={city.name}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${city.x}%`, top: `${city.y}%` }}
        >
          <span
            className={`block rotate-45 ${
              city.major ? 'size-2.5 bg-accent' : 'size-1.5 bg-accent/60'
            }`}
            aria-hidden="true"
          />
          {withLabels && city.major ? (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-semibold text-fg-muted">
              {city.name}
            </span>
          ) : null}
        </span>
      ))}
      <figcaption className="sr-only">
        Карта Оренбургской области с городами, куда выезжает ДезГарант
      </figcaption>
    </figure>
  );
}
