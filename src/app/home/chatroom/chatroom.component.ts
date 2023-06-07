import { Component, OnInit } from '@angular/core';
import { ChatuserlistComponent } from '../chatuserlist/chatuserlist.component';
import { ChatService } from 'src/app/services/chat.service';
import { FormControl } from '@angular/forms';
import { Chat, Message } from 'src/app/chat';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {

  messageControl = new FormControl
  cureentUser$ = this.chatServices.selectedChat$
  cuData?: Chat
  message$: Observable<Message[]> | undefined
  messageData: any


  constructor(private chatServices: ChatService) { }
  ngOnInit(): void {
    this.chatServices.selectedChat$.subscribe(
      (res) => { this.cuData = res, this.myfunction(res?.id) }
    )


  }

  myfunction(id: any) {
    if (this.cuData?.id !== undefined) {
      console.log("id are there" + this.cuData?.id)
      // this.message$ = this.chatServices.getChatMessages$(id).subscribe()
      this.message$ = this.chatServices.selectedChat$.pipe(
        map(value => id),
        switchMap(chatId => this.chatServices.getChatMessages$(chatId))
      )
      this.message$.subscribe(
        (res: any) => { },
        (err: any) => { console.log(err) },
      )
    } else {
      console.log("id not there")

    }
  }
  sendMessage() {
    const message = this.messageControl.value;
    const selectedChatId = this.cuData?.id
    if (message && selectedChatId) {
      this.chatServices.addChatMessage(selectedChatId, message).subscribe()
      this.messageControl.setValue('');
    }
  }

}
