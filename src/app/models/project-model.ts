import { Time } from "@angular/common";
import { actionActualData } from "./task-model";
import { ParticipantData } from "./enterprise-model";
import { classification } from "./user-model";

export interface Project {
    name: string,
    type: string,
    by: string,
    byId: string,
    companyName: string,
    companyId: string,
    createdOn: string,
    location: string,
    sector: string,
    champion: ParticipantData,
    id: string,
    completion: string,
}

export interface projectCompDetail { id: string, name: string };

export interface abridgedBill {
    section:Section,  id: string, name: string, No: number, projectId: string,
    projectName: string, companyId: string, companyName: string, totalAmount: number,
    createdOn: string, UpdatedOn: string
};

export interface workItem {
    id: string, uid: string, name: string, unit: string, quantity: number, rate: number, amount: number, billID: string,
    billName: string, projectId: string, projectName: string, byId: string, by: string, createdOn: string, championName: string, championId: string,
    UpdatedOn: string, actualData: [actionActualData], workStatus: string, complete: boolean, start: string, end: string,
    startWeek: string, startDay: string, startDate: string, endDay: string, endDate: string, endWeek: string, taskName: string,
    taskId: string, companyName: string, companyId: string, champion: ParticipantData, participants: [ParticipantData],
    departmentName: string, departmentId: string, classification: classification, type: string, targetQty: number,
    classificationName: string, classificationId: string, selectedWork: boolean, workHours: [workHours], section: Section,
    actualStart: string, actualEnd: string, Hours: string, selectedWeekWork: boolean, selectedWeekly: boolean
 };

// export interface sectWorkItem extends workItem { section: string, sectionNumber: number }

export interface Section {
    id: string, no: number, name: string, projectId: string, projectName: string, companyId: string, companyName: string, Bills: [abridgedBill], type: string
}

export interface  subSection {
    id: string, no: number, name: string, type: string, sectionNo: number, sectionName: string, sectionId: string, projectId: string, projectName: string, companyId: string, companyName: string, Bills: [abridgedBill] 
}

export interface superSections extends Section { subSections: [subSection] }

export interface workHours {
    name: string; action: string; actionId: string; hours: number, time: string;
} 

export interface setTime {
    name: string; id: string;
}
