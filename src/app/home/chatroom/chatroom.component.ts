import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatuserlistComponent } from '../chatuserlist/chatuserlist.component';
import { ChatService } from 'src/app/services/chat.service';
import { FormControl } from '@angular/forms';
import { Chat, Message } from 'src/app/chat';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { error } from 'console';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {

  messageControl = new FormControl
  cureentUser$ = this.chatServices.selectedChat$
  authUser$ = this.authServices.currentUser$
  cuData?: Chat
  message$: Observable<Message[]> | undefined
  messageData: any
  currentId: any = 0
  chatHistoryDate?: any

  @ViewChild('endOfChat')
  endOfChat!: ElementRef;

  constructor(private chatServices: ChatService, private authServices: AuthService) {
    this.scrollToBottom()
  }

  ngOnInit(): void {
    this.chatServices.selectedChat$.subscribe((res) => { this.cuData = res, this.currentId = res?.id, this.myfunction(this.cuData?.id) })
  }

  myfunction(id: any) {
    this.message$ = this.chatServices.selectedChat$.pipe(
      map(value => id),
      switchMap((chatId) => this.chatServices.getChatMessages$(chatId),),
      tap((res) => { console.log(res), this.scrollToBottom() })
    )
  }

  sendMessage() {

    const message = this.messageControl.value;
    // const selectedChatId = this.cuData?.id
    if (message && this.currentId) {
      this.chatServices.addChatMessage(this.currentId, message).subscribe()
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
    }, 1000);
  }

  newDateMsg(datemsg: any) {
    if (datemsg !== this.chatHistoryDate) {
      console.log(datemsg + "his" + this.chatHistoryDate)
      return true
    }
    return false
  }

}
