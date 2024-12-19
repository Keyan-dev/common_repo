import { UrlShortenService } from './url-shorten.service';
import { initFlowbite, Modal } from 'flowbite';
import { AfterViewInit, Component, input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnInit, AfterViewInit {
  urlShortenForm: FormGroup;
  linkModal: Modal | undefined;
  shortUrl: string | null = null;
  loader = false;
  errorMessage:string|null=null;
  constructor(
    private UrlShorten: UrlShortenService,
  ) {
    this.urlShortenForm = new FormGroup({
      originalUrl: new FormControl(null, [Validators.required]),
      redirectPrefix: new FormControl(null, [Validators.required])
    });
    this.urlShortenForm.get('redirectPrefix')?.setValue(window.origin);
  }
  ngOnInit() {
    initFlowbite();
    this.redirectUrl();
  }
  ngAfterViewInit() {
    const $targetModal = document.getElementById('short-url-modal');
    this.linkModal = new Modal($targetModal);
  }
  redirectUrl() {
    const pathId=window.location.pathname.split('/').filter((e)=>e!='');
    if(pathId?.length){
        this.loader = true;
        this.UrlShorten.redirectUrl({ id: pathId[0] }).subscribe({
          next: (data: any) => {
            window.location.href = data?.originalUrl;
          },
          error: (err) => {
            //need to handle error
          }
        })
    }
  }
  getShortenUrl() {
    this.UrlShorten.getShortUrl(this.urlShortenForm.value).subscribe({
      next: (data: any) => {
        if (data?.shortUrl) {
          this.shortUrl = data?.shortUrl;
          this.errorMessage=null;
          this.linkModal && this.linkModal.show();
        }
        else if(data?.error){
          this.errorMessage=data?.error;
        }
        else{
          this.errorMessage='Something went wrong!Try again';
        }
      },
      error: (err) => {
        this.errorMessage=err;
      }
    })
  }
  copyToClipboard() {
    let inputElement = document.getElementById("short-url") as HTMLInputElement;
    let defaultIcon = document.getElementById("default-icon-short-url") as HTMLElement;
    let successIcon = document.getElementById("success-icon-short-url") as HTMLElement;
    let defaultTooltip = document.getElementById("default-tooltip-message-short-url") as HTMLElement;
    let successTooltip = document.getElementById("success-tooltip-message-short-url") as HTMLElement;
    navigator.clipboard.writeText(inputElement.value);
    defaultIcon.classList.add("hidden");
    successIcon.classList.remove("hidden");
    defaultTooltip.classList.add("hidden");
    successTooltip.classList.remove("hidden");
    setTimeout(() => {
      defaultIcon.classList.remove("hidden");
      successIcon.classList.add("hidden");
      defaultTooltip.classList.remove("hidden");
      successTooltip.classList.add("hidden");
    }, 5000)
  }
}
