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

Router.route('/subjects', function(){
  this.render('subjects');
})

Router.route('/teachers', function(){
  this.render('teachers');
})

Router.route('/groups', function(){
  this.render('groups');
})

Router.route('/money', function(){
  this.render('money');
})

Router.route('/students', function(){
  this.render('students');
})

Router.route('/attendances', function(){
  this.render('attendances');
})

Router.route('/managers', function(){
  this.render('managers');
})
