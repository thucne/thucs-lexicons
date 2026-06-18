import { Phonetic, SearchResult } from '@/types';

export const HERO_MAX_PRONUNCIATION_VARIANTS = 3;

/** Strip surrounding slashes/brackets for comparison. */
export function normalizePhoneticText(text: string): string {
    return text.trim().replace(/^[/\[\]·\s]+|[/\[\]·\s]+$/g, '').trim();
}

/** Format IPA for display with a single slash pair. */
export function formatPhoneticDisplay(text: string): string {
    const normalized = normalizePhoneticText(text);
    return normalized ? `/${normalized}/` : '';
}

function phoneticKey(phonetic: Phonetic): string | null {
    const text = phonetic.text?.trim();
    if (text) {
        const normalized = normalizePhoneticText(text);
        if (normalized) {
            return `text:${normalized}`;
        }
    }

    const audio = phonetic.audio?.trim();
    if (audio) {
        return `audio:${audio}`;
    }

    return null;
}

function toDisplayPhonetic(phonetic: Phonetic): Phonetic {
    const text = phonetic.text?.trim();
    return {
        ...phonetic,
        text: text ? formatPhoneticDisplay(text) : ''
    };
}

export function getUniquePhonetics(entry: SearchResult): Phonetic[] {
    const candidates: Phonetic[] = [];

    if (entry.phonetic?.trim()) {
        candidates.push({ text: entry.phonetic.trim() });
    }

    for (const phonetic of entry.phonetics ?? []) {
        if (phonetic.text?.trim() || phonetic.audio?.trim()) {
            candidates.push(phonetic);
        }
    }

    const seen = new Map<string, Phonetic>();

    for (const phonetic of candidates) {
        const key = phoneticKey(phonetic);
        if (!key) {
            continue;
        }

        const existing = seen.get(key);
        if (!existing) {
            seen.set(key, toDisplayPhonetic(phonetic));
            continue;
        }

        const existingHasAudio = Boolean(existing.audio?.trim());
        const incomingHasAudio = Boolean(phonetic.audio?.trim());
        if (!existingHasAudio && incomingHasAudio) {
            seen.set(key, toDisplayPhonetic(phonetic));
        }
    }

    return Array.from(seen.values());
}

export function getDisplayPhonetics(
    entry: SearchResult,
    options?: { max?: number; offset?: number }
): Phonetic[] {
    const offset = options?.offset ?? 0;
    const slice = getUniquePhonetics(entry).slice(offset);

    if (options?.max === undefined) {
        return slice;
    }

    return slice.slice(0, options.max);
}

export function hasPronunciation(entry: SearchResult): boolean {
    return getUniquePhonetics(entry).length > 0;
}
