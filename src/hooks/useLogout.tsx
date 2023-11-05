import { useState, useEffect } from 'react'
import { projectAuth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'


export default function useLogout() {
    const navigate = useNavigate()
    const [isCancelled, setisCancelled] = useState<boolean>(false)
    const [error, setError] = useState<any>(null)
    const [isPending, setIsPending] = useState<boolean>(false)
    const {dispatch} = useAuthContext()

    const logout = async () => {
        setError(null)
        setIsPending(true)

        try{
            await projectAuth.signOut()

            // Dispatch Login Action

            dispatch({type: "LOGOUT"})
            navigate("/")
            if(!isCancelled){
                setIsPending(false)
                setError(null)
            }
           
        }

        catch(err: any){
            if(!isCancelled){
            // console.log(err.message)
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
        {logout, error, isPending}
    )
}
