import { Button, Container, Text, Content, View } from 'native-base'
import React from 'react'
import StyleSheet from 'react-native'

const Home = ({ navigation }) => {
  return (
    <Container>
      <Content contentContainerStyle={{ flex: 1, justifyContent: 'center', backgroundColor: '#1e3d59' }}>
        <View style={{ padding: 10, alignSelf: 'center' }}>
          <Button rounded
            style={{ marginBottom: 20, backgroundColor: '#ff6e40', flex: 1 }}
            onPress={() => navigation.navigate('Map')}
          >
            <Text style={{ fontSize: 30, color: '#1e3d59' }}>Start</Text>
          </Button>

          <Button rounded
            style={{ backgroundColor: '#ff6e40', flex: 1 }}
            onPress={() => navigation.navigate('Sos')}
          >
            <Text style={{ fontSize: 30, color: '#1e3d59' }}>SOS</Text>
          </Button>
        </View>
      </Content>
    </Container>
  )
}


export default Home

