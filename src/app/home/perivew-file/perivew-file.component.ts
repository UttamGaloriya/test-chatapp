import { Component, Input, OnInit } from '@angular/core';
import { getDownloadURL, ref, Storage, uploadBytes, getStorage, getMetadata } from '@angular/fire/storage';
@Component({
  selector: 'app-perivew-file',
  templateUrl: './perivew-file.component.html',
  styleUrls: ['./perivew-file.component.scss']
})
export class PerivewFileComponent implements OnInit {

  @Input() type: any = ''
  @Input() src: string = ''

  constructor(private storage: Storage) { }

  ngOnInit(): void {
  }
  mytype(url: string) {
    const httpsReference = ref(this.storage, url);

    getMetadata(httpsReference)
      .then((metadata) => {
        let i = metadata.contentType?.lastIndexOf('/')
        const data = metadata.contentType
        console.log("working")
        return data?.slice(0, i)
      })
      .catch((error) => {
        console.log(url)
      });
    return null
  }
}
