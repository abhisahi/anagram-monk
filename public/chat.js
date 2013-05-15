//Create a chat module to use.
(function () {
  window.Chat = {
    socket : null,
    
    initialize : function(socketURL) {
      this.socket = io.connect(socketURL);

      //Send message on button click or enter
      $('#send').click(function() {
        Chat.send();
      });

      $('#message').keydown(function(evt) {
        if ((evt.keyCode || evt.which) == 13) {
          Chat.send();
          return false;
        }
      });

      //Process any incoming messages
      this.socket.on('new', this.add);

      this.socket.on('MYANAGRAM', this.onAnagramReceive);
    },

    onAnagramReceive:function(data){
     console.log('onAnagramReceive');		
     var name =  'Anagram Monk';
     var msg = $('<div class="msg"></div>').append('<span class="name">' + name + '</span>: ')
     .append('<span class="text">' + data + '</span>');

     $('#messages').append(msg).animate({scrollTop: $('#messages').prop('scrollHeight')}, 0);
   },

    //Adds a new message to the chat.
    add : function(data) {
     console.log('--add--');		
     var name = data.name || 'anonymous';
     var msg = $('<div class="msg"></div>')
     .append('<span class="name">' + name + '</span>: ')
     .append('<span class="text">' + data.msg + '</span>');

     $('#messages')
     .append(msg)
     .animate({scrollTop: $('#messages').prop('scrollHeight')}, 0);
   },
   
    //Sends a message to the server,
    //then clears it from the textarea
    send : function() {
      this.socket.emit('msg', {
        name: $('#name').val(),
        msg: $('#message').val()
      });

      $('#message').val('');

      return false;
    }
  };
}());
