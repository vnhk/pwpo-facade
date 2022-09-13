import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../../main/service/http.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {DataEnum, Person} from "../../../main/api-models";
import {TaskService} from "../../service/task.service";

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  priority: DataEnum[] | undefined;
  taskType: DataEnum[] | undefined;
  addedToProject: Person[] | undefined;

  constructor(private httpService: HttpService,
              private taskService: TaskService,
              private route: ActivatedRoute,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get("id");
    this.httpService.getUsersWithAccessToTheProject(id).subscribe(value => this.addedToProject = value.items);
    this.httpService.getEnumByName("com.pwpo.common.enums.Priority").subscribe(value => this.priority = value.items);
    this.httpService.getEnumByName("com.pwpo.task.enums.TaskType").subscribe(value => this.taskType = value.items);
  }


  profileForm = this.fb.group({
    assignee: [''],
    firstName: [''],
    lastName: [''],
    address: [''],
    dob: [''],
    gender: ['']
  });

  onSubmit() {
    console.log('form data is ', this.profileForm.value);
  }
}
