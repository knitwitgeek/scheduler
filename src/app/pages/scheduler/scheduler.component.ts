import { Component } from '@angular/core';
import { Appointment, Presentation, AppointmentService } from 'src/app/appointment.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  providers: [AppointmentService]
})
export class SchedulerComponent {

  appointments: Appointment[];
  presentations: Presentation[];
  currentDate: Date = new Date(2021, 4, 25);

  constructor(apptService: AppointmentService) {
    this.appointments = apptService.getAppointments();
    this.presentations = apptService.getPresentations();
  }

  onAppointmentFormOpening(data: any) {
    const that = this;
    const form = data.form;
    let presentationInfo = that.getPresentationById(data.appointmentData.presentationId) || {};
    let startDate = data.appointmentData.startDate;

    form.option('items', [{
      label: {
        text: 'Presentation'
      },
      editorType: 'dxSelectBox',
      dataField: 'presentationId',
      editorOptions: {
        items: that.presentations,
        displayExpr: 'title',
        valueExpr: 'id',
        onValueChanged(args: any) {
          presentationInfo = that.getPresentationById(args.value);

          form.updateData('endDate', new Date(startDate.getTime() + 60 * 1000 * presentationInfo.duration));
        }
      }
    }, {
      dataField: 'startDate',
      editorType: 'dxDateBox',
      editorOptions: {
        width: '100%',
        type: 'datetime',
        onValueChanged(args: any) {
          startDate = args.value;
          form.updateData('endDate', new Date(startDate.getTime() + 60 * 1000 * presentationInfo.duration));
        }
      }
    }, {
      name: 'endDate',
      dataField: 'endDate',
      editorType: 'dxDateBox',
      editorOptions: {
        width: '100%',
        type: 'datetime',
        readOnly: true
      }
    }]);
  }

  getPresentationById(id: number): Presentation {
    return this.presentations.filter(p => p.id === id)[0];
  }
}
