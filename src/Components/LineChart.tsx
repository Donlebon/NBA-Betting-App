import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';
import {CategoryScale} from 'chart.js'; 
import { projectFirestore } from '../firebase/config';
import { getParseTreeNode } from 'typescript';

ChartJS.register(CategoryScale);

export default function LineChart(props: any){
    const [bettingData, setBettingData] = useState<any>(null)
    let ref = useRef(props.startingAmount)
    
    useEffect(() => {
      ref.current = Number(props.startingAmount)
    }, [props.startingAmount])


    useEffect(() => {
        if(props.nbaProfits){
            let profits = props.nbaProfits.map((item: any) => {
                ref.current += Number(item.profit)
                return ref.current
            })
            let numberofBets = props.nbaProfits.map((item: any, index: number) => index + 1)
            const bettingHistory = {
                labels: numberofBets,
                datasets: [{
                    label: "Profit Chart",
                    data: profits,
                    backgroundColor: "green",
                    borderColor: "green",
                    tension: 0.4,
                    color: "dark",
                }],
            }
            setBettingData(bettingHistory)
        }
    },[props.nbaProfits])

    const axisOptions = {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Profit Amount',
              color: "dark",
            }
          },
          x: {
            title: {
              display: true,
              text: 'Number of Bets',
              color: "dark",
            }
          }
        }
      }

    return (
        <div>
            {bettingData && <Line data = {bettingData} options = {axisOptions} className = "chart"/>}
        </div> 
    )
}

