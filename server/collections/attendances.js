Attendances = new Mongo.Collection('attendances');
Meteor.publish("attendances", function(argument){
  return Attendances.find({
    isActive: true
  });
});
Meteor.methods({
  deleteAttendance: function(rowId){
    Attendances.update({_id:rowId}, {$set:{
      isActive: false
    }});
  },
  addAttendance: function(attendanceJSON){
    attendanceJSON.createdBy = this.userId;
    attendanceJSON.createdAt = new Date();
    attendanceJSON.isActive = true;
    return Attendances.insert(attendanceJSON);
  },
  editAttendance: function(aId, attendanceJSON){
    Attendances.update(
      {_id:aId},
      {
        $set:
        {
          name : schoolJSON.name,
          address : schoolJSON.address,
          isActive: schoolJSON.isActive,
          students: schoolJSON.students,
          updatedAt: new Date(),
          updatedBy: this.userId
        }
      });
  }
});
