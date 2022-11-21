import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import { signIn, signOut, useSession } from 'next-auth/react';

import styles from './SignInButton.module.scss'

export default function SignInButton(){
  const {data: session} = useSession()
  console.log("🚀 / SignInButton / session", session)

  return session? (
    <button
      type='button'
      className={styles.signInButton}
    >
        <FaGithub color='#04d361'/> 
        {session.user.name}
        <FiX color='#737380' className={styles.closeIcon} onClick={() => signOut()}/> 
    </button>
  ) : (
    <button
      type='button'
      className={styles.signInButton}
      onClick={() => signIn('github')}
    >
        <FaGithub color='#eba417'/> 
        Sign In with GitHub
    </button>
  )
}