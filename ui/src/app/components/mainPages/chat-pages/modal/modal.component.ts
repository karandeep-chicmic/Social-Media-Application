import { Component, Input, inject } from '@angular/core';
import { CommonFunctionsAndVarsService } from '../../../../services/common-functions-and-vars.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() isVisible = false;
  commonFuncs: CommonFunctionsAndVarsService = inject(
    CommonFunctionsAndVarsService
  );

  closeModal() {
    this.commonFuncs.showModal.next(false);
    this.isVisible = false;
  }
}
