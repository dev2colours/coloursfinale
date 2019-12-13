import { Injectable } from '@angular/core';
import { Enterprise, ParticipantData, companyChampion, Department, Subsidiary, employeeData, asset, client,
   companyStaff, projectRole } from '../models/enterprise-model';
import { Project, projectCompDetail, workItem, abridgedBill, Section } from '../models/project-model';
import { Task, MomentTask, ActionItem } from '../models/task-model';
import { classification, coloursUser } from 'app/models/user-model';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  taskSent: Task;
  constructor() {}
  showNotification(data, from, align, dm) {
        // var type = ['', 'info', 'success', 'warning', 'danger'];
        const type = ['', 'info', 'success', 'warning', 'danger'];

        let color = Math.floor((Math.random() * 4) + 1);
        if (data === 'dataNotify') {
            $.notify({
                icon: 'ti-gift',
                message: 'Please update your profile information to<br> enhance your public profile display !!!.'
            }, {
                    type: type[color],
                    timer: 4000,
                    placement: {
                        from: from,
                        align: align
                    },
                    template:
                    '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
                        '<div class="row">' +
                            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">' +
                            '<i style="padding-top:10px" class="nc-icon nc-simple-remove"></i></button>' +
                            '<span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> ' +
                            '<a class="btn btn-link" click="profileInfo()" style="cursor:pointer;' +
                            'color:orange" data-notify="message">{2}</a>' +
                        '</div>' +
                        '<div class="row">' +
                            '<div class="progress" data-notify="progressbar">' +
                                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" ' +
                                'aria-valuemax="100" style="width: 0%;"></div>' +
                            '</div>' +
                            '<a href="{3}" target="{4}" data-notify="url"></a>' +
                        '</div>' +
                    '</div>'
                });
        }

        if (data === 'project') {
            $.notify({
                icon: 'ti-gift',
                message: 'A new project has been created <br> check colours projects dropdown.'
            }, {
                    type: type[color],
                    timer: 4000,
                    placement: {
                        from: from,
                        align: align
                    },
                    template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"> ' +
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove">' +
                    '</i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="title">{1}</span>' +
                    '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar">' +
                    '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0"' +
                    'aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
                });
        }

        if (data === 'declineTask') {
            $.notify({
                icon: 'ti-gift',
                // message: 'Task ' + ' ' + this.taskSent.name + ' Declined'
                message: 'Task ' + ' ' + dm.name + ' Declined'

            }, {
                    type: type[color],
                    timer: 4000,
                    placement: {
                        from: from,
                        align: align
                    },
                    template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove">' +
                    '</i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span>' +
                    '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar">' +
                    '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0"' +
                    'aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
                });
        }

        if (data === 'Task') {
            $.notify({
                icon: 'ti-gift',
                message: 'Task has been updated'
            }, {
                    type: type[color],
                    timer: 4000,
                    placement: {
                        from: from,
                        align: align
                    },
                    template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove">' +
                    '</i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span>' +
                    '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar ' +
                    'progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">' +
                    '</div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
                });
        }

        if (data === 'acceptTask') {
            $.notify({
                icon: 'ti-gift',
                // message: 'Task' + ' ' + this.taskSent.name + ' added' 
                message: 'Task' + ' ' + dm.name + ' added'

            }, {
                    type: type[color],
                    timer: 4000,
                    placement: {
                        from: from,
                        align: align
                    },
                    template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove">' +
                    '</i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span>' +
                    '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar' +
                    'progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">' +
                    '</div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
                });
        }

        if (data === 'comp') {
            $.notify({
                icon: 'ti-gift',
                message: 'A new enterprise has been created <b> check colours enterprise dropdown.'
            }, {
                    type: type[color],
                    timer: 4000,
                    placement: {
                        from: from,
                        align: align
                    },
                    template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove">' +
                    '</i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span>' +
                    '<span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar' +
                    'progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">' +
                    '</div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
                });
        }

  }

}
