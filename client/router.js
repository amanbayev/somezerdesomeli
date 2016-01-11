Router.configure({
  layoutTemplate:"Home"
  // notFoundTemplate:"notFoundTemplate",
  // loadingTemplate:"loadingTemplate",
  // yieldRegions:{
  //   "myAside": {to: "aside"},
  //   "myHeader": {to: "header"}
  //   "myFooter": {to: "footer"}
  // }
});

Router.route('/', function(){
  this.render('dashboard');
});

Router.route('/schools', function(){
  this.render('schools');
})

Router.route('/branches', function(){
  this.render('branches');
})
