import { Pipe, PipeTransform } from '@angular/core';
import { getDownloadURL, ref, Storage, uploadBytes, getStorage, getMetadata } from '@angular/fire/storage';
@Pipe({
  name: 'filetype'
})
export class FiletypePipe implements PipeTransform {
  constructor(private storage: Storage) { }
  transform(url: string): unknown {
    const httpsReference = ref(this.storage, url);

    getMetadata(httpsReference)
      .then((metadata) => {
        let i = metadata.contentType?.lastIndexOf('/')
        const data = metadata.contentType
        console.log(data?.slice(0, i))
        return data?.slice(0, i)
      })
      .catch((error) => {
        console.log(url)
      });
    return null;
  }

}
