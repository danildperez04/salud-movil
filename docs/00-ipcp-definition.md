En Salud Móvil, el IPCP (Índice de Prioridad de Control del Paciente) funcionaría como un sistema que analiza los datos de un paciente con una enfermedad crónica y determina qué tan prioritario es su seguimiento.

Por ejemplo, un paciente registra su presión arterial, glucosa, medicamentos, síntomas y cumplimiento del tratamiento. El IPCP analiza esos datos y asigna puntos según el nivel de riesgo. Después genera una puntuación, por ejemplo, de 0 a 100.

Podríamos estructurarlo así:

| Variable evaluada |	Ejemplo de lo que analiza |
| - | - |
| Presión arterial	| Si está dentro o fuera del rango establecido |
|Glucosa	| Valores registrados y alteraciones |
| Adherencia al tratamiento |	Medicamentos tomados u omitidos |
| Síntomas	| Aparición o empeoramiento de síntomas |
| Controles médicos	| Citas realizadas o incumplidas |
| Antecedentes	| Enfermedades y factores de riesgo |
|Tendencia |	Si los indicadores mejoran o empeoran con el tiempo |

Entonces, no sería simplemente una alarma por un dato aislado. La idea más interesante es combinar varios factores.

Ejemplo práctico

Supongamos que Juan tiene hipertensión. Durante varios días registra su presión en Salud Móvil.

Normalmente mantiene valores adecuados, toma sus medicamentos y no presenta síntomas. Su IPCP podría mantenerse bajo:

IPCP = 22/100 → 🟢 Prioridad baja

Pero empieza a registrar presiones elevadas, reporta que olvidó varias dosis y además indica dolor de cabeza. El sistema recalcula:

IPCP = 64/100 → 🟡 Prioridad moderada

Si posteriormente aparecen valores clínicos preocupantes o síntomas de alarma, el sistema podría elevar la prioridad:

IPCP = 87/100 → 🔴 Prioridad alta

Esto permitiría que Salud Móvil mostrara algo como “Paciente que requiere revisión prioritaria” al personal sanitario, en vez de obligarlo a revisar manualmente cientos de registros.

Una forma conceptual de expresarlo sería:

IPCP = Presión/Glucosa + Síntomas + Adherencia + Antecedentes + Tendencia clínica + Seguimiento

Pero todavía no deberíamos afirmar que esos porcentajes o puntos están clínicamente validados. Si queremos convertir el IPCP en una parte seria y defendible de Salud Móvil, debemos definir cada variable y sus ponderaciones a partir de guías clínicas y posteriormente plantear su validación.

En resumen:

Paciente → registra datos → Salud Móvil analiza variables → calcula IPCP → clasifica prioridad 🟢🟡🔴 → genera seguimiento/alerta → profesional sanitario revisa el caso.

Y un punto clave para defenderlo: el IPCP no diagnostica ni sustituye al médico; funciona como una herramienta de priorización y apoyo al seguimiento.

Si quieres, puedo construirte ahora el modelo completo del IPCP de Salud Móvil, con la fórmula 0–100, cuánto vale cada variable y exactamente cuándo un paciente pasa de 🟢 a 🟡 o 🔴, fundamentándolo con bibliografía clínica.