import React from 'react'
import { Button, Container, Text, Content } from 'native-base'
const Sos = () => {
  return (
    <Container>
      <Content contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
        <Button block light
          style={{ padding: 10, alignSelf: 'center', margin: 10 }}
        >
          <Text style={{ fontSize: 30,  color: '#1e3d59' }}>Emergency call</Text>
        </Button>

        <Button block light
          style={{ padding: 10, alignSelf: 'center', margin: 10 }}
        >
          <Text style={{ fontSize: 30, color: '#1e3d59' }}>Send location</Text>
        </Button>
      </Content>
    </Container>
  )
}

export default Sos
