var debug = function(o) {
  Titanium.API.info(o);
  // Ti.API.info(o);
};

var log = debug;

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');


Titanium.include('header.js');

/* Create the view */
//Create view container (allows us to do nice transitions)
var viewContainer = Titanium.UI.createView({
  top:60,
  width:320,
  height:420
});

// var data = [{title:"Row 1"},{title:"Row 2"}];
// var table = Titanium.UI.createTableView({data:data});
// viewContainer.add(table);    


var viewContainer = Titanium.UI.createView({
  top:60,
  width:320,
  height:420
});

// var data = [{title:"Row 1"},{title:"Row 2"}];
// var table = Titanium.UI.createTableView({data:data});
// viewContainer.add(table);    

var views = [];
var currentView = -1;
function newView() { 
  var view = Titanium.UI.createView({
    top:0,
    width:320,
    height:420
  });
  
  views.push(view);
  viewContainer.add( view );

  currentView++;

  return view;
}

function switchView(viewIndex) {  
  if( viewIndex < 0 ) {
    // button.visible = false;
    return;
  // } else if( viewIndex == 0 ) {
  //   button.visible = false;
  } else {
    button.visible = true;
    
  }
  
  
  log('About to switch to ' + viewIndex);
  log( views[viewIndex]);
  
  try{    
    viewContainer.animate({view: views[viewIndex], transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT} );
    for( var i = 0; i < views.length; i++ ) {
      views[i].visible = (i == viewIndex) ? true : false;
    }
  } catch( ex ) {
    log(ex);
  }
  currentView = viewIndex;    
}



var sha = "123";

var folderIconPath = "images/dir.png";
var fileIconPath = "images/txt.png";

var url = "http://github.com/api/v2/json/tree/show/sr3d/GithubFinder/";

var tableViews = [];


function loadTree(sha) { 
  
  
  if( !sha ){
    sha = 'c8a8ba0bd1fc1d9f7abf38f2cff0f414e430b6e5';
  }
  
  
  log('Loading: ' + url + sha );  
  
  var loader = Titanium.Network.createHTTPClient();
  loader.open("GET", url + sha);
  
  
  
  loader.onload = function() { 
    debug("Response Text: " + this.responseText);
    var rows = [];
    var items = eval( '(' + this.responseText + ')').tree;
    
    items = items.sort(function(a,b){
      // blobs always lose to tree
      if( a.type == 'blob' && b.type == 'tree' ) {
        return 1; 
      }
        
      if( a.type == 'tree' && b.type == 'blob' ) {
        return -1;
      }
        
      return a.name > b.name ? 1 : ( a.name < b.name ? - 1 : 0 );
    });          
    
    
    // debug(items);
    
    for( var i = 0; i < items.length; i++ ) {
      var item = items[i];
      item.title = item.name;

      var row     = Ti.UI.createTableViewRow( { height: 'auto' } );
      var rowView = Ti.UI.createView( { height: 40, layout: 'vertical', top: 5, right: 5, bottom: 5, left: 5 } );
      var icon    = Ti.UI.createImageView( { url: item.type == 'blob' ? fileIconPath : folderIconPath, width: 16, height: 16, top: 0, left: 0 } );
      var label   = Ti.UI.createLabel( { text: item.name, left: 20, height: 20, color: '#444', top: -16,
                      font: { fontFamily:'Trebuchet MS',fontSize: 16 } } );

      if( item.type == 'blob' ) {
        row.hasChild = false;
        
        // show preview
        row.addEventListener('click', function(e) {
          log('blobk click');
          log(e);
        });
        
      } else {
        row.hasChild = true;
        var treeSha = item.sha;
        row.addEventListener('click', (function(sha) { 
          return function() {
            log('loadTree: ' + sha );
            loadTree( sha );
          }
        })(item.sha));
        
      }
      
      rowView.add( icon );
      rowView.add( label );
      
      row.add( rowView );
      row.className = "item" + i;
      
      rows.push( row );
    }
    
    // debug(tree);
    // update view here?
    var tableView = Titanium.UI.createTableView({data:rows});
    
    // var view = newView();
    
    (newView()).add(tableView);
    
    // switchView(0);
    
  };
  
  debug('about to send ajaxreqest');
  loader.send();
  
};

debug('before loadTree');

loadTree();

debug('after loadTree');



//
// create base UI tab and root window
//
var app = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundColor:'#fff'
});


app.add(headerView);
app.add(viewContainer);

app.open({
	transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
});