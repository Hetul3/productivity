import Image from 'next/image'
import styles from './page.module.css'
import {getServerSession} from "next-auth"


export default async function Home() {
  const session = await getServerSession();

  return (
    <>
    {session?.user?.name || ""}
    </>
  )
}
