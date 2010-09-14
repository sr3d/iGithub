//Construct main app header
var headerView = Titanium.UI.createView({
  backgroundColor:'#252f30',
  top:0,
  left:0,
  height:60,
  width:320,
  opacity:0.85
});

var logo = Titanium.UI.createImageView({
	url:'images/logo.png',
	width:109,
	height:50,
	left:10,
	bottom:5,
	opacity:1
});
headerView.add(logo);

var button = Titanium.UI.createButton({
  // backgroundImage:'images/post-button.png',
  title: 'Back',
	width:148,
	height:46,
	top: 10,
	right: 10
});
headerView.add(button);

button.addEventListener('click', function() { 
  switchView(currentView-1);
});