import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../Service/product.service';
import { ActivatedRoute } from "@angular/router";
import { Validations } from 'src/app/Shared/Validations/Validations';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ExportService } from 'src/app/Services/ExportService';

@Component({
  selector: 'app-produt-view',
  templateUrl: './produt-view.component.html',
  styleUrls: ['./produt-view.component.scss']
})
export class ProdutViewComponent implements OnInit {
  id: number = 0;

  @ViewChild(DatatableComponent) table!: DatatableComponent;

  productForm: FormGroup;
  errorMessage: string = '';
  showError: boolean = false;
  formsubmited: boolean = false;

  data: any[] = [];
  temp: any[] = [];
  rows: any[] = [];
  isDeleted: boolean = false;
  isInEditingMood: boolean = false;
  loadingIndicator = true;
  ColumnMode = ColumnMode;

  filterAmmount: string = '';
  filterEligibility: string = '';
  filterViewCommented: boolean = false;

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private exportService: ExportService) {
    this.route.params.subscribe(params => this.id = params['id']);
    this.productForm = this.fb.group({
      Date: ['', Validations.Date],
      Id: [],
      Docket: ['', Validations.RequiredAlphaNamaric],
      LineNo: ['', Validations.RequiredAlphaNamaric],
      EMP: ['', Validations.RequiredAlphaNamaric],
      Sufix: ['', Validations.RequiredAlphaNamaric],
      Steps: ['', Validations.RequiredAlphaNamaric],
      Eligibility: ['', Validations.RequiredAlphaNamaric],
      Amount: ['', Validations.RerquiredPrice],
    });
  }

  get FormElement() {
    return this.productForm.controls
  }

  onSubmit(form: FormGroup) {
    this.showError = false;
    this.productService.UpdateProduct(form.value).subscribe((data) => {
      this.formsubmited = true;
    }, (error) => {
      this.errorMessage = error.message;
      this.showError = true;
      this.formsubmited = false;
    });
  }

  ngOnInit(): void {
      this.loadingIndicator = true;
      this.productService.getProduct(this.id).subscribe((data) => {
      this.rows = [...data];
      this.loadingIndicator = false;
    })
  }

  Delete(id: number) {
    debugger;
    this.loadingIndicator = true;
    this.productService.DeleteProductData(id).subscribe((data) => {
      this.rows = [...data];
      this.isDeleted = true;
      this.loadingIndicator = false;
    })
  }

  onActivate(event: any) {
    if (event.type == 'click') {
      let index = this.table.bodyComponent.getRowIndex(event.row);
      this.rows[index].Date = new Date(this.rows[index].Date).toJSON().split('T')[0];;
      this.productForm.patchValue(event.row);
      this.isInEditingMood = true;
    }
  }


  exportDatAsEXCEL() {
    this.exportService.exportXLSFile();
  }
  exportDatAsPDF() {    
    this.exportService.exportPDFFile();
  }

  updateFilter(event: any) {
    let filters = {
      Ammount: this.filterAmmount,
      Eligibility: this.filterEligibility,
      ViewCommented: this.filterViewCommented
    }
    this.loadingIndicator = true;
    this.productService.getProduct(this.id, filters).subscribe((data) => {
      this.rows = [...data];
      this.loadingIndicator = false;
    });
  }
}
