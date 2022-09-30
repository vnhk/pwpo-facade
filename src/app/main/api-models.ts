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
  created?: string;
  modified?: string;
}

export interface TaskApi extends ItemApi {
  items: Task[];
}

export interface Task extends Item {
  type?: string;
  number?: string;
  summary?: string;
  status?: string;
  assignee?: Person;
  owner?: Person;
  dueDate?: string;
  priority?: string;
  description?: string;
  estimation?: string;
  createdBy?: Person;
  created?: string;
  modified?: string;
  projectId?: string;
}

export interface DataEnumApi extends ItemApi {
  items: DataEnum[];
}

export interface DataEnum extends Item {
  internalName?: string;
  displayName?: string;
}
