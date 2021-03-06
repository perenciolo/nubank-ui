import React from 'react';

import { Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  Container,
  Content,
  Card,
  CardHearder,
  CardContent,
  CardFooter,
  Title,
  Description,
  Annotation,
} from './styles';

import Header from '~/components/Header';
import Tabs from '~/components/Tabs';
import Menu from '~/Menu';

function Main() {
  let offset = 0;
  const translateY = new Animated.Value(0);

  const animatedEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true },
  );

  function onHandlerStateChange(event) {
    const { translationY, oldState } = event.nativeEvent;

    if (oldState === State.ACTIVE) {
      let opened = false;

      offset += translationY;

      if (translationY >= 100) {
        opened = true;
      } else {
        translateY.setValue(offset);
        translateY.setOffset(0);
        offset = 0;
      }

      Animated.timing(translateY, {
        toValue: opened ? 380 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        offset = opened ? 380 : 0;

        translateY.setOffset(offset);
        translateY.setValue(0);
      });
    }
  }

  return (
    <Container>
      <Header />
      <Content>
        <Menu translateY={translateY} />
        <PanGestureHandler
          onGestureEvent={animatedEvent}
          onHandlerStateChange={onHandlerStateChange}>
          <Card
            style={{
              transform: [
                {
                  translateY: translateY.interpolate({
                    inputRange: [-350, 0, 380],
                    outputRange: [-50, 0, 380],
                    extrapolate: 'clamp', // Limit translate
                  }),
                },
              ],
            }}>
            <CardHearder>
              <Icon name="attach-money" size={28} color="#666" />
              <Icon name="visibility-off" size={28} color="#666" />
            </CardHearder>
            <CardContent>
              <Title>Saldo Disponível</Title>
              <Description>R$ 197.611,65</Description>
            </CardContent>
            <CardFooter>
              <Annotation>
                Transferência de R$ 40.000,00 recebida de Gilson Gennes hoje às
                9h30
              </Annotation>
            </CardFooter>
          </Card>
        </PanGestureHandler>
      </Content>
      <Tabs translateY={translateY} />
    </Container>
  );
}

export default Main;
