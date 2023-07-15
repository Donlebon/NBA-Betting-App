import { useEffect, useState, useRef } from "react"
import { projectFirestore } from "../firebase/config"

interface queryState{
    transaction: string,
    equal: string,
    id: any ,
}

export const useCollection = (collection: any, _query: any, user: string) => {

    const [documents, setDocuments] = useState<any>(null)
    const [error, setError] = useState<any>(null)

    const query = useRef(_query).current

    useEffect(() => {
        let ref
        if(query){
            ref = projectFirestore.collection(collection).where("user", "==", user)
            console.log(ref)
        } else{
            ref = projectFirestore.collection(collection)
        }

        const unsubscribe = ref.onSnapshot((snapshot) => {
            let results: any = []
            snapshot.docs.forEach(doc => {
                results.push({...doc.data(), docid: doc.id})
            })
            console.log(snapshot)
            setDocuments(results)
            setError(null)
        }, (error) => {
            console.log(error)
            setError("Could not fetch data")
        })

        return () => unsubscribe()

    },[collection, query])

    return {documents, error}
}