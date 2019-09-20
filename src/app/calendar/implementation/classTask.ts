import { Task } from '../../models/task-model';
import { classification } from 'app/models/user-model';
export interface classTask extends Task {
  classification: classification;
}
