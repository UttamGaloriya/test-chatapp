import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  // Message_data: any[] = [];
  message_length: number = 0
  lastSeenId?: string
  currentChatId: any = 0
  count: number = 30
  scrollValue = 0;
  toggled: boolean = false;
  loading: boolean = true;
  chatId = this.chatServices.selectedChat$.subscribe((res) => { this.myfunction(res?.id), this.lastSeenId = res?.lastMessageUserId })

  @ViewChild('endOfChat') endOfChat!: ElementRef;
  @ViewChild('midOfChat') midOfchat!: ElementRef;
  constructor(private chatServices: ChatService, private authServices: AuthService, private userservices: UsersService, private notfication: NotificationService) {
    this.scrollToBottom()
  }

  ngOnInit(): void {
    this.authUser$.subscribe((res) => { this.authorized = res })
    this.scrollToBottom()
  }


  myfunction(id: any) {
    if (this.currentChatId !== id) {
      this.message$ = this.chatServices.selectedChat$.pipe(
        switchMap((chatId) => {
          this.currentChatId = id; // Update the current chat ID
          return this.chatServices.getChatMessages$(id).pipe(
            map((messages) => messages.slice(-this.count)) // Get the last 30 messages
          );
        }),
        tap((res) => { this.scrollToBottom(), this.loading = false })
      );
    }
  }




  sendMessage() {
    const message = this.messageControl.value;
    if (message && this.currentChatId) {
      this.chatServices.addChatMessage(this.currentChatId, message, this.authorized?.uid).subscribe()
      this.messageControl.setValue('');
      this.scrollToBottom()
    }
  }


  chatClose() {
    this.chatServices.updateCurrentChat(null)
    if (window.screen.width <= 767) {
      const userclass = document.getElementsByClassName('home-page-window')
      userclass[0].classList.remove('hide')
    }
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
    if (this.scrollValue == 0 && this.count <= this.message_length) {
      this.count = this.count + 30
      console.log("value upadte")
      this.update()
    }
  }



  update() {
    this.loading = true


    //upadate message
    this.message$ = this.chatServices.selectedChat$.pipe(
      switchMap((chatId) => {
        this.currentChatId  // Update the current chat ID
        return this.chatServices.getChatMessages$(this.currentChatId).pipe(
          map((messages) => messages.slice(-this.count)) // Get the last count messages
        );
      }),
      tap(() => { this.loading = false })
    );
  }

}
