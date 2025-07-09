import { currentUser } from '@clerk/nextjs/server';

export default async function Page() {
  const user = await currentUser();

  if (!user) return <div>No estás logueado</div>;

  return <div>Hola, {user.firstName}</div>;
}
