import { useReducer, useEffect, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";

enum ActionKind {
    ISPENDING = 'IS_PENDING',
    ADDEDDOCUMENT = 'ADDED_DOCUMENT',
    ERROR = "ERROR"
}

interface firstAction {
    type: ActionKind;
    payload: any | string;
  }

interface firstState{
    document: string | null,
    isPending: boolean,
    error: any ,
    success: boolean | null
}

let initialState = {
    document: null,
    isPending: false, 
    error: null,
    success: null
}

const fireStoreReducer = (state: firstState, action: firstAction) => {
    switch (action.type) {
        case ActionKind.ISPENDING:
            return {isPending: true, document: null, success: false, error: null}
        case ActionKind.ADDEDDOCUMENT:
            return {isPending: false, document: action.payload, success: true, error: null}
        case ActionKind.ERROR:
            return {isPending: false, document: null, success: false, error: action.payload}
        default:
            return state
    }
}

export const useFireStore = (collection: any) => {
    const [response, dispatch] = useReducer(fireStoreReducer, initialState)
    const [isCancelled, setIsCancelled] = useState<boolean>(false)

    // Collection ref
    const ref = projectFirestore.collection(collection)

    // Only Dispatch if not cancelled

    const dispatchIfNotCancelled = (action: firstAction) => {
        if(!isCancelled){
            dispatch(action)
        }
    }

    // Add a Document
    const addDocument = async (doc: any) => {
        dispatch({type: ActionKind.ISPENDING, payload: null})

        try{
            const createdAt = timestamp.fromDate(new Date())
            const addedDocument = await ref.add({...doc, createdAt})
            dispatchIfNotCancelled({type: ActionKind.ADDEDDOCUMENT, payload: addedDocument})
        }

        catch(err: any){
            dispatchIfNotCancelled({type: ActionKind.ERROR, payload: err.message})
        }

    }

    // Update a Document

    // const updateDocument = async (doc: any) => {

    // }

    // // Delete a Document
    // const deleteDocument = (id) => {

    // }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return {addDocument, response}

}