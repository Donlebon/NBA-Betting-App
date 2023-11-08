import React, { useEffect, useState } from 'react'
import "../home.css"
import { todayDate } from '../hooks/todayDate'
import { useFireStore } from '../hooks/useFiresStore'
import { useAuthContext } from '../hooks/useAuthContext'

export default function Games() {
  const {user} = useAuthContext()
  const {addDocument, response} = useFireStore("transactions")
  const {scoreDate, oddDate} = todayDate()
  const [bballScore, setBballScore] = useState<any>(null)
  const [isPending, setIsPending] = useState<boolean>(true)
  const [error, setError] = useState<any>(null)
  const [homeActive, setHomeActive] = useState<boolean>(false)
  const [awayActive, setAwayActive] = useState<boolean>(false)
  
  const [invalidBet, setInvalidBet] = useState<boolean>(false)
  const [validBet, setValidBet] = useState<boolean>(false)

  const [nba, setNbaData] = useState<any>(null)


  const [wagerAmount, setWagerAmount] = useState<number>(1)
  const [profitAmount, setProfitAmount] = useState<number>(1)

  const [bballData, setBballData] = useState<any>(null)
    
    const handleFetchData = async () => {
      setError(null)
      setIsPending(true)
      try{
        const score = await fetch(`https://www.balldontlie.io/api/v1/games?start_date=${scoreDate}&end_date=${scoreDate}`)
        const nbaScore = await score.json()
        const spreadResponse =  await fetch(`https://tank01-fantasy-stats.p.rapidapi.com/getNBABettingOdds?gameDate=${oddDate}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': `${process.env.REACT_APP_NBA}`,
            'X-RapidAPI-Host': 'tank01-fantasy-stats.p.rapidapi.com'
          }
        }
        );
        const nbaData = await spreadResponse.json();

  //  If no response, e.g network connection is bad
        if(!score){
          // console.log("error")
          throw new Error("Could not complete request")
        }

        if(score && spreadResponse){
           setNbaData(nbaData.body)
           setBballScore(nbaScore.data)      
           setIsPending(false)
        }

      }
        catch(err: any){
          // console.log(err.message)
          setError(err.message)
          setIsPending(false)
    }
}

      useEffect(() => {
          handleFetchData();
      },[])

      useEffect(() => {
        if(nba && bballScore){
            // console.log("this is running")
            let newData = bballScore.map((item: any, index: number) => {
              let key: keyof typeof nba;
              for(key in nba){
                const nbakey = nba[key]              
                if(key.slice(9, 12) === item.visitor_team.abbreviation){
                  return {id: index,
                    gameId: item.id,
                    user: user.uid,
                    date: scoreDate,
                    [item.home_team.abbreviation]: homeActive, 
                  [item.visitor_team.abbreviation]: awayActive, 
                  wager: wagerAmount,
                  profit: profitAmount,
                  spreadHome: {[item.home_team.abbreviation]: nbakey.fanduel.homeTeamSpread, homeTeam: item.home_team.abbreviation},
                  spreadAway: {[item.visitor_team.abbreviation]: nbakey.fanduel.awayTeamSpread, awayTeam: item.visitor_team.abbreviation}
                }
                } else if(key.slice(9, 11) === item.visitor_team.abbreviation.slice(0, -1)){
                  return {id: index,
                    gameId: item.id,
                    user: user.uid,
                    date: scoreDate,
                    [item.home_team.abbreviation]: homeActive, 
                  [item.visitor_team.abbreviation]: awayActive, 
                  wager: wagerAmount,
                  profit: profitAmount,
                  spreadHome: {[item.home_team.abbreviation]: nbakey.fanduel.homeTeamSpread, homeTeam: item.home_team.abbreviation},
                  spreadAway: {[item.visitor_team.abbreviation]: nbakey.fanduel.awayTeamSpread, awayTeam: item.visitor_team.abbreviation}
                }
              }
              }
            })
            setBballData(newData)
          }
}, [nba, bballScore]);

  // console.log(nba)
  // console.log(bballScore.length)
  // console.log(bballData)

    interface IObjectKeys {
      [key: string]: string | number
    }
    
    const [spread, setSpread] = useState<IObjectKeys>({})


    const handleClick = ({ target, currentTarget }: React.MouseEvent<HTMLButtonElement>, index: number, team: string, away: string) => {
      setBballData((state: any) => {
        if(currentTarget.value === away){
          setHomeActive(false)
          setAwayActive(item => (!item))
          const newArray = bballData.map((item: any) => {return {...item}})
          newArray.find((item: any) => item.id === index)[team] = false;
          newArray.find((item: any) => item.id === index)[currentTarget.value] = !awayActive;
          return newArray
        }
        else if(currentTarget.value === team){
          setAwayActive(false)
          setHomeActive(item => (!item))
          const newArray = bballData.map((item: any) => {return {...item}})
          newArray.find((item: any) => item.id === index)[away] = false;
          newArray.find((item: any) => item.id === index)[currentTarget.value] = !homeActive;
          return newArray
        } 
        return [...state]
      }
      )
    }
    
    const handleBet = (e: any, index: number, home: string, away: string) => {
      e.preventDefault()
      if(bballData[index][home] === false && bballData[index][away] === false){
        setInvalidBet(true)
        setTimeout(() => {
          setInvalidBet(false)
        }, 500)
        // console.log("Please choose a team to bet on")
      } else{
        setValidBet(true)
        setTimeout(() => {
          setValidBet(false)
        }, 500)
        // console.log("Bet sent to firebase")
        addDocument(bballData[index])
      }
      // console.log("Bet Amount", wagerAmount, "Index", index, bballData[index], user.uid)
    }

    const getWager = (e: any, index: any, id: number) => {
      setWagerAmount(e.target.value)
      setProfitAmount(Math.round(e.target.value * 1.91) - e.target.value)
      if(e.target.value < 0){
        e.target.value = 1
      } else if(e.target.value === ""){
        e.target.value = 1
      }
      setBballData((state: any) => {
          const newArray = bballData.map((item: any) => {return {...item}})
          newArray.find((item: any) => item.id == index)["wager"] = e.target.valueAsNumber;
          newArray.find((item: any) => item.id == index)["profit"] = (Math.round(e.target.valueAsNumber * 1.91) - e.target.valueAsNumber);
          return newArray
      })
    }

    let homeSpread = ""
    let awaySpread = ""

    // console.log(bballScore)

      return (
        <>
        {/* {(bballScore === null || (Array.isArray(bballScore) && bballScore.length === 0)) && (<h1 className='loading'>No NBA Games Today</h1>)}             */}
        {isPending && <h1 className = "loading">Loading Games...</h1>}
        {invalidBet && <h1 className = "betFail loading">Bet Unsuccessful...</h1>}
        {validBet && <h1 className = "betSuccess loading">Bet Successful!</h1>}
          <main className = "main">
            <div className = "game-container">
              {(bballScore && nba) && bballScore.map((item: any, index: number) => {
                let key: keyof typeof nba;
                for(key in nba){
                  const final = nba[key]
                  if(key.slice(9, 12) === item.visitor_team.abbreviation){
                      homeSpread = final.fanduel.homeTeamSpread
                      awaySpread = final.fanduel.awayTeamSpread
                      // console.log("first if ran")
                      // console.log(key.slice(9, 12), awaySpread, item.home_team.abbreviation, homeSpread)
                      break
                    } 
                    else if(key.slice(-3) === item.home_team.abbreviation){
                      // console.log(key.slice(9, 11), item.visitor_team.abbreviation.slice(0, -1))
                      homeSpread = final.fanduel.homeTeamSpread
                      awaySpread = final.fanduel.awayTeamSpread
                      // console.log("second if ran")
                      // console.log(key.slice(9, 11), awaySpread, item.home_team.abbreviation.slice(0, -1), homeSpread)
                      break
                    }
                    else if(key.slice(9, 11) === item.visitor_team.abbreviation.slice(0, -1)){
                      // console.log(key.slice(9, 11), item.visitor_team.abbreviation.slice(0, -1))
                      homeSpread = final.fanduel.homeTeamSpread
                      awaySpread = final.fanduel.awayTeamSpread
                      // console.log("third if ran")
                      // console.log(key.slice(9, 11), awaySpread, item.home_team.abbreviation.slice(0, -1), homeSpread)
                      // console.log(bballData)
                  }
                }
                  return (
                    <div className = "game" key = {item.id}>
                      <h1>@{item.home_team.full_name} {homeSpread}</h1>
                      <h1>{item.visitor_team.full_name} {awaySpread}</h1> 
                      <h1 className = "score">{item.home_team.abbreviation} <span>{item.home_team_score} - {item.visitor_team_score}</span> {item.visitor_team.abbreviation}</h1>
                      <form onSubmit = {(e) => handleBet(e, index, item.home_team.abbreviation, item.visitor_team.abbreviation)}>
    
                        {bballData && (<button 
                        key = {item.home_team.id}
                        type = "button"
                        className = {`bet bet1 ${bballData[index][item.home_team.abbreviation] ? "betActive" : ""}`}
                        value = {item.home_team.abbreviation}
                        onClick = {(e) => {handleClick(e, index, item.home_team.abbreviation, item.visitor_team.abbreviation)}}
    
                        >{item.home_team.abbreviation} {homeSpread}
                        </button>)}
                        
                        {bballData && (<button className = {`bet bet2 ${bballData[index][item.visitor_team.abbreviation] ? "betActive" : ""}`}
                        key = {item.visitor_team.id}
                        type = "button"
                        value = {item.visitor_team.abbreviation}
                        onClick = {(e) => {handleClick(e, index, item.home_team.abbreviation, item.visitor_team.abbreviation)}}
                        >{item.visitor_team.abbreviation} {awaySpread}</button>)}
    
                        <input type = "number" min = "1" className = "wager" 
                        
                        onChange = {(e) => {getWager(e, index, item.id)}}>
    
    
                        </input>
                        
                        <button className = {`${bballScore[index]["status"].includes("Qtr") || bballScore[index]["status"].includes("Final") ? "disabledButton" : "betButton" }`}
                        disabled = {bballScore[index]["status"].includes("Qtr") || bballScore[index]["status"].includes("Final") ? true : false}
                        type = "submit"
                        >Bet</button>
    
    
                      </form>
    
                    </div>
                  )
                })}
            </div>
        </main>
        </>
      )
    }

