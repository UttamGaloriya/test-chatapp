import { Injectable } from '@angular/core';
import { collection, Firestore, addDoc, collectionData, where, query, Timestamp, doc, updateDoc, orderBy } from '@angular/fire/firestore';
import { UserProfile } from '../user-profile';
import { UsersService } from './users.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { Chat, Message } from '../chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private firestore: Firestore, private usersService: UsersService) { }
  // add chat
  createChat(otherUser: UserProfile): Observable<string> {
    const ref = collection(this.firestore, 'chats');
    return this.usersService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          lastMessageUserId: user?.uid,
          userIds: [user?.uid, otherUser?.uid],
          users: [
            {
              userName: user?.userName ?? '',
              photoURL: user?.photoURL ?? '',
            },
            {
              userName: otherUser.userName ?? '',
              photoURL: otherUser.photoURL ?? '',
            },
          ],
        })
      ),
      map((ref) => ref.id)
    );
  }


  get myChat$(): Observable<Chat[]> {
    const ref = collection(this.firestore, 'chats');

    return this.usersService.currentUserProfile$.pipe(
      concatMap((user) => {
        const myQuery = query(ref, where('userIds', 'array-contains', user?.uid));
        return collectionData(myQuery, { idField: 'id' }).pipe(
          map(chats => this.addChatNameAndPic(user?.uid ?? '', chats as Chat[]))
        )
      })
    )
  }

  addChatNameAndPic(currentUserId: string, chats: Chat[]): Chat[] {
    chats.forEach((chat: Chat) => {
      const chatUserIndex = chat.userIds.indexOf(currentUserId ?? '') === 0 ? 1 : 0;
      const { userName, photoURL } = chat.users[chatUserIndex];
      chat.chatName = userName;
      chat.chatPic = photoURL;
    });
    return chats
  }



  //currnent data
  private cureentid: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  updateCurrentChat(id: any): void {
    this.cureentid.next(id);
    console.log(id)
  }

  selectedChat$ = combineLatest([
    this.cureentid,
    this.myChat$
  ]).pipe(map(([value, chats]) => chats.find((c) => c.id === value)));

  //add chat
  addChatMessage(chatId: string, message: string): Observable<any> {
    const ref = collection(this.firestore, 'chats', chatId, 'messages');
    const chatRef = doc(this.firestore, 'chats', chatId);
    const today = Timestamp.fromDate(new Date());
    return this.usersService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          text: message,
          senderId: user?.uid,
          sentDate: today,
        })
      ),
      concatMap((user) =>
        updateDoc(chatRef, { lastMessage: message, lastMessageDate: today, lastMessageUserId: user?.id })
      )
    );
  }

  getChatMessages$(chatId: string): Observable<Message[]> {
    const ref = collection(this.firestore, 'chats', chatId, 'messages');
    const queryAll = query(ref, orderBy('sentDate', 'asc'));
    return collectionData(queryAll) as Observable<Message[]>;
  }

  isExistingChat(otherUserId: string): Observable<string | null> {
    return this.myChat$.pipe(
      take(1),
      map((chats) => {
        for (let i = 0; i < chats.length; i++) {
          if (chats[i].userIds.includes(otherUserId)) {
            return chats[i].id;
          }
        }
        return null;
      })
    );
  }
}
