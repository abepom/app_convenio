import React from 'react'
import { View, Text } from 'react-native'
import axios from axios
const testes = () => {

  getuser = async() => {
    const user = await axios.get('https://api.github.com/diego3g')
    alert(JSON.stringify(user))
  }
  useEffect(() => {
    getuser()
  }, [])
  return (
    <View>
      <Text>teste</Text>
    </View>
  )
}

export default testes
