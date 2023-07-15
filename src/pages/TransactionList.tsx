import { useEffect, useState } from 'react'
import { projectFirestore } from '../firebase/config'

export function TransactionList (props: any){
    const allBets = props.transactions
    const [prevData, setPrevData] = useState(null)
    const [boxScore, setBoxScore] = useState<any>([])


    const [betResult, setBetResult] = useState<string>("")
    const [profit, setProfit] = useState<boolean>(false)


    const url = "https://www.balldontlie.io/api/v1/games?"
    const games = "start_date=2023-02-08&end_date=2023-02-08"


//     let updateCollection = projectFirestore.collection("transactions").doc("${doc.id}")
// updateCollection.update({
//     finished: true

// })

    const fetchPractice = async () => {
        await Promise.all(
            allBets.map(async (item: any) => {
            const response = await fetch(`https://www.balldontlie.io/api/v1/games/${item.gameId}`)
            const gameData = await response.json()
            setBoxScore((prev: any) => {
                return [...prev, gameData]
            })
        })
        )
    }

    useEffect(() => {
        fetchPractice()
    }, [allBets])
    
    
    if(allBets.length === boxScore.length){
        console.log(allBets, "allbets")
        console.log(boxScore, "boxScore")
    }

    if(allBets.length === 0){
        return <h1 className = "noBet">No Bets Found!</h1>
    }
    
    return (
        <div className = "bet-container">
        {allBets.map((item: any) => {
            if (allBets.length === boxScore.length){
                let targetGame = boxScore.filter((gameItem: any) => gameItem.id === item.gameId)
                    if(targetGame[0].status !== "Final"){
                        return (
                            <div key = {item.docid} className = "bets">
                                <h1 className = "game">{item.date}</h1>
                                <h1 className = "game">{targetGame[0].home_team.abbreviation} {targetGame[0].home_team_score} - {targetGame[0].visitor_team_score} {targetGame[0].visitor_team.abbreviation} </h1>
                                <p className = "result">Pending</p>
                                <div className = "teamSpread">
                                    {item[item.spreadHome.homeTeam] && <p className = "myTeam">{item.spreadHome.homeTeam} <span className = "spread">{item.spreadHome[item.spreadHome.homeTeam]}</span></p>}
                                    {item[item.spreadAway.awayTeam] && <p className = "myTeam">{item.spreadAway.awayTeam} <span className = "spread">{item.spreadHome[item.spreadHome.homeTeam]}</span></p>}
                                    <p className = "odds">-110</p>
                                </div>
                                <div className = "wagerAmount">
                                    <p className = "betAmount">Wager: ${item.wager}</p>
                                    <p className = "profit">Profit: Pending</p>
                                </div>
                            </div>
                    )
                    }
                    else if(targetGame[0].status === "Final"){
                        if((item[targetGame[0].home_team.abbreviation] === false)){
                            // console.log("Check if First Bet is true - OKC does not equal FALSE or means LAL bet is TRUE")
                            let finalHomeCount = Number(targetGame[0].home_team_score) + Number(item.spreadHome[targetGame[0].home_team.abbreviation])
                            if(finalHomeCount > targetGame[0].visitor_team_score){ 
                                    let updateCollection = projectFirestore.collection("transactions").doc(`${item.docid}`)
                                    updateCollection.update({
                                        finished: true,
                                        profit: `${-item.wager}`
                                    })
                                    return (
                                            <div key = {item.docid} className = "bets">
                                               <h1 className = "game">{item.date}</h1>
                                                <h1 className = "game">{targetGame[0].home_team.abbreviation} {targetGame[0].home_team_score} - {targetGame[0].visitor_team_score} {targetGame[0].visitor_team.abbreviation} </h1>
                                                <p className = "result">Loss</p>
                                                <div className = "teamSpread">
                                                    {item[item.spreadHome.homeTeam] && <p className = "myTeam">{item.spreadHome.homeTeam} <span className = "spread">{item.spreadHome[item.spreadHome.homeTeam]}</span></p>}
                                                    {item[item.spreadAway.awayTeam] && <p className = "myTeam">{item.spreadAway.awayTeam} <span className = "spread">{item.spreadAway[item.spreadAway.awayTeam]}</span></p>}
                                                    <p className = "odds">-110</p>
                                                </div>
                                                <div className = "wagerAmount">
                                                    <p className = "betAmount">Wager: ${item.wager}</p>
                                                    <p className = "profit loss">Profit: -${item.wager}</p>
                                                </div>
                                            </div>
                                    )
                                }
                            else if(finalHomeCount < targetGame[0].visitor_team_score){
                                let updateCollection = projectFirestore.collection("transactions").doc(`${item.docid}`)
                                    updateCollection.update({
                                        finished: true
                                    })
                                // console.log("first instance, no profit ran")
                                // console.log(item[item.spreadHome.homeTeam], item.spreadHome.homeTeam, item[item.spreadAway.awayTeam], item.spreadAway.awayTeam)
                                return (
                                    <div key = {item.docid} className = "bets">
                                        <h1 className = "game">{item.date}</h1>
                                        <h1 className = "game">{targetGame[0].home_team.abbreviation} {targetGame[0].home_team_score} - {targetGame[0].visitor_team_score} {targetGame[0].visitor_team.abbreviation} </h1>
                                        <p className = "result">Win</p>
                                        <div className = "teamSpread">
                                            {item[item.spreadHome.homeTeam] && <p className = "myTeam">{item.spreadHome.homeTeam} <span className = "spread">{item.spreadHome[item.spreadHome.homeTeam]}</span></p>}
                                            {item[item.spreadAway.awayTeam] && <p className = "myTeam">{item.spreadAway.awayTeam} <span className = "spread">{item.spreadAway[item.spreadAway.awayTeam]}</span></p>}
                                            <p className = "odds">-110</p>
                                        </div>
                                        <div className = "wagerAmount">
                                            <p className = "betAmount">Wager: ${item.wager}</p>
                                            <p className = "profit win">Profit: ${Math.round(item.wager * 1.91) - item.wager}</p>
                                        </div>
                                    </div>
                                )
                            }
                            else if(finalHomeCount === targetGame[0].visitor_team_score){
                                return (
                                    <div key = {item.docid} className = "bets">
                                        <h1 className = "game">{item.date}</h1>
                                        <h1 className = "game">{targetGame[0].home_team.abbreviation} {targetGame[0].home_team_score} - {targetGame[0].visitor_team_score} {targetGame[0].visitor_team.abbreviation} </h1>
                                        <p className = "result">Tie</p>
                                        <div className = "teamSpread">
                                            {item[item.spreadHome.homeTeam] && <p className = "myTeam">{item.spreadHome.homeTeam} <span className = "spread">{item.spreadHome[item.spreadHome.homeTeam]}</span></p>}
                                            {item[item.spreadAway.awayTeam] && <p className = "myTeam">{item.spreadAway.awayTeam} <span className = "spread">{item.spreadAway[item.spreadAway.awayTeam]}</span></p>}
                                            <p className = "odds">-110</p>
                                        </div>
                                        <div className = "wagerAmount">
                                            <p className = "betAmount">Wager: ${item.wager}</p>
                                            <p className = "profit">Profit: $0</p>
                                        </div>
                                    </div>
                            )
                            }
                        }
                        else if(item[targetGame[0].home_team.abbreviation] === true){
                            let finalHomeCount = Number(targetGame[0].home_team_score) + Number(item.spreadHome[targetGame[0].home_team.abbreviation])
                            if(finalHomeCount > targetGame[0].visitor_team_score){ 
                                let updateCollection = projectFirestore.collection("transactions").doc(`${item.docid}`)
                                updateCollection.update({
                                    finished: true,
                                })
                                    return (
                                            <div key = {item.docid} className = "bets">
                                                <h1 className = "game">{item.date}</h1>
                                                <h1 className = "game">{targetGame[0].home_team.abbreviation} {targetGame[0].home_team_score} - {targetGame[0].visitor_team_score} {targetGame[0].visitor_team.abbreviation} </h1>
                                                <p className = "result">Win</p>
                                                <div className = "teamSpread">
                                                    {item[item.spreadHome.homeTeam] && <p className = "myTeam">{item.spreadHome.homeTeam} <span className = "spread">{item.spreadHome[item.spreadHome.homeTeam]}</span></p>}
                                                    {item[item.spreadAway.awayTeam] && <p className = "myTeam">{item.spreadAway.awayTeam} <span className = "spread">{item.spreadAway[item.spreadAway.awayTeam]}</span></p>}
                                                    <p className = "odds">-110</p>
                                                </div>
                                                <div className = "wagerAmount">
                                                    <p className = "betAmount">Wager: ${item.wager}</p>
                                                    <p className = "profit win">Profit: ${Math.round(item.wager * 1.91) - item.wager}</p>
                                                </div>
                                            </div>
                                    )
                                }
                            else if(finalHomeCount < targetGame[0].visitor_team_score){
                                let updateCollection = projectFirestore.collection("transactions").doc(`${item.docid}`)
                                updateCollection.update({
                                    finished: true,
                                    profit: `${-item.wager}`
                                })
                                // console.log(item[targetGame[0].home_team.abbreviation], targetGame[0].home_team_score, targetGame[0].visitor_team_score, "this second false ran")
                                return (
                                    <div key = {item.docid} className = "bets">
                                        <h1 className = "game">{item.date}</h1>
                                        <h1 className = "game">{targetGame[0].home_team.abbreviation} {targetGame[0].home_team_score} - {targetGame[0].visitor_team_score} {targetGame[0].visitor_team.abbreviation} </h1>
                                        <p className = "result">Loss</p>
                                        <div className = "teamSpread">
                                            {item[item.spreadHome.homeTeam] && <p className = "myTeam">{item.spreadHome.homeTeam} <span className = "spread">{item.spreadHome[item.spreadHome.homeTeam]}</span></p>}
                                            {item[item.spreadAway.awayTeam] && <p className = "myTeam">{item.spreadAway.awayTeam} <span className = "spread">{item.spreadAway[item.spreadAway.awayTeam]}</span></p>}
                                            <p className = "odds">-110</p>
                                        </div>
                                        <div className = "wagerAmount">
                                            <p className = "betAmount">Wager: ${item.wager}</p>
                                            <p className = "profit loss">Profit: -${item.wager}</p>
                                        </div>
                                    </div>
                            )
                            }
                            else if(finalHomeCount === targetGame[0].visitor_team_score){
                                return (
                                    <div key = {item.docid} className = "bets">
                                        <h1 className = "game">{item.date}</h1>
                                        <h1 className = "game">{targetGame[0].home_team.abbreviation} {targetGame[0].home_team_score} - {targetGame[0].visitor_team_score} {targetGame[0].visitor_team.abbreviation} </h1>
                                        <p className = "result">Tie</p>
                                        <div className = "teamSpread">
                                            {item[item.spreadHome.homeTeam] && <p className = "myTeam">{item.spreadHome.homeTeam} <span className = "spread">{item.spreadHome[item.spreadHome.homeTeam]}</span></p>}
                                            {item[item.spreadAway.awayTeam] && <p className = "myTeam">{item.spreadAway.awayTeam} <span className = "spread">{item.spreadAway[item.spreadAway.awayTeam]}</span></p>}
                                            <p className = "odds">-110</p>
                                        </div>
                                        <div className = "wagerAmount">
                                            <p className = "betAmount">Wager: ${item.wager}</p>
                                            <p className = "profit">Profit: $0</p>
                                        </div>
                                    </div>
                            )
                            }
                        }
                    }
            }
                
                        
                   

            // return (
            //     <div key = {item.docid} className = "bets">
            //         <h1 className = "game">@{item.spreadHome.homeTeam} vs {item.spreadAway.awayTeam} - {item.date}</h1>
            //         <div className = "teamSpread">
            //             {item[item.spreadHome.homeTeam] && <p className = "myTeam">{item.spreadHome.homeTeam} <span className = "spread">{item.spreadHome[item.spreadHome.homeTeam]}</span></p>}
            //             {item[item.spreadAway.awayTeam] && <p className = "myTeam">{item.spreadAway.awayTeam} <span className = "spread">{item.spreadHome[item.spreadHome.homeTeam]}</span></p>}
            //             <p className = "odds">-110</p>
            //         </div>
            //         <div className = "wagerAmount">
            //             <p className = "betAmount">Wager: ${item.wager}</p>
            //             <p className = "result">Win</p>
            //             <p className = "profit">Profit: ${Math.round(item.wager * 1.91) - item.wager}</p>
            //         </div>
            //     </div>
            // )
        })}
        </div>
    )
}
