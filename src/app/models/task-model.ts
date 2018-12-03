import { Enterprise, ParticipantData, companyChampion, Department } from "./enterprise-model";
import { Time } from "@angular/common";
import { Observable, of, bindCallback } from 'rxjs';

export interface Task {
    id: string,
    name: string,
    champion: ParticipantData,
    participants: [ParticipantData],
    start: string,
    startDay: string,
    startWeek: string,
    startMonth: string,
    startQuarter: string,
    startYear: string,
    finish: string,
    finishDay: string,
    finishWeek: string,
    finishMonth: string,
    finishQuarter: string,
    finishYear: string,
    createdBy: string,
    createdOn: string,
    projectName: string,
    projectId: string,
    projectType: string,
    byId: string,
    companyName: string,
    companyId: string,
    trade: string,
    section: string,
    complete :boolean,
    status: string
}

export interface MomentTask extends Task {
    when: string,
    then: string
}

export interface TaskData {
    title: string,
    start: string,
    end: string
};

export interface ActionItem {
    // participants: Observable<ParticipantData[]>
    participants: [ParticipantData],
    name: string,
    siu: string,
    targetQty: string,
    actualData: [actionActualData],
    workStatus: string,
    complete : boolean,
    start: Time,
    end: Time,
    startWeek: string,
    startDay: string,
    endDay: string,
    startDate: string,
    endDate: string,
    id: string,
    taskId : string,
    projectName: string,
    projectId: string,
    companyName: string,
    companyId: string,
    createdOn: string,
    createdBy: string,
    byId: string,
    champion: string
};

export interface actionActualData {
    updateTime: string, qty: number
}

