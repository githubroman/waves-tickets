const { issue, broadcast, invokeScript, nodeInteraction, waitForTx } = require('@waves/waves-transactions');
const nodeUrl = 'https://testnodes.wavesnodes.com/';
const dApp = '3Mqf9mef6PyWRzsCm8ZNzBmTm5BTADAkEB1';
const seed = 'traffic common hotel rent simple happy garbage hammer shock maximum earn peace';

const createTickets = (name, description, quantity, price, cb) => {
  try {
    const signedIssueTx = issue({
      name,
      description,
      // With given options you'll have 100000.00000 tokens
      quantity,
      decimals: 0,
      precision: 0,
      // This flag defines whether additional emission is possible
      reissuable: false,
      fee: 100000000,
      timestamp: Date.now(),
      chainId: 'T'
    }, seed)
    broadcast(signedIssueTx, nodeUrl).then(resp => {
      setTimeout(() => {
        const signedInvokeScript = invokeScript({
          dApp,
          call: {
            function: 'createOrder',
            args: [{
              type: 'integer',
              value: price,
            }],
          },
          payment: [{ amount: quantity, assetId: resp.assetId }],
          chainId: 'T'
        }, seed)
        broadcast(signedInvokeScript, nodeUrl).then(resp => {
          cb(null, resp)
        })
      }, 6000);
    })
  } catch (err) {
    cb(err);
  }
}
createTickets('Event 4', 'Description of Event', 200, 1 * 100000000, (err, tx) => {

});

const cancelOrder = (uniqId, cb) => {
  try {
    const signedInvokeScript = invokeScript({
      dApp,
      call: {
        function: 'cancelOrder',
        args: [{
          type: 'string',
          value: uniqId,
        }],
      },
      payment: [],
      chainId: 'T'
    }, seed)
    broadcast(signedInvokeScript, nodeUrl).then(resp => {
      cb(null, resp);
    })
  } catch (err) {
    cb(err)
  }
  
}
cancelOrder('3MtQuxQSEMyo7wnD2JyEGYr1gs3Lm1eSrZk_3AbeX8CVwEP32YwTApmje4JyFtEU3Vqpn1gYKsdK5BKn_667014', (err, tx) => {
  console.log(err, tx)
});

const buyTicket = (uniqId, price, cb) => {
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
// Only one ticket. Second arg is price.
buyTicket('3MyL7xwVBmj3eM8TkdJQEoKFBUAYGYZqAaJ_4L8TvHYgW4xeLCL3CqTXWK1oMohEDVV5KDnE2AaYu8tA_666843', 1 * 100000000, (err, tx) => {
  console.log(err, tx)
});

const checkIn = (assetId, cb) => {
  try {
    const signedInvokeScript = invokeScript({
      dApp,
      call: {
        function: 'checkIn',
        args: [],
      },
      payment: [{ amount: 1, assetId: assetId }],
      chainId: 'T'
    }, seed)
    broadcast(signedInvokeScript, nodeUrl).then(resp => {
      cb(null, resp);
    })
  } catch (err) {
    cb(err);
  }
}
checkIn('4L8TvHYgW4xeLCL3CqTXWK1oMohEDVV5KDnE2AaYu8tA', (err, tx) => {
  console.log(err,tx)
});

const listTickets = (cb) => {
  nodeInteraction.accountData(dApp, nodeUrl).then(resp => {
    const ticketKeys = Object.keys(resp);
    if (ticketKeys.length <= 0)
      return cb("Account data is null");
  
    let ticketsList = {};
    ticketKeys.forEach((key) => {
      const values = key.split('_');
      if (values[0] == 'assetAmount' || values[0] == 'assetPrice') {
        const uniqId = values[1] + '_' + values[2] + '_' + values[3]

        if (typeof ticketsList[uniqId] == 'undefined')
          ticketsList[uniqId] = { uniqId, assetId: values[2] };

        if (values[0] == 'assetAmount')
          ticketsList[uniqId]['amount'] = resp[key].value;

        if (values[0] == 'assetPrice')
          ticketsList[uniqId]['price'] = resp[key].value;

      }
    })

    cb(null, Object.values(ticketsList));
  })
}
listTickets((err, ticketsList) => {
  console.log(ticketsList)
})

const getEventInfo = (assetId, cb) => {
  try {
    waitForTx(assetId, { apiBase: nodeUrl, timeout: 10000 }).then((tx) => {
      cb(null, tx)
    })
  } catch (err) {
    cb(err)
  }
}
getEventInfo('4L8TvHYgW4xeLCL3CqTXWK1oMohEDVV5KDnE2AaYu8tA', (err, tx) => {
  console.log(err, tx)
});
