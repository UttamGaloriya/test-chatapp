import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserProfile } from 'src/app/user-profile';
import { combineLatest, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chatuserlist',
  templateUrl: './chatuserlist.component.html',
  styleUrls: ['./chatuserlist.component.scss']
})
export class ChatuserlistComponent implements OnInit {
  searchControl = new FormControl('')
  chatListControl = new FormControl('')
  mychat$ = this.chatServices.myChat$
  user$ = this.useServices.currentUserProfile$
  // selId: string = "1"
  // selId?: number = null

  users$ = combineLatest(
    [this.useServices.allUsers$,
    this.user$,
    this.searchControl.valueChanges.pipe(startWith(''))]).pipe(
      map(([users, user, searchQuery]) => users.filter((u => u.userName?.toLowerCase().includes(searchQuery.toLowerCase()) && u.uid !== user?.uid)
      )))

  constructor(private useServices: UsersService, private authServices: AuthService, private chatServices: ChatService) { }

  ngOnInit(): void {
    // this.mychat$.subscribe( )
  }
  onSearchClear() {
    this.searchControl = new FormControl('')

  }
  // createChat(data: UserProfile) {
  //   this.chatServices.createChat(data).subscribe()
  // }

  createChat(user: UserProfile) {
    this.chatServices
      .isExistingChat(user.uid)
      .pipe(
        switchMap((chatId) => {
          if (!chatId) {
            return this.chatServices.createChat(user);
          } else {
            return of(chatId);
          }
        })
      )
      .subscribe((chatId) => {
        this.chatListControl.setValue([chatId]);
      });
  }

  selectUser(id: any) {
    this.chatServices.updateCurrentChat(id)
    const userclass = document.getElementsByClassName('home-page-window')
    userclass[0].classList.add('hide')
    this.chatServices.lastmessageSeen(id).subscribe()

  }

  selectedChat$ = combineLatest([
    this.chatListControl.valueChanges,
    this.mychat$
  ]).pipe(map(([value, chats]) => chats.find((c) => c.id === value[0])));


}
