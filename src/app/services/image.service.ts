import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { getDownloadURL, ref, Storage, uploadBytes, } from '@angular/fire/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private storage: Storage, private http: HttpClient) { }

  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
  }


  //upload file
  uploadfile(fl: File, path: string): Observable<string> {

    const storageRef = ref(this.storage, path)
    const uploadTask = from(uploadBytes(storageRef, fl))
    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)))
  }

  ptrintfile(data: string) {
    const httpsReference = ref(this.storage, data);
    console.log(httpsReference)
  }


}