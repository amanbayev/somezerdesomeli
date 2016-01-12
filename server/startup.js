Meteor.startup(function(){
  if(!Meteor.users.find().count()) {
    var options = {
      password: 'Gulzhan1',
      email: 'admin@admin.kz'
    };
    var userId = Accounts.createUser(options);
    Roles.addUsersToRoles(userId,'admin');
  }
});
