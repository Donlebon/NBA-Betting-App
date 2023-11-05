import React from 'react'
import { useState, useEffect, useRef } from 'react'
import LineChart from '../Components/LineChart'
import { projectFirestore } from '../firebase/config';
import { useAuthContext } from '../hooks/useAuthContext';


export default function Profit() {


  const {user} = useAuthContext()
  const [nbaProfits, setNbaProfits] = useState<any>(null)
  const [startAmount, setStartingAmount] = useState<number>(0)
  const [editAmount, setEditAmount] = useState<boolean>(false)

  const ref = useRef(0)

  const handleEdit = () => {
    setEditAmount((prev: boolean) => {
      return !prev
    })
  }

  const handleKeyDown = (e: any) => {
    if(e.key === "Enter"){
      setEditAmount((prev: boolean) => {
        return !prev
      })
      if(e.target.value === "" || isNaN(e.target.value) === true){
        return startAmount
      }
      setStartingAmount(() => {
        return e.target.value
      })
    }
  }

  async function getProfit(){
      const betArray: any = []
      await projectFirestore.collection("transactions").get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              betArray.push(doc.data())
          });
      });
      const finalArray = betArray.filter((finished: any) => finished.finished === true && user.uid === finished.user)
      // console.log(finalArray)
      setNbaProfits(finalArray)
  }

  useEffect(() => {
      getProfit()
  },[startAmount])


  if(nbaProfits){
    ref.current = 0
    const allProfit = nbaProfits.map((item: any) => {
      return Number(item.profit)
    })
    for(const item of allProfit){
      ref.current += item
    }
  }


  return (
    <div className = "profit-container">

      <LineChart 
        startingAmount = {startAmount}
        nbaProfits = {nbaProfits}
      />

        <h1 className = "start-container">Starting Amount</h1>
        {!editAmount ? 
        <h1 className = "start-price" onClick = {() => handleEdit()}>{startAmount}</h1> : 
        <input
        className = "start-amount"
        onKeyDown = {(e) => handleKeyDown(e)}
        type="text" autoFocus/>}

        <div className = "start-other">
          <h1 className = "start-profit">Current Profit</h1>
          <h1 className = "bet-title">Number of Bets</h1>
        </div>

        <div className = "start-info">
          <h1 className = "profit-amount">${ref.current}</h1>
          {nbaProfits && (<h1 className = "bet-amount">{nbaProfits.length}</h1>)}
        </div>

    </div>
  )
}
