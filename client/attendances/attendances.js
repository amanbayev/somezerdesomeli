Template.attendances.onRendered(function(){
  $.fn.datepicker.dates['kk'] = {
      days:["Жексенбі","Дүйсенбі","Сейсенбі","Сәрсенбі","Бейсенбі","Жұма","Сенбі"],
      daysShort:["Жек","Дүй","Сей","Сәр","Бей","Жұм","Сен"],
      daysMin:["Жк","Дс","Сс","Ср","Бс","Жм","Сн"],
      months:["Қаңтар","Ақпан","Наурыз","Сәуір","Мамыр","Маусым","Шілде","Тамыз","Қыркүйек","Қазан","Қараша","Желтоқсан"],
      monthsShort:["Қаң","Ақп","Нау","Сәу","Мамыр","Мау","Шлд","Тмз","Қыр","Қзн","Қар","Жел"],
      today:"Бүгін",
      clear: "Болдырмау",
      format: "mm.dd.yyyy",
      titleFormat: "MM yyyy", /* Leverages same syntax as 'format' */
      weekStart: 1
  };
  $('#attendanceDateField').datepicker({
    language: 'kk',
    autoclose: true,
    todayHighlight: true,
    defaultViewDate: { year: 1977, month: 04, day: 25 }
  });
});

Template.attendances.helpers({
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
  }
});

Template.attendances.events({
  "click #createNewAttendance": function(e, t){
     e.preventDefault();
     Session.set('isCreatingAttendance', true);
     Session.set('isEditingAttendance', false);
  },
  "click #cancelAttendance": function(e,t){
    e.preventDefault();
    Session.set('isCreatingAttendance',false);
    //to add more editing and reset values
  }
});
