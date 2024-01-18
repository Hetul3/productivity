import Image from 'next/image';
import styles from './page.module.css';
import { getServerSession } from 'next-auth';
import { sql } from '@vercel/postgres';

export default async function Home() {
  const session = await getServerSession();

  if (session?.user?.name) {
    const userName = session.user.name;

    try {
      await sql`
        INSERT INTO Dbusers (Name)
        VALUES (${userName})
        ON CONFLICT (Name) DO NOTHING;
      `;
    } catch (error) {
      console.error('Error adding user to the database', error);
    }
  }

  return (
    <>
      {session?.user?.name || ''}
    </>
  );
}
