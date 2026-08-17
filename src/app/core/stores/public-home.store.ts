import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PatientModelMock } from '../../mocks/patient/patient.mock';
import { PatientModel } from '../../models/patient.model';
import { SystemContactModel } from '../../models/system-contact.model';
import { SystemContactMock } from '../../mocks/system-contact.mock';
import { SystemSocialMediaModel } from '../../models/system-landing-page-social-media.model';
import { SystemSocialMediaMock } from '../../mocks/system-social-media.mock';
import { SystemLandingPageArticleModel } from '../../models/system-landing-page-article.model';
import { SystemLandingPageArticleMock } from '../../mocks/system-landing-page-article.mock';
import { SystemLandingPageProjectMock } from '../../mocks/system-landing-page-project.mock';
import { SystemLandingPageProjectModel } from '../../models/system-landing-page-project.model';
import { UserModelMock } from '../../mocks/user/user.mock';
import { UserModel } from '../../models/user.model';
import { SystemLandingPagePublicationModel } from '../../models/system-landing-page-publication.model';
import { SystemLandingPagePublicationMock } from '../../mocks/system-landing-page-publication.mock';
import { BaseStore } from '../abstractions/base.store';
import { UserMemberLandingPageModel } from '../../models/user-member-landing-page.model';
import { RequestAppointmentModel } from '../../models/request-appointment.model';

@Injectable()
export class PublicHomeStore extends BaseStore {
  constructor() {
    super('public/home');
  }
  getContactsActives(): Observable<SystemContactModel[]> {
    return this.requestService.makeGet(this.getUrl('contacts'), { useAuth: false });
  }
  getSocialMediasActives(): Observable<SystemSocialMediaModel[]> {
    return this.requestService.makeGet(this.getUrl('social-medias'), { useAuth: false });
  }
  getArticles(): Observable<SystemLandingPageArticleModel[]> {
    return this.requestService.makeGet(this.getUrl('articles'), { useAuth: false });
  }
  getMembers(): Observable<UserMemberLandingPageModel[]> {
    return this.requestService.makeGet(this.getUrl('users-members'), { useAuth: false });
  }
  getProjects(): Observable<SystemLandingPageProjectModel[]> {
    return this.requestService.makeGet(this.getUrl('projects'), { useAuth: false });
  }
  getPublications(): Observable<SystemLandingPagePublicationModel[]> {
    return this.requestService.makeGet(this.getUrl('publications'), { useAuth: false });
  }
  requestAppointment(model: RequestAppointmentModel): Observable<RequestAppointmentModel> {
    return this.requestService.makePost(this.getUrl('request-appointment'), {
      data: model,
      useAuth: false,
    });
  }
}
