import { useState, useEffect } from 'react'
import { projectAuth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'

export default function useLogin() {
    const navigate = useNavigate()
    const [isCancelled, setisCancelled] = useState<boolean>(false)
    const [error, setError] = useState<any>(null)
    const [isPending, setIsPending] = useState<boolean>(false)
    const {dispatch} = useAuthContext()

    const login = async (email: string, password: string) => {
        setError(null)
        setIsPending(true)

        try{
            const res = await projectAuth.signInWithEmailAndPassword(email, password)

            // Dispatch Login Action

            dispatch({type: "LOGIN", payload: res.user})
            navigate("/")
            if(!isCancelled){
                setIsPending(false)
                setError(null)
            }
           
        }

        catch(err: any){
            if(!isCancelled){
            console.log(err.message)
            setError(err.message)
            setIsPending(false)
        }
        }

    }

    useEffect(() => {
        return () => {
            setisCancelled(true)
        }
    }, [])

    return (
        {login, error, isPending}
    )
}
