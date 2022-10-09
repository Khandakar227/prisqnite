import type { NextPage } from 'next'
import {signIn} from 'next-auth/react'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <button onClick={() => signIn()}> Login </button>
    </div>
  )
}

export default Home
