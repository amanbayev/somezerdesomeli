Template.dashboard.helpers({
  SchoolsCount: function(){
    var countG = 0;
    Meteor.call('getSchoolsCount', function(error, count){
      console.log('count '+count);
      Session.set('schoolsCount',count);
    });
    countG = Session.get('schoolsCount');
    return countG;
  },
  BranchesCount: function(){
    Meteor.call('getBranchesCount',function(e,c){
      Session.set('branchesCount',c);
    });
    return Session.get('branchesCount');
  }
});
