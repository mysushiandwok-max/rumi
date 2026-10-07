import { Reveal } from "@/components/category/Reveal";
import type { CategoryEducationPoint } from "@/lib/types";

// Contenido educativo dentro de la categoría. Es tipografía pura: sin tarjetas ni íconos repetidos,
// para que se lea como una guía y no como otra rejilla de productos.
export function CategoryEducation({
  title,
  intro,
  points,
}: {
  title: string;
  intro: string;
  points: CategoryEducationPoint[];
}) {
  return (
    <section aria-labelledby="education-title" className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h2
          id="education-title"
          className="max-w-md text-balance font-display text-2xl font-bold leading-tight text-ink sm:text-3xl"
        >
          {title}
        </h2>
        {intro && <p className="mt-3 max-w-md text-base leading-relaxed text-ink/65">{intro}</p>}
      </div>

      <ol className="divide-y divide-border">
        {points.map((point, index) => (
          <Reveal as="li" key={point.title} delay={index * 70} className="py-6 first:pt-0 last:pb-0">
            <h3 className="font-display text-lg font-bold text-ink">{point.title}</h3>
            {point.text && <p className="mt-2 max-w-[62ch] text-base leading-relaxed text-ink/65">{point.text}</p>}
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
