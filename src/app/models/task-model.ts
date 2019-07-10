import { Enterprise, ParticipantData, companyChampion, Department } from "./enterprise-model";
import { Time } from "@angular/common";
import { Observable, of, bindCallback } from 'rxjs';
import { Section } from "./project-model";
import { classification } from "./user-model";

export interface Task {
    id: string, name: string,
    companyId: string, companyName: string, department: string, departmentId: string, championName: string, championId: string,
    champion: ParticipantData, participants: [ParticipantData], classification: classification, 
    start: string, startDay: string, startWeek: string, startMonth: string, startQuarter: string, startYear: string,
    finish: string, finishDay: string, finishWeek: string, finishMonth: string, finishQuarter: string, finishYear: string,
    by: string, createdOn: string, projectName: string, projectId: string, projectType: string, byId: string,
    trade: string, section: Section, complete: boolean, status: string, selectedWeekly: boolean
}

export interface MomentTask extends Task {
    when: string,
    then: string
}

export interface completeTask extends MomentTask {
    noAllActions: string,
    noCompleteActions: string
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
    unit: string,
    targetQty: string,
    actualData: [actualData],
    workStatus: string,
    complete : boolean,
    start: Time,
    end: Time,
    startWeek: string,
    startDay: string,
    startDate: string,
    endDay: string,
    endDate: string,
    endWeek: string,
    id: string,
    taskId : string,
    projectName: string,
    projectId: string,
    companyName: string,
    companyId: string,
    createdOn: string,
    by: string,
    byId: string,
    champion: ParticipantData,   
    classification: classification, 
};

export interface actionActualData {
   time: string, name: string, actionId: string, id: string, actuals: [actualData]
}

export interface actualData {
    updateTime: string, qty: number
}

export interface rate {
    name: string;
    id: string;
    unit: string;
    rate: string;
    by: string;
    byId: string;
    createdOn: string;
    companyId: string;
    companyName: string;
}
