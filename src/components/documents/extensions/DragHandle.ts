import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { NodeSelection } from '@tiptap/pm/state';

const dragHandlePluginKey = new PluginKey('dragHandle');

export const DragHandle = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    let dragHandleElement: HTMLElement | null = null;
    let hoveredPos: number | null = null;

    const createDragHandle = () => {
      const el = document.createElement('div');
      el.className = 'drag-handle';
      el.setAttribute('draggable', 'true');
      el.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="5" cy="3" r="1.5"/>
        <circle cx="11" cy="3" r="1.5"/>
        <circle cx="5" cy="8" r="1.5"/>
        <circle cx="11" cy="8" r="1.5"/>
        <circle cx="5" cy="13" r="1.5"/>
        <circle cx="11" cy="13" r="1.5"/>
      </svg>`;
      el.style.display = 'none';
      document.body.appendChild(el);
      return el;
    };

    const showHandle = (view: any, pos: number) => {
      if (!dragHandleElement) return;
      const node = view.nodeDOM(pos);
      if (!node || !(node instanceof HTMLElement)) {
        dragHandleElement.style.display = 'none';
        return;
      }
      const editorRect = view.dom.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      dragHandleElement.style.display = 'flex';
      dragHandleElement.style.top = `${nodeRect.top + window.scrollY + 2}px`;
      dragHandleElement.style.left = `${editorRect.left - 28}px`;
    };

    return [
      new Plugin({
        key: dragHandlePluginKey,
        view(editorView) {
          dragHandleElement = createDragHandle();

          const handleMouseMove = (event: MouseEvent) => {
            const view = editorView;
            if (!view.dom.contains(event.target as Node) && event.target !== dragHandleElement) {
              if (dragHandleElement) dragHandleElement.style.display = 'none';
              hoveredPos = null;
              return;
            }

            const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
            if (!pos) return;

            const $pos = view.state.doc.resolve(pos.pos);
            // Get top-level node position
            const depth = $pos.depth;
            if (depth === 0) return;

            const topPos = $pos.before(1);
            if (topPos === hoveredPos) return;
            hoveredPos = topPos;
            showHandle(view, topPos);
          };

          const handleDragStart = (event: DragEvent) => {
            if (hoveredPos === null) return;
            const view = editorView;
            const node = view.state.doc.nodeAt(hoveredPos);
            if (!node) return;

            // Select the node
            const tr = view.state.tr;
            const selection = NodeSelection.create(view.state.doc, hoveredPos);
            tr.setSelection(selection);
            view.dispatch(tr);

            // Set drag data
            const slice = view.state.selection.content();
            event.dataTransfer?.setData('text/plain', node.textContent || '');
            if (dragHandleElement) {
              event.dataTransfer?.setDragImage(dragHandleElement, 0, 0);
            }

            view.dragging = { slice, move: true };
          };

          const handleMouseLeave = (event: MouseEvent) => {
            const related = event.relatedTarget as HTMLElement;
            if (related === dragHandleElement || dragHandleElement?.contains(related)) return;
            if (dragHandleElement) dragHandleElement.style.display = 'none';
            hoveredPos = null;
          };

          document.addEventListener('mousemove', handleMouseMove);
          dragHandleElement.addEventListener('dragstart', handleDragStart);
          editorView.dom.addEventListener('mouseleave', handleMouseLeave);

          return {
            destroy() {
              document.removeEventListener('mousemove', handleMouseMove);
              if (dragHandleElement) {
                dragHandleElement.removeEventListener('dragstart', handleDragStart);
                dragHandleElement.remove();
                dragHandleElement = null;
              }
              editorView.dom.removeEventListener('mouseleave', handleMouseLeave);
            },
          };
        },
      }),
    ];
  },
});
