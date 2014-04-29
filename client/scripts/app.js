// YOUR CODE HERE:
var app ={
  server:  'https://api.parse.com/1/classes/chatterbox',
  usernames: {},
  roomnames: {},
  latestMsgTime: new Date(2000, 1, 1),
  activeRoom: 'lobby',
  firstTime: false
};

app.init = function(){
  $('#main').on('click', '.username', app.addFriend);
  $('#sendMessage.submit').on('click', app.handleSubmit);
  $('#createRoom.submit').on('click', app.handleNewRoom);
  $('#rooms').on('change', app.updateRoom);
};

app.send = function(message){
  var obj= {
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  };

  $.ajax(obj);
};

app.fetch = function(){

  var messages;
  // var filter = encodeURI('order=-createdAt &');
  // var filter = encodeURI('where={"roomname":"' + app.activeRoom + '}');
  var parameters = encodeURI('order=-createdAt');
  var filter = encodeURI('where={"roomname":"' + app.activeRoom + '"}');
  var parameters = parameters + '&' + filter;

  var obj= {
    async: false, // TODO: delete this line and have success call sth
    type: 'GET',
    contentType: 'application/json',
    data: parameters,
    // data: {order: '-createdAt',
    //        where: encodeURI({'roomname: '+_.escape(app.activeRoom)})},
    success: function (data) {
      console.log('chatterbox: Message recieved');
      messages = data;
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  };

  $.ajax(this.server, obj);
  return messages.results;
};

app.clearMessages = function(){
  $('#chats').empty();
};

app.addMessage = function(message){
  if (!app.usernames.hasOwnProperty(message.username) && _.escape(message.username)) {
    app.usernames[message.username] = true;
    $('#users').append('<li class="username">' + _.escape(message.username) + '</li>');
  }

  if (_.escape(message.text) && _.escape(message.username)) {
    $('#chats').prepend('<li>(' +
      _.escape(message.username) + ') ' +
      _.escape(message.text) + '</li>');
  }

  app.latestMsgTime = message.createdAt;
};

app.addRoom = function(name){
  if (!app.roomnames.hasOwnProperty(name) && _.escape(name)) {
    app.roomnames[name] = true;
    // $('#rooms').append('<li>' + _.escape(name) + '</li>');
    $('#test').append('<option>' + _.escape(name) + '</option>');
  }
};

app.addFriend = function () {
  var friend = this.innerHTML;
  var children = $('#chats').children();
  for (var i = 0; i < children.length; i++){
    if (children[i].innerHTML.indexOf(friend) !== -1){
      children[i].classList.add('friend');
    }else{
      children[i].classList.remove('friend');
    }
  }
};

app.handleSubmit = function () {
  var message = {
    username: $('#username').val(),
    text: $('#message').val(),
    roomname: app.activeRoom
  };
  app.send(message);
};

app.handleNewRoom = function () {
  var newRoom = $('#newRoom').val();
  if (!app.roomnames.hasOwnProperty(newRoom)) {
    $('#test').append('<option>' + newRoom + '</option>');
    app.roomnames[newRoom] = true;
  }
};

app.updateRoom = function () {
  app.clearMessages();
  app.activeRoom = $('#test').val();
  app.printMessages(app.fetch());
};

app.printMessages = function (messages) {
  for (var i = messages.length - 1; i >= 0; i--) {
    app.addMessage(messages[i]);
    app.addRoom(messages[i].roomname);
  }
};

$('document').ready(function () {
  app.init();
  var messages = app.fetch();
  for (var i = messages.length - 1; i >= 0; i--) {
    app.addMessage(messages[i]);
    app.addRoom(messages[i].roomname);
  }

  setInterval(function(){
    var messages = app.fetch();
    for (var i = messages.length - 1; i >= 0; i--) {
      if (Date.parse(app.latestMsgTime) < Date.parse(messages[i].createdAt)) {
        app.addMessage(messages[i]);
        app.addRoom(messages[i].roomname);
      }
    }
  }, 5000);
});



