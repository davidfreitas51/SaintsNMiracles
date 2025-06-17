import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';

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
  ],
})
export class SaintFormPageComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  saintId: string | null = null;
  content: string = ''; 

  countries = ['Brazil', 'Italy', 'France', 'USA', 'Portugal'];
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
      markdownPath: ['', Validators.required],
      slug: ['', Validators.required],
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

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    if (this.isEditMode) {
      // Atualizar
      // this.saintsService.updateSaint(this.saintId, formValue).subscribe(...)
    } else {
      // Criar novo
      // this.saintsService.createSaint(formValue).subscribe(...)
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.form.get('image')?.setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  get markdownPath(): FormControl {
    return this.form.get('markdownPath') as FormControl;
  }
}
