export interface KeyMapping {
  id: number;
  systemKey: string;
  virtualKey: string;
  systemShift?: string; 
  virtualShift?: string; 
}

export const baseKeyMapping: KeyMapping[] = [
    // Row 1
    { id: 1, systemKey: 'Escape', virtualKey: 'Esc' },
    { id: 2, systemKey: '1', virtualKey: '1', systemShift: '!', virtualShift: '!' },
    { id: 3, systemKey: '2', virtualKey: '2', systemShift: '@', virtualShift: '@' },
    { id: 4, systemKey: '3', virtualKey: '3', systemShift: '#', virtualShift: '#' },
    { id: 5, systemKey: '4', virtualKey: '4', systemShift: '$', virtualShift: '$' },
    { id: 6, systemKey: '5', virtualKey: '5', systemShift: '%', virtualShift: '%' },
    { id: 7, systemKey: '6', virtualKey: '6', systemShift: '^', virtualShift: '^' },
    { id: 8, systemKey: '7', virtualKey: '7', systemShift: '&', virtualShift: '&' },
    { id: 9, systemKey: '8', virtualKey: '8', systemShift: '*', virtualShift: '*' },
    { id: 10, systemKey: '9', virtualKey: '9', systemShift: '(', virtualShift: '(' },
    { id: 11, systemKey: '0', virtualKey: '0', systemShift: ')', virtualShift: ')' },
    { id: 12, systemKey: '-', virtualKey: '-', systemShift: '_', virtualShift: '_' },
    { id: 13, systemKey: '=', virtualKey: '=', systemShift: '+', virtualShift: '+' },
    { id: 14, systemKey: 'Backspace', virtualKey: 'Backspace' },
  
    // Row 2
    { id: 15, systemKey: 'Tab', virtualKey: 'Tab' },
    { id: 16, systemKey: 'q', virtualKey: 'q', systemShift: 'Q', virtualShift: 'Q' },
    { id: 17, systemKey: 'w', virtualKey: 'w', systemShift: 'W', virtualShift: 'W' },
    { id: 18, systemKey: 'e', virtualKey: 'f', systemShift: 'E', virtualShift: 'F' },
    { id: 19, systemKey: 'r', virtualKey: 'p', systemShift: 'R', virtualShift: 'P' },
    { id: 20, systemKey: 't', virtualKey: 'g', systemShift: 'T', virtualShift: 'G' },
    { id: 21, systemKey: 'y', virtualKey: 'j', systemShift: 'Y', virtualShift: 'J' },
    { id: 22, systemKey: 'u', virtualKey: 'l', systemShift: 'U', virtualShift: 'L' },
    { id: 23, systemKey: 'i', virtualKey: 'u', systemShift: 'I', virtualShift: 'U' },
    { id: 24, systemKey: 'o', virtualKey: 'y', systemShift: 'O', virtualShift: 'Y' },
    { id: 25, systemKey: 'p', virtualKey: ';', systemShift: 'P', virtualShift: ':' },
    { id: 26, systemKey: '[', virtualKey: '[', systemShift: '{', virtualShift: '{' },
    { id: 27, systemKey: ']', virtualKey: ']', systemShift: '}', virtualShift: '}' },
    { id: 28, systemKey: '\\', virtualKey: '\\', systemShift: '|', virtualShift: '|' },
  
    // Row 3
    { id: 29, systemKey: 'CapsLock', virtualKey: 'Caps' },
    { id: 30, systemKey: 'a', virtualKey: 'a', systemShift: 'A', virtualShift: 'A' },
    { id: 31, systemKey: 's', virtualKey: 'r', systemShift: 'S', virtualShift: 'R' },
    { id: 32, systemKey: 'd', virtualKey: 's', systemShift: 'D', virtualShift: 'S' },
    { id: 33, systemKey: 'f', virtualKey: 't', systemShift: 'F', virtualShift: 'T' },
    { id: 34, systemKey: 'g', virtualKey: 'd', systemShift: 'G', virtualShift: 'D' },
    { id: 35, systemKey: 'h', virtualKey: 'h', systemShift: 'H', virtualShift: 'H' },
    { id: 36, systemKey: 'j', virtualKey: 'n', systemShift: 'J', virtualShift: 'N' },
    { id: 37, systemKey: 'k', virtualKey: 'e', systemShift: 'K', virtualShift: 'E' },
    { id: 38, systemKey: 'l', virtualKey: 'i', systemShift: 'L', virtualShift: 'I' },
    { id: 39, systemKey: ';', virtualKey: 'o', systemShift: ':', virtualShift: 'O' },
    { id: 40, systemKey: "'", virtualKey: "'", systemShift: '"', virtualShift: '"' },
    { id: 41, systemKey: 'Enter', virtualKey: 'Enter' },
  
    // Row 4
    { id: 42, systemKey: 'Shift', virtualKey: 'Shift' },
    { id: 43, systemKey: 'z', virtualKey: 'z', systemShift: 'Z', virtualShift: 'Z' },
    { id: 44, systemKey: 'x', virtualKey: 'x', systemShift: 'X', virtualShift: 'X' },
    { id: 45, systemKey: 'c', virtualKey: 'c', systemShift: 'C', virtualShift: 'C' },
    { id: 46, systemKey: 'v', virtualKey: 'v', systemShift: 'V', virtualShift: 'V' },
    { id: 47, systemKey: 'b', virtualKey: 'b', systemShift: 'B', virtualShift: 'B' },
    { id: 48, systemKey: 'n', virtualKey: 'k', systemShift: 'N', virtualShift: 'K' },
    { id: 49, systemKey: 'm', virtualKey: 'm', systemShift: 'M', virtualShift: 'M' },
    { id: 50, systemKey: ',', virtualKey: ',', systemShift: '<', virtualShift: '<' },
    { id: 51, systemKey: '.', virtualKey: '.', systemShift: '>', virtualShift: '>' },
    { id: 52, systemKey: '/', virtualKey: '/', systemShift: '?', virtualShift: '?' },
    { id: 53, systemKey: 'Shift', virtualKey: 'Shift' },
  
    // Row 5
    { id: 54, systemKey: 'Control', virtualKey: 'Ctrl' },
    { id: 55, systemKey: 'Meta', virtualKey: 'Meta' },
    { id: 56, systemKey: 'Alt', virtualKey: 'Alt' },
    { id: 57, systemKey: ' ', virtualKey: ' ' },
    { id: 58, systemKey: 'AltGraph', virtualKey: 'Alt' },
    { id: 59, systemKey: 'MetaRight', virtualKey: 'Meta' },
    { id: 60, systemKey: 'ContextMenu', virtualKey: 'Menu' },
    { id: 61, systemKey: 'ControlRight', virtualKey: 'Ctrl' },
  ];