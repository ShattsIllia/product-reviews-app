import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-star-rating',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './star-rating.component.html',
    styleUrls: ['./star-rating.component.scss'],
})
export class StarRatingComponent {
    @Input() rating: number | null = 0;
    @Input() reviewCount: number = 0;
    @Input() showValue: boolean = true;
}
