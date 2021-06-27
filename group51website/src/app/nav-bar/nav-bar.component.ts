import { UploadService } from './../upload.service';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

    file;
    file_list: File[];

    modal_element: HTMLElement;
    modal_background: HTMLElement;

    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

    constructor(private uploadService: UploadService) { }
    ngOnInit(): void {
        this.uploadService.currentFile.subscribe(newfile => this.file = newfile);
        this.modal_background = document.getElementById('upload_modal_background');
        this.modal_element    = document.getElementById('upload_modal');

        this.modal_background.addEventListener('click', () => {
            if (this.modal_element.className == "modal is-active"){
                this.modal_element.className = "modal"
            }
        })

        this.addToggleNavbarBurger();
    }

    onFileUpload() {
        // get file from button
        const file = this.fileInput.nativeElement.files[0];
        if (file.type.split('/')[1] != 'vnd.ms-excel') {
            alert('Please upload a csv file :D');
        }

        this.file = file;
        this.uploadService.changeFile(this.file);

        // update displayed name
        var labels = document.querySelectorAll('#file-upload .file-name');
        labels.forEach((label) => { label.textContent = file.name; console.log(label); })
        //fileName.textContent = file.name;
    }

    // checks if the modal is shown, and inverts visibility
    toggleUploadModal(): void {
        if (this.modal_element.className == "modal is-active"){
            this.modal_element.className = "modal"
        } else {
            this.modal_element.className = "modal is-active"

            

        }
    }
    removeNotification(id:string):void{
        document.getElementById(id).className += " is-hidden";
    }

    // provided by bulma documentation: https://bulma.io/documentation/components/navbar/ 
    addToggleNavbarBurger(): void {
        document.addEventListener('DOMContentLoaded', () => {

            // Get all "navbar-burger" elements
            const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
          
            // Check if there are any navbar burgers
            if ($navbarBurgers.length > 0) {
          
                // Add a click event on each of them
                $navbarBurgers.forEach( el => {
                    el.addEventListener('click', () => {
                        // Get the target from the "data-target" attribute
                        const target = el.dataset.target;
                        const $target = document.getElementById(target);
                
                        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                        el.classList.toggle('is-active');
                        $target.classList.toggle('is-active');
                    });
                });
            }
        });
    }
}
