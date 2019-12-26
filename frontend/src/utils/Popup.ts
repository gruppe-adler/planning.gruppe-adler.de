import { Popup as LeafletPopup, LatLng, Map as LeafletMap } from 'leaflet';
import { Feature } from '@/services/shared';

interface ToolOptions {
    icon: string;
    tooltip: string;
    onClick: (event: MouseEvent) => any;
}

export default class Popup extends LeafletPopup {
    public onEdit?: () => void;
    public onDelete?: () => void;

    constructor() {
        super({
            closeButton: false,
            className: 'grad-popup__wrapper'
        });

        this.setContent(this.setupElement());
    }

    private setupElement(): HTMLDivElement {
        const wrapper = document.createElement('div');
        wrapper.className = 'grad-popup';

        const tools: ToolOptions[] = [
            {
                icon: 'edit',
                tooltip: 'Edit',
                onClick: () => { if (this.onEdit) this.onEdit(); }
            },
            {
                icon: 'delete',
                tooltip: 'Delete',
                onClick: () => { if (this.onDelete) this.onDelete(); }
            }
        ];

        for (const tool of tools) {
            const elem = this.createTool(tool);
            wrapper.appendChild(elem);
        }

        return wrapper;
    }

    private createTool(options: ToolOptions): HTMLDivElement {
        const tool = document.createElement('div');
        tool.className = 'grad-popup__tool';

        tool.innerHTML = `
            <i class="material-icons">${options.icon}</i>
            <span class="grad-popup__tool-tooltip">${options.tooltip}</span>
        `;

        tool.addEventListener('click', options.onClick);

        return tool;
    }
}
