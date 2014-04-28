// YOUR CODE HERE:
var app ={
  server:  'https://api.parse.com/1/classes/chatterbox'
};

app.init = function(){
  $('#main').on('click', '.username', app.addFriend);
  $('#send .submit').on('submit', app.handleSubmit);
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
  var obj= {
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message recieved');
      console.log(data);
      return data;
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  };

  $.ajax(this.server, obj);
};

app.clearMessages = function(){
  $('#chats').empty();
};

app.addMessage = function(message){
  $('#main').append('<li class="username">' + message.username + '</li>');
  $('#chats').append('<li>(' + message.username + '): ' + message.text + '</li>');
};

app.addRoom = function(name){
  $('#roomSelect').append('<li>' + name + '</li>');
};

app.addFriend = function () {

};

app.handleSubmit = function () {

};

// _.each(app.fetch(), app.addMessage);
