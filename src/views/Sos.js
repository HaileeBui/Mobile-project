import React from 'react'
import { Button, Container, Text, Content, View, Icon } from 'native-base'
const Sos = () => {
  return (
    <Container>
      <Content contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ padding: 10, alignSelf: 'center' }}>
          <Button rounded
            style={{ marginBottom: 20, backgroundColor: '#ff6e40', flex: 1 }}
          >
            <Text style={{ fontSize: 30, color: '#1e3d59' }}>Emergency call</Text>
          </Button>

          <Button rounded
            style={{ backgroundColor: '#ff6e40', flex: 1 }}
          >
            <Text style={{ fontSize: 30, color: '#1e3d59' }}>Send location</Text>
          </Button>
        </View>
      </Content>
    </Container>
  )
}

export default Sos
