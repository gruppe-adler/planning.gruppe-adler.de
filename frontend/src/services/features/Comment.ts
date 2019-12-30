import { Marker, DivIcon, Popup, tooltip, Tooltip } from 'leaflet';
import { Comment } from '@/services/shared';

class CommentPopup extends Popup {
    constructor(text: string, author: string) {
        const el = document.createElement('div');
        el.className = 'grad-comment-popup__wrapper';
        el.innerHTML = `
            <div class="grad-comment-popup__text-wrapper">
                <span class="grad-comment-popup__text">${text}</span>
                <span class="grad-comment-popup__author">${author}</span>
            </div>
        `;

        const editBtn = document.createElement('div');
        editBtn.className = 'grad-icon-button grad-icon-button--tooltip-top grad-icon-button--dense grad-icon-button--disabled';
        editBtn.innerHTML = `
            <i class="material-icons">edit</i>
            <span class="grad-icon-button__tooltip">Edit</span>
        `;
        editBtn.addEventListener('click', () => this.fire('edit'));

        el.appendChild(editBtn);

        const delBtn = document.createElement('div');
        delBtn.className = 'grad-icon-button grad-icon-button--tooltip-top grad-icon-button--dense';
        delBtn.innerHTML = `
            <i class="material-icons">delete</i>
            <span class="grad-icon-button__tooltip">Delete</span>
        `;
        delBtn.addEventListener('click', () => this.fire('delete'));

        el.appendChild(delBtn);

        super({
            closeButton: false,
            className: 'grad-comment-popup'
        });

        this.setContent(el);
    }
}
class CommentTooltip extends Tooltip {
    constructor(text: string, author: string) {
        const el = document.createElement('div');
        el.className = 'grad-comment-popup__text-wrapper';
        el.innerHTML = `
            <span class="grad-comment-popup__text">${text}</span>
            <span class="grad-comment-popup__author">${author}</span>
        `;

        super({
            className: 'grad-comment-popup',
            direction: 'top',
            opacity: 1
        });

        this.setContent(el);
    }
}

export default class CommentFeature extends Marker {
    constructor(options: Comment) {
        const icon = new DivIcon({
            className: 'grad-comment',
            html: '<i class="material-icons" style="color: #2F80ED; text-shadow: 0px 0.25rem 0.5rem rgba(0, 0, 0, 0.25); font-size: 36px;">mode_comment</i>',
            iconSize: [36, 36]
        });

        super(options.pos, {
            icon
        });

        const tooltip = new CommentTooltip(options.text, options.author);
        const popup = new CommentPopup(options.text, options.author);
        popup.on('delete', () => this.fire('delete'));
        popup.on('edit', () => this.fire('edit'));

        this.bindPopup(popup);
        this.bindTooltip(tooltip);

        // leaflet allows popup and tooltip beeing open at the same time
        // and that looks shitty so we want to prevent that
        this.on('popupopen', () => this.unbindTooltip());
        this.on('popupclose', () => this.bindTooltip(tooltip));
    }
}
