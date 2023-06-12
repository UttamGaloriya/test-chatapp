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

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  authuid: any = "1";
  messg: any[] = []
  lastSeenId?: string
  currentId: any = 0
  currentUserId?: string
  messageControl = new FormControl('')
  count: number = -30
  cureentUser$ = this.chatServices.selectedChat$;//selectd chat user
  authUser$ = this.userservices.currentUserProfile$;//authorized user

  chatId = this.chatServices.selectedChat$.subscribe((res) => { this.myfunction(res?.id), this.lastSeenId = res?.lastMessageUserId })
  cuData?: Chat
  message$: Observable<Message[]> | undefined
  //emoji
  toggled: boolean = false;
  messageData: any
  chatHistoryDate?: any

  @ViewChild('endOfChat')
  endOfChat!: ElementRef;


  constructor(private chatServices: ChatService, private authServices: AuthService, private userservices: UsersService) {
    this.scrollToBottom()
  }

  ngOnInit(): void {
    this.authUser$.subscribe((res) => { this.authuid = res?.uid })
    this.scrollToBottom()
  }

  myfunction(id: any) {
    if (this.currentId !== id) {
      this.message$ = this.chatServices.selectedChat$.pipe(
        switchMap((chatId) => this.chatServices.getChatMessages$(id)),
        tap(() => this.scrollToBottom()),
        map((messages) => {

          this.messg = messages;
          debugger
          // return this.messg.slice(this.count);
          return messages.slice(this.count);
        })
      );
      this.currentId = id;
    }
  }


  sendMessage() {

    const message = this.messageControl.value;
    // const selectedChatId = this.cuData?.id
    if (message && this.currentId) {
      this.chatServices.addChatMessage(this.currentId, message, this.authuid).subscribe()
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

  newDateMsg(datemsg: any) {
    if (datemsg !== this.chatHistoryDate) {
      this.chatHistoryDate = datemsg
      return true
    }
    return false
  }


  handleSelection(event: any) {
    this.messageControl.setValue(this.messageControl.value + event.char)
  }
  scrollValue = 0;

  onScroll(event: any) {
    this.scrollValue = event.target.scrollTop;
    console.log(this.scrollValue)
    if (this.scrollValue == 0) {
      console.log("value upadte")
      this.update()
    }
  }

  update() {
    debugger
    this.count = this.count - 30
    const newMessages: any[] = [];
    this.messg = newMessages.concat(this.messg);
    this.message$ = of(this.messg.slice(this.count));
  }
}
