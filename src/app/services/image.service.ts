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


  // downloadFile(fileUrl: string): void {
  //   const xhr = new XMLHttpRequest();
  //   xhr.responseType = 'blob';

  //   xhr.onload = () => {
  //     const blob = new Blob([xhr.response], { type: 'application/octet-stream' });
  //     const downloadUrl = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = downloadUrl;
  //     a.download = 'file_name.extension';
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(downloadUrl);
  //   };

  //   xhr.open('GET', fileUrl);
  //   xhr.send();
  // }

  // downloadFile(fileUrl: string): void {
  //   console.log('Download URL:', fileUrl);
  //   const xhr = new XMLHttpRequest();
  //   xhr.responseType = 'blob';
  //   console.log(xhr.status); // Log the status code
  //   console.log(xhr.responseText); // Log the response text

  //   xhr.onload = () => {
  //     const contentType = xhr.getResponseHeader('content-type');
  //     // const contentType = 'image/png';
  //     const extension = this.getFileExtension(contentType);
  //     console.log(contentType)
  //     const blob = new Blob([xhr.response], { type: contentType || '.png' });
  //     const downloadUrl = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = downloadUrl;
  //     a.download = 'file_name' + extension;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(downloadUrl);
  //   };

  //   xhr.open('GET', fileUrl);
  //   xhr.send();
  // }

  // private getFileExtension(contentType: string | null): string {
  //   if (!contentType) {
  //     return '';
  //   }

  //   switch (contentType) {
  //     case 'image/jpeg':
  //       return '.jpg';
  //     case 'image/png':
  //       return '.png';
  //     case 'application/pdf':
  //       return '.pdf';
  //     // Add more cases for other file types as needed
  //     default:
  //       return '';
  //   }
  // }
  downloadFile(fileUrl: string): void {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';

    xhr.onload = () => {
      const contentType = xhr.getResponseHeader('content-type');
      const extension = this.getFileExtension(contentType);
      const blob = new Blob([xhr.response], { type: contentType || 'application/octet-stream' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'file_name' + extension;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    };

    xhr.open('GET', fileUrl);
    xhr.send();
  }

  private getFileExtension(contentType: string | null): string {
    if (!contentType) {
      return '';
    }

    switch (contentType) {
      case 'image/jpeg':
        return '.jpg';
      case 'image/png':
        return '.png';
      case 'application/pdf':
        return '.pdf';
      // Add more cases for other file types as needed
      default:
        return '';
    }
  }

}