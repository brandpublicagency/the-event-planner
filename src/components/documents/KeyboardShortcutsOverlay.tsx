import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface KeyboardShortcutsOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);
const mod = isMac ? '⌘' : 'Ctrl';

const shortcutGroups = [
  {
    title: 'Text Formatting',
    shortcuts: [
      { keys: `${mod} + B`, label: 'Bold' },
      { keys: `${mod} + I`, label: 'Italic' },
      { keys: `${mod} + U`, label: 'Underline' },
      { keys: `${mod} + Shift + H`, label: 'Highlight' },
      { keys: `${mod} + E`, label: 'Inline Code' },
      { keys: `${mod} + Shift + X`, label: 'Strikethrough' },
    ],
  },
  {
    title: 'Structure',
    shortcuts: [
      { keys: `${mod} + Shift + 1`, label: 'Heading 1' },
      { keys: `${mod} + Shift + 2`, label: 'Heading 2' },
      { keys: `${mod} + Shift + 3`, label: 'Heading 3' },
      { keys: `${mod} + Shift + 7`, label: 'Numbered List' },
      { keys: `${mod} + Shift + 8`, label: 'Bullet List' },
      { keys: `${mod} + Shift + 9`, label: 'Task List' },
    ],
  },
  {
    title: 'Insert',
    shortcuts: [
      { keys: '/', label: 'Slash Commands' },
      { keys: `${mod} + K`, label: 'Add Link' },
      { keys: `${mod} + Shift + E`, label: 'Code Block' },
    ],
  },
  {
    title: 'General',
    shortcuts: [
      { keys: `${mod} + Z`, label: 'Undo' },
      { keys: `${mod} + Shift + Z`, label: 'Redo' },
      { keys: `${mod} + S`, label: 'Save' },
      { keys: `${mod} + /`, label: 'Show Shortcuts' },
    ],
  },
];

export function KeyboardShortcutsOverlay({ open, onOpenChange }: KeyboardShortcutsOverlayProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.label}
                    className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50"
                  >
                    <span className="text-sm text-foreground">{shortcut.label}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.split(' + ').map((key, i) => (
                        <span key={i}>
                          {i > 0 && <span className="text-muted-foreground text-xs mx-0.5">+</span>}
                          <kbd className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-[11px] font-medium text-muted-foreground bg-muted border border-border rounded">
                            {key}
                          </kbd>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
