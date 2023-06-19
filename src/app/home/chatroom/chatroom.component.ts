import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ChatuserlistComponent } from '../chatuserlist/chatuserlist.component';
import { ChatService } from 'src/app/services/chat.service';
import { FormControl } from '@angular/forms';
import { Chat, Message } from 'src/app/chat';
import { Observable, of } from 'rxjs';
import { map, scan, switchMap, takeLast, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { error } from 'console';
import { UsersService } from 'src/app/services/users.service';
import { UserProfile } from 'src/app/user-profile';
import { NotificationService } from 'src/app/services/notification.service';
import { ImageService } from 'src/app/services/image.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  messageControl = new FormControl('')

  cureentUser$ = this.chatServices.selectedChat$;//selectd chat user
  authUser$ = this.userservices.currentUserProfile$;//authorized user
  message$: Observable<Message[]> | undefined

  authorized!: UserProfile | null
  // Temp_Message: any[] = []
  Message_data: any[] = [];
  message_length: number = 0
  lastSeenId?: string
  currentChatId: any = 0
  count: number = 30
  scrollValue = 0;
  toggled: boolean = false;
  loading: boolean = true;
  msgToggled: boolean = true;
  msgLast: boolean = false;
  fileUrl: any
  chatId = this.chatServices.selectedChat$.subscribe((res) => { this.myfunction(res?.id), this.lastSeenId = res?.lastMessageUserId })

  @ViewChild('endOfChat') endOfChat!: ElementRef;
  @ViewChild('midOfChat') midOfchat!: ElementRef;
  constructor(private chatServices: ChatService, private http: HttpClient, private sanitizer: DomSanitizer, private renderer: Renderer2, private authServices: AuthService, private userservices: UsersService, private notfication: NotificationService, private imgeServices: ImageService) {
    this.scrollToBottom()
  }

  ngOnInit(): void {
    this.authUser$.subscribe((res) => { this.authorized = res })
    this.scrollToBottom()
  }


  // myfunction(id: any) {
  //   if (this.currentChatId !== id) {
  //     this.message$ = this.chatServices.selectedChat$.pipe(
  //       switchMap((chatId) => {
  //         this.currentChatId = id; // Update the current chat ID
  //         return this.chatServices.getChatMessages$(id).pipe(
  //           map((messages) => messages.slice(-this.count)) // Get the last 30 messages
  //         );
  //       }),
  //       tap((res) => { this.scrollToBottom(), this.loading = false })
  //     );
  //   }
  // }
  myfunction(id: any) {
    if (this.currentChatId !== id) {
      this.message$ = this.chatServices.selectedChat$.pipe(
        switchMap((chatId) => {
          this.currentChatId = id; // Update the current chat ID
          return this.chatServices.getChatMessages$(id).pipe(
            map((messages) => {

              return messages
            })
          );
        }),
        tap((res) => {
          if (this.msgToggled) {
            if (this.msgLast) {
              this.Message_data = this.Message_data.concat(res[res.length - 1]);
            } else { this.Message_data = res; }
          }
          this.scrollToBottom(), this.loading = false, this.msgToggled = false, this.msgLast = true
        })
      );
    }
  }





  sendMessage() {
    const message = this.messageControl.value;
    if (message && this.currentChatId) {
      this.chatServices.addChatMessage(this.currentChatId, message, this.authorized?.uid).subscribe()
      this.msgToggled = true
      this.messageControl.setValue('');
      this.scrollToBottom()
    }
  }


  chatClose() {
    this.chatServices.updateCurrentChat(null)
    const userclass = document.getElementsByClassName('home-page-window')
    userclass[0].classList.remove('hide')

  }


  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1000);
  }



  handleSelection(event: any) {
    this.messageControl.setValue(this.messageControl.value + event.char)
  }

  onScroll(event: any) {
    this.scrollValue = event.target.scrollTop;
    if (this.scrollValue == 0) {
      this.count = this.count + 30
      console.log("value upadte")
      this.update()
    }
  }


  update() {
    this.loading = true
    const lastmsg = this.Message_data[0]
    const oldMessage = this.Message_data
    this.chatServices.getChatMessagesLoader$(this.currentChatId, lastmsg).subscribe(
      res => { console.log(this.Message_data = res.concat(oldMessage)), this.loading = false }
    )
  }

  uploadFile(event: any) {
    // this.imgeServices.uploadfile()
    const date = Date.now()
    const fileName = event.target.files[0].name
    this.imgeServices.uploadfile(event.target.files[0], `ChatFile/${this.currentChatId}/${fileName}`).pipe(
      switchMap(res => this.chatServices.addFileMessage(this.currentChatId, res, this.authorized?.uid)),
      tap((res) => { console.log(res) })
    ).subscribe()
  }
  downloadFile(url: any) {
    this.imgeServices.downloadFile(url)
    // saveAs(url, "file.png");
  }

  downloadFxile(url: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.setAttribute('download', 'file.png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    saveAs(url, "file.png");
  }


  downloadFicle(url: string): void {
    console.log(url)
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';

    xhr.onload = () => {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = 'file.png';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(a.href);
    };

    xhr.open('GET', url);
    xhr.send();
  }

  // downloadFile(url: any) {
  //   fetch(url, { mode: 'no-cors' })
  //     .then(response => response.blob())
  //     .then(blob => {
  //       const a = document.createElement('a');
  //       const objectURL = URL.createObjectURL(blob);
  //       console.log(objectURL);
  //       a.href = objectURL;
  //       debugger
  //       // a.download = url.substring(url.lastIndexOf('/') + 1);
  //       a.download = "file.PNG";
  //       a.style.display = 'none';
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);
  //       URL.revokeObjectURL(objectURL);
  //     })
  //     .catch(error => {
  //       console.error('Error downloading file:', error);
  //     });
  // }
  // downloadFile()
}
