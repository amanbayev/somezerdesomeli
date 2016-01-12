Groups = new Mongo.Collection('groups');
Meteor.publish("groups", function(argument){
  return Groups.find({isActive:true});
});
Meteor.methods({
  deleteGroup: function(rowId){
    Groups.update({_id:rowId}, {$set:{
      isActive: false
    }});
  },
  addGroup: function(GroupJSON){
    GroupJSON.createdBy = this.userId;
    GroupJSON.createdAt = new Date();
    GroupJSON.isActive = true;
    GroupJSON.students = [];
    var gId = Groups.insert(GroupJSON);
    var teachers = GroupJSON.teachers;
    teachers.forEach(function(teacherObj,i){
      var add = true;
      var cTeacher = Teachers.findOne({_id:teacherObj});
      var groupIds = cTeacher.groups;
      groupIds.forEach(function(guid, ind){
        if (guid === gId)
          add = false;
      });
      if (add) {
        groupIds.push(gId);
        Teachers.update({_id: cTeacher._id},
          {$set:{
            groups: groupIds
        }});
      }
    });
    return gId;
  },
  editGroup: function(GroupId, GroupJSON, removedTeachers){
    Groups.update(
      {_id:GroupId},
      {
        $set:
        {
          name : GroupJSON.name,
          price : GroupJSON.price,
          pricePerDay : GroupJSON.pricePerDay,
          subject : GroupJSON.subject,
          branch : GroupJSON.branch,
          teachers : GroupJSON.teachers,
          attendances : GroupJSON.attendances,
          isActive: GroupJSON.isActive,
          students: GroupJSON.students,
          updatedAt: new Date(),
          updatedBy: this.userId
        }
      });
    var gId = GroupId;
    var teachers = GroupJSON.teachers;
    teachers.forEach(function(teacherObj,i){
      var add = true;
      var cTeacher = Teachers.findOne({_id:teacherObj});
      var groupIds = cTeacher.groups;
      groupIds.forEach(function(guid, ind){
        if (guid === gId)
          add = false;
      });
      if (add) {
        groupIds.push(gId);
        Teachers.update({_id: cTeacher._id},
          {$set:{
            groups: groupIds
        }});
      }
    });
    removedTeachers.forEach(function(o,i){
      var cTeacher = Teachers.findOne({_id:o});
      var groupIds = cTeacher.groups;
      groupIds.forEach(function(grId, ind){
        if (grId === gId) {
          groupIds.splice(ind, 1);
        }
      });
      Teachers.update({_id:cTeacher._id}, {$set:{
        groups: groupIds
      }});
    });
  },
  getGroupsCount: function(){
    // console.log(Groups.find({isActive:true}).count());
    var count = Groups.find({isActive:true}).count();
    return count;
  }
});
