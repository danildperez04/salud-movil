import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { PublicRelease, ReleasePlatform } from "../../types";

type State = {
  loading: boolean;
  releases: Partial<Record<ReleasePlatform, PublicRelease>>;
};

// Última versión publicada por plataforma. Si la API no responde se muestra
// todo como "disponible pronto": la landing no debe romperse por esto.
export function useLatestReleases(): State {
  const [state, setState] = useState<State>({ loading: true, releases: {} });

  useEffect(() => {
    let cancelled = false;
    api
      .getLatestReleases()
      .then((list) => {
        if (cancelled) return;
        setState({
          loading: false,
          releases: Object.fromEntries(list.map((r) => [r.platform, r])),
        });
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, releases: {} });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
