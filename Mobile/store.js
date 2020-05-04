import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'
import AsyncStorage from '@react-native-community/async-storage'


const StoreContext = createContext([{}, () => { }])

export const useStore = () => {
    const [state, setState] = useContext(StoreContext)
    return [state, setState]
}

export const deleteStore = () => {
    const [state, setState] = useContext(StoreContext)
    return [state, setState]
}

const initialState = { convenio: { efetuarVenda: false }, load: '', usuario: {} }
export const StorePrivider = ({ children }) => {
    const [state, setState] = useState({ carregouDados: false })

    const carregarDados = async () => {
        try {
            const data = await AsyncStorage.getItem('store')
            console.log(data, "data")
            if (!!data) {
                setState({ ...JSON.parse(data), load: '', carregouDados: true })
            } else {
                setState({ load: '', carregouDados: true })
            }

        } catch (error) {

        }
    }

    useEffect(() => {
        carregarDados()
    }, [])
    const salvarDados = async () => {
        try {
            const dadosAntigos = await AsyncStorage.getItem('store')
            if (state != dadosAntigos && state != null) {
                await AsyncStorage.setItem('store', JSON.stringify(state))
                console.log("tentou salvar", state)
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        salvarDados()
    }, [state])

    return (
        <StoreContext.Provider value={[state, setState]}>
            {children}
        </StoreContext.Provider>
    )
}


