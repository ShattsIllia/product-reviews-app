import { Component, inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface DeleteConfirmDialogData {
    title: string;
    message: string;
}

@Component({
    selector: 'app-delete-confirm-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    templateUrl: './delete-confirm-dialog.component.html',
    styleUrls: ['./delete-confirm-dialog.component.scss'],
})
export class DeleteConfirmDialogComponent {
    dialogRef = inject(MatDialogRef<DeleteConfirmDialogComponent>);
    data = inject(MAT_DIALOG_DATA) as DeleteConfirmDialogData;

    onCancel(): void {
        this.dialogRef.close(false);
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }
}
