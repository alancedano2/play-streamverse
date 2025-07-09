'use client';

import { currentUser } from '@clerk/nextjs/server';

export default function Page() {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn) return <div>No estás logueado</div>;

  return <div>Hola, {user.firstName}</div>;
}
