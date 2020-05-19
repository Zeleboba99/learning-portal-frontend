import { Component, OnInit } from '@angular/core';
import {Page} from '../../models/page';
import {ActivatedRoute, Router} from '@angular/router';
import {PageService} from '../../services/page.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {

  public page_number = 1;
  public page_id: number;
  public lesson_id: number;
  public course_id: number;
  public pages: Page[] = [];
  public currentPage: Page;
  public numToInsert: any;
  public selectedFile;
  imgURL: any;
  public type: string;

  constructor(private route: ActivatedRoute, private router: Router, private pageService: PageService,
              private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.currentPage = new Page();
    this.route.queryParams.subscribe(params => {
      this.lesson_id = params['lesson_id'];
      this.course_id = params['course_id'];
      this.page_id = params['page_id'];
      this.type = params['type'];
    });
    if (this.lesson_id && this.course_id && this.page_id) {
      this.spinnerService.show();
    }
    this.pageService.getPagesForLesson(this.lesson_id).subscribe(res => this.pages = res);
    if (this.page_id) {
      this.pageService.getPageById(this.page_id).subscribe(result => this.currentPage = result);
      this.spinnerService.hide();
    }
  }

  createPage() {
    if (this.numToInsert) {
      console.log(this.numToInsert);
      this.currentPage.number = this.numToInsert;
    } else {
      this.currentPage.number = this.pages.length + 1;
    }
    const uploadData = new FormData();
    if (this.selectedFile) {
      uploadData.append('image', this.selectedFile, this.selectedFile.name);
    }
    uploadData.append('pageName', this.currentPage.name);
    uploadData.append('pageNumber', this.currentPage.number.toString());
    uploadData.append('pageType', this.type);
    uploadData.append('pageContent', this.currentPage.content);
    this.pageService.createPage(this.currentPage, this.lesson_id, uploadData).subscribe(
      next => this.router.navigate(['pages'],
        {queryParams: {course_id: this.course_id, lesson_id: this.lesson_id, page_id: this.page_id}})
    );
  }

  updatePage() {
    this.pageService.updatePage(this.currentPage, this.lesson_id).subscribe(
      next => this.router.navigate(['pages'], {queryParams: {course_id: this.course_id, lesson_id: this.lesson_id}})
    );
  }

  onFileChanged(event) {
    console.log(event);
    this.selectedFile = event.target.files[0];

    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event2) => {
      this.imgURL = reader.result;
    };
  }

  onChangeImage() {
    const uploadData = new FormData();
    uploadData.append('image', this.selectedFile, this.selectedFile.name);
    // this.userService.uploadImageForProfile(uploadData).subscribe(
    //   res => {
    //     this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
    //       this.router.navigate(['profile']));
    //   },
    //   err => console.log('Error Occured duringng saving: ' + err)
    // );
  }
}
