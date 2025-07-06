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
import { ReligiousOrder } from '../../../../interfaces/religious-order';
import { Tag } from '../../../../interfaces/tag';
import { TagsService } from '../../../../core/services/tags.service';
import { ReligiousOrdersService } from '../../../../core/services/religious-orders.service';
import { EntityFilters } from '../../../../interfaces/entity-filters';
import { MatMenuModule } from '@angular/material/menu';
import { NgxMaskDirective } from 'ngx-mask';

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
    MatMenuModule,
    NgxMaskDirective,
  ],
})
export class SaintFormPageComponent implements OnInit, AfterViewInit {
  private saintsService = inject(SaintsService);
  private tagsService = inject(TagsService);
  private religiousOrdersService = inject(ReligiousOrdersService);
  private snackBarService = inject(SnackbarService);
  private dialog = inject(MatDialog);

  @ViewChild('descriptionTextarea')
  descriptionTextarea!: ElementRef<HTMLTextAreaElement>;

  imageBaseUrl = environment.assetsUrl;

  religiousOrders: ReligiousOrder[] = [];
  tagsList: Tag[] = [];
  currentTags: string[] = [];

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
    const filter = new EntityFilters();
    filter.pageSize = 9999;

    this.tagsService
      .getTags(filter)
      .subscribe((res) => (this.tagsList = res.items));
    this.religiousOrdersService
      .getOrders(filter)
      .subscribe((res) => (this.religiousOrders = res.items));

    this.form = this.fb.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      century: [null, Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
      markdownContent: ['', Validators.required],
      title: [''],
      feastDay: [''],
      patronOf: [''],
      religiousOrder: [''],
    });

    this.form
      .get('description')
      ?.valueChanges.subscribe(() =>
        setTimeout(() => this.autoResizeOnLoad(), 0)
      );

    this.route.paramMap.subscribe((params) => {
      this.saintId = params.get('id');
      this.isEditMode = !!this.saintId;

      if (this.isEditMode && this.saintId) {
        this.saintsService.getSaintWithMarkdown(this.saintId).subscribe({
          next: ({ saint, markdown }) => {
            this.currentTags = saint.tags.map((tag) => tag.name);
            this.form.patchValue({
              name: saint.name,
              country: saint.country,
              century: saint.century,
              image: saint.image,
              description: saint.description,
              markdownContent: markdown,
              title: saint.title,
              patronOf: saint.patronOf,
              feastDay: this.formatFeastDayToInput(saint.feastDay || null),
              religiousOrder: saint.religiousOrder?.id,
            });
            this.cdr.detectChanges();
            setTimeout(
              () =>
                this.descriptionTextarea?.nativeElement &&
                this.autoResizeOnLoad(),
              100
            );
          },
          error: () => {
            this.snackBarService.error('Error loading saint for update');
            this.router.navigate(['admin/saints']);
          },
        });
      } else {
        this.cdr.detectChanges();
      }
    });
  }
  formatFeastDayToInput(isoDate: string | null): string {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return '';
    return `${parts[2]}/${parts[1]}`;
  }
  ngAfterViewInit() {
    this.autoResizeOnLoad();
  }

  onSubmit() {
    if (this.imageLoading) return;

    const saintData = {
      name: this.form.value.name,
      country: this.form.value.country,
      century: +this.form.value.century,
      image: this.form.value.image,
      description: this.form.value.description,
      markdownContent: this.form.value.markdownContent,
      title: this.form.value.title || null,
      feastDay: this.form.value.feastDay || null,
      patronOf: this.form.value.patronOf || null,
      religiousOrderId: this.form.value.religiousOrder || null,
      tags: this.currentTags,
    };

    const request$ =
      this.isEditMode && this.saintId
        ? this.saintsService.updateSaint(this.saintId, saintData)
        : this.saintsService.createSaint(saintData);

    request$.subscribe({
      next: () => {
        this.snackBarService.success(
          `Saint successfully ${this.isEditMode ? 'updated' : 'created'}`
        );
        this.router.navigate(['admin/saints']);
      },
      error: (err) => {
        console.error(err);
        const msg =
          typeof err.error === 'string'
            ? err.error
            : err.error?.message ?? 'Unexpected error.';
        this.snackBarService.error(
          `Error ${this.isEditMode ? 'updating' : 'creating'} saint: ${msg}`
        );
      },
    });
  }

  onFileSelected(event: Event, input: HTMLInputElement): void {
    const dialogRef = this.dialog.open(CropDialogComponent, {
      height: '600px',
      width: '600px',
      data: { imageChangedEvent: event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'string') {
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
    const textarea = this.descriptionTextarea?.nativeElement;
    if (!textarea) return;
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

  addTag(tag: string) {
    if (
      tag &&
      this.currentTags.length < 5 &&
      !this.currentTags.includes(tag.trim())
    ) {
      this.currentTags.push(tag.trim());
    }
  }

  removeTag(tag: string) {
    this.currentTags = this.currentTags.filter((t) => t !== tag);
  }
}
