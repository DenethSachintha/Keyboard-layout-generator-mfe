// models/option-data.ts
export interface OptionData {
  id: number;         
  optionId: number;   // matches OptionItem.id
  steps: number;
  start_qwerty: boolean;
  letter_freqs: Record<string, number>;
  bigram_freqs: Record<string, number>;
}
