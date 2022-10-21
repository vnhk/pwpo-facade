export interface ItemApi {
  items: Item[];
  currentFound: number;
  currentPage: number;
  allFound: number;
}

export interface Item {
  id?: number;
}

export interface PersonApi extends ItemApi {
  items: Person[];
}

export interface Person extends Item {
  fullName?: string;
  nick?: string;
  projectRole?: string;
}

export interface ProjectApi extends ItemApi {
  items: Project[];
}

export interface Project extends Item {
  name?: string;
  summary?: string;
  status?: string;
  description?: string;
  shortForm?: string;
  owner?: Person;
  createdBy?: Person;
  created?: Date;
  updated?: Date;
}

export interface ProjectHistoryApi extends ItemApi {
  items: ProjectHistory[];
}

export interface HistoryDiffApi extends ItemApi {
  items: HistoryDiff[];
}

export interface HistoryDiff extends Item {
  entityId?: number;
  historyId?: number;
  diff?: DiffAttribute[];
}

export interface DiffAttribute {
  attribute: string;
  diff: DiffWord[];
}

export interface DiffWord {
  value: string;
  type: string;
}

export interface ProjectHistory extends Item {
  name?: string;
  summary?: string;
  status?: string;
  description?: string;
  shortForm?: string;
  owner?: string;
  editor?: Person;
  expired?: Date;
}

export interface TaskApi extends ItemApi {
  items: Task[];
}

export interface UserProject {
  user: number;
  projectRole: string;
}

export interface ChartData {
  name: string;
  value: number;
}


export interface TimeLogRequest {
  date: number;
  timeInHours: number;
  timeInMinutes: number;
  comment: number;
}

export interface TimeLog extends Item {
  date?: Date;
  loggedTimeInMinutes?: number;
  comment?: string;
  user?: Person;
}

export interface TimeLogApi extends ItemApi {
  items: TimeLog[];
}

export interface Task extends Item {
  type?: string;
  number?: string;
  summary?: string;
  status?: string;
  assignee?: Person;
  owner?: Person;
  dueDate?: any;
  priority?: string;
  description?: string;
  estimation?: number;
  createdBy?: Person;
  created?: Date;
  updated?: Date;
  project?: Project;
}

export interface DataEnumApi extends ItemApi {
  items: DataEnum[];
}

export interface DataEnum extends Item {
  internalName: string;
  displayName: string;
}

export interface TaskListDisplayOption {
  name: string;
  internalName: string;
  checked: boolean;
  subOptions: TaskListDisplayOption[];
}
