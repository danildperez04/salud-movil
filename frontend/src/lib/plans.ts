/**
 * Planes de membresía del registro público (`/registro`).
 *
 * Precios y alcance salen de la hoja "Planes" del plan financiero
 * (`docs/plan-financiero`): "Económico" es su plan "Esencial" y "Premium" es el
 * mismo plan Premium. Ese libro marca los precios como supuestos a validar con
 * clientes reales; se cambian aquí y se reflejan en todas las pantallas del
 * registro. La cuota única de implementación (C$ 5,000 / C$ 20,000) no entra:
 * este flujo no la cobra.
 *
 * El asistente por voz, el chatbot y el escáner de medicamentos son el
 * diferenciador Premium. El chatbot todavía no existe en la app y el escáner
 * figura como "Pronto" en el menú Más: se ofrecen por decisión de negocio, no
 * porque estén construidos.
 */
export type PlanId = 'economic' | 'premium';

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  /** Precio mensual en córdobas (C$). */
  monthlyPrice: number;
  /** Se resalta en la pantalla de elección. */
  featured?: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  economic: {
    id: 'economic',
    name: 'Económico',
    description: 'Lo esencial para dar seguimiento a tus pacientes.',
    monthlyPrice: 2500,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    description: 'Todo incluido, sin límites y soporte prioritario.',
    monthlyPrice: 9000,
    featured: true,
  },
};

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === 'string' && Object.hasOwn(PLANS, value);
}

/**
 * Qué ofrece cada plan en una característica: `true` / `false` si la incluye o
 * no, o un texto con su alcance ("hasta 300"), que cuenta como incluida.
 */
type FeatureValue = boolean | string;

interface PlanFeature {
  label: string;
  values: Record<PlanId, FeatureValue>;
}

/**
 * Matriz de características. Es una sola lista para los dos planes (y no una
 * por plan) para que las tarjetas muestren siempre las mismas filas en el mismo
 * orden y se puedan comparar de un vistazo. Las que el Económico no incluye van
 * al final, donde la diferencia se nota.
 */
const PLAN_FEATURES: PlanFeature[] = [
  {
    label: 'Indicadores, citas, recordatorios y expediente clínico',
    values: { economic: true, premium: true },
  },
  {
    label: 'Pacientes activos',
    values: { economic: 'hasta 300', premium: 'sin límite' },
  },
  {
    label: 'Cuidadores vinculados',
    values: { economic: '1 por paciente', premium: 'sin límite' },
  },
  {
    label: 'Reportes institucionales',
    values: { economic: 'resumen mensual', premium: 'tablero y exportación' },
  },
  {
    label: 'Soporte',
    values: { economic: 'por correo (48 h)', premium: 'prioritario (4 h)' },
  },
  {
    label: 'Prioridad IPCP con alertas al personal',
    values: { economic: false, premium: true },
  },
  {
    label: 'Escáner de medicamentos',
    values: { economic: false, premium: true },
  },
  {
    label: 'Asistente por voz',
    values: { economic: false, premium: true },
  },
  {
    label: 'Chatbot de salud',
    values: { economic: false, premium: true },
  },
];

export interface PlanFeatureRow {
  label: string;
  included: boolean;
  /** Alcance de la característica ("hasta 300"), si lo tiene. */
  detail?: string;
}

/** Las características de un plan, listas para pintarse en su tarjeta. */
export function getPlanFeatures(planId: PlanId): PlanFeatureRow[] {
  return PLAN_FEATURES.map(({ label, values }) => {
    const value = values[planId];
    return {
      label,
      included: value !== false,
      detail: typeof value === 'string' ? value : undefined,
    };
  });
}
