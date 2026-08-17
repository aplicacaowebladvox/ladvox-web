import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AttachmentModel } from '../../../models/attachment.model';
import { ConvertUtils } from '../../../modules/shared/utils/convert.utils';
import { AlertService } from '../../services/alert.provided.service';
import { UserStore } from '../../stores/user.store';
import { alertApiError } from '../../operators/api-alert-error.operator';

@Component({
  selector: 'app-profile-image-updater',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-image-updater.component.html',
  styleUrl: './profile-image-updater.component.scss',
  providers: [UserStore],
})
export class ProfileImageUpdaterComponent implements OnInit {
  @Input()
  profileImage!: AttachmentModel;
  @Input()
  userId!: string;
  @Input()
  userName: string = 'Usuário';
  get initials(): string {
    if (!this.userName) return 'U';
    let parts: string[] = this.userName.split(' ');
    if (parts.length > 1) {
      return parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1);
    }
    return parts[0].substring(0, 2);
  }
  file: string = '';
  showBase64?: string;
  constructor(
    private userStore: UserStore,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.showBase64 = this.profileImage?.base64;
  }
  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const file = files[0];
      ConvertUtils.toBase64(file).subscribe({
        next: (base64) => {
          this.showBase64 = base64;
          this.alertService.showConfirm({
            message: 'Tem certeza que deseja fazer essa alteração?',
            callbackConfirmFn: () => {
              this.profileImage.name = file.name;
              this.profileImage.bytesSize = file.size;
              this.profileImage.type = file.type;
              this.profileImage.lastModifiedDate = new Date(file.lastModified);
              this.profileImage.base64 = base64;
              this.userStore
                .saveImage(this.userId, this.profileImage)
                .pipe(alertApiError())
                .subscribe({
                  next: (model) => {
                    this.profileImage.id = model.id;
                    this.resetInput();
                  },
                });
            },
            callbackCancelFn: () => {
              this.showBase64 = this.profileImage?.base64;
              this.resetInput();
            },
          });
        },
      });
      // const _file = URL.createObjectURL(files[0]);
      // this.file = _file;
      // this.resetInput();
    }
  }
  resetInput() {
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }
}
