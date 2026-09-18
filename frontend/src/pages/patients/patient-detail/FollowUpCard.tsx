import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

// MOCK: el backend todavía no expone un feed real de eventos de seguimiento.
const MOCK_TIMELINE_EXTRA = [
  { title: "Alerta por SatO₂ baja", time: "Hace 13 min" },
  { title: "Último contacto por WhatsApp", time: "Ayer 4:20 p. m." },
];

export function FollowUpCard({ ipcpScore }: { ipcpScore: number }) {
  const timeline = [
    { title: `IPCP actualizado a ${ipcpScore}`, time: "Hace 8 min" },
    ...MOCK_TIMELINE_EXTRA,
  ];

  return (
    <Card title="Seguimiento">
      <ol className="flex flex-col gap-3">
        {timeline.map((item) => (
          <li key={item.title} className="border-l-2 border-primary pl-3">
            <p className="font-body text-sm font-medium text-navy">
              {item.title}
            </p>
            <p className="font-body text-xs text-muted">{item.time}</p>
          </li>
        ))}
      </ol>
      {/* TODO: sin backend para estas acciones todavía; botones sin onClick. */}
      <div className="mt-4 flex gap-2">
        <Button variant="secondary" className="flex-1">
          Asignar seguimiento
        </Button>
        <Button variant="danger" className="flex-1">
          Atención prioritaria
        </Button>
      </div>
    </Card>
  );
}
