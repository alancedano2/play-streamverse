'use client';

import { useUser } from '@clerk/nextjs';

export default function Page() {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn) return <div>No estás logueado</div>;

  return <div>Hola, {user.firstName}</div>;
}
