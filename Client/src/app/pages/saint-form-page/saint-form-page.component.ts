import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
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
import { SaintsService } from '../../services/saints.service';
import { SnackbarService } from '../../services/snackbar.service';

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
    RouterModule
  ],
})
export class SaintFormPageComponent implements OnInit {
  saintsService = inject(SaintsService);
  snackBarService = inject(SnackbarService)

  form!: FormGroup;
  isEditMode = false;
  saintId: string | null = null;
  content: string = '';

  countries = ['Brazil', 'Italy', 'France', 'USA', 'Portugal'];
  centuries = Array.from({ length: 21 }, (_, i) => i + 1);

  imageLoading = false;

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

    // Observa mudança nos parâmetros da rota
    this.route.paramMap.subscribe((params) => {
      this.saintId = params.get('id');
      this.isEditMode = !!this.saintId;
      this.cdr.detectChanges();

      if (this.isEditMode) {
        // Aqui você pode carregar os dados do santo, ex:
        // this.saintsService.getSaintById(this.saintId).subscribe((saint) => this.form.patchValue(saint));
      }
    });
  }

  onSubmit() {
    if (this.imageLoading) {
      return;
    }
    const saint = {
      name: this.form.value.name,
      country: this.form.value.country,
      century: +this.form.value.century,
      image: this.form.value.image,
      description: this.form.value.description,
      markdownContent: this.form.value.markdownContent,
    };

    if (this.isEditMode) {
      // Update logic here
    } else {
      this.saintsService.createSaint(saint).subscribe({
        next: () => {
          this.snackBarService.success('Saint successfully created')
          this.router.navigate(['admin/saints'])
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageLoading = true;
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.form.patchValue({ image: base64 });
        this.imageLoading = false;
      };
      reader.readAsDataURL(file);
    }
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  get markdownContent(): FormControl {
    return this.form.get('markdownContent') as FormControl;
  }
}
