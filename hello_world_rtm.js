var Botkit = require('./Botkit.js');

var bot = Botkit.slackbot();

var watson = require('watson-developer-cloud');

var personality_insights = watson.personality_insights({
  username: '8981e085-feca-4808-a3b2-a82a7daa51d9',
  password: 'bpAdv6AnyktC',
  version: 'v2'
});

bot.startRTM({
  team: {
    token: process.env.token
  }
},function(err,connection,payload) {
  if (err) {
    console.log('AN ERROR OCCURRED',err);
  }
});

bot.hears(['hello'],'direct_message,direct_mention',function(message) {
  bot.reply(message,'Hello!');
});


  bot.hears(['lunch'],'direct_message,direct_mention',function(message) {
    bot.startTask(message,function(task,convo) {
      convo.ask('Say YES or NO',[
        {
          callback: function(response,convo) { console.log('YES'); convo.say('YES! Good.'); convo.next(); },
          pattern: bot.utterances.yes,
        },
        {
          callback: function(response,convo) { console.log('NO');  convo.say('NO?!?! WTF?'); convo.next();},
          pattern: bot.utterances.no,
        },
        {
          callback: function(response,convo) { convo.say('THIRD CHOICE'); convo.next(); },
          pattern: 'foo',
        },
        {
          default: true,
          callback: function(response,convo) { console.log('DEFAULT'); convo.say('Huh?'); convo.repeat(); convo.next(); }
        }
    ]);
  });
});


bot.hears(['analyze'],'direct_message,direct_mention',function(message) {

    bot.api.channels.history({

      channel: message.channel,
    },function(err,history) {
      count: 500,

      if (err) {
        console.log('ERROR',err);
      }

      var messages = [];
      for (var i = 0; i < history.messages.length; i++) {
        messages.push(history.messages[i].text);
      }

      // call the watson api with your text
      var corpus = messages.join("\n");

      personality_insights.profile(
        {
          text: corpus,
          language: 'en'
        },
        function (err, response) {
          if (err) {
            console.log('error:', err);
          } else {

            bot.startTask(message,function(task,convo) {

              // response.tree.children.children is a list of the top 5 traits
              var top5 = response.tree.children[0].children[0].children;
              console.log(top5);
              for (var c = 0; c <  top5.length; c++) {

                  convo.say('Name: ' + top5[c].name + ' Percent: ' + top5[c].percentage);

              }

            });


          }
        }
      );



    });



})



// bot.hears(['analyze'],'direct_message,direct_mention',function(message) {

//   // message.channel

//   if (!channels[message.channel]) {
//     bot.reply(message,'No data for this channel!');
//   } else {

//     // call the watson api with your text
//     var corpus = channels[message.channel].join("\n");

//     personality_insights.profile(
//       {
//         text: corpus,
//         language: 'en'
//       },
//       function (err, response) {
//         if (err) {
//           console.log('error:', err);
//         } else {

//           bot.startTask(message,function(task,convo) {

//             // response.tree.children.children is a list of the top 5 traits
//             var top5 = response.tree.children[0].children[0].children;
//             console.log(top5);
//             for (var c = 0; c <  top5.length; c++) {

//                 convo.say('Name: ' + top5[c].name + ' Percent: ' + top5[c].percentage);

//             }

//           });


//           //bot.reply(message,JSON.stringify(response,null,2));

//           //
//           // bot.startConversation(message,function(convo) {
//           //   convo.say('This channels personality is...' + response.field);
//           //   convo.say('This channels personality is...' + response.field);
//           //   convo.say('This channels personality is...' + response.field);
//           //   convo.say('This channels personality is...' + response.field);
//           // })

//         }
//       }
//     );


//   }

// })

// var channels = {}

// bot.on('ambient,direct_message',function(message) {

//   // message.channel
//   // message.text
//   if (!channels[message.channel]) {
//     channels[message.channel] = [];
//   }

//   channels[message.channel].push(message.text);
//   if (channels[message.channel].length > 500) {
//     channels[message.channel].shift();
//   }

// })


// bot.on('message_received',function(message) {
//   console.log(message);

// });