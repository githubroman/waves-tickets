import React, {useState, useEffect} from 'react';
import { ScrollView, StyleSheet, TextInput, View, FlatList, Text, Modal, TouchableHighlight, Dimensions, AsyncStorage } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { issue, broadcast, invokeScript, nodeInteraction, waitForTx } from '@waves/waves-transactions';
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


const listTickets = async (cb) => {
  const dApp = await AsyncStorage.getItem('@Store:dApp');

  nodeInteraction.accountData(dApp, nodeUrl).then(resp => {
    const ticketKeys = Object.keys(resp);
    if (ticketKeys.length <= 0)
      return cb("Account data is null");
console.log(resp)
    let ticketsList = {};
    ticketKeys.forEach((key) => {
      const values = key.split('_');
      if ((values[0] == 'assetAmount' || values[0] == 'assetPrice')) {
        const uniqId = values[1] + '_' + values[2] + '_' + values[3]

        if (typeof ticketsList[uniqId] == 'undefined')
          ticketsList[uniqId] = { uniqId, assetId: values[2] };

        if (values[0] == 'assetAmount')
          ticketsList[uniqId]['amount'] = resp[key].value;

        if (values[0] == 'assetPrice')
          ticketsList[uniqId]['price'] = resp[key].value;

      }
    })

    cb(null, Object.values(ticketsList).filter((item) => item.amount > 0));
  })
}

const getEventInfo = (assetId, cb) => {
  try {
    waitForTx(assetId, { apiBase: nodeUrl, timeout: 10000 }).then((tx) => {
      cb(null, tx)
    })
  } catch (err) {
    cb(err)
  }
}

const getEvents = (cb) => {
  let result = []
  listTickets((err, ticketsList) => {
    let promises = []
    ticketsList.map((item)=>{
      promises.push(new Promise((resolve,reject)=>{
        getEventInfo(item.assetId, (err,res)=>{
          console.log(err,res);
          if (!err) {
            res.price = item.price
            res.uniqId = item.uniqId
            resolve(res)
          }
        })
      }))
    })
    Promise.all(promises).then(values => {
      cb(null, values);
    });
  })
  return result
}

export default function EventsScreen(props) {
  const [txtSearch, setTxtSearch] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents((err,res)=>{setEvents(res)});
    console.log(events)
  }, []);


  // const renderEvents = (array) => {
  //   let result = []
  //   array.map((item)=>{
  //
  //   })
  // }


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
            data={events}
            renderItem={({ item }) =>
              <View style={s.itemView}>
                <Text style={s.itemTimestamp}>05.12.2019</Text>
                <Text
                  style={s.itemTitle}
                  onClick={()=>{
                    props.navigation.navigate('Event',item)
                  }}
                >{item.name}</Text>
                <Text style={s.itemPlace}>{item.place}</Text>
                <Text style={s.itemPlace}>Цена {item.price / 100000000} waves</Text>
              </View>
            }
            keyExtractor={(item, index) => index}
          />
        </View>
      </ScrollView>
    </View>
  );
}

EventsScreen.navigationOptions = {
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
    borderColor: 'rgba(21, 30, 51, 0.3)',
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
    fontSize: 12,
    color: 'gray'
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
  itemView: {
    flex: 1,
    padding: 10,
    fontSize: 18,
    height: 44,
    // borderBottom: 'solid 1px gray',
    borderBottomColor: 'rgba(0,0,0,0.05)',
    borderBottomWidth: 1,
  },
});
