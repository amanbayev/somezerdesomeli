Template.attendances.onRendered(function () {
  $.fn.datepicker.dates['kk'] = {
      days: ["Жексенбі", "Дүйсенбі","Сейсенбі","Сәрсенбі","Бейсенбі","Жұма","Сенбі"],
      daysShort:["Жек","Дүй","Сей","Сәр","Бей","Жұм","Сен"],
      daysMin:["Жк","Дс","Сс","Ср","Бс","Жм","Сн"],
      months:["Қаңтар","Ақпан","Наурыз","Сәуір","Мамыр","Маусым","Шілде","Тамыз","Қыркүйек","Қазан","Қараша","Желтоқсан"],
      monthsShort:["Қаң","Ақп","Нау","Сәу","Мамыр","Мау","Шлд","Тмз","Қыр","Қзн","Қар","Жел"],
      today:"Бүгін",
      clear: "Болдырмау",
      format: "d MM (dd.mm.yyyy)",
      titleFormat: "MM yyyy", /* Leverages same syntax as 'format' */
      weekStart: 1
  };
  $('#attendanceDateField').datepicker({
    language: 'kk',
    autoclose: true,
    todayHighlight: true,
    todayBtn: "linked"
  });

  Session.setDefault('thisAttendanceStudents',[]);
  Session.setDefault('attendingStudents',[]);
  Session.setDefault('excusedStudents',[]);
  Session.setDefault('skippingStudents',[]);
  Session.setDefault('thisAttendanceTeachers',[]);
});

Template.attendances.helpers({
  Teachers: function(){
    var teachers = []
    teachers = Teachers.find({
      isActive: true,
      subject: $in [Session.get('thisGroupSubject')]
    }) 
  },
  addOne: function(number){
    return number + 1;
  },
  getStudentNameById: function(sId){
    var cStudent = Students.findOne({_id: sId, isActive:true});
    if (cStudent) return cStudent.firstName;
    else return '';
  },
  getStudentLastNameById: function(sId){
    var cStudent = Students.findOne({_id: sId, isActive:true});
    if (cStudent) return cStudent.lastName;
    else return '';
  },
  thisAttendanceStudents: function(){
    return Session.get('thisAttendanceStudents');
  },
  Groups: function(){
    return Groups.find({isActive:true});
  },
  Attendances: function(){
    return Attendances.find({isActive:true});
  },
  hideOrNot: function(){
    if (Session.get('isCreatingAttendance'))
      {
        return "show";
        console.log('showing');
      }
    else
    {
      return "hidden";
      console.log('hiding');
    }
  },
  createButtonShow: function(){
    if (Session.get('isCreatingAttendance'))
      return "hidden";
    else
      return "show";
  },
  deleteButtonShow: function(){
    if (Session.get('isEditingAttendance'))
      return "show";
    else {
      return "hidden";
    }
  },
  groupName: function(){
    return Session.get('thisGroupName');
  },
  teachersNames: function(){
    var teacherIds = Session.get('thisAttendanceTeachers');
    // return teacherIds;
    console.log('teacher Ids: '+teacherIds);
    var tNames = [];

    teacherIds.forEach(function(tId, ind){
      var cTeacher = Teachers.findOne({_id: tId});
      tNames.push({firstName : cTeacher.firstName, lastName : cTeacher.lastName });
    });
    return tNames;
  },
  thisGroupSubjectName: function(){
    var gId = Session.get('thisGroupId');
    var cGroup = Groups.findOne({_id: gId , isActive: true });
    if (cGroup){
      Session.set('thisGroupSubject', cGroup.subject);
      return cGroup.subject;
    }
    else {
      return '(топты таңданыз)';
    }
  }
});

Template.attendances.events({
  "click .addTeacherToAttendance": function(e, t){
    e.preventDefault();
    var tId = t.find('#selectTeacherForAttendance').value;
    console.log(tId);
    var teachers = Session.get('thisAttendanceTeachers');
    if (teachers === undefined) teachers = [];
    else {
      var add = true;
      teachers.forEach(function(tId2, ind){
        if (tId === tId2) add=false;
      });
      if (add) {
        teachers.push(tId);
        Session.set('thisAttendanceTeachers', teachers);
      }
    }
  },
  "click .removeTeacherFromAttendance": function(e, t){
    e.preventDefault();
  },
  "change #attendanceGroupSelect": function(e,t){
    e.preventDefault();
    var gId = t.find('#attendanceGroupSelect').value;
    var cGroup = Groups.findOne({isActive:true, _id: gId});
    if (cGroup) {
      Session.set('thisGroupName', cGroup.name);
      Session.set('thisAttendanceStudents', cGroup.students);
      Session.set('thisGroupId', cGroup._id);
      Session.set('thisAttendanceTeachers', cGroup.teachers);
    }
  },
  "click #createNewAttendance": function(e, t){
    e.preventDefault();
    Session.set('isCreatingAttendance', true);
    Session.set('isEditingAttendance', false);
    $("#attendanceGroupSelect :nth-child(1)").attr("selected", "selected");
    var gId = t.find('#attendanceGroupSelect').value;
    var cGroup = Groups.findOne({isActive:true, _id: gId});
    Session.set('thisAttendanceStudents', cGroup.students);
    Session.set('thisGroupName', cGroup.name);
    Session.set('thisGroupId', cGroup._id);
    Session.set('thisAttendanceTeachers', cGroup.teachers);
  },
  "click #cancelAttendance": function(e,t){
    e.preventDefault();
    Session.set('isCreatingAttendance',false);
    Session.set('isEditingAttendance', false);
    Session.set('thisAttendanceTeachers',[]);
    Session.set('attendingStudents',[]);
    Session.set('skippingStudents',[]);
    Session.set('excusedStudents',[]);
    //to add more editing and reset values
  },
  "click .attendingBtn": function(e,t){
    e.preventDefault();
    e.stopPropagation();
    if (!($(e.currentTarget).hasClass('btn-success'))) {
      var sId = $(e.currentTarget).data('student-id');
      var studentsArr = Session.get('attendingStudents');
      var add = true;
      studentsArr.forEach(function(stId, ind){
        if (stId === sId)
          add = false;
      });
      if (add) {
        studentsArr.push(sId);
        Session.set('attendingStudents', studentsArr);
      }
      $(e.currentTarget).removeClass('btn-default');
      $(e.currentTarget).addClass('btn-success');

      var excused = $(".btn-warning[data-student-id='"+sId+"']");
      if (excused.text()!=='') {
        excused.removeClass('btn-warning');
        excused.addClass('btn-default');
        var excusedArr = Session.get('excusedStudents');
        excusedArr.forEach(function(o,i){
          if (o===sId)
            {
              excusedArr.splice(i,1);
              Session.set('excusedStudents', excusedArr);
            }
        });
      }

      var skipping = $(".btn-danger[data-student-id='"+sId+"']");
      if (skipping.text()!==''){
        skipping.removeClass('btn-danger');
        skipping.addClass('btn-default');
        var skippingArr = Session.get('skippingStudents');
        skippingArr.forEach(function(o,i){
          if (o===sId)
            {
              skippingArr.splice(i,1);
              Session.set('skippingStudents', skippingArr);
            }
        });
      }

    } else
      console.log('already attending');
  },
  "click .excusedBtn": function(e,t){
    e.preventDefault();
    e.stopPropagation();
    if (!($(e.currentTarget).hasClass('btn-warning'))) {
      var sId = $(e.currentTarget).data('student-id');
      var studentsArr = Session.get('excusedStudents');
      var add = true;
      studentsArr.forEach(function(stId, ind){
        if (stId === sId)
          add = false;
      });
      if (add) {
        studentsArr.push(sId);
        Session.set('excusedStudents', studentsArr);
      }
      $(e.currentTarget).removeClass('btn-default');
      $(e.currentTarget).addClass('btn-warning');

      var success = $(".btn-success[data-student-id='"+sId+"']");
      if (success.text()!=='') {
        console.log('has sucess btn');
        success.removeClass('btn-success');
        success.addClass('btn-default');
        var attendingArr = Session.get('attendingStudents');
        attendingArr.forEach(function(o,i){
          if (o===sId)
            {
              attendingArr.splice(i,1);
              Session.set('attendingStudents', attendingArr);
            }
        });
      }

      var skipping = $(".btn-danger[data-student-id='"+sId+"']");
      if (skipping.text()!==''){
        skipping.removeClass('btn-danger');
        skipping.addClass('btn-default');
        var skippingArr = Session.get('skippingStudents');
        skippingArr.forEach(function(o,i){
          if (o===sId)
            {
              skippingArr.splice(i,1);
              Session.set('skippingStudents', skippingArr);
            }
        });
      }

    } else
      console.log('already excused');
  },
  "click .skippingBtn": function(e,t){
    e.preventDefault();
    e.stopPropagation();
    if (!($(e.currentTarget).hasClass('btn-danger'))) {
      var sId = $(e.currentTarget).data('student-id');
      var studentsArr = Session.get('skippingStudents');
      var add = true;
      studentsArr.forEach(function(stId, ind){
        if (stId === sId)
          add = false;
      });
      if (add) {
        studentsArr.push(sId);
        Session.set('skippingStudents', studentsArr);
      }
      $(e.currentTarget).removeClass('btn-default');
      $(e.currentTarget).addClass('btn-danger');

      var success = $(".btn-success[data-student-id='"+sId+"']");
      if (success.text()!=='') {
        console.log('has sucess btn');
        success.removeClass('btn-success');
        success.addClass('btn-default');
        var attendingArr = Session.get('attendingStudents');
        attendingArr.forEach(function(o,i){
          if (o===sId)
            {
              attendingArr.splice(i,1);
              Session.set('attendingStudents', attendingArr);
            }
        });
      }

      var excused = $(".btn-warning[data-student-id='"+sId+"']");
      if (excused.text()!=='') {
        excused.removeClass('btn-warning');
        excused.addClass('btn-default');
        var excusedArr = Session.get('excusedStudents');
        excusedArr.forEach(function(o,i){
          if (o===sId)
            {
              excusedArr.splice(i,1);
              Session.set('excusedStudents', excusedArr);
            }
        });
      }

    } else
      console.log('already skipping');
  }
});
