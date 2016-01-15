Meteor.publish('users', function(){
  return Meteor.users.find({});
});

Meteor.methods({
  makeManager:function(id){
    Roles.addUsersToRoles(id, 'manager');
  },
  removeManager:function(id) {
    if (Roles.userIsInRole(id,'admin')) {
      throw new Meteor.Error(500, 'Администраторды өзгертуге болмайды','Администраторды өзгертуге болмайды');
    }
    Roles.removeUsersFromRoles(id, 'manager');
    console.log('removed');
  },
  makeChecker:function(id){
    Roles.addUsersToRoles(id, 'checker');
  },
  removeChecker:function(id) {
    if (Roles.userIsInRole(id,'admin')) {
      throw new Meteor.Error(500, 'Администраторды өзгертуге болмайды','Администраторды өзгертуге болмайды');
    }
    Roles.removeUsersFromRoles(id, 'checker');
    console.log('removed');
  }
});
