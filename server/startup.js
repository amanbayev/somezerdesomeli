Meteor.startup(function(){
  if(!Meteor.users.find().count()) {
    var options = {
      password: 'arlanO1234',
      profile: {
        firstName: 'Admin',
        lastName: 'Zerdeli'
      },
      email: 'mauito@tcd.ie'
    };
    var userId = Accounts.createUser(options);
    Roles.addUsersToRoles(userId,['admin','manager']);
  }
});
