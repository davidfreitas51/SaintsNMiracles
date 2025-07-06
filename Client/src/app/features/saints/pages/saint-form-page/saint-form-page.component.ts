import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { SaintsService } from '../../../../core/services/saints.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { RomanPipe } from '../../../../shared/pipes/roman.pipe';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { CountryCodePipe } from '../../../../shared/pipes/country-code.pipe';
import { MatDialog } from '@angular/material/dialog';
import { CropDialogComponent } from '../../../../shared/components/crop-dialog/crop-dialog.component';

@Component({
  selector: 'app-saint-form-page',
  templateUrl: './saint-form-page.component.html',
  styleUrls: ['./saint-form-page.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    LMarkdownEditorModule,
    MatSelectModule,
    RouterModule,
    RomanPipe,
    CommonModule,
    CountryCodePipe,
  ],
})
export class SaintFormPageComponent implements OnInit, AfterViewInit {
  saintsService = inject(SaintsService);
  snackBarService = inject(SnackbarService);
  dialog = inject(MatDialog);

  @ViewChild('descriptionTextarea')
  descriptionTextarea!: ElementRef<HTMLTextAreaElement>;
  imageBaseUrl = environment.assetsUrl;

  croppedImage: string | null = null;
  form!: FormGroup;
  isEditMode = false;
  saintId: string | null = null;
  imageLoading = false;

  centuries = Array.from({ length: 20 }, (_, i) => i + 1);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      century: [null, Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
      markdownContent: ['', Validators.required],
    });

    this.route.paramMap.subscribe((params) => {
      this.saintId = params.get('id');
      this.isEditMode = !!this.saintId;

      if (this.isEditMode && this.saintId) {
        this.saintsService.getSaintWithMarkdown(this.saintId).subscribe({
          next: ({ saint, markdown }) => {
            this.form.patchValue({
              name: saint.name,
              country: saint.country,
              century: saint.century.toString(),
              image: saint.image,
              description: saint.description,
              markdownContent: markdown,
            });
            setTimeout(() => {
              this.autoResizeOnLoad();
            });
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.snackBarService.error('Error loading saint for update');
            this.router.navigate(['admin/saints']);
          },
        });
      } else {
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit() {
    this.autoResizeOnLoad();
  }

  onSubmit() {
    if (this.imageLoading) {
      return;
    }

    const saintData = {
      name: this.form.value.name,
      country: this.form.value.country,
      century: +this.form.value.century,
      image: this.form.value.image,
      description: this.form.value.description,
      markdownContent: this.form.value.markdownContent,
    };

    if (this.isEditMode && this.saintId) {
      this.saintsService.updateSaint(this.saintId, saintData).subscribe({
        next: () => {
          this.snackBarService.success('Saint successfully updated');
          this.router.navigate(['admin/saints']);
        },
        error: (err) => {
          console.error(err);
          this.snackBarService.error('Error updating saint');
        },
      });
    } else {
      this.saintsService.createSaint(saintData).subscribe({
        next: () => {
          this.snackBarService.success('Saint successfully created');
          this.router.navigate(['admin/saints']);
        },
        error: (err) => {
          console.error(err);

          const errorMessage =
            typeof err.error === 'string'
              ? err.error
              : err.error?.message ?? 'Unexpected error.';

          this.snackBarService.error('Error creating saint: ' + errorMessage);
        },
      });
    }
  }

  onFileSelected(event: Event, input: HTMLInputElement): void {
    const dialogRef = this.dialog.open(CropDialogComponent, {
      height: '600px',
      width: '600px',
      data: { imageChangedEvent: event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && typeof result === 'string') {
        this.croppedImage = result;
        this.form.patchValue({ image: result });
        this.form.get('image')?.updateValueAndValidity();
      } else {
        console.error('Unexpected result format:', result);
      }
      input.value = '';
    });
  }

  autoResizeOnLoad() {
    const textarea = this.descriptionTextarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  get markdownContent(): FormControl {
    return this.form.get('markdownContent') as FormControl;
  }

  getImagePreview(): string {
    const img = this.form.get('image')?.value;
    if (!img) return '';
    return img.startsWith('data:image') || img.startsWith('http')
      ? img
      : this.imageBaseUrl + img;
  }
}
