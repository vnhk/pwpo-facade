import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../../projects/service/project.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {Person} from "../../../main/api-models";

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  constructor(private projectService: ProjectService,
              private route: ActivatedRoute,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get("id");
    this.projectService.getUsersWithAccessToTheProject(id).subscribe(value => this.addedToProject = value.items);
  }

  addedToProject: Person[] | undefined;


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
