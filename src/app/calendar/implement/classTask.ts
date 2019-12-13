import { Task } from '../../models/task-model';
import { classification } from '../../models/user-model';
export interface classTask extends Task {
  classification: classification;
}
