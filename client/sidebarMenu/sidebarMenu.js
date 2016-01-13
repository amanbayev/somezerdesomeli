Template.sidebarMenu.events({
  // self made autoclose. see home.js on rendered for session var
  "click .sidebar-menu li": function(e,t){
//    e.preventDefault();
    if (Session.get('viewingOnMobile')){
//      console.log("i'm clicked");
      $('.sidebar-toggle').click();
    }
  }
});