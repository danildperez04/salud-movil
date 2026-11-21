import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { RedirectIfAuthed } from "../auth/guards";

/**
 * Marco común de las pantallas del registro (`/registro/*`), dentro de
 * `AuthLayout`:
 *  - quien ya tiene sesión no tiene nada que registrar, así que va al panel,
 *    igual que en el login;
 *  - cada paso empieza arriba. La elección de plan es larga (en el celular las
 *    dos tarjetas van una bajo otra) y la persona llega al botón de la segunda
 *    con la página desplazada: sin esto, el paso siguiente abre a media altura.
 */
export default function RegisterLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    // `instant` a propósito: `index.css` activa `scroll-behavior: smooth`, y
    // aquí se quiere estar arriba al abrir el paso, no ver cómo se sube.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <RedirectIfAuthed>
      <Outlet />
    </RedirectIfAuthed>
  );
}
