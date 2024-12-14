import { HttpClient, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  imports: [HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl:'./app.component.scss',
  standalone:true,
  providers:[]
})
export class AppComponent implements OnInit{
  eventsource:EventSource|undefined;
  constructor(private http:HttpClient){}
  ngOnInit(){
    initFlowbite();
  }
  createEventSourceConnection(){
    this.eventsource=new EventSource('http://localhost:1800/create-stream');
    this.eventsource.onmessage=({data})=>{
      console.log(data);
      const wind=document.getElementById('event-stream-window');
      const p=document.createElement('p');
      if(data=="stream connected"){
              p.innerHTML=`<div class="flex items-center"><span class="flex w-3 h-3 me-3 bg-green-500 rounded-full"></span> ${data}</div>`
      }
      else{
              p.innerHTML=`<div class="flex items-center"><span class="flex w-3 h-3 me-3 bg-yellow-300 rounded-full"></span> ${data}</div>`
      }
      wind?.appendChild(p)
      wind?.scrollTo(0,wind.scrollHeight);
    }
    this.eventsource.onerror=()=>{
      const wind=document.getElementById('event-stream-window');
      const p=document.createElement('p');
              p.innerHTML=`<div class="flex items-center"><span class="flex w-3 h-3 me-3 bg-red-500 rounded-full"></span> connection closed</div>`
      wind?.appendChild(p)
    }
  }
  closeConnection(){
    if(this.eventsource){
      this.eventsource.close();
      this.eventsource=undefined;
      const wind=document.getElementById('event-stream-window');
      const p=document.createElement('p');
              p.innerHTML=`<div class="flex items-center"><span class="flex w-3 h-3 me-3 bg-red-500 rounded-full"></span> connection closed</div>`
      wind?.appendChild(p);
      wind?.scrollTo(0,wind.scrollHeight);
    }
  }
  sayHelloFunction(){
    if(this.eventsource){
      this.http.get('http://localhost:1800/say-hello').subscribe({
        next:(data)=>{
          console.log("Message emitted",data);
        },
        error:(errMessage)=>{
          console.log("error in emitting message",errMessage);
        }
      })
    }
  }
}
