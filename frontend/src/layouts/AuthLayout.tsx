import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-mint-soft-2 via-surface to-mint-soft p-4">
      <Outlet />
    </div>
  );
}
