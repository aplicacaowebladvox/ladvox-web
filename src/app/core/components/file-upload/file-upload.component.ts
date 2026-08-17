import { CommonModule } from '@angular/common';
import { Component, inject, Input, output } from '@angular/core';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { AttachmentModel } from '../../../models/attachment.model';
import { IAttachmentStore } from '../../stores/I-attachment.store';
import { AlertService } from '../../services/alert.provided.service';
import { ConvertUtils } from '../../../modules/shared/utils/convert.utils';
import { LoadingComponent } from '../loading/loading.component';
import { finalize } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { alertApiError } from '../../operators/api-alert-error.operator';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, NgxFileDropModule, LoadingComponent, NgxSkeletonLoaderModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  isLoading: boolean = false;
  private alertService: AlertService = inject(AlertService);
  attachments: AttachmentModel[] = [];

  @Input() readonly!: boolean;
  private _entityId!: number | string;
  @Input('entityId')
  set entityId(input: number | string) {
    this._entityId = input;
    this._load();
  }
  get entityId(): number | string {
    return this._entityId;
  }
  private _store!: IAttachmentStore;
  @Input('store')
  set store(input: IAttachmentStore) {
    this._store = input;
    this._load();
  }
  onEntityIdGenerated = output<number | string>();
  get store(): IAttachmentStore {
    return this._store;
  }
  isLoadingFile: boolean = false;

  public dropped(files: NgxFileDropEntry[]) {
    // this.files = files;
    for (const droppedFile of files) {
      this.isLoadingFile = true;
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          ConvertUtils.toBase64(file).subscribe({
            next: (base64) => {
              this.store
                .saveForEntityId(this.entityId, {
                  name: file.name,
                  bytesSize: file.size,
                  type: file.type,
                  lastModifiedDate: new Date(file.lastModified),
                  base64: base64,
                } as AttachmentModel)
                .pipe(alertApiError())
                .subscribe({
                  next: (attachment) => {
                    this.attachments.push(attachment);
                    if (
                      !!attachment.referecedByEntityId &&
                      attachment.referecedByEntityId != this.entityId
                    ) {
                      this.onEntityIdGenerated.emit(attachment.referecedByEntityId);
                    }
                    this.isLoadingFile = false;
                  },
                });
            },
            error: (err) => this.alertService.showError({ message: err }),
          });
          // console.log(droppedFile.relativePath, file);

          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)

          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/
        });
      }
    }
    this.isLoadingFile = false;
  }
  showFile(attachment: AttachmentModel): void {
    let pdf_newTab = window.open('');
    if (pdf_newTab == null) return;
    pdf_newTab.document.write(
      `<html><head><title>${attachment.name}</title></head><body><iframe title='${attachment.name}'  width='100%' height='100%' src='${attachment.base64}'></iframe></body></html>`
    );
  }
  deleteFile(attachment: AttachmentModel): void {
    this.alertService.showConfirm({
      message: 'Esta ação é irreversivel, tem certeza que deseja executa-la?',
      title: 'Excluir anexo',
      callbackConfirmFn: () => {
        this.isLoading = true;
        this.store
          .delete(attachment.id)
          .pipe(
            finalize(() => (this.isLoading = false)),
            alertApiError()
          )
          .subscribe({
            next: () => {
              this._load();
            },
          });
      },
    });
  }
  private _load(): void {
    if (!this.store || !this.entityId) return;
    this.store
      .findAllByEntityId(this.entityId)
      .pipe(alertApiError())
      .subscribe({
        next: (attachments) => (this.attachments = attachments),
      });
  }
}
