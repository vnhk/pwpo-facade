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
  modified?: Date;
}

export interface TaskApi extends ItemApi {
  items: Task[];
}

export interface UserProject {
  user: number;
  projectRole: string;
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
  estimation?: string;
  createdBy?: Person;
  created?: Date;
  modified?: Date;
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
