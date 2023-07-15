import { useEffect, useState } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

type SigningUp = {
    state: any,
    name: any
}

export const useSignup = () => {
    const navigate = useNavigate()
    const {dispatch} = useAuthContext()

    const [isCancelled, setisCancelled] = useState<boolean>(false)
    const [error, setError] = useState<any>(null)
    const [isPending, setIsPending] = useState<any>(null)

    const signup = async (email: string, password: string, displayName: string) => {
        setError(null)
        setIsPending(true)

        try{
            const res = await projectAuth.createUserWithEmailAndPassword(email, password)

            // If no response, e.g network connection is bad
            if(!res){
                throw new Error("Could not complete signup")
            }

            // Add Display Name to User

            if(res.user){
                res.user.updateProfile({displayName})
                // Dispatch Login Action

                dispatch({type: "LOGIN", payload: res.user})
                navigate("/")
            }

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
    
    return {error, isPending, signup}

}