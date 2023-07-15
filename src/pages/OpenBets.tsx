import React from 'react'
import { useCollection } from '../hooks/useCollection'
import { TransactionList } from './TransactionList'
import { useAuthContext } from '../hooks/useAuthContext'


export default function OpenBets() {
  const {user} = useAuthContext()
  const getUserBets = ["uid", "==", user.uid]
  const {documents, error} = useCollection("transactions", getUserBets, user.uid)


  return (
  <div className = "bet-container">
    {documents && 
    <TransactionList 
    transactions = {documents} />}
    {error && <p>{error}</p>}
  </div>
  )
}

