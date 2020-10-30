import { Button, Container, Text, Content } from 'native-base'
import React from 'react'
import StyleSheet from 'react-native'

const Home = ({ navigation }) => {
  return (
    <Container>
      <Content contentContainerStyle={{ flex: 1, justifyContent: 'center', backgroundColor: '#1e3d59' }}>
        <Button block light
          style={{ padding: 10, alignSelf: 'center', margin: 10, width: 150 }}
          onPress={() => navigation.navigate('Map')}
        >
          <Text style={{ fontSize: 30,  color: '#1e3d59' }}>Start</Text>
        </Button>

        <Button block danger
          style={{ padding: 10, alignSelf: 'center', margin: 10, width: 150 }}
          onPress={() => navigation.navigate('Sos')}
        >
          <Text style={{ fontSize: 30, color: '#1e3d59' }}>SOS</Text>
        </Button>
      </Content>
    </Container>
  )
}


export default Home

