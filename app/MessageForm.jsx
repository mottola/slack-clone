var React = require('react');

var MessageForm = React.createClass({
	submit: function(evt) {
		evt.preventDefault();
		var newMessage = $('#msg').val();
		var that = this;
		$.post('/messages',
			{newMessage: newMessage},
			function(response) {
				if (response == "success") {
					that.props.getMessages();
					$('#msg').val('');
				}
			},
			'text'
		);
	},
	render: function() {
		return (
			<form onSubmit={this.submit}>
				<input type="text" name="msg" id="msg"></input>
				<input type="submit" value="Send"></input>
			</form>
		);
	}
});

module.exports = MessageForm;