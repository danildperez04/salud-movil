// features/health-indicators/domain/indicator-type.ts
// Los tipos vienen de cat_type_indicator con nombre en inglés. Para las rutas
// se usa un slug estable y legible en la URL (/health-indicators/blood-pressure/...).

const SLUG_BY_TYPE_NAME: Record<string, string> = {
  'Blood pressure': 'blood-pressure',
  Glucose: 'glucose',
  Weight: 'weight',
  Temperature: 'temperature',
};

const TYPE_NAME_BY_SLUG = Object.fromEntries(
  Object.entries(SLUG_BY_TYPE_NAME).map(([name, slug]) => [slug, name]),
);

/** "Blood pressure" -> "blood-pressure". Tipos desconocidos se normalizan igual. */
export function slugFromTypeName(typeName: string): string {
  return SLUG_BY_TYPE_NAME[typeName] ?? typeName.toLowerCase().replace(/\s+/g, '-');
}

/** "blood-pressure" -> "Blood pressure". undefined si el slug no corresponde a un tipo. */
export function typeNameFromSlug(slug: string | undefined): string | undefined {
  return slug ? TYPE_NAME_BY_SLUG[slug] : undefined;
}
