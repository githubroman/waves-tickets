import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import EventsScreen from '../screens/EventsScreen';
import EventScreen from '../screens/EventScreen';
import MyTicketsScreen from '../screens/MyTicketsScreen';
import NewEventScreen from '../screens/NewEventScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

///////////////////////////////
///////////////////////////////
///////////////////////////////

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Вход',
  // tabBarIcon: ({ focused }) => (
  //   <TabBarIcon
  //     focused={focused}
  //     style={styles.container}
  //     source={require('../assets/images/icons/events.png')}
  //   />
  // ),
};

HomeStack.path = '';

///////////////////////////////
///////////////////////////////
///////////////////////////////

const EventsStack = createStackNavigator(
  {
    Home: HomeScreen,
    Events: EventsScreen,
    Event: EventScreen,
  },
  config
);

EventsStack.navigationOptions = {
  tabBarLabel: 'События',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      style={styles.container}
      source={require('../assets/images/icons/events.png')}
    />
  ),
};

EventsStack.path = '';

///////////////////////////////
///////////////////////////////
///////////////////////////////

const MyTicketsStack = createStackNavigator(
  {
    Settings: MyTicketsScreen,
  },
  config
);

MyTicketsStack.navigationOptions = {
  tabBarLabel: 'Билеты',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      style={styles.container}
      source={require('../assets/images/icons/tickets.png')}
    />
  ),
};

MyTicketsStack.path = '';


///////////////////////////////
///////////////////////////////
///////////////////////////////

const NewEventStack = createStackNavigator(
  {
    Settings: NewEventScreen,
  },
  config
);

NewEventStack.navigationOptions = {
  tabBarLabel: 'Добавить событие',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      style={styles.containerLittle}
      source={require('../assets/images/icons/plus.png')}
    />
  ),
};

NewEventStack.path = '';

///////////////////////////////
///////////////////////////////
///////////////////////////////

const tabNavigator = createBottomTabNavigator({
  // HomeStack,
  EventsStack,
  // EventStack,
  MyTicketsStack,
  NewEventStack,
},{
  tabBarOptions: {
    activeTintColor: 'black',
    inactiveTintColor: 'white',
    showLabel: true,
    showIcon: true,
    style: {
      backgroundColor: '#42a5f5',
      boxShadow: '0px 0px 15px rgba(21, 30, 51, 0.3)',
    }
  },
});

tabNavigator.path = '';

const styles = StyleSheet.create({
  container: {
    width: 25, height: 25,
  },
  containerLittle: {
    width: 15, height: 15,
  },
});



export default tabNavigator;
