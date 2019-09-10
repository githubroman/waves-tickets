import React, {useState, useEffect} from 'react';
import { ScrollView, StyleSheet, TextInput, View, FlatList, Text, Modal, TouchableHighlight, Dimensions, Image, AsyncStorage } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { issue, broadcast, invokeScript, nodeInteraction, waitForTx } from '@waves/waves-transactions';
const nodeUrl = 'https://testnodes.wavesnodes.com/';

const data = {
  timestamp: 1567884743,
  title: 'Концерт "Ленинград"',
  place: 'Олимпийский',
  description: 'Концерт в Олимпийском. Все самые любимые песни для Вас.',
  image: 'url',
  price: '10800',
}

const buyTicket = async (uniqId, price, cb) => {
  const seed = await AsyncStorage.getItem('@Store:seed');
  const dApp = await AsyncStorage.getItem('@Store:dApp');
  try {
    const signedInvokeScript = invokeScript({
      dApp,
      call: {
        function: 'buyTicket',
        args: [{
          type: 'string',
          value: uniqId,
        }],
      },
      payment: [{ amount: price, assetId: null }],
      chainId: 'T'
    }, seed)
    broadcast(signedInvokeScript, nodeUrl).then(resp => {
      cb(null, resp);
    })
  } catch (err) {
    cb(err)
  }

}


export default function EventScreen(props) {
  const [event, setEvent] = useState(data);
  const [count, setCount] = useState(1);

  useEffect(() => {
    setEvent(props.navigation.state)
    console.log(props.navigation.state)
  });

  return (
    <View style={s.container}>
      <ScrollView style={s.container}>
        <View>
          <View style={s.itemCenter}>
            <Text style={s.itemTitle}>
              {event.params ? event.params.name : null}
            </Text>
          </View>

          <View style={s.itemImage}>
            <Image
              style={{ width: 200, height: 200 }}
              source={require('../assets/images/luna.png')}
            />
          </View>

          <View style={s.itemInfo}>
            <Text style={s.itemTimestamp}>
              {event.params ? event.params.description : null}
            </Text>
          </View>

          <View style={s.itemInfo}>
            <Text style={s.itemTimestamp}>
              Место и время: Олимпийский 09.12.2019 в 19:00
            </Text>
          </View>

          <View style={{alignItems:'center'}}>
            <View style={s.itemHorizontal}>
              <View style={s.itemInfo}>
                <Text style={s.itemTimestamp}>
                  Стоимость:
                </Text>
                <Text style={s.itemPrice}>
                  {event.params ? event.params.price/100000000: null}
                </Text>
              </View>
              <View style={s.itemInfo}>
                <Text style={s.itemTimestamp}>
                  Количество:
                </Text>
                <View style={s.itemHorizontal}>
                  <TouchableHighlight
                    title="-"
                    style={s.buttonCount}
                    onPress={()=>{setCount(count-1)}}
                  >
                    <Text>-</Text>
                  </TouchableHighlight>
                  <Text style={s.itemPrice}>
                    {count}
                  </Text>
                  <TouchableHighlight
                    title="+"
                    style={s.buttonCount}
                    onPress={()=>{setCount(count+1)}}
                  >
                    <Text>+</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>


          <View style={s.itemCenter}>
            <TouchableHighlight
              title="Вход"
              style={s.button}
              onPress={()=>{
                if (event.params) {
                  // console.log(event.params.price);
                  // console.log(event.params);
                  buyTicket(event.params.uniqId, event.params.price, async (err, tx) => {
                    console.log(err, tx)
                    let tickets = []
                    // await AsyncStorage.setItem('@Store:tickets',JSON.stringify(tickets));
                    tickets = JSON.parse(await AsyncStorage.getItem('@Store:tickets'));
                    console.log(123,tickets);
                    if (tickets.length>0) {
                      tickets.push({uniqId:event.params.assetId, count: count, price:event.params.price })
                    } else {
                      tickets = [{uniqId:event.params.assetId, count: count, price:event.params.price}]
                    }

                    console.log(tickets);
                    await AsyncStorage.setItem('@Store:tickets',JSON.stringify(tickets));
                  });
                }
              }}
            >
              <Text style={s.textButton}>Купить</Text>
            </TouchableHighlight>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

EventScreen.navigationOptions = {
  title: 'Событие',
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  input: {
    margin: 5,
    padding: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    // fontSize: 16,
    // color: '#2e78b7',
    backgroundColor: 'rgba(21, 30, 51, 0.01)',
    boxShadow: 'inset 0px 0px 10px rgba(21, 30, 51, 0.2)'
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    //fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  itemTimestamp: {
    paddingLeft: 5,
    fontSize: 14,
    // color: 'gray'
  },
  itemPrice: {
    paddingLeft: 5,
    fontSize: 20,
    //fontWeight: 'bold',
    // color: 'gray'
  },
  itemTitle: {
    paddingLeft: 5,
    fontSize: 16,
    //fontWeight: 500,
    color: 'black'
  },
  itemPlace: {
    paddingLeft: 5,
    fontSize: 12,
    color: 'gray'
  },
  itemCenter: {
    alignItems: 'center',
    flex: 1,
    padding: 10,
    fontSize: 18,
    height: 44,
    // borderBottom: 'solid 1px gray',
    // borderBottomColor: 'rgba(0,0,0,0.05)',
    // borderBottomWidth: 1,
  },
  itemImage: {
    alignItems: 'center'
  },
  itemInfo: {
    // alignItems: 'center'
    padding: 10,
  },
  itemHorizontal: {
    flexDirection: 'row',
    // alignItems: 'center'
    // padding: 10,
  },
  item: {
    flexDirection: 'row',
    // alignItems: 'center'
    // padding: 10,
  },
  button: {
    alignItems: 'center',
    margin: 5,
    padding: 10,
    height: 40,
    width: 100,
    // borderColor: 'gray',
    // borderWidth: 1,
    // borderRadius: 20,
    backgroundColor: '#42a5f5',
    color: '#fff',
    // boxShadow: '0px 5px 15px rgba(21, 30, 51, 0.2)'
  },
  buttonCount: {
    alignItems: 'center',
    margin: 5,
    padding: 3,
    height: 25,
    width: 25,
    // borderColor: 'gray',
    // borderWidth: 1,
    // borderRadius: 20,
    backgroundColor: '#fff',
    color: '#fff',
    // boxShadow: '0px 5px 15px rgba(21, 30, 51, 0.2)'
  },
  textButton: {
    color: '#fff',
  }
});
