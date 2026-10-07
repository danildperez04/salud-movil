// components/ui/line-chart.tsx
import { useMemo, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { Text } from '@/components/ui/text';
import { buildMonotonePath, type Point } from '@/lib/smooth-path';
import { colors } from '@/lib/tokens';

export type ChartPoint = Point;

/** Espacio a la izquierda reservado para las etiquetas del eje Y. */
const AXIS_GUTTER = 44;
const PADDING_RIGHT = 16;
const PADDING_Y = 16;
/** Separación entre el borde del área de trazado y los puntos extremos, para que el marcador no se recorte. */
const MARKER_INSET = 10;
const X_AXIS_HEIGHT = 28;
const GRID_LINES = 3;
const LINE_WIDTH = 2;
const MARKER_RADIUS = 5;
/** Con más puntos que esto los marcadores se apelmazan: solo se marca el último. */
const MAX_MARKERS = 14;
const LABEL_HEIGHT = 16;

type LineChartProps = {
  /** Ordenados por `x` ascendente. `x` y `y` en unidades de datos (ej. timestamp y valor). */
  points: ChartPoint[];
  /** Rango visible del eje Y. Por defecto, mínimo y máximo de los datos. */
  domain?: [number, number];
  height?: number;
  /** Etiquetas bajo el eje X: [inicio, fin] del período. Sin ellas no se reserva el espacio. */
  xLabels?: readonly [string, string];
  accessibilityLabel?: string;
  className?: string;
};

/** 129 -> "129"; 36.55 -> "36.6". Con rangos amplios no se muestran decimales. */
function formatAxisValue(value: number, span: number): string {
  return String(Number(value.toFixed(span >= 10 ? 0 : 1)));
}

/**
 * Gráfico de una sola serie: grilla tenue con la escala en el eje Y, línea de
 * 2px suavizada y marcadores huecos (el último, relleno). Sin etiquetas por
 * punto — los valores exactos se leen en la lista que acompaña al gráfico.
 */
export function LineChart({
  points,
  domain,
  height = 160,
  xLabels,
  accessibilityLabel,
  className,
}: LineChartProps) {
  const [width, setWidth] = useState(0);
  const handleLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  const ys = points.map((p) => p.y);
  const [yMin, yMax] = domain ?? (ys.length > 0 ? [Math.min(...ys), Math.max(...ys)] : [0, 1]);
  const ySpan = yMax - yMin;

  const plotTop = PADDING_Y;
  const plotHeight = height - PADDING_Y * 2 - (xLabels ? X_AXIS_HEIGHT : 0);
  const plotLeft = AXIS_GUTTER;
  const plotRight = width - PADDING_RIGHT;

  const plotted = useMemo(() => {
    if (width === 0 || points.length === 0) return [];

    const xs = points.map((p) => p.x);
    const xMin = Math.min(...xs);
    const xSpan = Math.max(...xs) - xMin;
    const innerLeft = plotLeft + MARKER_INSET;
    const innerWidth = plotRight - plotLeft - MARKER_INSET * 2;

    // un solo punto (o todos en el mismo instante) -> centrado; serie plana -> a media altura
    return points.map((p) => ({
      x: innerLeft + (xSpan === 0 ? innerWidth / 2 : ((p.x - xMin) / xSpan) * innerWidth),
      y: plotTop + (ySpan === 0 ? plotHeight / 2 : (1 - (p.y - yMin) / ySpan) * plotHeight),
    }));
  }, [points, width, plotLeft, plotRight, plotTop, plotHeight, yMin, ySpan]);

  const path = useMemo(() => buildMonotonePath(plotted), [plotted]);
  const showAllMarkers = plotted.length <= MAX_MARKERS;
  const grid = Array.from({ length: GRID_LINES }, (_, i) => {
    const ratio = i / (GRID_LINES - 1);
    return { y: plotTop + ratio * plotHeight, value: yMax - ratio * ySpan };
  });

  return (
    <View
      className={className}
      style={{ height }}
      onLayout={handleLayout}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      {width > 0 && (
        <Svg width={width} height={height}>
          {grid.map(({ y }) => (
            <Line
              key={y}
              x1={plotLeft}
              x2={plotRight}
              y1={y}
              y2={y}
              stroke={colors.neutralLight}
              strokeWidth={1}
            />
          ))}

          {plotted.length > 1 && (
            <Path
              d={path}
              fill="none"
              stroke={colors.brandGreen}
              strokeWidth={LINE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {plotted.map((p, i) => {
            const isLast = i === plotted.length - 1;
            if (!showAllMarkers && !isLast) return null;
            return (
              <Circle
                key={`${p.x}-${p.y}`}
                cx={p.x}
                cy={p.y}
                r={MARKER_RADIUS}
                fill={isLast ? colors.brandGreen : colors.backgroundDefault}
                stroke={colors.brandGreen}
                strokeWidth={LINE_WIDTH}
              />
            );
          })}
        </Svg>
      )}

      {grid.map(({ y, value }) => (
        <Text
          key={y}
          className="text-caption font-body text-muted-foreground absolute text-right"
          style={{
            top: y - LABEL_HEIGHT / 2,
            left: 0,
            width: AXIS_GUTTER - 10,
            height: LABEL_HEIGHT,
          }}
        >
          {formatAxisValue(value, ySpan)}
        </Text>
      ))}

      {xLabels && (
        <View
          className="absolute flex-row justify-between"
          style={{ left: plotLeft, right: PADDING_RIGHT, bottom: 8 }}
        >
          <Text className="text-caption font-body text-muted-foreground">{xLabels[0]}</Text>
          <Text className="text-caption font-body text-muted-foreground">{xLabels[1]}</Text>
        </View>
      )}
    </View>
  );
}
