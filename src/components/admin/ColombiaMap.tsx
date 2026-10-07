"use client";

import { COLOMBIA_DEPARTMENT_PATHS, COLOMBIA_MAP_VIEWBOX } from "@/lib/colombia-map-paths";

const SAN_ANDRES = "San Andrés y Providencia";

export function ColombiaMap({
  configuredDepartments,
  selected,
  onSelect,
}: {
  configuredDepartments: Set<string>;
  selected: string | null;
  onSelect: (name: string) => void;
}) {
  return (
    <svg
      viewBox={COLOMBIA_MAP_VIEWBOX}
      className="h-auto w-full select-none"
      role="img"
      aria-label="Mapa de Colombia por departamento"
    >
      {COLOMBIA_DEPARTMENT_PATHS.map((d) => {
        const isSelected = selected === d.name;
        const isConfigured = configuredDepartments.has(d.name);
        return (
          <path
            key={d.code}
            d={d.path}
            onClick={() => onSelect(d.name)}
            className="cursor-pointer transition-colors"
            fill={isSelected ? "#D64C74" : isConfigured ? "#F5B4C6" : "#EFE5E1"}
            stroke="#ffffff"
            strokeWidth={1}
          >
            <title>{d.name}</title>
          </path>
        );
      })}

      {/* San Andrés y Providencia: recuadro fijo, queda lejos del continente y distorsionaría la escala */}
      <g onClick={() => onSelect(SAN_ANDRES)} className="cursor-pointer" transform="translate(30, 40)">
        <rect
          width={54}
          height={40}
          rx={8}
          fill={selected === SAN_ANDRES ? "#D64C74" : configuredDepartments.has(SAN_ANDRES) ? "#F5B4C6" : "#EFE5E1"}
          stroke="#ffffff"
          strokeWidth={1}
        />
        <text
          x={27}
          y={24}
          textAnchor="middle"
          fontSize={8}
          fill={selected === SAN_ANDRES ? "#fff" : "#6B625D"}
          fontWeight={700}
        >
          San Andrés
        </text>
        <title>{SAN_ANDRES}</title>
      </g>
    </svg>
  );
}
