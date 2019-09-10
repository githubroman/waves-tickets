import React, {useState, useEffect} from 'react';
import { ScrollView, StyleSheet, TextInput, View, FlatList, Text, Modal, TouchableHighlight, Dimensions, AsyncStorage } from 'react-native';
import { issue, broadcast, invokeScript, nodeInteraction, waitForTx } from '@waves/waves-transactions';
import { ExpoLinksView } from '@expo/samples';
const nodeUrl = 'https://testnodes.wavesnodes.com/';
const data = [
  { timestamp: 1567884743, title: 'Концерт "Ленинград"', place: 'Олимпийсий',  },
  { timestamp: 1567884743, title: 'Rammstein cover by Luna', place: 'Филармония имени Ленина',  },
  { timestamp: 1567884743, title: 'Филипп Киркоров "Я и баста"', place: 'Олимпийский',  },
  { timestamp: 1567884743, title: 'Стас Михайлов "10 лет песен под один мотив"', place: 'Олимпийский',  },
  { timestamp: 1567884743, title: 'Евгений Гришковец "Как я съел собаку"', place: 'Филармония имени Ленина',  },
  { timestamp: 1567884743, title: 'Нурлан Сабуров "Маленький странный казах"', place: 'Лужники',  },
  { timestamp: 1567884743, title: 'Концерт "Ленинград"', place: 'Олимпийсий',  },
  { timestamp: 1567884743, title: 'Rammstein cover by Luna', place: 'Филармония имени Ленина',  },
  { timestamp: 1567884743, title: 'Филипп Киркоров "Я и баста"', place: 'Олимпийский',  },
  { timestamp: 1567884743, title: 'Стас Михайлов "10 лет песен под один мотив"', place: 'Олимпийский',  },
  { timestamp: 1567884743, title: 'Евгений Гришковец "Как я съел собаку"', place: 'Филармония имени Ленина',  },
  { timestamp: 1567884743, title: 'Нурлан Сабуров "Маленький странный казах"', place: 'Лужники',  },
  { timestamp: 1567884743, title: 'Концерт "Ленинград"', place: 'Олимпийсий',  },
  { timestamp: 1567884743, title: 'Rammstein cover by Luna', place: 'Филармония имени Ленина',  },
  { timestamp: 1567884743, title: 'Филипп Киркоров "Я и баста"', place: 'Олимпийский',  },
  { timestamp: 1567884743, title: 'Стас Михайлов "10 лет песен под один мотив"', place: 'Олимпийский',  },
  { timestamp: 1567884743, title: 'Евгений Гришковец "Как я съел собаку"', place: 'Филармония имени Ленина',  },
  { timestamp: 1567884743, title: 'Нурлан Сабуров "Маленький странный казах"', place: 'Лужники',  },
]

const getEventInfo = (assetId, cb) => {
  try {
    waitForTx(assetId, { apiBase: nodeUrl, timeout: 10000 }).then((tx) => {
      cb(null, tx)
    })
  } catch (err) {
    cb(err)
  }
}

export default function MyTicketsScreen(props) {
  const [txtSearch, setTxtSearch] = useState('');
  const [myTickets, setMyTickets] = useState('');

  useEffect(() => {

    renderTickets()

  });

  const renderTickets = async () => {
    let result = []
    let tickets = JSON.parse(await AsyncStorage.getItem('@Store:tickets'));
    let promises = []
    if (tickets) {
      tickets.map((item)=>{
        promises.push(new Promise((resolve,reject)=>{
          getEventInfo(item.uniqId, (err,res)=>{
            if (!err) {
              res.price = 200000000
              res.uniqId = item.uniqId
              resolve(res)
            }
          })
        }))
      })
      Promise.all(promises).then(values => {
        setMyTickets(values)
      });
    }

  }

  const sellTicket = async (assetId, price) => {
    const dApp = await AsyncStorage.getItem('@Store:dApp');
    const seed = await AsyncStorage.getItem('@Store:seed');
    const signedInvokeScript = invokeScript({
      dApp,
      call: {
        function: 'createOrder',
        args: [{
          type: 'integer',
          value: price,
        }],
      },
      payment: [{ amount: 1, assetId: assetId }],
      chainId: 'T'
    }, seed)
    broadcast(signedInvokeScript, nodeUrl).then(resp => {
      console.log(resp)
    })
    let tickets = JSON.parse(await AsyncStorage.getItem('@Store:tickets'));
    await AsyncStorage.setItem('@Store:tickets', JSON.stringify(tickets.filter((item) => item.uniqId !== assetId)))
  }

  return (
    <View style={s.container}>
      <View style={{}}>
        <TextInput
        style={s.input}
        onChangeText={text => setTxtSearch(text)}
        value={txtSearch}
        placeholder="🔍"
        />
      </View>



      <ScrollView style={s.container}>
        <View>
          <FlatList
            data={myTickets}
            renderItem={({ item }) =>
              <View style={s.itemView}>
                <View style={s.itemHorizontal}>
                  <Text style={s.itemCount}>{1}</Text>
                  <Text
                    style={s.itemTitle}
                    onClick={()=>{
                      console.log(props);
                      props.navigation.navigate('Event')
                    }}
                  >{item.name}</Text>
                </View>
                <Text style={s.itemTimestamp}>{item.timestamp}</Text>
                <Text style={s.itemPlace}>{item.place}</Text>
                <View style={s.itemHorizontal}>
                  <TouchableHighlight
                    title="Продать"
                    style={s.buttonSell}
                    onPress={()=>{
                      sellTicket(item.uniqId, item.price)
                    }}
                  >
                    <Text style={s.textButton}>Продать</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    title="Чек-ин"
                    style={s.button}
                    onPress={()=>{}}
                  >
                    <Text style={s.textButton}>Чек-ин</Text>
                  </TouchableHighlight>
                </View>
              </View>
            }
            keyExtractor={(item, index) => index}
          />
        </View>
      </ScrollView>
    </View>
  );
}

MyTicketsScreen.navigationOptions = {
  title: 'События',
};

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
    // fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  itemTimestamp: {
    paddingLeft: 5,
    fontSize: 12,
    color: 'gray'
  },
  itemTitle: {
    paddingLeft: 5,
    fontSize: 16,
    // fontWeight: 500,
    color: 'black'
  },
  itemCount: {
    width: 50,
    paddingLeft: 5,
    fontSize: 16,
    // fontWeight: 500,
    color: 'black'
  },
  itemPlace: {
    paddingLeft: 5,
    fontSize: 12,
    color: 'gray'
  },
  itemView: {
    flex: 1,
    padding: 10,
    fontSize: 18,
    height: 44,
    // borderBottom: 'solid 1px gray',
    borderBottomColor: 'rgba(0,0,0,0.05)',
    borderBottomWidth: 1,
  },
  itemHorizontal: {
    flexDirection: 'row',
  },
  buttonSell: {
    alignItems: 'center',
    margin: 5,
    padding: 5,
    height: 30,
    width: 100,
    // borderColor: 'gray',
    // borderWidth: 1,
    // borderRadius: 20,
    backgroundColor: '#f5b82b',
    // color: '#fff',
    // boxShadow: '0px 5px 15px rgba(21, 30, 51, 0.2)'
  },
  button: {
    alignItems: 'center',
    margin: 5,
    padding: 5,
    height: 30,
    width: 100,
    // borderColor: 'gray',
    // borderWidth: 1,
    // borderRadius: 20,
    backgroundColor: '#42a5f5',
    color: '#fff',
    // boxShadow: '0px 5px 15px rgba(21, 30, 51, 0.2)'
  },
  textButton: {
    //fontWeight: 500,
    color: '#fff',
  },
});
