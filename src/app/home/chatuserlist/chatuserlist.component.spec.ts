import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatuserlistComponent } from './chatuserlist.component';

describe('ChatuserlistComponent', () => {
  let component: ChatuserlistComponent;
  let fixture: ComponentFixture<ChatuserlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatuserlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatuserlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
