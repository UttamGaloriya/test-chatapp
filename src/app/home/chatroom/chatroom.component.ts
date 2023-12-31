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
import { url } from 'inspector';
import { getDownloadURL, ref, Storage, uploadBytes, getStorage, getMetadata } from '@angular/fire/storage';

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
  currentChatId: any = undefined
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
  constructor(private chatServices: ChatService,
    private userservices: UsersService,
    private imgeServices: ImageService,
    private sanitizer: DomSanitizer,
    private storage: Storage) {
    this.scrollToBottom()
  }

  ngOnInit(): void {
    this.authUser$.subscribe((res) => { this.authorized = res })
    this.scrollToBottom()
  }



  myfunction(id: any) {
    if (this.currentChatId !== id) {
      this.msgToggled = true;
      this.msgLast = false;
      this.Message_data = [];
      console.log(id)

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
          this.scrollToBottom(), this.loading = false;
          if (this.msgToggled) {
            if (this.msgLast) {
              this.Message_data = this.Message_data.concat(res[res.length - 1]);
            } else { this.Message_data = res; }
          }
        }));
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
    }, 100);
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
    const date = Date.now()
    const fileName = event.target.files[0].name
    this.imgeServices.uploadfile(event.target.files[0], `ChatFile/${this.currentChatId}/${fileName}`).pipe(
      switchMap(res =>
        this.chatServices.addFileMessage(this.currentChatId, res, this.authorized?.uid)

      ),
      tap((res) => { console.log(res, this.msgToggled = true) })
    ).subscribe()

  }


  downloadFile(url: any) {
    const httpsReference = ref(this.storage, url);
    saveAs(url, httpsReference.name)
    //   fetch(url, { method: 'GET', })
    //     .then(response => { console.log(response); return response.blob() })
    //     .then(blob => {
    //       console.log(blob)
    //       const a = document.createElement('a');
    //       const objectURL = URL.createObjectURL(blob);
    //       a.href = objectURL;
    //       a.download = httpsReference.name;
    //       a.style.display = 'none';
    //       document.body.appendChild(a);
    //       a.click();
    //       document.body.removeChild(a);
    //       URL.revokeObjectURL(objectURL);
    //     })
    //     .catch(error => {
    //       console.error('Error downloading file:', error);
    //     });
  }
}