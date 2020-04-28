import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { useAsyncStorage } from '@react-native-community/async-storage'


const StoreContext = createContext([initialState, () => { }])

export const useStore = () => {
    const [state, setState] = useContext(StoreContext)
    return [state, setState]
}

export const deleteStore = () => {
    const [state, setState] = useContext(StoreContext)

    return [state, setState]
}
const initialState = { convenio: { efetuarVenda: false }, load: '', usuario: { usuario: '', senha: '' } }

export const StorePrivider = ({ children }) => {
    const { getItem, setItem } = useAsyncStorage('store')
    const [state, setState] = useState(initialState)

    const carregarDados = async () => {
        const data = await getItem()

        console.log(data)
        if (!!data) {

            setState({ ...JSON.parse(data), load: '' })
        } else {
            setState(null)
        }
        //AsyncStorage.clear()
    }

    useEffect(() => {
        carregarDados()
    }, [])

    useEffect(() => {
        setItem(JSON.stringify(state))
    }, [state])

    return (
        <StoreContext.Provider value={[state, setState]}>
            {children}
        </StoreContext.Provider>
    )
}


