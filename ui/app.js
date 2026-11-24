// Caz Gitar Antrenman Stüdyosu — 8-Module Master Curriculum, Drop-3 / Drop-2 Engine & In-App AI Coach
// Standard Guitar Open String MIDIs: 1e=64, 2B=59, 3G=55, 4D=50, 5A=45, 6E=40
const OPEN_MIDI = { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 };
const STRING_LABELS = { 1: '1e', 2: '2B', 3: '3G', 4: '4D', 5: '5A', 6: '6E' };

// 12 Keys ordered in Circle of Fourths
const KEYS = [
  { id: 'C',  pc: 0,  sharp: true,  slide: { shape: 'A', r: 8  }, zone: { shape: 'A', r: 8  }, ii: 'Dm7',  iiB: 'Dm9',  V: 'G9',  VB: 'G13',  V7: 'G7',  I: 'CMaj7',  IB: 'CMaj9' },
  { id: 'F',  pc: 5,  sharp: false, slide: { shape: 'A', r: 1  }, zone: { shape: 'B', r: 8  }, ii: 'Gm7',  iiB: 'Gm9',  V: 'C9',  VB: 'C13',  V7: 'C7',  I: 'FMaj7',  IB: 'FMaj9' },
  { id: 'Bb', pc: 10, sharp: false, slide: { shape: 'A', r: 6  }, zone: { shape: 'A', r: 6  }, ii: 'Cm7',  iiB: 'Cm9',  V: 'F9',  VB: 'F13',  V7: 'F7',  I: 'BbMaj7', IB: 'BbMaj9' },
  { id: 'Eb', pc: 3,  sharp: false, slide: { shape: 'A', r: 11 }, zone: { shape: 'B', r: 6  }, ii: 'Fm7',  iiB: 'Fm9',  V: 'Bb9', VB: 'Bb13', V7: 'Bb7', I: 'EbMaj7', IB: 'EbMaj9' },
  { id: 'Ab', pc: 8,  sharp: false, slide: { shape: 'A', r: 4  }, zone: { shape: 'A', r: 4  }, ii: 'Bbm7', iiB: 'Bbm9', V: 'Eb9', VB: 'Eb13', V7: 'Eb7', I: 'AbMaj7', IB: 'AbMaj9' },
  { id: 'Db', pc: 1,  sharp: false, slide: { shape: 'A', r: 9  }, zone: { shape: 'B', r: 4  }, ii: 'Ebm7', iiB: 'Ebm9', V: 'Ab9', VB: 'Ab13', V7: 'Ab7', I: 'DbMaj7', IB: 'DbMaj9' },
  { id: 'Gb', pc: 6,  sharp: false, slide: { shape: 'A', r: 2  }, zone: { shape: 'B', r: 9  }, ii: 'Abm7', iiB: 'Abm9', V: 'Db9', VB: 'Db13', V7: 'Db7', I: 'GbMaj7', IB: 'GbMaj9' },
  { id: 'B',  pc: 11, sharp: true,  slide: { shape: 'A', r: 7  }, zone: { shape: 'A', r: 7  }, ii: 'C#m7', iiB: 'C#m9', V: 'F#9', VB: 'F#13', V7: 'F#7', I: 'BMaj7',  IB: 'BMaj9' },
  { id: 'E',  pc: 4,  sharp: true,  slide: { shape: 'A', r: 0  }, zone: { shape: 'B', r: 7  }, ii: 'F#m7', iiB: 'F#m9', V: 'B9',  VB: 'B13',  V7: 'B7',  I: 'EMaj7',  IB: 'EMaj9' },
  { id: 'A',  pc: 9,  sharp: true,  slide: { shape: 'A', r: 5  }, zone: { shape: 'A', r: 5  }, ii: 'Bm7',  iiB: 'Bm9',  V: 'E9',  VB: 'E13',  V7: 'E7',  I: 'AMaj7',  IB: 'AMaj9' },
  { id: 'D',  pc: 2,  sharp: true,  slide: { shape: 'A', r: 10 }, zone: { shape: 'B', r: 5  }, ii: 'Em7',  iiB: 'Em9',  V: 'A9',  VB: 'A13',  V7: 'A7',  I: 'DMaj7',  IB: 'DMaj9' },
  { id: 'G',  pc: 7,  sharp: true,  slide: { shape: 'A', r: 3  }, zone: { shape: 'A', r: 3  }, ii: 'Am7',  iiB: 'Am9',  V: 'D9',  VB: 'D13',  V7: 'D7',  I: 'GMaj7',  IB: 'GMaj9' }
];

// 8-Module Master Jazz Guitar Curriculum
const CURRICULUM = [
  {
    id: 'm1',
    num: 'MODULE 1',
    name: '6th-String Root Drop-3 Major ii–V–I',
    playable: true,
    strings: 'Strings 6-4-3-2 (Drop-3) & 5-4-3-2 (V9)',
    sampleC: 'Dm7 (10x10-10-10x) → G9 (x10-9-10-10x) → CMaj7 (8x998x)',
    desc: 'Core 6th-string jazz foundation: voice-leading Root-Position Drop-3 ii7 & IMaj7 with 5th-string V9 via half-step Guide Tones (b7 → 3), locked to in-position arpeggios, modes, and soloing.',
    targetSummary: 'Chords: 100 BPM • Arps: 95 BPM • Modes: 90 BPM • Solo: 105 BPM'
  },
  {
    id: 'm2',
    num: 'MODULE 2',
    name: 'Middle 4-String (5-4-3-2) Pure Drop-2 ii–V–I',
    playable: true,
    strings: 'Strings 5-4-3-2 Adjacent Middle Set',
    sampleC: 'Dm7 (x5756x) → G7 2nd Inv (x5546x) → CMaj7 (x3545x)',
    desc: 'Smooth Drop-2 voice leading on the middle 4 strings: connecting Root-Position Drop-2 Dm7 and CMaj7 through 2nd-Inversion Drop-2 G7 with half-step Guide-Tone resolution on strings 3 & 2.',
    targetSummary: 'Chords: 100 BPM • Arps: 95 BPM • Modes: 90 BPM • Solo: 105 BPM'
  },
  {
    id: 'm3',
    num: 'MODULE 3',
    name: 'Top 4-String (4-3-2-1) Pure Drop-2 ii–V–I',
    playable: true,
    strings: 'Strings 4-3-2-1 Adjacent Treble Set',
    sampleC: 'Dm7 (xx7768) → G7 (xx5767) → CMaj7 (xx5557)',
    desc: 'The #1 jazz comping and Chord-Melody string set: clear upper-register Drop-2 voice leading that stays completely out of the bass player\'s register, paired with melodic treble arpeggios.',
    targetSummary: 'Chords: 105 BPM • Arps: 100 BPM • Modes: 95 BPM • Solo: 110 BPM'
  },
  {
    id: 'm4',
    num: 'MODULE 4',
    name: 'Single-Zone Cross-String Integration (Drop-3 ↔ Drop-2)',
    playable: true,
    strings: 'Alternating 6th & 5th-String Roots in One Zone',
    sampleC: 'C Major (Frets 7–10 Form A) ↔ F Major (Frets 7–10 Form B)',
    desc: 'Eliminate position jumping: play all 12 keys around the Circle of 4ths inside a single central fret zone (frets 4–10) by alternating 6th-string and 5th-string families.',
    targetSummary: '12-Key Single-Zone Circle: 100 BPM'
  },
  {
    id: 'm5',
    num: 'MODULE 5',
    name: 'Minor iiø7 – V7(b9) – im7 (Drop-3 & Drop-2)',
    playable: false,
    strings: 'Strings 6-4-3-2 & 5-4-3-2 Minor Family',
    sampleC: 'Bm7b5 → E7b9 → Am7 / Am6',
    desc: 'The other 50% of the jazz repertoire: Half-Diminished (m7b5) voicings, b9 dominant resolution, Locrian ♮2, and Phrygian Dominant / Harmonic Minor soloing.',
    targetSummary: 'Unlocks after Modules 1–4 • Target: 100 BPM'
  },
  {
    id: 'm6',
    num: 'MODULE 6',
    name: 'All Drop-2 & Drop-3 Inversions (Root, 1st, 2nd, 3rd Inv.)',
    playable: false,
    strings: 'Vertical Voice Movement Across All String Sets',
    sampleC: 'CMaj7: xx2413 → xx5557 → xx998-10 → xx-10-12-12-12',
    desc: 'Vertical chord movement up the neck on a single harmony: the foundation of Wes Montgomery and Joe Pass block-chord soloing and inner-voice motion.',
    targetSummary: 'After Module 5 • Target: 95 BPM (4 inversions continuous)'
  },
  {
    id: 'm7',
    num: 'MODULE 7',
    name: 'Altered Dominants (7#9, 7b13) & Tritone Sub (bII7#11)',
    playable: false,
    strings: 'Rootless & Altered Dominant Voicings',
    sampleC: 'Dm9 → G7#9b13 (or Db7#11) → CMaj9(#11)',
    desc: 'Modern jazz tension & release: Altered Scale (Super Locrian) and Lydian Dominant lines resolving strongly from altered V7 into IMaj7.',
    targetSummary: 'After Module 6 • Target: 105 BPM'
  },
  {
    id: 'm8',
    num: 'MODULE 8',
    name: 'Jazz Standards Repertoire & Chord-Melody',
    playable: false,
    strings: '32-Bar AABA / ABAC Standard Forms',
    sampleC: 'Autumn Leaves • Blue Bossa • All The Things You Are',
    desc: 'Full repertoire integration: 1 chorus Comping + 1 chorus Guide-Tone Arpeggios + 2 choruses Free Improvisation and solo Chord-Melody arrangement.',
    targetSummary: 'Standard Tempos: 120 – 160 BPM'
  }
];

const CHORUS_OPTIONS = [1, 2, 3, 4, 6, 8, 12, 16];
const MINUTE_OPTIONS = [0.5, 1, 2, 3, 4, 5, 8, 10, 15];

const FLAT_NAMES  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const SHARP_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

// Dynamic Block-Aware Exercise Catalog
const BLOCK_CATEGORY_LABELS = {
  b1: 'Chord Drill:',
  b2: 'Arpeggio Drill:',
  b3: 'Mode / Scale Drill:',
  b4: 'Improvisation Drill:'
};

const BLOCK_DRILL_OPTIONS = {
  b1: [
    { modId: 'm1', optLabel: 'Chord 1.1: 6th-Str Root Drop-3 ii–V–I (6-4-3-2)', headerTitle: 'Block 1 • Chord 1.1 — 6th-Str Root Drop-3 ii–V–I', headerSub: 'Strings 6-4-3-2 Drop-3 & 5th-Str V9 • C Major: Dm7 (10x10-10-10x) → G9 (x10-9-10-10x) → CMaj7 (8x998x)' },
    { modId: 'm2', optLabel: 'Chord 1.2: Mid 4-Str (5-4-3-2) Pure Drop-2 ii–V–I', headerTitle: 'Block 1 • Chord 1.2 — Mid 4-Str (5-4-3-2) Pure Drop-2', headerSub: 'Strings 5-4-3-2 Pure Drop-2 • C Major: Dm7 (x5756x) → G7 2nd Inv (x5546x) → CMaj7 (x3545x)' },
    { modId: 'm3', optLabel: 'Chord 1.3: Top 4-Str (4-3-2-1) Pure Drop-2 ii–V–I', headerTitle: 'Block 1 • Chord 1.3 — Top 4-Str (4-3-2-1) Pure Drop-2', headerSub: 'Strings 4-3-2-1 (#1 Comping Set) • C Major: Dm7 (xx7768) → G7 (xx5767) → CMaj7 (xx5557)' },
    { modId: 'm4', optLabel: 'Chord 1.4: Single-Zone Cross-String Comping (6th & 5th Str)', headerTitle: 'Block 1 • Chord 1.4 — Single-Zone 12-Key Cross Comping', headerSub: 'Central Zone (Frets 4–10) • Alternating 6th-Str Form A ↔ 5th-Str Form B Without Position Jumps' }
  ],
  b2: [
    { modId: 'm1', optLabel: 'Arp 2.1: 6th-Str Box Voice-Led 7th Arpeggios (b7→3)', headerTitle: 'Block 2 • Arp 2.1 — 6th-Str Box Voice-Led 7th Arpeggios', headerSub: '6th-Str Position Box (C: Frets 7–10) • Barline Half-Step Guide-Tone Resolution: C(b7)→B(3) & F(b7)→E(3)' },
    { modId: 'm2', optLabel: 'Arp 2.2: 5th-Str Box Voice-Led 7th Arpeggios (b7→3)', headerTitle: 'Block 2 • Arp 2.2 — 5th-Str Box Voice-Led 7th Arpeggios', headerSub: '5th-Str Position Box (C: Frets 2–5 / F: Frets 7–10) • Smooth Middle-Register b7 → 3 Voice Leading' },
    { modId: 'm3', optLabel: 'Arp 2.3: Top 4-Str (4-3-2-1) Melodic 7th Arpeggios', headerTitle: 'Block 2 • Arp 2.3 — Top 4-Str Melodic 7th Arpeggios', headerSub: 'Strings 4-3-2-1 Only (C: Frets 5–8) • Lyrical Upper-Register 7th Arpeggio Voice Leading' },
    { modId: 'm4', optLabel: 'Arp 2.4: Single-Zone 12-Key Cross-String Arpeggios', headerTitle: 'Block 2 • Arp 2.4 — Single-Zone 12-Key 7th Arpeggios', headerSub: 'Central Zone (Frets 4–10) • Connect All 12 Keys Around the Circle Without Leaving Position' }
  ],
  b3: [
    { modId: 'm1', optLabel: 'Mode 3.1: 6th-Str Box — Dorian / Mixolydian / Lydian (#4)', headerTitle: 'Block 3 • Mode 3.1 — 6th-Str Box Modes & Lydian (#4)', headerSub: '6th-Str Box (C: Frets 7–10) • ii: Dorian → V: Mixolydian → I: Lydian (Bright #4 Color Tone)' },
    { modId: 'm2', optLabel: 'Mode 3.2: 5th-Str Box — Dorian / Mixolydian / Lydian (#4)', headerTitle: 'Block 3 • Mode 3.2 — 5th-Str Box Modes & Lydian (#4)', headerSub: '5th-Str Box (C: Frets 2–5 / F: Frets 7–10) • Flowing Swing Eighth-Note Modal Lines' },
    { modId: 'm3', optLabel: 'Mode 3.3: Top 4-Str (4-3-2-1) — Melodic Modes & #4', headerTitle: 'Block 3 • Mode 3.3 — Top 4-Str Dorian / Mixolydian / Lydian (#4)', headerSub: 'Upper 4 Strings (C: Frets 5–8) • Treble-Register 9th, 13th & Lydian #4 Extensions' },
    { modId: 'm4', optLabel: 'Mode 3.4: Single-Zone 12-Key Cross-String Modes', headerTitle: 'Block 3 • Mode 3.4 — Single-Zone 12-Key Modal Lines', headerSub: 'Central Zone (Frets 4–10) • Continuous 12-Key Modal Modulation Without Shifting Hand Position' }
  ],
  b4: [
    { modId: 'm1', optLabel: 'Solo 4.1: 6th-Str Box Guide-Tone Target Soloing', headerTitle: 'Block 4 • Solo 4.1 — 6th-Str Box Jazz Trio Improvisation', headerSub: 'Guide Guitar Muted • Resolve Phrases Onto Gold 3rd & 7th Guide Tones Over Walking Bass + Comping' },
    { modId: 'm2', optLabel: 'Solo 4.2: 5th-Str Box Guide-Tone Target Soloing', headerTitle: 'Block 4 • Solo 4.2 — 5th-Str Box Jazz Trio Improvisation', headerSub: '5th-Str Zone • Target 3rd & 7th Guide Tones on Beat 1 of Every Chord Change' },
    { modId: 'm3', optLabel: 'Solo 4.3: Top 4-Str Soloing + Drop-2 Chord Punches', headerTitle: 'Block 4 • Solo 4.3 — Top 4-Str Soloing & Chord-Punches', headerSub: 'Strings 4-3-2-1 • Alternate Single-Note Jazz Phrases With Short Self-Comping Drop-2 Stabs' },
    { modId: 'm4', optLabel: 'Solo 4.4: Single-Zone 12-Key Continuous Soloing', headerTitle: 'Block 4 • Solo 4.4 — Single-Zone 12-Key Soloing Exam', headerSub: 'Central Zone (Frets 4–10) • Improvise Seamlessly Through the Circle of 4ths Without Jumping' }
  ]
};

function getBlocksForModule(modId) {
  if (modId === 'm2') {
    return [
      {
        id: 'b1', code: 'BLOCK 1 • 45 MIN', short: '5-4-3-2 Pure Drop-2',
        title: 'Chord 1.2 — Middle 4-String (5-4-3-2) Pure Drop-2 ii–V–I Voice Leading',
        minutes: 45, startBpm: 65, goalBpm: 100, defaultLead: true, defaultComp: false,
        purpose: 'GOAL: Mute strings 6 & 1 and lock in smooth Drop-2 voice leading on strings 5-4-3-2: Root-Position ii7 → 2nd-Inversion V7 → Root-Position IMaj7 with zero hand jumping.',
        howto: 'HOW TO PRACTICE: In C Major: Dm7 (x-5-7-5-6-x) → G7 2nd Inv (x-5-5-4-6-x) → CMaj7 (x-3-5-4-5-x). Hear the half-step Guide-Tone drops: C→B on string 3 and F→E on string 2! Target: 100 BPM.'
      },
      {
        id: 'b2', code: 'BLOCK 2 • 60 MIN', short: '5th-Str Box Arpeggios',
        title: 'Arp 2.2 — 5th-String Box Continuous Voice-Led 7th Arpeggios',
        minutes: 60, startBpm: 65, goalBpm: 95, defaultLead: true, defaultComp: true,
        purpose: 'GOAL: Stitch ii7 → V7 → IMaj7 7th arpeggios directly inside the 5th-string Drop-2 position box using half-step Guide-Tone resolutions (b7 → 3) across every barline.',
        howto: 'HOW TO PRACTICE: Play legato swing eighth notes with light upbeat back-accents. Nail the ★ half-step resolutions on Beat 1 of Bars 2 & 3. Target: 95 BPM.'
      },
      {
        id: 'b3', code: 'BLOCK 3 • 45 MIN', short: '5th-Str Dorian/Mixo/Lydian',
        title: 'Mode 3.2 — 5th-String Position Modes & Lydian (#4) Color',
        minutes: 45, startBpm: 65, goalBpm: 90, defaultLead: true, defaultComp: true,
        purpose: 'GOAL: Fill out the 5th-string arpeggio skeleton with Dorian (ii7), Mixolydian (V7), and Lydian #4 (IMaj7, avoiding natural-4 clash) in flowing jazz eighth-note lines.',
        howto: 'HOW TO PRACTICE: Learn the line with Guide Guitar enabled, then uncheck Guide Guitar and play over Walking Bass + Comping up to 90 BPM.'
      },
      {
        id: 'b4', code: 'BLOCK 4 • 60 MIN', short: '5th-Str Zone Soloing',
        title: 'Solo 4.2 — 5th-String Box Guide-Tone Target Improvisation',
        minutes: 60, startBpm: 75, goalBpm: 105, defaultLead: false, defaultComp: true,
        purpose: 'GOAL: Turn chords, arpeggios, and modes into real-time improvisation by landing phrases on the gold 3rd & 7th Guide Tones on chord changes.',
        howto: 'HOW TO PRACTICE: First 20 min chord/arpeggio tones only; next 40 min add scale extensions and leave a 2-beat breath rest at the end of Bar 4. Target: 105 BPM.'
      }
    ];
  }
  if (modId === 'm3') {
    return [
      {
        id: 'b1', code: 'BLOCK 1 • 45 MIN', short: '4-3-2-1 Pure Drop-2',
        title: 'Chord 1.3 — Top 4-String (4-3-2-1) Pure Drop-2 ii–V–I Comping',
        minutes: 45, startBpm: 65, goalBpm: 105, defaultLead: true, defaultComp: false,
        purpose: 'GOAL: Master jazz guitar\'s #1 comping and Chord-Melody string set (4-3-2-1, strings 6 & 5 muted) using close voice-led Drop-2 inversions.',
        howto: 'HOW TO PRACTICE: In C Major: Dm7 2nd Inv (xx7768) → G7 Root (xx5767) → CMaj7 2nd Inv (xx5557). Track C→B on string 1 and F→E on string 2! Target: 105 BPM.'
      },
      {
        id: 'b2', code: 'BLOCK 2 • 60 MIN', short: 'Top 4-Str 7th Arpeggios',
        title: 'Arp 2.3 — Top 4-String Box Melodic 7th Arpeggio Voice Leading',
        minutes: 60, startBpm: 65, goalBpm: 100, defaultLead: true, defaultComp: true,
        purpose: 'GOAL: Connect ii7 → V7 → IMaj7 7th arpeggios purely on the treble strings (4-3-2-1) via b7 → 3 half-step resolutions.',
        howto: 'HOW TO PRACTICE: Play with warm, singing legato articulation on the top strings; emphasize the ★ target resolutions on strings 1 & 2. Target: 100 BPM.'
      },
      {
        id: 'b3', code: 'BLOCK 3 • 45 MIN', short: 'Top 4-Str Modes & #4',
        title: 'Mode 3.3 — Top 4-String Dorian / Mixolydian / Lydian (#4)',
        minutes: 45, startBpm: 65, goalBpm: 95, defaultLead: true, defaultComp: true,
        purpose: 'GOAL: Weave 9ths, 13ths, and the Lydian #4 color tone into your upper-register Drop-2 arpeggio shapes.',
        howto: 'HOW TO PRACTICE: Highlight the purple Lydian #4 on string 2 when resolving into IMaj7 in Bar 3. Target: 95 BPM.'
      },
      {
        id: 'b4', code: 'BLOCK 4 • 60 MIN', short: 'Treble Solo & Chord-Punch',
        title: 'Solo 4.3 — Top 4-String Target Soloing & Self-Comping Stabs',
        minutes: 60, startBpm: 75, goalBpm: 110, defaultLead: false, defaultComp: true,
        purpose: 'GOAL: Combine melodic treble-string solo phrases with brief rhythmic Drop-2 chord punches in the spaces between phrases.',
        howto: 'HOW TO PRACTICE: In 12-Key Circle mode, nail the gold Guide Tones on strings 1–4 across every key change. Target: 110 BPM.'
      }
    ];
  }
  const isM4 = modId === 'm4';
  return [
    {
      id: 'b1', code: 'BLOCK 1 • 45 MIN', short: isM4 ? 'Cross-String Comping' : '6th-Str Drop-3 Comping',
      title: isM4
        ? 'Chord 1.4 — Single-Zone (6th & 5th-Str Alternating) 12-Key Comping'
        : 'Chord 1.1 — 6th-String Root Drop-3 ii–V–I Voicings & Guide-Tone Resolution',
      minutes: 45, startBpm: 65, goalBpm: 100, defaultLead: true, defaultComp: false,
      purpose: isM4
        ? 'GOAL: Keep your fretting hand anchored in the central zone (frets 4–10) around the Circle of 4ths by alternating Form A (6th-str) and Form B (5th-str) voicings.'
        : 'GOAL: Replace bulky barre chords with standard 4-note jazz Drop-3 voicings (2 strings muted) and ingrain the half-step Guide-Tone pull (b7 → 3) on strings 4 & 3.',
      howto: 'HOW TO PRACTICE: First 15 min "Four-to-the-Bar" quarter notes, next 30 min "Charleston" rhythm (Beat 1 & 2-&). Flesh-mute all (×) strings cleanly. Target: 100 BPM.'
    },
    {
      id: 'b2', code: 'BLOCK 2 • 60 MIN', short: 'Voice-Led 7th Arpeggios',
      title: isM4
        ? 'Arp 2.4 — Single-Zone 12-Key Cross-String 7th Arpeggio Voice Leading'
        : 'Arp 2.1 — In-Position Voice-Led 7th Arpeggios (b7 → 3 Guide-Tone Stitch)',
      minutes: 60, startBpm: 65, goalBpm: 95, defaultLead: true, defaultComp: true,
      purpose: 'GOAL: Instead of restarting every chord from its root, connect ii7 → V7 → IMaj7 7th arpeggios inside a single 4-fret box via half-step Guide-Tone resolutions (b7 → 3).',
      howto: 'HOW TO PRACTICE: Strict 1-finger-per-fret discipline in legato swing eighths. Hear the ★ half-step Guide-Tone resolutions on Beat 1 of Bars 2 & 3. Target: 95 BPM.'
    },
    {
      id: 'b3', code: 'BLOCK 3 • 45 MIN', short: 'Dorian / Mixo / Lydian #4',
      title: isM4
        ? 'Mode 3.4 — Single-Zone 12-Key Modal Transitions & Lydian (#4)'
        : 'Mode 3.1 — In-Position Modal Voice Leading & Lydian (#4) Jazz Color',
      minutes: 45, startBpm: 65, goalBpm: 90, defaultLead: true, defaultComp: true,
      purpose: 'GOAL: Surround the arpeggio skeleton with Dorian (ii7), Mixolydian (V7), and Lydian #4 (IMaj7, eliminating the natural-4 avoid note) in smooth jazz lines.',
      howto: 'HOW TO PRACTICE: Watch the shift from natural 4 in Bars 1–2 to the purple Lydian #4 in Bar 3. Practice with Guide Guitar first, then mute Guide Guitar. Target: 90 BPM.'
    },
    {
      id: 'b4', code: 'BLOCK 4 • 60 MIN', short: 'Jazz Trio Improvisation',
      title: isM4
        ? 'Solo 4.4 — Single-Zone 12-Key Continuous Trio Improvisation'
        : 'Solo 4.1 — Guide-Tone Target Improvisation Over Live Jazz Trio',
      minutes: 60, startBpm: 75, goalBpm: 105, defaultLead: false, defaultComp: true,
      purpose: 'GOAL: Apply your voicings, arpeggios, and modes in real-time improvisation by resolving lines onto the highlighted gold 3rd & 7th Guide Tones.',
      howto: 'HOW TO PRACTICE: Guide Guitar is muted; solo over Walking Bass + Comping. First 20m arpeggio tones targeting 3rd/7th on Beat 1; next 40m add modal colors & 2-beat breath rests. Target: 105 BPM.'
    }
  ];
}

// --- Runtime State ---
let activeModuleId = 'm1';       // 'm1' | 'm2' | 'm3' | 'm4'
let perBlockModule = { b1: 'm1', b2: 'm1', b3: 'm1', b4: 'm1' };
let currentKeyId = 'C';
let activeBlockId = 'b1';
let b1RhythmMode = 'charleston'; // 'four' | 'charleston'
let posMode = 'slide';           // 'slide' | 'zone' (used in m1/m4)
let practiceLoopMode = 'circle'; // 'single' | 'circle'
let circleOrderMode = 'fourths'; // 'fourths' | 'fifths' | 'random'
let circleUnitMode = 'chorus';   // 'chorus' | 'minutes'
let circleChorusesPerKey = 1;
let circleMinutesPerKey = 1;
let circleBreathBar = false;
let circleEndAction = 'plus5';   // 'plus5' | 'loop' | 'stop'

let labelMode = 'note';
let zoomBoxOnly = false;
let uiScalePx = 16;

let bpm = 65;
let cleanReps = 0;

let leadEnabled = true;
let compEnabled = false;
let bassEnabled = true;
let swingEnabled = true;
let countInEnabled = true;
let metroVol = 1.0;
let metroOnlyMode = false;
let masterVol = 0.82;
const tapTimes = [];

let timerRemainingSec = 45 * 60;
let timerRunning = false;
let timerInterval = null;

// Circle Live UI State
let uiCircleOrder = KEYS.map(k => k.id);
let uiCircleIdx = 0;
let uiCircleLap = 1;
let uiChorusInKey = 1;
let uiRemSecInKey = 60;
let uiNextKeyWarnId = null;

// AI Coach State
let aiChatHistory = [];
let aiBusy = false;

// Live Guitar Listener & Auto-Judge State
let autoJudgeEnabled = false;
let autoJudgeDeviceIdx = null;
let autoJudgeChannel = 'sum';
let autoJudgeThreshold = 85;
let autoJudgeLatencyMs = 28;
let autoJudgeHoldKey = true;
let autoJudgeMuteLead = false;
let judgeMeterTimer = null;
let lastJudgeReport = null;
let autoFailStreak = 0;
let isCalibrating = false;

// Chorus Tracking for Auto-Judge
let activeChorusRecord = null;
let pendingChorusBoundary = false;
let cleanChorusesInKey = 0;

// Audio Scheduler State
let audioCtx = null;
let isPlaying = false;
let schedulerTimer = null;
let nextSubTime = 0;

let schedPhase = 'play';
let schedSubInBar = 0;
let schedBarIdx = 0;
let schedCountSub = 0;
let schedBreathSub = 0;
let schedOrder = [];
let schedKeyIdx = 0;
let schedLap = 1;
let schedChorusIdx = 0;
let schedKeyElapsedSec = 0;
let schedBpm = 65;
let schedLastEvIdx = -1;

let activeBarIdx = 0;
let activeEventIdx = -1;
let manualFretKey = null;
const visualQueue = [];
let rafId = null;
let currentEvents = [];

// --- Persistence ---
const STORE_KEY = 'aoi_jazz_studio_desktop_v3';
let appStateCache = {};

function loadLocalStore() {
  try {
    return JSON.parse(
      localStorage.getItem(STORE_KEY) ||
      localStorage.getItem('aoi_jazz_studio_desktop_v2') ||
      localStorage.getItem('aoi_jazz_studio_desktop_v1') ||
      '{}'
    );
  } catch {
    return {};
  }
}

function syncSettingsToCache() {
  appStateCache.activeModuleId = activeModuleId;
  appStateCache.perBlockModule = perBlockModule;
  appStateCache.lastBlockId = activeBlockId;
  appStateCache.lastKeyId = currentKeyId;
  appStateCache.uiScalePx = uiScalePx;
  appStateCache.zoomBoxOnly = zoomBoxOnly;
  appStateCache.b1RhythmMode = b1RhythmMode;
  appStateCache.posMode = posMode;
  appStateCache.practiceLoopMode = practiceLoopMode;
  appStateCache.circleOrderMode = circleOrderMode;
  appStateCache.circleUnitMode = circleUnitMode;
  appStateCache.circleChorusesPerKey = circleChorusesPerKey;
  appStateCache.circleMinutesPerKey = circleMinutesPerKey;
  appStateCache.circleBreathBar = circleBreathBar;
  appStateCache.circleEndAction = circleEndAction;
  appStateCache.metroVol = metroVol;
  appStateCache.autoJudgeDeviceIdx = autoJudgeDeviceIdx;
  appStateCache.autoJudgeChannel = autoJudgeChannel;
  appStateCache.autoJudgeThreshold = autoJudgeThreshold;
  appStateCache.autoJudgeLatencyMs = autoJudgeLatencyMs;
  appStateCache.autoJudgeHoldKey = autoJudgeHoldKey;
  appStateCache.autoJudgeMuteLead = autoJudgeMuteLead;
}

function persistState() {
  syncSettingsToCache();
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(appStateCache));
  } catch {}
  if (window.pywebview && window.pywebview.api && window.pywebview.api.save_state) {
    window.pywebview.api.save_state(appStateCache).then(() => {
      const ind = document.getElementById('save-indicator');
      if (ind) ind.textContent = '✓ Saved to disk';
    }).catch(() => {});
  }
}

function getBlockProgress(bid, modId = activeModuleId) {
  const blocks = appStateCache.blocks || {};
  const mBlocks = getBlocksForModule(modId);
  const def = mBlocks.find(b => b.id === bid) || mBlocks[0];
  const scopedKey = `${modId}_${bid}`;
  if (blocks[scopedKey]) return blocks[scopedKey];
  // Backward-compatible migration for Module 1 existing progress!
  if (modId === 'm1' && blocks[bid]) return blocks[bid];
  return { bpm: def.startBpm, reps: 0, graduated: false };
}

function saveBlockProgress(bid, bpmVal, repsVal, gradVal, modId = activeModuleId) {
  if (!appStateCache.blocks) appStateCache.blocks = {};
  appStateCache.blocks[`${modId}_${bid}`] = { bpm: bpmVal, reps: repsVal, graduated: gradVal };
  persistState();
}

// --- Core Helpers ---
function getKeyById(kid) {
  return KEYS.find(k => k.id === kid) || KEYS[0];
}
function getKeyObj() {
  return getKeyById(currentKeyId);
}
function getBlockObj() {
  const arr = getBlocksForModule(activeModuleId);
  return arr.find(b => b.id === activeBlockId) || arr[0];
}

// Unified Layout Resolver across Modules 1, 2, 3, 4!
function getKeyLayout(keyObj) {
  if (activeModuleId === 'm2') {
    // Module 2: Pure 5-4-3-2 Drop-2 anchored at 5th-string I root r5 in [0..11]
    const r5 = ((keyObj.pc - 9) + 12) % 12;
    return { shape: 'D2_5', r: r5 };
  }
  if (activeModuleId === 'm3') {
    // Module 3: Pure 4-3-2-1 Drop-2 anchored at 4th-string V root u4 in [0..11]
    const u4 = (keyObj.pc + 5) % 12;
    return { shape: 'D2_4', r: u4 };
  }
  if (activeModuleId === 'm4') {
    return keyObj.zone;
  }
  return posMode === 'zone' ? keyObj.zone : keyObj.slide;
}

function getBoxBounds(layout) {
  if (layout.shape === 'D2_5') {
    if (activeBlockId === 'b1') return { min: layout.r, max: layout.r + 4 };
    if (layout.r === 0) return { min: 0, max: 4 };
    return { min: Math.max(0, layout.r - 1), max: layout.r + 2 };
  }
  if (layout.shape === 'D2_4') {
    return { min: layout.r, max: layout.r + 3 };
  }
  if (layout.r === 0) {
    return { min: 0, max: activeBlockId === 'b1' ? 2 : 4 };
  }
  if (layout.r === 1 && activeBlockId === 'b1') {
    return { min: 1, max: 3 };
  }
  return { min: Math.max(0, layout.r - 1), max: layout.r + 2 };
}

function getShapeBadgeLabel(layout, keyObj) {
  if (activeBlockId !== 'b1') {
    if (layout.shape === 'D2_5') return `5th-STR ROOT BOX • ${keyObj.id} Major`;
    if (layout.shape === 'D2_4') return `TOP 4-STR (4-3-2-1) BOX • ${keyObj.id} Major`;
    if (layout.shape === 'B') return `CENTRAL ZONE (5th-Str Box) • ${keyObj.id} Major`;
    return `6th-STR ROOT BOX • ${keyObj.id} Major`;
  }
  if (layout.shape === 'D2_5') return `PURE DROP-2 (5-4-3-2) • ${keyObj.id} Major`;
  if (layout.shape === 'D2_4') return `PURE DROP-2 (4-3-2-1) • ${keyObj.id} Major`;
  if (layout.shape === 'B') return `FORM B • 5th-Str Root (${keyObj.id} Major)`;
  return `FORM A • 6th-Str Drop-3 (${keyObj.id} Major)`;
}

function getShortShapeCode(layout) {
  if (activeBlockId !== 'b1') {
    if (layout.shape === 'D2_5') return '5thStr';
    if (layout.shape === 'D2_4') return 'Top4';
    if (layout.shape === 'B') return '5thStr';
    return '6thStr';
  }
  if (layout.shape === 'D2_5') return 'D2·5S';
  if (layout.shape === 'D2_4') return 'D2·4S';
  return layout.shape;
}

function midiName(midi, preferSharp = false) {
  const pc = ((midi % 12) + 12) % 12;
  const oct = Math.floor(midi / 12) - 1;
  const arr = preferSharp ? SHARP_NAMES : FLAT_NAMES;
  return { name: arr[pc], oct, full: `${arr[pc]}${oct}` };
}
function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function computeCircleOrder(startKeyId, orderMode, avoidFirstId = null) {
  const baseIds = KEYS.map(k => k.id);
  if (orderMode === 'fourths') {
    const idx = Math.max(0, baseIds.indexOf(startKeyId));
    return [...baseIds.slice(idx), ...baseIds.slice(0, idx)];
  } else if (orderMode === 'fifths') {
    const fifths = [baseIds[0], ...baseIds.slice(1).reverse()];
    const idx = Math.max(0, fifths.indexOf(startKeyId));
    return [...fifths.slice(idx), ...fifths.slice(0, idx)];
  } else {
    if (avoidFirstId) {
      const all = [...baseIds];
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
      }
      if (all[0] === avoidFirstId) [all[0], all[1]] = [all[1], all[0]];
      return all;
    }
    const rest = baseIds.filter(id => id !== startKeyId);
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    return [startKeyId, ...rest];
  }
}

function rebuildUiCirclePreview() {
  uiCircleOrder = computeCircleOrder(currentKeyId, circleOrderMode);
  uiCircleIdx = 0;
  uiCircleLap = 1;
  uiChorusInKey = 1;
  uiRemSecInKey = circleMinutesPerKey * 60;
  uiNextKeyWarnId = null;
}

// --- Studio Web Audio Engine ---
function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playArchtopNote(midi, when, durSec = 0.42, gainMul = 0.24) {
  if (masterVol <= 0.01) return;
  const ctx = ensureAudio();
  const t = Math.max(when, ctx.currentTime);
  const freq = midiToFreq(midi);

  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.setValueAtTime(78, t);

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(Math.min(2050, freq * 4.6), t);
  lp.frequency.exponentialRampToValueAtTime(Math.max(220, freq * 2.15), t + 0.13);

  const env = ctx.createGain();
  const peak = gainMul * masterVol;
  const endT = t + Math.max(durSec, 0.24);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(peak, t + 0.007);
  env.gain.exponentialRampToValueAtTime(peak * 0.46, t + 0.14);
  env.gain.exponentialRampToValueAtTime(0.0001, endT);

  const o1 = ctx.createOscillator();
  o1.type = 'triangle';
  o1.frequency.setValueAtTime(freq, t);

  const o2 = ctx.createOscillator();
  o2.type = 'sine';
  o2.frequency.setValueAtTime(freq, t);

  o1.connect(lp);
  o2.connect(lp);
  lp.connect(hp);
  hp.connect(env);
  env.connect(ctx.destination);

  o1.start(t);
  o2.start(t);
  o1.stop(endT + 0.02);
  o2.stop(endT + 0.02);
}

function playChordVoicing(notesArr, when, durSec = 0.45, vol = 0.15) {
  notesArr.forEach((n, idx) => {
    playArchtopNote(n.midi, when + idx * 0.013, durSec, vol);
  });
}

function playWalkingBass(midi, when, durSec = 0.48) {
  if (!bassEnabled || masterVol <= 0.01) return;
  const ctx = ensureAudio();
  const t = Math.max(when, ctx.currentTime);
  const freq = midiToFreq(midi);

  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.setValueAtTime(58, t);

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(510, t);
  lp.frequency.exponentialRampToValueAtTime(185, t + 0.18);

  const env = ctx.createGain();
  const peak = 0.25 * masterVol;
  const endT = t + durSec;
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(peak, t + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0001, endT);

  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, t);

  osc.connect(lp);
  lp.connect(hp);
  hp.connect(env);
  env.connect(ctx.destination);

  osc.start(t);
  osc.stop(endT + 0.02);
}

function playSoftJazzClick(when, isTwoOrFour, isBarOne, isCue = false) {
  if (masterVol <= 0.01 || metroVol <= 0.01) return;
  const ctx = ensureAudio();
  const t = Math.max(when, ctx.currentTime);
  const osc = ctx.createOscillator();
  const lp = ctx.createBiquadFilter();
  const g = ctx.createGain();

  osc.type = 'triangle';
  const pitch = isCue
    ? (isBarOne ? 1060 : 860)
    : (isBarOne ? 980 : (isTwoOrFour ? 1220 : 750));
  osc.frequency.setValueAtTime(pitch, t);
  osc.frequency.exponentialRampToValueAtTime(pitch * 0.72, t + 0.026);

  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(2500, t);

  const amp = Math.min(0.45, (isCue ? 0.18 : (isTwoOrFour ? 0.14 : 0.08)) * masterVol * metroVol);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(amp, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

  osc.connect(lp);
  lp.connect(g);
  g.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.034);
}

// --- Multi-Module Voicing Engine (Drop-3, 5-4-3-2 Pure Drop-2, 4-3-2-1 Pure Drop-2, Kalıp B) ---
function getVoicingsForKey(keyObj) {
  const layout = getKeyLayout(keyObj);
  const r = layout.r;
  const sharp = keyObj.sharp;
  const mk = (s, f, finger, role, isGuide) => {
    const midi = OPEN_MIDI[s] + f;
    return { s, f, finger, role, isGuide, midi, ...midiName(midi, sharp) };
  };

  if (layout.shape === 'D2_5') {
    // Module 2: Pure 5-4-3-2 Drop-2 (Root ii7 -> 2nd Inv V7 -> Root IMaj7)
    const fI1 = r === 0 ? 0 : 1;
    const fI2 = r === 0 ? 1 : 2;
    const fI3 = r === 0 ? 2 : 3;
    const fI4 = r === 0 ? 3 : 4;
    return {
      shape: 'D2_5',
      iiName: keyObj.ii,
      VName: keyObj.V7,
      IName: keyObj.I,
      ii: {
        shapeText: `x - ${r+2} - ${r+4} - ${r+2} - ${r+3} - x`,
        notes: [
          mk(5, r + 2, 1, '1',  false),
          mk(4, r + 4, 3, '5',  false),
          mk(3, r + 2, 1, 'b7', true),
          mk(2, r + 3, 2, 'b3', true)
        ]
      },
      V: {
        shapeText: `x - ${r+2} - ${r+2} - ${r+1} - ${r+3} - x`,
        notes: [
          mk(5, r + 2, 2, '5',  false),
          mk(4, r + 2, 3, '1',  false),
          mk(3, r + 1, 1, '3',  true),
          mk(2, r + 3, 4, 'b7', true)
        ]
      },
      I: {
        shapeText: `x - ${r} - ${r+2} - ${r+1} - ${r+2} - x`,
        notes: [
          mk(5, r,     fI1, '1', false),
          mk(4, r + 2, fI3, '5', false),
          mk(3, r + 1, fI2, '7', true),
          mk(2, r + 2, fI4, '3', true)
        ]
      }
    };
  }

  if (layout.shape === 'D2_4') {
    // Module 3: Pure 4-3-2-1 Drop-2 (2nd Inv ii7 -> Root V7 -> 2nd Inv IMaj7)
    return {
      shape: 'D2_4',
      iiName: keyObj.ii,
      VName: keyObj.V7,
      IName: keyObj.I,
      ii: {
        shapeText: `x - x - ${r+2} - ${r+2} - ${r+1} - ${r+3}`,
        notes: [
          mk(4, r + 2, 2, '5',  false),
          mk(3, r + 2, 3, '1',  false),
          mk(2, r + 1, 1, 'b3', true),
          mk(1, r + 3, 4, 'b7', true)
        ]
      },
      V: {
        shapeText: `x - x - ${r} - ${r+2} - ${r+1} - ${r+2}`,
        notes: [
          mk(4, r === 0 ? 0 : r, r === 0 ? 0 : 1, '1',  false),
          mk(3, r + 2, 3, '5',  false),
          mk(2, r + 1, 2, 'b7', true),
          mk(1, r + 2, 4, '3',  true)
        ]
      },
      I: {
        shapeText: `x - x - ${r} - ${r} - ${r} - ${r+2}`,
        notes: [
          mk(4, r,     r === 0 ? 0 : 1, '5', false),
          mk(3, r,     r === 0 ? 0 : 1, '1', false),
          mk(2, r,     r === 0 ? 0 : 1, '3', true),
          mk(1, r + 2, r === 0 ? 2 : 4, '7', true)
        ]
      }
    };
  }

  if (layout.shape === 'B') {
    return {
      shape: 'B',
      iiName: keyObj.iiB,
      VName: keyObj.VB,
      IName: keyObj.IB,
      ii: {
        shapeText: `x - ${r+2} - ${r} - ${r+2} - ${r+2} - x`,
        notes: [
          mk(5, r + 2, 3, '1',  false),
          mk(4, r,     1, 'b3', true),
          mk(3, r + 2, 4, 'b7', true),
          mk(2, r + 2, 4, '9',  false)
        ]
      },
      V: {
        shapeText: `${r} - x - ${r} - ${r+1} - ${r+2} - x`,
        notes: [
          mk(6, r,     1, '1',  false),
          mk(4, r,     2, 'b7', true),
          mk(3, r + 1, 3, '3',  true),
          mk(2, r + 2, 4, '13', false)
        ]
      },
      I: {
        shapeText: `x - ${r} - ${r-1} - ${r+1} - ${r} - x`,
        notes: [
          mk(5, r,     2, '1',  false),
          mk(4, r - 1, 1, '3',  true),
          mk(3, r + 1, 4, '7',  true),
          mk(2, r,     3, '9',  false)
        ]
      }
    };
  }

  // Kalıp A (6th-string Drop-3)
  const iF1 = r === 0 ? 0 : 1;
  const iF2 = r === 0 ? 0 : 2;
  const iF3 = r === 0 ? 1 : 3;
  const iF4 = r === 0 ? 2 : 4;
  return {
    shape: 'A',
    iiName: keyObj.ii,
    VName: keyObj.V,
    IName: keyObj.I,
    ii: {
      shapeText: `${r+2} - x - ${r+2} - ${r+2} - ${r+2} - x`,
      notes: [
        mk(6, r + 2, 2, '1',  false),
        mk(4, r + 2, 3, 'b7', true),
        mk(3, r + 2, 3, 'b3', true),
        mk(2, r + 2, 3, '5',  false)
      ]
    },
    V: {
      shapeText: `x - ${r+2} - ${r+1} - ${r+2} - ${r+2} - x`,
      notes: [
        mk(5, r + 2, 2, '1',  false),
        mk(4, r + 1, 1, '3',  true),
        mk(3, r + 2, 3, 'b7', true),
        mk(2, r + 2, 4, '9',  false)
      ]
    },
    I: {
      shapeText: `${r} - x - ${r+1} - ${r+1} - ${r} - x`,
      notes: [
        mk(6, r,     iF1, '1',  false),
        mk(4, r + 1, iF3, '7',  true),
        mk(3, r + 1, iF4, '3',  true),
        mk(2, r,     iF2, '5',  false)
      ]
    }
  };
}

function getBoxMapForBar(keyObj, barIdx) {
  const layout = getKeyLayout(keyObj);
  const bounds = getBoxBounds(layout);
  const rootPc = keyObj.pc;
  const sharp = keyObj.sharp;
  const map = new Map();
  const useLydian = (activeBlockId === 'b3' || activeBlockId === 'b4');
  const maxString = layout.shape === 'D2_4' ? 4 : 6;

  for (let s = 1; s <= maxString; s++) {
    for (let f = bounds.min; f <= bounds.max; f++) {
      const midi = OPEN_MIDI[s] + f;
      const rel = (((midi % 12) - rootPc) + 12) % 12;
      const finger = f === 0 ? 0 : Math.max(1, Math.min(4, f - bounds.min + (bounds.min === 0 ? 0 : 1)));
      let role = null;
      let tier = null;

      if (barIdx === 0) {
        if (rel === 2)  { role = '1';  tier = 'chord'; }
        if (rel === 5)  { role = 'b3'; tier = 'guide'; }
        if (rel === 9)  { role = '5';  tier = 'chord'; }
        if (rel === 0)  { role = 'b7'; tier = 'guide'; }
        if (rel === 4)  { role = '9';  tier = 'scale'; }
        if (rel === 7)  { role = '11'; tier = 'scale'; }
        if (rel === 11) { role = '6';  tier = 'scale'; }
      } else if (barIdx === 1) {
        if (rel === 7)  { role = '1';  tier = 'chord'; }
        if (rel === 11) { role = '3';  tier = 'guide'; }
        if (rel === 2)  { role = '5';  tier = 'chord'; }
        if (rel === 5)  { role = 'b7'; tier = 'guide'; }
        if (rel === 9)  { role = '9';  tier = 'scale'; }
        if (rel === 0)  { role = '11'; tier = 'scale'; }
        if (rel === 4)  { role = '13'; tier = 'scale'; }
      } else {
        if (rel === 0)  { role = '1';  tier = 'chord'; }
        if (rel === 4)  { role = '3';  tier = 'guide'; }
        if (rel === 7)  { role = '5';  tier = 'chord'; }
        if (rel === 11) { role = '7';  tier = 'guide'; }
        if (rel === 2)  { role = '9';  tier = 'scale'; }
        if (useLydian && rel === 6)  { role = '#4'; tier = 'lydian'; }
        if (!useLydian && rel === 5) { role = '4';  tier = 'scale'; }
        if (rel === 9)  { role = '6';  tier = 'scale'; }
      }

      if (role) {
        const nm = midiName(midi, rel === 6 ? true : sharp);
        map.set(`${s}-${f}`, { s, f, midi, finger, role, tier, ...nm });
      }
    }
  }
  return map;
}

function buildEventsForKey(keyObj) {
  const layout = getKeyLayout(keyObj);
  const r = layout.r;
  const sharp = keyObj.sharp;
  const voicings = getVoicingsForKey(keyObj);

  const mkSingle = (sub, durSubs, barIdx, s, f, finger, role, tag = '') => {
    const midi = OPEN_MIDI[s] + f;
    const forceSharp = (role === '#4') ? true : sharp;
    const nm = midiName(midi, forceSharp);
    return {
      type: 'single',
      sub,
      durSubs,
      barIdx,
      s,
      f,
      finger: f === 0 ? 0 : finger,
      role,
      tag,
      midi,
      label: `${nm.full}`,
      tab: `Str ${s} • Fret ${f}`,
      notes: [{ s, f, midi, role, finger: f === 0 ? 0 : finger, ...nm }]
    };
  };

  if (activeBlockId === 'b1') {
    const barChords = [
      { bar: 0, name: voicings.iiName, v: voicings.ii },
      { bar: 1, name: voicings.VName,  v: voicings.V  },
      { bar: 2, name: voicings.IName,  v: voicings.I  },
      { bar: 3, name: voicings.IName,  v: voicings.I  }
    ];
    const evs = [];
    barChords.forEach(bc => {
      const base = bc.bar * 8;
      if (b1RhythmMode === 'four') {
        for (let beat = 0; beat < 4; beat++) {
          evs.push({
            type: 'chord', sub: base + beat * 2, durSubs: 1.4, barIdx: bc.bar,
            label: `${bc.name} (Beat ${beat + 1})`, tab: bc.v.shapeText,
            role: beat === 1 || beat === 3 ? 'Backbeat' : 'Quarter', notes: bc.v.notes
          });
        }
      } else {
        evs.push({
          type: 'chord', sub: base + 0, durSubs: 2.8, barIdx: bc.bar,
          label: `${bc.name} (Beat 1)`, tab: bc.v.shapeText, role: 'Downbeat', notes: bc.v.notes
        });
        evs.push({
          type: 'chord', sub: base + 3, durSubs: 1.6, barIdx: bc.bar,
          label: `${bc.name} (2-&)`, tab: bc.v.shapeText, role: 'Upbeat', notes: bc.v.notes
        });
      }
    });
    return evs;
  }

  // --- BLOCK 2: 7th ARPEGGIOS ---
  if (activeBlockId === 'b2') {
    if (layout.shape === 'D2_4') {
      // Module 3 Upper 4 Strings [u .. u+3] Arpeggios
      const u = r;
      return [
        mkSingle(0,  1, 0, 4, u+2, 3, '5'),
        mkSingle(1,  1, 0, 3, u+2, 3, '1'),
        mkSingle(2,  1, 0, 2, u+1, 2, 'b3'),
        mkSingle(3,  1, 0, 1, u,   1, '5'),
        mkSingle(4,  1, 0, 1, u+3, 4, 'b7'),
        mkSingle(5,  1, 0, 1, u,   1, '5'),
        mkSingle(6,  1, 0, 2, u+1, 2, 'b3'),
        mkSingle(7,  1, 0, 1, u+3, 4, 'b7'),

        mkSingle(8,  1, 1, 1, u+2, 3, '3', '★ Half-Step Resolution!'),
        mkSingle(9,  1, 1, 2, u+3, 4, '1'),
        mkSingle(10, 1, 1, 2, u+1, 2, 'b7'),
        mkSingle(11, 1, 1, 3, u+2, 3, '5'),
        mkSingle(12, 1, 1, 4, u,   1, '1'),
        mkSingle(13, 1, 1, 3, u+2, 3, '5'),
        mkSingle(14, 1, 1, 1, u+2, 3, '3'),
        mkSingle(15, 1, 1, 2, u+1, 2, 'b7'),

        mkSingle(16, 1, 2, 2, u,   1, '3', '★ Half-Step Resolution!'),
        mkSingle(17, 1, 2, 2, u+3, 4, '5'),
        mkSingle(18, 1, 2, 1, u+2, 3, '7'),
        mkSingle(19, 1, 2, 1, u+3, 4, '1'),
        mkSingle(20, 1, 2, 1, u+2, 3, '7'),
        mkSingle(21, 1, 2, 2, u+3, 4, '5'),
        mkSingle(22, 1, 2, 2, u,   1, '3'),
        mkSingle(23, 1, 2, 3, u,   1, '1'),

        mkSingle(24, 1, 3, 4, u,   1, '5'),
        mkSingle(25, 1, 3, 3, u,   1, '1'),
        mkSingle(26, 4, 3, 2, u,   1, '3', 'Target Note (2 Beats)')
      ];
    }

    if (layout.shape === 'B' || layout.shape === 'D2_5') {
      if (r === 0) {
        // Open A Major [0..4] (Bm7 -> E7 -> AMaj7)
        return [
          mkSingle(0,  1, 0, 5, 2, 2, '1'),
          mkSingle(1,  1, 0, 4, 0, 0, 'b3'),
          mkSingle(2,  1, 0, 4, 4, 4, '5'),
          mkSingle(3,  1, 0, 3, 2, 2, 'b7'),
          mkSingle(4,  1, 0, 3, 4, 4, '1'),
          mkSingle(5,  1, 0, 2, 3, 3, 'b3'),
          mkSingle(6,  1, 0, 1, 2, 2, '5'),
          mkSingle(7,  1, 0, 3, 2, 2, 'b7'),

          mkSingle(8,  1, 1, 3, 1, 1, '3', '★ Half-Step Resolution!'),
          mkSingle(9,  1, 1, 2, 0, 0, '5'),
          mkSingle(10, 1, 1, 1, 0, 0, '1'),
          mkSingle(11, 1, 1, 2, 3, 3, 'b7'),
          mkSingle(12, 1, 1, 3, 1, 1, '3'),
          mkSingle(13, 1, 1, 4, 2, 2, '1'),
          mkSingle(14, 1, 1, 5, 2, 2, '5'),
          mkSingle(15, 1, 1, 4, 0, 0, 'b7'),

          mkSingle(16, 1, 2, 5, 4, 4, '3', '★ Half-Step Resolution!'),
          mkSingle(17, 1, 2, 4, 2, 2, '5'),
          mkSingle(18, 1, 2, 3, 1, 1, '7'),
          mkSingle(19, 1, 2, 3, 2, 2, '1'),
          mkSingle(20, 1, 2, 2, 2, 2, '3'),
          mkSingle(21, 1, 2, 1, 0, 0, '5'),
          mkSingle(22, 1, 2, 1, 4, 4, '7'),
          mkSingle(23, 1, 2, 3, 2, 2, '1'),

          mkSingle(24, 1, 3, 3, 1, 1, '7'),
          mkSingle(25, 1, 3, 4, 2, 2, '5'),
          mkSingle(26, 4, 3, 2, 2, 2, '3', 'Target Note (2 Beats)')
        ];
      }
      return [
        mkSingle(0,  1, 0, 5, r+2, 4, '1'),
        mkSingle(1,  1, 0, 4, r,   2, 'b3'),
        mkSingle(2,  1, 0, 3, r-1, 1, '5'),
        mkSingle(3,  1, 0, 3, r+2, 4, 'b7'),
        mkSingle(4,  1, 0, 2, r,   2, '1'),
        mkSingle(5,  1, 0, 3, r-1, 1, '5'),
        mkSingle(6,  1, 0, 4, r,   2, 'b3'),
        mkSingle(7,  1, 0, 3, r+2, 4, 'b7'),

        mkSingle(8,  1, 1, 3, r+1, 3, '3', '★ Half-Step Resolution!'),
        mkSingle(9,  1, 1, 2, r,   2, '5'),
        mkSingle(10, 1, 1, 1, r,   2, '1'),
        mkSingle(11, 1, 1, 2, r,   2, '5'),
        mkSingle(12, 1, 1, 3, r+1, 3, '3'),
        mkSingle(13, 1, 1, 4, r+2, 4, '1'),
        mkSingle(14, 1, 1, 5, r+2, 4, '5'),
        mkSingle(15, 1, 1, 4, r,   2, 'b7'),

        mkSingle(16, 1, 2, 4, r-1, 1, '3', '★ Half-Step Resolution!'),
        mkSingle(17, 1, 2, 4, r+2, 4, '5'),
        mkSingle(18, 1, 2, 3, r+1, 3, '7'),
        mkSingle(19, 1, 2, 3, r+2, 4, '1'),
        mkSingle(20, 1, 2, 2, r+2, 4, '3'),
        mkSingle(21, 1, 2, 1, r,   2, '5'),
        mkSingle(22, 1, 2, 2, r+2, 4, '3'),
        mkSingle(23, 1, 2, 3, r+2, 4, '1'),

        mkSingle(24, 1, 3, 3, r+1, 3, '7'),
        mkSingle(25, 1, 3, 4, r+2, 4, '5'),
        mkSingle(26, 4, 3, 4, r-1, 1, '3', 'Target Note (2 Beats)')
      ];
    }

    if (r === 0) {
      return [
        mkSingle(0,  1, 0, 6, 2, 2, '1'),
        mkSingle(1,  1, 0, 5, 0, 0, 'b3'),
        mkSingle(2,  1, 0, 5, 4, 4, '5'),
        mkSingle(3,  1, 0, 4, 2, 2, 'b7'),
        mkSingle(4,  1, 0, 4, 4, 4, '1'),
        mkSingle(5,  1, 0, 3, 2, 2, 'b3'),
        mkSingle(6,  1, 0, 2, 2, 2, '5'),
        mkSingle(7,  1, 0, 1, 0, 0, 'b7'),

        mkSingle(8,  1, 1, 2, 4, 4, '3', '★ Half-Step Resolution!'),
        mkSingle(9,  1, 1, 2, 0, 0, '1'),
        mkSingle(10, 1, 1, 3, 2, 2, 'b7'),
        mkSingle(11, 1, 1, 4, 4, 4, '5'),
        mkSingle(12, 1, 1, 4, 1, 1, '3'),
        mkSingle(13, 1, 1, 5, 2, 2, '1'),
        mkSingle(14, 1, 1, 6, 2, 2, '5'),
        mkSingle(15, 1, 1, 5, 0, 0, 'b7'),

        mkSingle(16, 1, 2, 6, 4, 4, '3', '★ Half-Step Resolution!'),
        mkSingle(17, 1, 2, 5, 2, 2, '5'),
        mkSingle(18, 1, 2, 4, 1, 1, '7'),
        mkSingle(19, 1, 2, 4, 2, 2, '1'),
        mkSingle(20, 1, 2, 3, 1, 1, '3'),
        mkSingle(21, 1, 2, 2, 0, 0, '5'),
        mkSingle(22, 1, 2, 2, 4, 4, '7'),
        mkSingle(23, 1, 2, 1, 0, 0, '1'),

        mkSingle(24, 1, 3, 2, 4, 4, '7'),
        mkSingle(25, 1, 3, 2, 0, 0, '5'),
        mkSingle(26, 4, 3, 3, 1, 1, '3', 'Target Note (2 Beats)')
      ];
    }

    return [
      mkSingle(0,  1, 0, 6, r+2, 4, '1'),
      mkSingle(1,  1, 0, 5, r,   2, 'b3'),
      mkSingle(2,  1, 0, 4, r-1, 1, '5'),
      mkSingle(3,  1, 0, 4, r+2, 4, 'b7'),
      mkSingle(4,  1, 0, 3, r-1, 1, '1'),
      mkSingle(5,  1, 0, 3, r+2, 4, 'b3'),
      mkSingle(6,  1, 0, 2, r+2, 4, '5'),
      mkSingle(7,  1, 0, 1, r,   2, 'b7'),

      mkSingle(8,  1, 1, 1, r-1, 1, '3', '★ Half-Step Resolution!'),
      mkSingle(9,  1, 1, 2, r,   2, '1'),
      mkSingle(10, 1, 1, 3, r+2, 4, 'b7'),
      mkSingle(11, 1, 1, 3, r-1, 1, '5'),
      mkSingle(12, 1, 1, 4, r+1, 3, '3'),
      mkSingle(13, 1, 1, 5, r+2, 4, '1'),
      mkSingle(14, 1, 1, 6, r+2, 4, '5'),
      mkSingle(15, 1, 1, 5, r,   2, 'b7'),

      mkSingle(16, 1, 2, 5, r-1, 1, '3', '★ Half-Step Resolution!'),
      mkSingle(17, 1, 2, 5, r+2, 4, '5'),
      mkSingle(18, 1, 2, 4, r+1, 3, '7'),
      mkSingle(19, 1, 2, 4, r+2, 4, '1'),
      mkSingle(20, 1, 2, 3, r+1, 3, '3'),
      mkSingle(21, 1, 2, 2, r,   2, '5'),
      mkSingle(22, 1, 2, 1, r-1, 1, '7'),
      mkSingle(23, 1, 2, 1, r,   2, '1'),

      mkSingle(24, 1, 3, 1, r-1, 1, '7'),
      mkSingle(25, 1, 3, 2, r,   2, '5'),
      mkSingle(26, 4, 3, 3, r+1, 3, '3', 'Target Note (2 Beats)')
    ];
  }

  // --- BLOCK 3: MODES & LYDIAN #4 ---
  if (activeBlockId === 'b3') {
    if (layout.shape === 'D2_4') {
      const u = r;
      return [
        mkSingle(0,  1, 0, 3, u+2, 3, '1'),
        mkSingle(1,  1, 0, 2, u,   1, '9'),
        mkSingle(2,  1, 0, 2, u+1, 2, 'b3'),
        mkSingle(3,  1, 0, 2, u+3, 4, '11'),
        mkSingle(4,  1, 0, 1, u,   1, '5'),
        mkSingle(5,  1, 0, 1, u+2, 3, '6', 'Dorian 6'),
        mkSingle(6,  1, 0, 1, u+3, 4, 'b7'),
        mkSingle(7,  1, 0, 1, u,   1, '5'),

        mkSingle(8,  1, 1, 1, u+2, 3, '3'),
        mkSingle(9,  1, 1, 1, u,   1, '9'),
        mkSingle(10, 1, 1, 2, u+3, 4, '1'),
        mkSingle(11, 1, 1, 2, u+1, 2, 'b7'),
        mkSingle(12, 1, 1, 2, u,   1, '13'),
        mkSingle(13, 1, 1, 3, u+2, 3, '5'),
        mkSingle(14, 1, 1, 4, u,   1, '1'),
        mkSingle(15, 1, 1, 2, u+1, 2, 'b7'),

        mkSingle(16, 1, 2, 2, u,   1, '3', '★ Guide Resolution'),
        mkSingle(17, 1, 2, 2, u+2, 3, '#4', '★ Lydian #4!'),
        mkSingle(18, 1, 2, 2, u+3, 4, '5'),
        mkSingle(19, 1, 2, 1, u,   1, '6'),
        mkSingle(20, 1, 2, 1, u+2, 3, '7'),
        mkSingle(21, 1, 2, 1, u+3, 4, '1'),
        mkSingle(22, 1, 2, 1, u+2, 3, '7'),
        mkSingle(23, 1, 2, 2, u+2, 3, '#4', '★ Lydian #4!'),

        mkSingle(24, 1, 3, 2, u+3, 4, '5'),
        mkSingle(25, 1, 3, 2, u,   1, '3'),
        mkSingle(26, 4, 3, 1, u+2, 3, '7', 'Maj7 Color (2 Beats)')
      ];
    }

    if (layout.shape === 'B' || layout.shape === 'D2_5') {
      if (r === 0) {
        // Open A Major [0..4] Modes: B Dorian -> E Mixo -> A Lydian (#4 = D#)
        return [
          mkSingle(0,  1, 0, 5, 2, 2, '1'),
          mkSingle(1,  1, 0, 5, 4, 4, '9'),
          mkSingle(2,  1, 0, 4, 0, 0, 'b3'),
          mkSingle(3,  1, 0, 4, 2, 2, '11'),
          mkSingle(4,  1, 0, 4, 4, 4, '5'),
          mkSingle(5,  1, 0, 3, 1, 1, '6', 'Dorian 6'),
          mkSingle(6,  1, 0, 3, 2, 2, 'b7'),
          mkSingle(7,  1, 0, 3, 4, 4, '1'),

          mkSingle(8,  1, 1, 2, 2, 2, '13'),
          mkSingle(9,  1, 1, 2, 0, 0, '5'),
          mkSingle(10, 1, 1, 3, 2, 2, '11'),
          mkSingle(11, 1, 1, 3, 1, 1, '3'),
          mkSingle(12, 1, 1, 4, 4, 4, '9'),
          mkSingle(13, 1, 1, 4, 2, 2, '1'),
          mkSingle(14, 1, 1, 5, 2, 2, '5'),
          mkSingle(15, 1, 1, 4, 0, 0, 'b7'),

          mkSingle(16, 1, 2, 5, 4, 4, '3', '★ Guide Resolution'),
          mkSingle(17, 1, 2, 4, 1, 1, '#4', '★ Lydian #4!'),
          mkSingle(18, 1, 2, 4, 2, 2, '5'),
          mkSingle(19, 1, 2, 4, 4, 4, '6'),
          mkSingle(20, 1, 2, 3, 1, 1, '7'),
          mkSingle(21, 1, 2, 3, 2, 2, '1'),
          mkSingle(22, 1, 2, 3, 4, 4, '9'),
          mkSingle(23, 1, 2, 2, 4, 4, '#4', '★ Lydian #4!'),

          mkSingle(24, 1, 3, 1, 0, 0, '5'),
          mkSingle(25, 1, 3, 2, 2, 2, '3'),
          mkSingle(26, 4, 3, 3, 1, 1, '7', 'Maj7 Color (2 Beats)')
        ];
      }
      return [
        mkSingle(0,  1, 0, 5, r+2, 4, '1'),
        mkSingle(1,  1, 0, 4, r-1, 1, '9'),
        mkSingle(2,  1, 0, 4, r,   2, 'b3'),
        mkSingle(3,  1, 0, 4, r+2, 4, '11'),
        mkSingle(4,  1, 0, 3, r-1, 1, '5'),
        mkSingle(5,  1, 0, 3, r+1, 3, '6', 'Dorian 6'),
        mkSingle(6,  1, 0, 3, r+2, 4, 'b7'),
        mkSingle(7,  1, 0, 2, r,   2, '1'),

        mkSingle(8,  1, 1, 2, r+2, 4, '13'),
        mkSingle(9,  1, 1, 2, r,   2, '5'),
        mkSingle(10, 1, 1, 3, r+2, 4, '11'),
        mkSingle(11, 1, 1, 3, r+1, 3, '3'),
        mkSingle(12, 1, 1, 3, r-1, 1, '9'),
        mkSingle(13, 1, 1, 4, r+2, 4, '1'),
        mkSingle(14, 1, 1, 5, r+2, 4, '5'),
        mkSingle(15, 1, 1, 4, r,   2, 'b7'),

        mkSingle(16, 1, 2, 4, r-1, 1, '3', '★ Guide Resolution'),
        mkSingle(17, 1, 2, 4, r+1, 3, '#4', '★ Lydian #4!'),
        mkSingle(18, 1, 2, 4, r+2, 4, '5'),
        mkSingle(19, 1, 2, 3, r-1, 1, '6'),
        mkSingle(20, 1, 2, 3, r+1, 3, '7'),
        mkSingle(21, 1, 2, 3, r+2, 4, '1'),
        mkSingle(22, 1, 2, 2, r,   2, '9'),
        mkSingle(23, 1, 2, 1, r-1, 1, '#4', '★ Lydian #4!'),

        mkSingle(24, 1, 3, 1, r,   2, '5'),
        mkSingle(25, 1, 3, 2, r+2, 4, '3'),
        mkSingle(26, 4, 3, 3, r+1, 3, '7', 'Maj7 Color (2 Beats)')
      ];
    }

    if (r === 0) {
      return [
        mkSingle(0,  1, 0, 6, 2, 2, '1'),
        mkSingle(1,  1, 0, 6, 4, 4, '9'),
        mkSingle(2,  1, 0, 5, 0, 0, 'b3'),
        mkSingle(3,  1, 0, 5, 2, 2, '11'),
        mkSingle(4,  1, 0, 5, 4, 4, '5'),
        mkSingle(5,  1, 0, 4, 1, 1, '6', 'Dorian 6'),
        mkSingle(6,  1, 0, 4, 2, 2, 'b7'),
        mkSingle(7,  1, 0, 4, 4, 4, '1'),

        mkSingle(8,  1, 1, 3, 2, 2, 'b7'),
        mkSingle(9,  1, 1, 3, 1, 1, '13'),
        mkSingle(10, 1, 1, 4, 4, 4, '5'),
        mkSingle(11, 1, 1, 4, 2, 2, '11'),
        mkSingle(12, 1, 1, 4, 1, 1, '3'),
        mkSingle(13, 1, 1, 5, 4, 4, '9'),
        mkSingle(14, 1, 1, 5, 2, 2, '1'),
        mkSingle(15, 1, 1, 5, 0, 0, 'b7'),

        mkSingle(16, 1, 2, 6, 4, 4, '3', '★ Guide Resolution'),
        mkSingle(17, 1, 2, 5, 1, 1, '#4', '★ Lydian #4!'),
        mkSingle(18, 1, 2, 5, 2, 2, '5'),
        mkSingle(19, 1, 2, 5, 4, 4, '6'),
        mkSingle(20, 1, 2, 4, 1, 1, '7'),
        mkSingle(21, 1, 2, 4, 2, 2, '1'),
        mkSingle(22, 1, 2, 4, 4, 4, '9'),
        mkSingle(23, 1, 2, 3, 3, 3, '#4', '★ Lydian #4!'),

        mkSingle(24, 1, 3, 2, 0, 0, '5'),
        mkSingle(25, 1, 3, 3, 1, 1, '3'),
        mkSingle(26, 4, 3, 4, 1, 1, '7', 'Maj7 Color (2 Beats)')
      ];
    }

    return [
      mkSingle(0,  1, 0, 6, r+2, 4, '1'),
      mkSingle(1,  1, 0, 5, r-1, 1, '9'),
      mkSingle(2,  1, 0, 5, r,   2, 'b3'),
      mkSingle(3,  1, 0, 5, r+2, 4, '11'),
      mkSingle(4,  1, 0, 4, r-1, 1, '5'),
      mkSingle(5,  1, 0, 4, r+1, 3, '6', 'Dorian 6'),
      mkSingle(6,  1, 0, 4, r+2, 4, 'b7'),
      mkSingle(7,  1, 0, 3, r-1, 1, '1'),

      mkSingle(8,  1, 1, 3, r+2, 4, 'b7'),
      mkSingle(9,  1, 1, 3, r+1, 3, '13'),
      mkSingle(10, 1, 1, 3, r-1, 1, '5'),
      mkSingle(11, 1, 1, 4, r+2, 4, '11'),
      mkSingle(12, 1, 1, 4, r+1, 3, '3'),
      mkSingle(13, 1, 1, 4, r-1, 1, '9'),
      mkSingle(14, 1, 1, 5, r+2, 4, '1'),
      mkSingle(15, 1, 1, 5, r,   2, 'b7'),

      mkSingle(16, 1, 2, 5, r-1, 1, '3', '★ Guide Resolution'),
      mkSingle(17, 1, 2, 5, r+1, 3, '#4', '★ Lydian #4!'),
      mkSingle(18, 1, 2, 5, r+2, 4, '5'),
      mkSingle(19, 1, 2, 4, r-1, 1, '6'),
      mkSingle(20, 1, 2, 4, r+1, 3, '7'),
      mkSingle(21, 1, 2, 4, r+2, 4, '1'),
      mkSingle(22, 1, 2, 3, r-1, 1, '9'),
      mkSingle(23, 1, 2, 2, r-1, 1, '#4', '★ Lydian #4!'),

      mkSingle(24, 1, 3, 2, r,   2, '5'),
      mkSingle(25, 1, 3, 3, r+1, 3, '3'),
      mkSingle(26, 4, 3, 4, r+1, 3, '7', 'Maj7 Color (2 Beats)')
    ];
  }

  // Block 4: Guide-Tone Solo Target Map
  const gIi = voicings.ii.notes.filter(n => n.isGuide);
  const gV  = voicings.V.notes.filter(n => n.isGuide);
  const gI  = voicings.I.notes.filter(n => n.isGuide);
  const fmtG = arr => arr.map(n => `S${n.s}:F${n.f}`).join(' / ');

  return [
    { type: 'chord', sub: 0,  durSubs: 8, barIdx: 0, label: `${keyObj.ii} Targets: b3 & b7`, tab: fmtG(gIi), role: 'Target', notes: gIi },
    { type: 'chord', sub: 8,  durSubs: 8, barIdx: 1, label: `${keyObj.V7} Targets: 3 & b7`,  tab: fmtG(gV),  role: 'Target', notes: gV  },
    { type: 'chord', sub: 16, durSubs: 8, barIdx: 2, label: `${keyObj.I} Targets: 3 & 7`,    tab: fmtG(gI),  role: 'Target', notes: gI  },
    { type: 'chord', sub: 24, durSubs: 8, barIdx: 3, label: `${keyObj.I} (Leave Space)`,     tab: '2-Beat Breath', role: 'Space', notes: gI }
  ];
}

function buildBlockEvents() {
  currentEvents = buildEventsForKey(getKeyObj());
}

function getWalkingBassMidi(keyObj, barIdx, beatInBar, nextKeyObjForBridge = null) {
  const rootC = 36 + keyObj.pc;
  const base = rootC < 38 ? rootC + 12 : rootC;

  if (barIdx === 3 && beatInBar === 3 && nextKeyObjForBridge) {
    const nextRootC = 36 + nextKeyObjForBridge.pc;
    const nextBase = nextRootC < 38 ? nextRootC + 12 : nextRootC;
    const nextIiRoot = nextBase + 2;
    return nextIiRoot + 1;
  }

  const patterns = [
    [base + 2, base + 5, base + 9, base + 8],
    [base + 7, base + 11, base + 14, base + 1],
    [base + 0, base + 4, base + 7, base + 9],
    [base + 0, base + 7, base + 4, base + 3]
  ];
  return patterns[barIdx][beatInBar];
}

// --- Scheduler ---
function getSubStepDurationForBpm(useBpm, subIdx) {
  const quarterSec = 60 / useBpm;
  const mod2 = ((subIdx % 2) + 2) % 2;
  if (!swingEnabled) return quarterSec / 2;
  return mod2 === 0 ? quarterSec * 0.62 : quarterSec * 0.38;
}

function startPlayback() {
  const ctx = ensureAudio();
  isPlaying = true;
  visualQueue.length = 0;
  nextSubTime = ctx.currentTime + 0.06;

  schedBpm = bpm;
  schedOrder = computeCircleOrder(currentKeyId, circleOrderMode);
  schedKeyIdx = 0;
  schedLap = 1;
  schedChorusIdx = 0;
  schedKeyElapsedSec = 0;
  schedBarIdx = 0;
  schedSubInBar = 0;
  schedLastEvIdx = -1;
  activeChorusRecord = null;
  pendingChorusBoundary = false;
  cleanChorusesInKey = 0;

  if (countInEnabled) {
    schedPhase = 'countin';
    schedCountSub = 0;
  } else {
    schedPhase = 'play';
  }

  uiCircleOrder = [...schedOrder];
  uiCircleIdx = 0;
  uiCircleLap = 1;

  const btn = document.getElementById('btn-play');
  btn.classList.add('playing');
  document.getElementById('play-icon').textContent = '■';
  document.getElementById('play-label').textContent = 'Stop (Space)';

  schedulerTick();
  schedulerTimer = setInterval(schedulerTick, 25);
  if (!rafId) rafId = requestAnimationFrame(uiLoop);
}

function stopPlayback() {
  isPlaying = false;
  metroOnlyMode = false;
  if (schedulerTimer) { clearInterval(schedulerTimer); schedulerTimer = null; }
  visualQueue.length = 0;
  activeEventIdx = -1;
  uiNextKeyWarnId = null;
  activeChorusRecord = null;
  pendingChorusBoundary = false;
  cleanChorusesInKey = 0;

  const btn = document.getElementById('btn-play');
  btn.classList.remove('playing');
  document.getElementById('play-icon').textContent = '▶';
  document.getElementById('play-label').textContent = 'Start Backing & Drill (Space)';
  document.getElementById('btn-metro-only').classList.remove('active');
  document.getElementById('btn-metro-only').textContent = '🥁 Metronome Only (M)';
  renderBeatPads(0);

  const banner = document.getElementById('countin-banner');
  banner.classList.remove('visible');
  banner.textContent = '';

  buildBlockEvents();
  renderAll();
}

window.togglePlay = function() {
  if (isPlaying && !metroOnlyMode) {
    stopPlayback();
  } else {
    if (isPlaying) stopPlayback();
    metroOnlyMode = false;
    startPlayback();
  }
};

window.toggleMetroOnly = function() {
  if (isPlaying && metroOnlyMode) {
    stopPlayback();
  } else {
    if (isPlaying) stopPlayback();
    metroOnlyMode = true;
    const savedCountIn = countInEnabled;
    countInEnabled = false;
    startPlayback();
    countInEnabled = savedCountIn;
    document.getElementById('btn-metro-only').classList.add('active');
    document.getElementById('btn-metro-only').textContent = '■ Stop Metronome (M)';
  }
};

window.setMetroVol = function(v) {
  metroVol = Math.max(0, Math.min(1.5, Number(v)));
  persistState();
};

window.tapTempo = function() {
  ensureAudio();
  const now = performance.now();
  while (tapTimes.length > 0 && now - tapTimes[0] > 2800) tapTimes.shift();
  tapTimes.push(now);
  playSoftJazzClick(audioCtx.currentTime, true, false, false);
  if (tapTimes.length >= 2) {
    let sum = 0;
    for (let i = 1; i < tapTimes.length; i++) sum += (tapTimes[i] - tapTimes[i - 1]);
    setBpm(Math.round(60000 / (sum / (tapTimes.length - 1))));
  }
};

function renderBeatPads(activeBeat) {
  for (let b = 1; b <= 4; b++) {
    const el = document.getElementById(`beat-pad-${b}`);
    if (!el) continue;
    el.className = 'beat-pad';
    if (b === activeBeat) {
      if (b === 1) el.classList.add('active-downbeat');
      else if (b === 2 || b === 4) el.classList.add('active-backbeat');
      else el.classList.add('active-pulse');
    }
  }
}

function peekNextCircleKeyId() {
  if (schedKeyIdx + 1 < schedOrder.length) return schedOrder[schedKeyIdx + 1];
  if (circleEndAction === 'stop') return null;
  return schedOrder[0];
}

function isCurrentChorusFinalInCircle() {
  if (practiceLoopMode !== 'circle') return false;
  if (autoJudgeEnabled && autoJudgeHoldKey && !metroOnlyMode && circleUnitMode === 'chorus') {
    return (cleanChorusesInKey + 1) >= circleChorusesPerKey;
  }
  if (circleUnitMode === 'chorus') return (schedChorusIdx + 1) >= circleChorusesPerKey;
  const remainingSubsInChorus = (3 - schedBarIdx) * 8 + (8 - schedSubInBar);
  const remSecInChorus = remainingSubsInChorus * ((60 / schedBpm) / 2);
  return (schedKeyElapsedSec + remSecInChorus) >= (circleMinutesPerKey * 60 - 0.05);
}

function schedulerTick() {
  if (!isPlaying || !audioCtx) return;

  // Trigger Live Guitar Chorus Judge ~210ms before Bar 5 Beat 1 so IPC completes before boundary scheduling!
  if (
    autoJudgeEnabled &&
    !metroOnlyMode &&
    activeChorusRecord &&
    !activeChorusRecord.evalTriggered &&
    audioCtx.currentTime >= activeChorusRecord.expectedEndAudioTime - Math.min(0.22, Math.max(0.14, (60 / schedBpm) * 0.45))
  ) {
    activeChorusRecord.evalTriggered = true;
    evaluateActiveChorus(activeChorusRecord);
  }

  while (nextSubTime < audioCtx.currentTime + 0.10) {
    if (schedPhase === 'stopped') break;

    if (schedPhase === 'countin') {
      const stepDur = getSubStepDurationForBpm(schedBpm, schedCountSub);
      if (schedCountSub % 2 === 0) {
        const countBeat = Math.floor(schedCountSub / 2) + 1;
        playSoftJazzClick(nextSubTime, countBeat === 2 || countBeat === 4, countBeat === 1, true);
        visualQueue.push({ time: nextSubTime, kind: 'countin', countBeat, keyId: schedOrder[schedKeyIdx] });
      }
      nextSubTime += stepDur;
      schedCountSub++;
      if (schedCountSub >= 8) { schedPhase = 'play'; schedBarIdx = 0; schedSubInBar = 0; }
      continue;
    }

    if (schedPhase === 'breath') {
      const stepDur = getSubStepDurationForBpm(schedBpm, schedBreathSub);
      const targetKeyObj = getKeyById(schedOrder[schedKeyIdx]);
      if (schedBreathSub % 2 === 0) {
        const breathBeat = Math.floor(schedBreathSub / 2) + 1;
        playSoftJazzClick(nextSubTime, breathBeat === 2 || breathBeat === 4, breathBeat === 1, true);
        if (breathBeat === 1 && !metroOnlyMode) {
          const pedMidi = getWalkingBassMidi(targetKeyObj, 0, 0);
          playWalkingBass(pedMidi, nextSubTime, (60 / schedBpm) * 1.5);
        }
        visualQueue.push({
          time: nextSubTime, kind: 'breath', breathBeat, keyId: targetKeyObj.id,
          circleOrder: [...schedOrder], circleIdx: schedKeyIdx, circleLap: schedLap, bpmSync: schedBpm
        });
      }
      nextSubTime += stepDur;
      schedBreathSub++;
      if (schedBreathSub >= 8) { schedPhase = 'play'; schedBarIdx = 0; schedSubInBar = 0; }
      continue;
    }

    // Resolve end-of-chorus boundary ~100ms before Bar 5 Beat 1 (after Auto-Judge result is ready!)
    if (pendingChorusBoundary) {
      pendingChorusBoundary = false;
      const finishedRec = activeChorusRecord;
      activeChorusRecord = null;

      if (practiceLoopMode === 'circle') {
        const gatedByJudge = autoJudgeEnabled && autoJudgeHoldKey && !metroOnlyMode;
        let shouldSwitchKey = false;

        if (gatedByJudge) {
          const passedChorus = finishedRec && finishedRec.gateDecision === 'pass';
          if (passedChorus) cleanChorusesInKey++;
          if (circleUnitMode === 'chorus') {
            shouldSwitchKey = cleanChorusesInKey >= circleChorusesPerKey;
          } else {
            shouldSwitchKey = passedChorus && (schedKeyElapsedSec >= circleMinutesPerKey * 60 - 0.05);
          }
        } else {
          shouldSwitchKey = (circleUnitMode === 'chorus')
            ? ((schedChorusIdx + 1) >= circleChorusesPerKey)
            : (schedKeyElapsedSec >= circleMinutesPerKey * 60 - 0.05);
        }

        if (shouldSwitchKey) {
          schedChorusIdx = 0;
          cleanChorusesInKey = 0;
          schedKeyElapsedSec = 0;
          schedLastEvIdx = -1;

          if (schedKeyIdx + 1 < schedOrder.length) {
            schedKeyIdx++;
          } else {
            // Full 12-key lap completed! If Auto-Judge gated all 12 keys at >= goalBpm, mark graduated!
            if (gatedByJudge) {
              const bDef = getBlockObj();
              if (schedBpm >= bDef.goalBpm) {
                saveBlockProgress(bDef.id, schedBpm, 3, true);
              }
            }
            if (circleEndAction === 'stop') {
              schedPhase = 'stopped';
              visualQueue.push({ time: nextSubTime, kind: 'circle_done_stop' });
              continue;
            }
            if (circleEndAction === 'plus5') schedBpm = Math.min(160, schedBpm + 5);
            const prevLastKey = schedOrder[schedOrder.length - 1];
            if (circleOrderMode === 'random') {
              schedOrder = computeCircleOrder(schedOrder[0], 'random', prevLastKey);
            }
            schedKeyIdx = 0;
            schedLap++;
          }

          if (circleBreathBar) {
            schedPhase = 'breath';
            schedBreathSub = 0;
            continue;
          }
        } else {
          schedChorusIdx++;
        }
      }
    }

    const stepDur = getSubStepDurationForBpm(schedBpm, schedSubInBar);
    const quarterSec = 60 / schedBpm;
    const subInLoop = schedBarIdx * 8 + schedSubInBar;
    const isQuarter = (schedSubInBar % 2 === 0);
    const beatInBar = Math.floor(schedSubInBar / 2);

    const activeKeyId = practiceLoopMode === 'circle' ? schedOrder[schedKeyIdx] : currentKeyId;
    const keyObj = getKeyById(activeKeyId);
    const voicings = getVoicingsForKey(keyObj);
    const barVoicingList = [voicings.ii.notes, voicings.V.notes, voicings.I.notes, voicings.I.notes];
    const keyEvents = buildEventsForKey(keyObj);

    if (subInLoop === 0 && !metroOnlyMode) {
      activeChorusRecord = {
        keyId: keyObj.id,
        keyPc: keyObj.pc,
        blockId: activeBlockId,
        startAudioTime: nextSubTime,
        expectedEndAudioTime: nextSubTime + 16 * quarterSec,
        evalTriggered: false,
        gateDecision: null,
        events: []
      };
    }

    const finalChorus = isCurrentChorusFinalInCircle();
    const isBar4Transition = finalChorus && schedBarIdx === 3;
    const upcomingKeyId = isBar4Transition ? peekNextCircleKeyId() : null;
    const useBridgeBass = upcomingKeyId && !(autoJudgeEnabled && autoJudgeHoldKey);
    const nextKeyForBass = useBridgeBass ? getKeyById(upcomingKeyId) : null;

    if (isQuarter) {
      const isTwoFour = (beatInBar === 1 || beatInBar === 3);
      const isBarStart = (subInLoop === 0);
      playSoftJazzClick(nextSubTime, isTwoFour, isBarStart, false);
      if (!metroOnlyMode) {
        const bassMidi = getWalkingBassMidi(keyObj, schedBarIdx, beatInBar, nextKeyForBass);
        playWalkingBass(bassMidi, nextSubTime, quarterSec * 0.88);
      }
    }

    if (!metroOnlyMode && compEnabled && (schedSubInBar === 0 || schedSubInBar === 3)) {
      const vNotes = barVoicingList[schedBarIdx];
      const compDur = schedSubInBar === 0 ? quarterSec * 1.15 : quarterSec * 0.55;
      playChordVoicing(vNotes, nextSubTime, compDur, 0.12);
    }

    const evIdx = keyEvents.findIndex(e => e.sub === subInLoop);
    if (evIdx !== -1) {
      schedLastEvIdx = evIdx;
      const ev = keyEvents[evIdx];
      const evDur = ev.durSubs * (quarterSec / 2) * 0.92;
      const shouldPlaySynthLead = !metroOnlyMode && leadEnabled && !(autoJudgeEnabled && autoJudgeMuteLead) && activeBlockId !== 'b4';
      if (shouldPlaySynthLead) {
        if (ev.type === 'chord') playChordVoicing(ev.notes, nextSubTime, evDur, 0.19);
        else playArchtopNote(ev.midi, nextSubTime, evDur, 0.27);
      }
      if (activeChorusRecord) {
        activeChorusRecord.events.push({
          barIdx: schedBarIdx,
          relStartSec: Math.max(0, nextSubTime - activeChorusRecord.startAudioTime),
          durSec: evDur,
          midi: ev.midi || 0,
          label: ev.label || '',
          notes: (ev.notes || []).map(n => ({ midi: n.midi, isGuide: Boolean(n.isGuide) }))
        });
      }
      visualQueue.push({
        time: nextSubTime, kind: 'play', keyId: keyObj.id, barIdx: schedBarIdx,
        beatNum: isQuarter ? (beatInBar + 1) : 0, evIdx: schedLastEvIdx,
        circleOrder: [...schedOrder], circleIdx: schedKeyIdx, circleLap: schedLap,
        chorusInKey: (autoJudgeEnabled && autoJudgeHoldKey && circleUnitMode === 'chorus') ? (cleanChorusesInKey + 1) : (schedChorusIdx + 1),
        remSecInKey: Math.max(0, circleMinutesPerKey * 60 - schedKeyElapsedSec),
        nextKeyWarnId: upcomingKeyId, bpmSync: schedBpm
      });
    } else if (isQuarter) {
      visualQueue.push({
        time: nextSubTime, kind: 'play', keyId: keyObj.id, barIdx: schedBarIdx,
        beatNum: beatInBar + 1, evIdx: schedLastEvIdx,
        circleOrder: [...schedOrder], circleIdx: schedKeyIdx, circleLap: schedLap,
        chorusInKey: (autoJudgeEnabled && autoJudgeHoldKey && circleUnitMode === 'chorus') ? (cleanChorusesInKey + 1) : (schedChorusIdx + 1),
        remSecInKey: Math.max(0, circleMinutesPerKey * 60 - schedKeyElapsedSec),
        nextKeyWarnId: upcomingKeyId, bpmSync: schedBpm
      });
    }

    if (subInLoop === 31 && activeChorusRecord) {
      activeChorusRecord.expectedEndAudioTime = nextSubTime + stepDur;
    }

    nextSubTime += stepDur;
    schedKeyElapsedSec += stepDur;
    schedSubInBar++;

    if (schedSubInBar >= 8) {
      schedSubInBar = 0;
      schedBarIdx++;
      if (schedBarIdx >= 4) {
        schedBarIdx = 0;
        pendingChorusBoundary = true;
      }
    }
  }
}

window.skipToNextKey = function() {
  if (practiceLoopMode === 'circle') {
    if (isPlaying) {
      schedKeyIdx = (schedKeyIdx + 1) % schedOrder.length;
      schedChorusIdx = 0;
      cleanChorusesInKey = 0;
      activeChorusRecord = null;
      pendingChorusBoundary = false;
      schedKeyElapsedSec = 0;
      schedBarIdx = 0;
      schedSubInBar = 0;
      schedLastEvIdx = -1;
    } else {
      const ord = computeCircleOrder(currentKeyId, circleOrderMode === 'random' ? 'fourths' : circleOrderMode);
      onKeyChange(ord[1] || ord[0]);
    }
  } else {
    const ord = computeCircleOrder(currentKeyId, 'fourths');
    onKeyChange(ord[1] || ord[0]);
  }
};

function uiLoop() {
  if (!audioCtx) { rafId = null; return; }
  const now = audioCtx.currentTime;
  let latest = null;
  while (visualQueue.length > 0 && visualQueue[0].time <= now + 0.012) {
    latest = visualQueue.shift();
  }
  if (latest) {
    const banner = document.getElementById('countin-banner');

    if (latest.kind === 'circle_done_stop') {
      stopPlayback();
      document.getElementById('grad-status').className = 'grad-status done';
      document.getElementById('grad-status').textContent = '🏆 FULL 12-KEY CIRCLE COMPLETED!';
      return;
    }

    if (latest.bpmSync && latest.bpmSync !== bpm) {
      bpm = latest.bpmSync;
      document.getElementById('bpm-slider').value = bpm;
      document.getElementById('bpm-readout').textContent = `${bpm} BPM`;
      const b = getBlockObj();
      const cur = getBlockProgress(b.id);
      saveBlockProgress(b.id, bpm, cleanReps, cur.graduated || bpm >= b.goalBpm);
      renderGradStatus();
      renderBlockTabs();
    }

    if (latest.kind === 'countin') {
      renderBeatPads(latest.countBeat);
      banner.classList.add('visible');
      const ko = getKeyById(latest.keyId);
      const bnd = getBoxBounds(getKeyLayout(ko));
      banner.textContent = `COUNT-IN (${ko.id} Major • Frets ${bnd.min}–${bnd.max}):  ${latest.countBeat}  /  4`;
    } else if (latest.kind === 'breath') {
      renderBeatPads(latest.breathBeat);
      if (currentKeyId !== latest.keyId) {
        currentKeyId = latest.keyId;
        buildBlockEvents();
        renderKeySelect();
      }
      uiCircleOrder = latest.circleOrder;
      uiCircleIdx = latest.circleIdx;
      uiCircleLap = latest.circleLap;
      uiNextKeyWarnId = null;
      activeBarIdx = 0;
      activeEventIdx = -1;
      const ko = getKeyObj();
      const lay = getKeyLayout(ko);
      const bnd = getBoxBounds(lay);
      banner.classList.add('visible');
      banner.textContent = `TRANSITION BREATH → NEW KEY: ${ko.id} Major (Frets ${bnd.min}–${bnd.max} • ${getShortShapeCode(lay)}) — ${latest.breathBeat} / 4`;
      renderCirclePanel();
      renderBars();
      renderFretboard();
      renderStrip();
      updateAiContextBar();
    } else if (latest.kind === 'play') {
      if (latest.beatNum) renderBeatPads(latest.beatNum);
      banner.classList.remove('visible');
      const keyChanged = currentKeyId !== latest.keyId;
      if (keyChanged) {
        currentKeyId = latest.keyId;
        buildBlockEvents();
        renderKeySelect();
      }
      uiCircleOrder = latest.circleOrder;
      uiCircleIdx = latest.circleIdx;
      uiCircleLap = latest.circleLap;
      uiChorusInKey = latest.chorusInKey;
      uiRemSecInKey = latest.remSecInKey;
      uiNextKeyWarnId = latest.nextKeyWarnId;

      activeBarIdx = latest.barIdx;
      activeEventIdx = latest.evIdx;

      renderCirclePanel();
      renderBars();
      renderFretboard();
      renderStrip();
      if (keyChanged) updateAiContextBar();
    }
  }

  if (isPlaying || visualQueue.length > 0) {
    rafId = requestAnimationFrame(uiLoop);
  } else {
    rafId = null;
  }
}

// --- Countdown Timer ---
function formatTimer(sec) {
  const sTotal = Math.max(0, Math.ceil(sec));
  const m = Math.floor(sTotal / 60);
  const s = sTotal % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

window.toggleTimer = function() {
  ensureAudio();
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    document.getElementById('btn-timer').textContent = '⏱ Resume (T)';
  } else {
    timerRunning = true;
    document.getElementById('btn-timer').textContent = '⏸ Pause (T)';
    timerInterval = setInterval(() => {
      if (timerRemainingSec > 0) {
        timerRemainingSec--;
        document.getElementById('timer-display').textContent = formatTimer(timerRemainingSec);
      } else {
        clearInterval(timerInterval);
        timerRunning = false;
        document.getElementById('btn-timer').textContent = '✓ Time Complete';
        playArchtopNote(60, audioCtx.currentTime, 0.6, 0.25);
        playArchtopNote(64, audioCtx.currentTime + 0.18, 0.8, 0.25);
      }
    }, 1000);
  }
};

window.resetTimer = function() {
  if (timerInterval) clearInterval(timerInterval);
  timerRunning = false;
  timerRemainingSec = getBlockObj().minutes * 60;
  document.getElementById('timer-display').textContent = formatTimer(timerRemainingSec);
  document.getElementById('btn-timer').textContent = '⏱ Start Timer (T)';
};

// --- BPM & Graduation ---
window.setBpm = function(val) {
  bpm = Math.max(45, Math.min(160, Number(val) || 65));
  schedBpm = bpm;
  document.getElementById('bpm-slider').value = bpm;
  document.getElementById('bpm-readout').textContent = `${bpm} BPM`;
  const b = getBlockObj();
  const cur = getBlockProgress(b.id);
  saveBlockProgress(b.id, bpm, cleanReps, cur.graduated || bpm > b.goalBpm);
  renderGradStatus();
  renderBlockTabs();
  updateAiContextBar();
};

window.adjustBpm = function(delta) {
  cleanReps = 0;
  setBpm(bpm + delta);
  renderRepDots();
};

window.markCleanRep = function() {
  ensureAudio();
  const b = getBlockObj();
  cleanReps++;
  playArchtopNote(64 + cleanReps * 2, audioCtx.currentTime, 0.25, 0.20);

  if (cleanReps >= 3) {
    if (bpm >= b.goalBpm) {
      saveBlockProgress(b.id, bpm, 3, true);
      renderRepDots();
      renderGradStatus();
      renderBlockTabs();
      return;
    } else {
      cleanReps = 0;
      setBpm(Math.min(160, bpm + 5));
    }
  } else {
    const cur = getBlockProgress(b.id);
    saveBlockProgress(b.id, bpm, cleanReps, cur.graduated);
  }
  renderRepDots();
  renderGradStatus();
  renderBlockTabs();
};

window.markStumble = function() {
  if (cleanReps > 0) cleanReps = 0;
  else setBpm(Math.max(45, bpm - 5));
  const b = getBlockObj();
  const cur = getBlockProgress(b.id);
  saveBlockProgress(b.id, bpm, cleanReps, cur.graduated);
  renderRepDots();
  renderGradStatus();
};

// --- Module & Roadmap Controls ---
function renderTopDrillSelect() {
  const lblEl = document.getElementById('drill-select-label');
  const selEl = document.getElementById('select-module');
  if (lblEl) lblEl.textContent = BLOCK_CATEGORY_LABELS[activeBlockId] || 'Drill:';

  const opts = BLOCK_DRILL_OPTIONS[activeBlockId] || BLOCK_DRILL_OPTIONS.b1;
  const bDefArr = modId => getBlocksForModule(modId).find(x => x.id === activeBlockId);

  if (selEl) {
    selEl.innerHTML = opts.map(o => {
      const prog = getBlockProgress(activeBlockId, o.modId);
      const goal = bDefArr(o.modId).goalBpm;
      const statusTxt = prog.graduated ? `✓ ${o.optLabel} [🏆 ${prog.bpm} BPM]` : `${o.optLabel} [${prog.bpm}/${goal} BPM]`;
      return `<option value="${o.modId}" ${o.modId === activeModuleId ? 'selected' : ''}>${statusTxt}</option>`;
    }).join('');
  }

  const curOpt = opts.find(o => o.modId === activeModuleId) || opts[0];
  document.getElementById('header-mod-title').textContent = curOpt.headerTitle;
  document.getElementById('header-mod-sub').textContent = curOpt.headerSub;
  document.getElementById('pos-strategy-wrap').style.display = (activeModuleId === 'm1') ? 'flex' : 'none';
}

window.selectModule = function(modId) {
  if (!['m1', 'm2', 'm3', 'm4'].includes(modId)) return;
  if (isPlaying) stopPlayback();
  activeModuleId = modId;
  perBlockModule[activeBlockId] = modId;

  const b = getBlockObj();
  const prog = getBlockProgress(activeBlockId, modId);
  bpm = prog.bpm || b.startBpm;
  schedBpm = bpm;
  cleanReps = prog.reps || 0;
  leadEnabled = b.defaultLead;
  compEnabled = b.defaultComp;
  document.getElementById('chk-lead').checked = leadEnabled;
  document.getElementById('chk-comp').checked = compEnabled;

  resetTimer();
  activeBarIdx = 0;
  activeEventIdx = -1;
  persistState();
  buildBlockEvents();
  renderAll();
  updateAiContextBar();
};

window.toggleRoadmapModal = function() {
  const bd = document.getElementById('roadmap-backdrop');
  const opening = !bd.classList.contains('open');
  bd.classList.toggle('open', opening);
  if (opening) renderRoadmapCards();
};

function renderRoadmapCards() {
  const el = document.getElementById('roadmap-cards');
  el.innerHTML = CURRICULUM.map(m => {
    const isCurrent = m.id === activeModuleId;
    let gradCount = 0;
    if (m.playable) {
      ['b1', 'b2', 'b3', 'b4'].forEach(bid => {
        if (getBlockProgress(bid, m.id).graduated) gradCount++;
      });
    }
    const statusHtml = m.playable
      ? `<span class="badge-grad" style="${gradCount === 0 ? 'background:rgba(56,189,248,0.16);color:#7dd3fc;' : ''}">${gradCount}/4 Blocks Graduated</span>`
      : `<span style="font-size:0.75rem;color:var(--text-muted);font-family:Consolas,monospace;">Upcoming Stage</span>`;

    const actionHtml = m.playable
      ? `<button class="${isCurrent ? 'btn-clean' : 'btn-secondary'}" style="padding:0.32rem 0.75rem;font-size:0.8rem;" onclick="selectModule('${m.id}'); toggleRoadmapModal();">
          ${isCurrent ? '✓ Active Position Family' : '▶ Load Position Family'}
        </button>`
      : `<span style="font-size:0.76rem;color:var(--text-dim);">Unlocks after Modules 1–4</span>`;

    return `<div class="roadmap-card ${isCurrent ? 'current-mod' : ''} ${!m.playable ? 'locked-mod' : ''}">
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;">
          <span style="font-family:Consolas,monospace;font-size:0.8rem;font-weight:800;color:var(--accent-gold-bright);">${m.num} • ${m.strings}</span>
          ${statusHtml}
        </div>
        <div style="font-size:0.98rem;font-weight:800;margin-top:0.2rem;color:#fff;">${m.name}</div>
        <div style="font-family:Consolas,monospace;font-size:0.78rem;color:var(--accent-blue);margin-top:0.2rem;">${m.sampleC}</div>
        <p style="font-size:0.82rem;color:var(--text-muted);margin:0.35rem 0 0;line-height:1.42;">${m.desc}</p>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding-top:0.45rem;border-top:1px solid var(--border-subtle);">
        <span style="font-family:Consolas,monospace;font-size:0.75rem;color:var(--text-muted);">${m.targetSummary}</span>
        ${actionHtml}
      </div>
    </div>`;
  }).join('');
}

// --- Circle & Strategy Setters ---
window.setPosMode = function(mode) {
  posMode = (mode === 'zone') ? 'zone' : 'slide';
  document.getElementById('select-pos-mode').value = posMode;
  persistState();
  buildBlockEvents();
  renderAll();
};

window.setPracticeLoopMode = function(mode) {
  practiceLoopMode = (mode === 'circle') ? 'circle' : 'single';
  rebuildUiCirclePreview();
  if (isPlaying) {
    schedOrder = [...uiCircleOrder];
    schedKeyIdx = 0;
    schedChorusIdx = 0;
    schedKeyElapsedSec = 0;
  }
  persistState();
  renderAll();
};

window.setCircleOrderMode = function(mode) {
  const wasPlaying = isPlaying;
  if (wasPlaying) stopPlayback();
  circleOrderMode = ['fourths', 'fifths', 'random'].includes(mode) ? mode : 'fourths';
  document.getElementById('select-circle-order').value = circleOrderMode;
  rebuildUiCirclePreview();
  persistState();
  renderCirclePanel();
};

window.setCircleUnitMode = function(mode) {
  circleUnitMode = (mode === 'minutes') ? 'minutes' : 'chorus';
  schedChorusIdx = 0;
  schedKeyElapsedSec = 0;
  persistState();
  renderCirclePanel();
};

window.stepCircleAmount = function(dir) {
  if (circleUnitMode === 'chorus') {
    const idx = CHORUS_OPTIONS.indexOf(circleChorusesPerKey);
    const nextIdx = Math.max(0, Math.min(CHORUS_OPTIONS.length - 1, (idx === -1 ? 0 : idx) + dir));
    circleChorusesPerKey = CHORUS_OPTIONS[nextIdx];
  } else {
    const idx = MINUTE_OPTIONS.indexOf(circleMinutesPerKey);
    const nextIdx = Math.max(0, Math.min(MINUTE_OPTIONS.length - 1, (idx === -1 ? 1 : idx) + dir));
    circleMinutesPerKey = MINUTE_OPTIONS[nextIdx];
    uiRemSecInKey = circleMinutesPerKey * 60;
  }
  persistState();
  renderCirclePanel();
};

window.setCircleBreath = function(flag) {
  circleBreathBar = Boolean(flag);
  document.getElementById('chk-circle-breath').checked = circleBreathBar;
  persistState();
};

window.setCircleEndAction = function(act) {
  circleEndAction = ['plus5', 'loop', 'stop'].includes(act) ? act : 'plus5';
  document.getElementById('select-circle-end').value = circleEndAction;
  persistState();
};

// --- View / Mode Controls ---
window.setUiScale = function(px) {
  uiScalePx = px;
  document.documentElement.style.setProperty('--ui-scale', `${px}px`);
  document.getElementById('zoom-100').classList.toggle('active', px === 16);
  document.getElementById('zoom-115').classList.toggle('active', px === 18.5);
  document.getElementById('zoom-130').classList.toggle('active', px === 21);
  persistState();
};

window.toggleBoxZoom = function() {
  zoomBoxOnly = !zoomBoxOnly;
  document.getElementById('btn-box-zoom').classList.toggle('active', zoomBoxOnly);
  document.getElementById('fretboard-section').classList.toggle('zoom-box-mode', zoomBoxOnly);
  persistState();
  renderFretboard();
};

window.requestAppFullscreen = function() {
  if (window.pywebview && window.pywebview.api && window.pywebview.api.toggle_fullscreen) {
    window.pywebview.api.toggle_fullscreen();
  } else if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
};

window.setB1Rhythm = function(mode) {
  b1RhythmMode = mode;
  document.getElementById('btn-rhythm-four').classList.toggle('active', mode === 'four');
  document.getElementById('btn-rhythm-charleston').classList.toggle('active', mode === 'charleston');
  persistState();
  buildBlockEvents();
  renderStrip();
};

window.selectBlock = function(bid) {
  if (isPlaying) stopPlayback();
  activeBlockId = bid;
  // Switch to this block's own remembered exercise level!
  const targetMod = perBlockModule[bid] || 'm1';
  if (['m1', 'm2', 'm3', 'm4'].includes(targetMod)) {
    activeModuleId = targetMod;
  }
  const b = getBlockObj();
  const prog = getBlockProgress(bid, activeModuleId);

  bpm = prog.bpm || b.startBpm;
  schedBpm = bpm;
  cleanReps = prog.reps || 0;
  leadEnabled = b.defaultLead;
  compEnabled = b.defaultComp;
  document.getElementById('chk-lead').checked = leadEnabled;
  document.getElementById('chk-comp').checked = compEnabled;
  document.getElementById('b1-rhythm-bar').style.display = (bid === 'b1') ? 'flex' : 'none';

  resetTimer();
  activeBarIdx = 0;
  activeEventIdx = -1;
  persistState();
  buildBlockEvents();
  renderAll();
  updateAiContextBar();
};

window.onKeyChange = function(kid) {
  if (isPlaying) stopPlayback();
  currentKeyId = kid;
  rebuildUiCirclePreview();
  persistState();
  buildBlockEvents();
  renderAll();
  updateAiContextBar();
};

window.onRingKeyClick = function(kid, idxInRing) {
  if (isPlaying && practiceLoopMode === 'circle') {
    schedKeyIdx = idxInRing;
    schedChorusIdx = 0;
    cleanChorusesInKey = 0;
    activeChorusRecord = null;
    pendingChorusBoundary = false;
    schedKeyElapsedSec = 0;
    schedBarIdx = 0;
    schedSubInBar = 0;
    schedLastEvIdx = -1;
  } else {
    onKeyChange(kid);
  }
};

window.onBarClick = function(bIdx) {
  ensureAudio();
  activeBarIdx = bIdx;
  const v = getVoicingsForKey(getKeyObj());
  const chordNotes = [v.ii.notes, v.V.notes, v.I.notes, v.I.notes][bIdx];
  playChordVoicing(chordNotes, audioCtx.currentTime, 0.9, 0.22);
  renderBars();
  renderFretboard();
  updateAiContextBar();
};

window.onFretClick = function(s, f) {
  ensureAudio();
  const midi = OPEN_MIDI[s] + f;
  playArchtopNote(midi, audioCtx.currentTime, 0.65, 0.28);
  const nm = midiName(midi, getKeyObj().sharp);
  const boxMap = getBoxMapForBar(getKeyObj(), activeBarIdx);
  const info = boxMap.get(`${s}-${f}`);
  const roleTxt = info ? `Degree: ${info.role} (${info.finger === 0 ? 'Open String' : 'Finger ' + info.finger})` : 'Outside Box';
  document.getElementById('note-inspector').textContent = `${nm.full}  •  String ${s}, Fret ${f}  •  ${roleTxt}`;
  manualFretKey = `${s}-${f}`;
  renderFretboard();
  setTimeout(() => {
    if (manualFretKey === `${s}-${f}`) { manualFretKey = null; renderFretboard(); }
  }, 380);
};

window.onEventClick = function(idx) {
  ensureAudio();
  const ev = currentEvents[idx];
  if (!ev) return;
  activeEventIdx = idx;
  activeBarIdx = ev.barIdx;
  if (ev.type === 'chord') playChordVoicing(ev.notes, audioCtx.currentTime, 0.85, 0.22);
  else playArchtopNote(ev.midi, audioCtx.currentTime, 0.58, 0.28);
  document.getElementById('note-inspector').textContent = `${ev.label}  •  ${ev.tab} ${ev.tag ? ' • ' + ev.tag : ''}`;
  renderBars();
  renderFretboard();
  renderStrip();
  updateAiContextBar();
};

window.updateFeelLabel = function() {
  document.getElementById('feel-readout').textContent = swingEnabled
    ? '4/4 Jazz Swing (62%/38%)'
    : '4/4 Even Eighths (50%/50%)';
};

// --- Rendering ---
function renderKeySelect() {
  const sel = document.getElementById('select-key');
  document.getElementById('key-select-label').textContent =
    practiceLoopMode === 'circle' ? 'Starting Key:' : 'Active Key:';

  sel.innerHTML = KEYS.map((k, i) => {
    const lay = getKeyLayout(k);
    const bnd = getBoxBounds(lay);
    return `<option value="${k.id}" ${k.id === currentKeyId ? 'selected' : ''}>${i + 1}. ${k.id} Major (Frets ${bnd.min}–${bnd.max} • ${getShortShapeCode(lay)})</option>`;
  }).join('');
}

function renderCirclePanel() {
  const isCircle = practiceLoopMode === 'circle';
  document.getElementById('circle-panel').classList.toggle('circle-active', isCircle);
  document.getElementById('btn-mode-single').classList.toggle('active', !isCircle);
  document.getElementById('btn-mode-circle').classList.toggle('active-gold', isCircle);
  document.getElementById('circle-controls').style.display = isCircle ? 'flex' : 'none';

  document.getElementById('btn-unit-chorus').classList.toggle('active-gold', circleUnitMode === 'chorus');
  document.getElementById('btn-unit-minutes').classList.toggle('active-gold', circleUnitMode === 'minutes');

  const amtEl = document.getElementById('circle-amount-readout');
  amtEl.textContent = circleUnitMode === 'chorus'
    ? `${circleChorusesPerKey} ${circleChorusesPerKey === 1 ? 'Chorus' : 'Choruses'}`
    : (circleMinutesPerKey === 0.5 ? '30 Sec' : `${circleMinutesPerKey} Min`);

  const ringOrder = isCircle ? uiCircleOrder : KEYS.map(k => k.id);
  const ringEl = document.getElementById('key-ring-grid');

  ringEl.innerHTML = ringOrder.map((kid, idx) => {
    const k = getKeyById(kid);
    const lay = getKeyLayout(k);
    const bnd = getBoxBounds(lay);
    const isCurrent = kid === currentKeyId;
    const isDone = isCircle && isPlaying && idx < uiCircleIdx;
    const isNext = isCircle && uiNextKeyWarnId === kid && !isCurrent;

    let cls = 'key-node';
    if (isCurrent) cls += ' current';
    else if (isNext) cls += ' up-next';
    else if (isDone) cls += ' done';

    const prefix = isDone ? '✓ ' : (isNext ? '⏭ ' : (isCircle ? `${idx + 1}. ` : ''));
    return `<button onclick="onRingKeyClick('${kid}', ${idx})" class="${cls}" title="${k.id} Major: Frets ${bnd.min}–${bnd.max} (${getShortShapeCode(lay)})">
      <div class="key-node-name">${prefix}${k.id}</div>
      <div class="key-node-sub">Fr ${bnd.min}–${bnd.max} (${getShortShapeCode(lay)})</div>
    </button>`;
  }).join('');

  const progTxt = document.getElementById('circle-progress-text');
  const warnEl = document.getElementById('next-key-alert');

  if (isCircle) {
    const nextIdx = (uiCircleIdx + 1) % uiCircleOrder.length;
    const nextInRing = uiCircleOrder[nextIdx];
    if (isPlaying) {
      const unitStatus = circleUnitMode === 'chorus'
        ? `Chorus ${uiChorusInKey}/${circleChorusesPerKey}`
        : `Time Left ${formatTimer(uiRemSecInKey)}`;
      progTxt.textContent =
        `🔄 Circle Lap #${uiCircleLap}  •  Key ${uiCircleIdx + 1}/12 (${currentKeyId} Major)  •  Bar ${activeBarIdx + 1}/4  •  ${unitStatus}  ➔  Up Next: ${nextInRing} Major`;
    } else {
      const unitDesc = circleUnitMode === 'chorus'
        ? `every ${circleChorusesPerKey} ${circleChorusesPerKey === 1 ? 'chorus' : 'choruses'} (${circleChorusesPerKey * 4} bars)`
        : `every ${circleMinutesPerKey === 0.5 ? '30 seconds' : circleMinutesPerKey + ' min'}`;
      progTxt.textContent =
        `🔄 CIRCLE MODE ACTIVE: Auto-modulates to the next key ${unitDesc} (${uiCircleOrder.slice(0, 5).join(' → ')}...)`;
    }

    if (isPlaying && uiNextKeyWarnId) {
      const nk = getKeyById(uiNextKeyWarnId);
      const nLay = getKeyLayout(nk);
      const nBnd = getBoxBounds(nLay);
      warnEl.classList.add('visible');
      warnEl.textContent = `⏭ SWITCHING NEXT BAR: ${nk.id} Major (Frets ${nBnd.min}–${nBnd.max} • ${getShortShapeCode(nLay)})`;
    } else {
      warnEl.classList.remove('visible');
      warnEl.textContent = '';
    }
  } else {
    progTxt.textContent =
      `🔒 SINGLE KEY MODE: Looping ${currentKeyId} Major only (no auto key change). Select "🔄 12-Key Circle Loop" above for continuous modulation.`;
    warnEl.classList.remove('visible');
    warnEl.textContent = '';
  }
}

function renderBlockTabs() {
  const el = document.getElementById('block-tabs');
  const fixedTitles = [
    { id: 'b1', code: 'BLOCK 1 • 45 MIN', cat: 'Jazz Voicings & Comping' },
    { id: 'b2', code: 'BLOCK 2 • 60 MIN', cat: 'Voice-Led 7th Arpeggios' },
    { id: 'b3', code: 'BLOCK 3 • 45 MIN', cat: 'Modes & Lydian #4' },
    { id: 'b4', code: 'BLOCK 4 • 60 MIN', cat: 'Jazz Trio Improvisation' }
  ];
  el.innerHTML = fixedTitles.map((ft, idx) => {
    const active = ft.id === activeBlockId;
    const modForBlock = active ? activeModuleId : (perBlockModule[ft.id] || 'm1');
    const bDef = getBlocksForModule(modForBlock).find(x => x.id === ft.id);
    const prog = getBlockProgress(ft.id, modForBlock);
    let gradCount = 0;
    ['m1', 'm2', 'm3', 'm4'].forEach(m => {
      if (getBlockProgress(ft.id, m).graduated) gradCount++;
    });
    const stepNum = `${idx + 1}.${modForBlock.slice(1)}`;
    const badge = prog.graduated
      ? `<span class="badge-grad">🏆 ${stepNum} Grad (${gradCount}/4)</span>`
      : `<span>Drill ${stepNum}: ${prog.bpm}/${bDef.goalBpm} BPM</span>`;
    return `<button onclick="selectBlock('${ft.id}')" class="block-tab ${active ? 'active' : ''}">
      <div class="block-tab-top">
        <span>[${idx + 1}] ${ft.code}</span>
        ${badge}
      </div>
      <div class="block-tab-title">${ft.cat}</div>
    </button>`;
  }).join('');
}

function renderMission() {
  const b = getBlockObj();
  document.getElementById('drill-title').textContent = b.title;
  document.getElementById('drill-goal-badge').textContent = `Start: ${b.startBpm} BPM  →  Target: ${b.goalBpm} BPM`;
  document.getElementById('drill-purpose').textContent = b.purpose;
  document.getElementById('drill-howto').textContent = b.howto;
  document.getElementById('bpm-slider').value = bpm;
  document.getElementById('bpm-readout').textContent = `${bpm} BPM`;
  document.getElementById('b1-rhythm-bar').style.display = (b.id === 'b1') ? 'flex' : 'none';
  document.getElementById('bpm-ladder-label').textContent = practiceLoopMode === 'circle'
    ? 'BPM Ladder (+5 BPM per 12-Key Lap or Manual)'
    : 'BPM Ladder (3 Clean Reps = +5 BPM)';
}

function renderRepDots() {
  const el = document.getElementById('rep-dots');
  let html = '<span style="font-size:0.84rem;color:var(--text-muted);font-weight:700;margin-right:0.25rem;">Clean Reps:</span>';
  for (let i = 1; i <= 3; i++) {
    const filled = i <= cleanReps;
    html += `<span class="rep-dot ${filled ? 'filled' : ''}">${i}</span>`;
  }
  el.innerHTML = html;
}

function renderGradStatus() {
  const b = getBlockObj();
  const prog = getBlockProgress(b.id);
  const el = document.getElementById('grad-status');
  if (prog.graduated || (bpm >= b.goalBpm && cleanReps >= 3)) {
    el.className = 'grad-status done';
    el.textContent = `🏆 GRADUATED (${prog.bpm || bpm} BPM)! Ready to advance to the next drill or block.`;
  } else {
    const rem = Math.max(0, b.goalBpm - bpm);
    el.className = 'grad-status';
    el.textContent = rem > 0
      ? `Remaining to graduation target (${b.goalBpm} BPM): +${rem} BPM`
      : `At target tempo (${b.goalBpm} BPM)! ${3 - cleanReps} clean rep(s) left to graduate.`;
  }
}

function renderBars() {
  const k = getKeyObj();
  const v = getVoicingsForKey(k);
  const bars = [
    { idx: 0, chord: activeBlockId === 'b1' ? v.iiName : k.ii, shape: v.ii.shapeText, roman: 'ii7 • Dorian' },
    { idx: 1, chord: activeBlockId === 'b1' ? v.VName  : k.V7, shape: v.V.shapeText,  roman: 'V7 • Mixolydian' },
    { idx: 2, chord: activeBlockId === 'b1' ? v.IName  : k.I,  shape: v.I.shapeText,  roman: 'IMaj7 • Lydian (#4)' },
    { idx: 3, chord: activeBlockId === 'b1' ? v.IName  : k.I,  shape: v.I.shapeText,  roman: 'IMaj7 • Turnaround' }
  ];
  document.getElementById('bar-cards').innerHTML = bars.map(b => {
    const on = b.idx === activeBarIdx;
    return `<button onclick="onBarClick(${b.idx})" class="bar-card ${on ? 'active' : ''}">
      <div class="bar-num">BAR ${b.idx + 1} (${k.id} Major)</div>
      <div class="bar-chord">${b.chord}</div>
      <div class="bar-shape">${b.shape}</div>
      <div class="bar-roman">${b.roman}</div>
    </button>`;
  }).join('');
}

function renderFretboard() {
  const mount = document.getElementById('fretboard-mount');
  const keyObj = getKeyObj();
  const layout = getKeyLayout(keyObj);
  const bnd = getBoxBounds(layout);
  const boxMin = bnd.min;
  const boxMax = bnd.max;

  const famBadge = document.getElementById('shape-family-badge');
  famBadge.className = (layout.shape === 'A') ? 'shape-family-badge kalip-a' : 'shape-family-badge kalip-b';
  famBadge.textContent = getShapeBadgeLabel(layout, keyObj);

  let nextMin = -1;
  let nextMax = -1;
  if (isPlaying && uiNextKeyWarnId) {
    const nLay = getKeyLayout(getKeyById(uiNextKeyWarnId));
    const nBnd = getBoxBounds(nLay);
    nextMin = nBnd.min;
    nextMax = nBnd.max;
  }

  let fretStart = 0;
  let fretEnd = 15;
  if (zoomBoxOnly) {
    const low = nextMin >= 0 ? Math.min(boxMin, nextMin) : boxMin;
    const high = nextMax >= 0 ? Math.max(boxMax, nextMax) : boxMax;
    fretStart = Math.max(0, low - 1);
    fretEnd = Math.min(15, high + 1);
  }
  const fretCount = fretEnd - fretStart + 1;
  const gridCols = `64px repeat(${fretCount}, minmax(${zoomBoxOnly ? '78px' : '48px'}, 1fr))`;

  const boxMap = getBoxMapForBar(keyObj, activeBarIdx);
  const voicings = getVoicingsForKey(keyObj);
  const barVoicingNotes = [voicings.ii.notes, voicings.V.notes, voicings.I.notes, voicings.I.notes][activeBarIdx];

  const activeNotesMap = new Map();
  if (activeEventIdx >= 0 && currentEvents[activeEventIdx]) {
    currentEvents[activeEventIdx].notes.forEach(n => activeNotesMap.set(`${n.s}-${n.f}`, n));
  } else if (activeBlockId === 'b1') {
    barVoicingNotes.forEach(n => activeNotesMap.set(`${n.s}-${n.f}`, n));
  }

  document.getElementById('box-range-label').textContent =
    `Active Box: Frets ${boxMin} – ${boxMax} (${getShortShapeCode(layout)})${uiNextKeyWarnId ? `  •  Next: Frets ${nextMin}–${nextMax}` : ''}`;

  let html = `<div class="fret-nums-row" style="grid-template-columns:${gridCols};">
    <div class="fret-num-cell">Str</div>`;
  for (let f = fretStart; f <= fretEnd; f++) {
    const inBox = f >= boxMin && f <= boxMax;
    const inNext = !inBox && f >= nextMin && f <= nextMax;
    html += `<div class="fret-num-cell ${inBox ? 'in-box' : (inNext ? 'next-box-hint' : '')}">${f === 0 ? 'Open(0)' : f}</div>`;
  }
  html += `</div>`;

  html += `<div class="fretboard-neck">`;
  for (let s = 1; s <= 6; s++) {
    const wireH = s <= 2 ? '1.5px' : (s <= 4 ? '2.5px' : '3.5px');
    const mutedString = (activeBlockId === 'b1' && !barVoicingNotes.some(n => n.s === s)) ||
                        (layout.shape === 'D2_4' && s >= 5);

    html += `<div class="fret-string-row" style="grid-template-columns:${gridCols};">`;
    html += `<div class="string-header ${mutedString ? 'muted' : ''}">${STRING_LABELS[s]}${mutedString ? ' ×' : ''}</div>`;

    for (let f = fretStart; f <= fretEnd; f++) {
      const key = `${s}-${f}`;
      const node = boxMap.get(key);
      const activeNode = activeNotesMap.get(key);
      const isManual = manualFretKey === key;
      const inBox = f >= boxMin && f <= boxMax;
      const inNext = !inBox && f >= nextMin && f <= nextMax;

      let cellCls = 'fret-cell';
      if (f === 0) cellCls += ' nut-cell';
      if (inBox) cellCls += ' in-box';
      else if (inNext) cellCls += ' next-box';
      if (f === boxMin && f > 0) cellCls += ' box-left';
      if (f === boxMax) cellCls += ' box-right';

      let inlay = '';
      if (s === 3 && [3, 5, 7, 9, 15].includes(f)) inlay = `<span class="inlay-dot mid"></span>`;
      else if (f === 12 && (s === 2 || s === 4)) inlay = `<span class="inlay-dot mid"></span>`;

      const midi = OPEN_MIDI[s] + f;
      const nm = midiName(midi, keyObj.sharp);
      const refNode = activeNode || node;
      let txt = refNode ? refNode.name : nm.name;

      if (refNode) {
        if (labelMode === 'role') txt = refNode.role;
        else if (labelMode === 'finger') txt = String(refNode.finger);
        else if (labelMode === 'both') txt = `${refNode.name}·${refNode.role}`;
      }

      const soundingCls = (isManual || (isPlaying && activeNode)) ? ' is-sounding' : '';
      let badgeHtml = '';

      if (activeBlockId === 'b1' && activeNode) {
        const tierCls = activeNode.isGuide ? 'tier-guide' : 'tier-chord';
        badgeHtml = `<span class="note-badge ${tierCls}${soundingCls}">${txt}</span>`;
      } else if (node && activeBlockId !== 'b1') {
        badgeHtml = `<span class="note-badge tier-${node.tier}${soundingCls}">${txt}</span>`;
      } else if (isManual) {
        badgeHtml = `<span class="note-badge tier-chord is-sounding">${nm.name}</span>`;
      } else {
        badgeHtml = `<span class="note-badge tier-ghost">${nm.name}</span>`;
      }

      html += `<button onclick="onFretClick(${s}, ${f})" class="${cellCls}">
        <span class="string-wire" style="height:${wireH}"></span>
        ${inlay}
        ${badgeHtml}
      </button>`;
    }
    html += `</div>`;
  }
  html += `</div>`;
  mount.innerHTML = html;
}

function renderStrip() {
  const strip = document.getElementById('sequence-strip');
  const lay = getKeyLayout(getKeyObj());
  document.getElementById('strip-meta').textContent =
    `${currentKeyId} Major (${getShortShapeCode(lay)})  •  ${currentEvents.length} Steps  •  4 Bars`;
  strip.innerHTML = currentEvents.map((ev, idx) => {
    const cur = idx === activeEventIdx;
    const isStar = ev.tag && ev.tag.includes('★');
    return `<button onclick="onEventClick(${idx})" class="step-chip ${cur ? 'active' : ''} ${isStar ? 'star' : ''}">
      <div style="font-weight:700;">B${ev.barIdx + 1}: ${ev.label} <span style="opacity:0.75;">(${ev.role})</span></div>
      <div style="opacity:0.82;margin-top:0.12rem;">${ev.tab}</div>
    </button>`;
  }).join('');
}

function renderAll() {
  renderTopDrillSelect();
  renderKeySelect();
  renderCirclePanel();
  renderBlockTabs();
  renderMission();
  renderRepDots();
  renderGradStatus();
  renderBars();
  renderFretboard();
  renderStrip();
}

// --- In-App AI Jazz Coach Logic (Online LLM + Instant Local Theory Analyzer) ---
function getStudioContextSnapshot() {
  const k = getKeyObj();
  const v = getVoicingsForKey(k);
  const lay = getKeyLayout(k);
  const bnd = getBoxBounds(lay);
  const b = getBlockObj();
  const modMeta = CURRICULUM.find(m => m.id === activeModuleId);
  const activeChordName = [v.iiName, v.VName, v.IName, v.IName][activeBarIdx];
  const activeShape = [v.ii.shapeText, v.V.shapeText, v.I.shapeText, v.I.shapeText][activeBarIdx];
  const activeNotes = [v.ii.notes, v.V.notes, v.I.notes, v.I.notes][activeBarIdx]
    .map(n => `Str ${n.s} Fret ${n.f} = ${n.full} (Degree: ${n.role}${n.isGuide ? ', Guide Tone' : ''})`)
    .join('; ');

  const grads = [];
  ['m1', 'm2', 'm3', 'm4'].forEach(mid => {
    ['b1', 'b2', 'b3', 'b4'].forEach(bid => {
      const p = getBlockProgress(bid, mid);
      if (p.graduated) grads.push(`${mid.toUpperCase()}-${bid.toUpperCase()} (${p.bpm} BPM)`);
    });
  });

  return {
    Active_Module: `${modMeta.num}: ${modMeta.name} (${modMeta.strings})`,
    Active_Block: `${b.code} — ${b.title}`,
    Active_Key: `${k.id} Major (${k.ii} – ${k.V7} – ${k.I})`,
    Position_Box: `Frets ${bnd.min}–${bnd.max} (${getShapeBadgeLabel(lay, k)})`,
    Selected_Bar_and_Voicing: `Bar ${activeBarIdx + 1}: ${activeChordName} [Grip 6->1: ${activeShape}]`,
    Voicing_Notes: activeNotes,
    Loop_Mode: practiceLoopMode === 'circle' ? `12-Key Circle (${circleOrderMode})` : 'Single Key Loop',
    Current_BPM: `${bpm} BPM (Target: ${b.goalBpm} BPM)`,
    Last_Auto_Judge_Score: lastJudgeReport ? `${lastJudgeReport.summary} [Bars: ${(lastJudgeReport.bar_scores || []).join('% / ')}%]` : 'No chorus graded yet',
    Graduated_Drills: grads.length ? grads.join(', ') : 'None yet'
  };
}

// --- Live Guitar Listener & Auto-Advance Judge Engine ---
function populateAudioInputs() {
  if (!(window.pywebview && window.pywebview.api && window.pywebview.api.list_audio_inputs)) return Promise.resolve([]);
  return window.pywebview.api.list_audio_inputs().then(devs => {
    const sel = document.getElementById('select-audio-in');
    if (!sel || !Array.isArray(devs) || devs.length === 0) return [];
    const hasSaved = autoJudgeDeviceIdx !== null && devs.some(d => d.index === Number(autoJudgeDeviceIdx));
    if (!hasSaved) {
      autoJudgeDeviceIdx = devs[0].index;
    }
    sel.innerHTML = devs.map(d =>
      `<option value="${d.index}" ${d.index === Number(autoJudgeDeviceIdx) ? 'selected' : ''}>${d.preferred ? '★ ' : ''}${d.name}</option>`
    ).join('');
    return devs;
  }).catch(() => []);
}

function syncJudgeParamsToBackend() {
  if (window.pywebview && window.pywebview.api && window.pywebview.api.set_judge_settings) {
    window.pywebview.api.set_judge_settings(autoJudgeLatencyMs, autoJudgeThreshold).catch(() => {});
  }
}

function renderJudgeBarUI() {
  const panel = document.getElementById('judge-panel');
  const btn = document.getElementById('btn-auto-judge');
  const lbl = document.getElementById('judge-btn-label');
  if (!panel || !btn || !lbl) return;

  panel.classList.toggle('listening', autoJudgeEnabled);
  btn.classList.toggle('active', autoJudgeEnabled);
  lbl.textContent = autoJudgeEnabled ? '🎙️ Auto-Judge: LISTENING (J)' : '🎙️ Auto-Judge: OFF (J)';

  document.getElementById('select-audio-ch').value = autoJudgeChannel;
  document.getElementById('select-judge-thresh').value = String(autoJudgeThreshold);
  document.getElementById('judge-lat-readout').textContent = `${Math.round(autoJudgeLatencyMs)} ms`;
  document.getElementById('chk-hold-key').checked = autoJudgeHoldKey;
  document.getElementById('chk-judge-mute-lead').checked = autoJudgeMuteLead;
}

function startMeterPolling() {
  if (judgeMeterTimer) clearInterval(judgeMeterTimer);
  judgeMeterTimer = setInterval(() => {
    if (!autoJudgeEnabled || !(window.pywebview && window.pywebview.api && window.pywebview.api.get_guitar_level)) return;
    window.pywebview.api.get_guitar_level().then(st => {
      if (!st) return;
      const db = typeof st.rms_db === 'number' ? st.rms_db : -90;
      const pct = Math.max(0, Math.min(100, ((db + 68) / 62) * 100));
      const fill = document.getElementById('judge-meter-fill');
      const txt = document.getElementById('judge-db-readout');
      if (fill) fill.style.width = `${pct.toFixed(1)}%`;
      if (txt) txt.textContent = db <= -85 ? '-∞ dB' : `${Math.round(db)} dB`;
    }).catch(() => {});
  }, 110);
}

function stopMeterPolling() {
  if (judgeMeterTimer) { clearInterval(judgeMeterTimer); judgeMeterTimer = null; }
  const fill = document.getElementById('judge-meter-fill');
  const txt = document.getElementById('judge-db-readout');
  if (fill) fill.style.width = '0%';
  if (txt) txt.textContent = '-90 dB';
}

window.toggleAutoJudge = function() {
  if (!(window.pywebview && window.pywebview.api && window.pywebview.api.start_guitar_listener)) {
    const sumEl = document.getElementById('judge-summary-text');
    sumEl.className = 'judge-summary-text fail';
    sumEl.textContent = '⚠ Native Audio Judge requires launching the desktop app (CazGitarKocu.vbs / app.py).';
    return Promise.resolve(false);
  }

  if (autoJudgeEnabled) {
    autoJudgeEnabled = false;
    stopMeterPolling();
    window.pywebview.api.stop_guitar_listener().catch(() => {});
    renderJudgeBarUI();
    renderMission();
    renderCirclePanel();
    const sumEl = document.getElementById('judge-summary-text');
    sumEl.className = 'judge-summary-text';
    sumEl.textContent = '🎙️ Auto-Judge paused. Press J or click Auto-Judge anytime to resume live guitar grading.';
    return Promise.resolve(false);
  }

  return populateAudioInputs().then(() => {
    syncJudgeParamsToBackend();
    return window.pywebview.api.start_guitar_listener(autoJudgeDeviceIdx, autoJudgeChannel);
  }).then(res => {
    const sumEl = document.getElementById('judge-summary-text');
    if (res && res.ok) {
      autoJudgeEnabled = true;
      autoJudgeDeviceIdx = res.device_index;
      cleanChorusesInKey = 0;
      autoFailStreak = 0;
      persistState();
      renderJudgeBarUI();
      renderMission();
      renderCirclePanel();
      startMeterPolling();
      sumEl.className = 'judge-summary-text pass';
      sumEl.textContent = `🟢 Listening on ${res.device_name} (${res.samplerate} Hz) — press Space & play along! Resting choruses have zero penalty.`;
      return true;
    } else {
      autoJudgeEnabled = false;
      renderJudgeBarUI();
      sumEl.className = 'judge-summary-text fail';
      sumEl.textContent = `⚠ Could not open audio input: ${(res && res.error) ? res.error : 'Unknown error'}`;
      return false;
    }
  });
};

window.onJudgeDeviceChange = function(val) {
  autoJudgeDeviceIdx = val !== '' ? Number(val) : null;
  persistState();
  if (autoJudgeEnabled && window.pywebview && window.pywebview.api) {
    window.pywebview.api.start_guitar_listener(autoJudgeDeviceIdx, autoJudgeChannel).then(res => {
      if (res && res.ok) {
        const sumEl = document.getElementById('judge-summary-text');
        sumEl.className = 'judge-summary-text pass';
        sumEl.textContent = `🟢 Switched input to ${res.device_name} (${res.samplerate} Hz).`;
      }
    }).catch(() => {});
  }
};

window.onJudgeChannelChange = function(mode) {
  autoJudgeChannel = ['sum', 'ch1', 'ch2'].includes(mode) ? mode : 'sum';
  persistState();
  if (window.pywebview && window.pywebview.api && window.pywebview.api.set_guitar_channel) {
    window.pywebview.api.set_guitar_channel(autoJudgeChannel).catch(() => {});
  }
};

window.onJudgeThresholdChange = function(val) {
  autoJudgeThreshold = Number(val) || 85;
  persistState();
  syncJudgeParamsToBackend();
};

window.setJudgeHoldKey = function(flag) {
  autoJudgeHoldKey = Boolean(flag);
  cleanChorusesInKey = 0;
  persistState();
  renderCirclePanel();
};

window.setJudgeMuteLead = function(flag) {
  autoJudgeMuteLead = Boolean(flag);
  persistState();
};

function renderJudgeScorecard(res, recKeyId) {
  const sumEl = document.getElementById('judge-summary-text');
  const bars = res.bar_scores || [0, 0, 0, 0];

  for (let i = 0; i < 4; i++) {
    const pill = document.getElementById(`judge-bar-${i + 1}`);
    if (!pill) continue;
    if (res.status === 'resting') {
      pill.className = 'judge-bar-pill';
      pill.textContent = `B${i + 1}: --`;
    } else {
      const sc = bars[i] ?? 0;
      pill.className = 'judge-bar-pill ' + (sc >= autoJudgeThreshold ? 'good' : (sc >= 65 ? 'mid' : 'low'));
      pill.textContent = `B${i + 1}: ${sc}%`;
    }
  }

  if (res.status === 'resting') {
    sumEl.className = 'judge-summary-text rest';
    sumEl.textContent = res.summary || '⏸ Listening — play along on guitar to grade chorus (zero penalty).';
  } else if (res.passed) {
    sumEl.className = 'judge-summary-text pass';
    const modeNote = practiceLoopMode === 'circle'
      ? (autoJudgeHoldKey ? `✓ ${recKeyId} Major Passed (${res.score}%) — Advancing key!` : `✓ ${recKeyId} Major Clean (${res.score}%)!`)
      : `✓ CLEAN CHORUS (${res.score}% >= ${autoJudgeThreshold}%) — Clean Rep (+1) logged!`;
    sumEl.textContent = modeNote;
  } else {
    sumEl.className = 'judge-summary-text fail';
    const holdHint = (practiceLoopMode === 'circle' && autoJudgeHoldKey) ? ` • Repeating ${recKeyId} Major` : '';
    sumEl.textContent = `${res.summary}${holdHint}`;
  }
}

function evaluateActiveChorus(rec) {
  if (!rec || !(window.pywebview && window.pywebview.api && window.pywebview.api.evaluate_chorus)) return;
  const nowAudio = audioCtx ? audioCtx.currentTime : rec.expectedEndAudioTime;
  const chorusStartAgoSec = Math.max(0.4, nowAudio - rec.startAudioTime);
  const clippedEvents = rec.events
    .filter(ev => ev.relStartSec < chorusStartAgoSec - 0.04)
    .map(ev => ({
      ...ev,
      durSec: Math.min(ev.durSec, Math.max(0.10, chorusStartAgoSec - ev.relStartSec - 0.01))
    }));

  const payload = {
    chorusStartAgoSec,
    chorusDurSec: chorusStartAgoSec,
    blockId: rec.blockId,
    keyPc: rec.keyPc,
    events: clippedEvents
  };

  window.pywebview.api.evaluate_chorus(payload).then(res => {
    if (!res || !res.ok) return;
    lastJudgeReport = res;

    if (res.status === 'resting') {
      rec.gateDecision = 'resting';
      renderJudgeScorecard(res, rec.keyId);
      return;
    }

    if (res.passed) {
      rec.gateDecision = 'pass';
      autoFailStreak = 0;
      renderJudgeScorecard(res, rec.keyId);

      if (practiceLoopMode === 'single') {
        markCleanRep();
      } else {
        // Subtle confirmation chime in Circle mode & check if at goalBpm
        playArchtopNote(76, audioCtx.currentTime, 0.20, 0.16);
      }
    } else {
      rec.gateDecision = 'fail';
      autoFailStreak++;
      renderJudgeScorecard(res, rec.keyId);

      if (practiceLoopMode === 'single') {
        if (cleanReps > 0) {
          cleanReps = 0;
          const b = getBlockObj();
          const cur = getBlockProgress(b.id);
          saveBlockProgress(b.id, bpm, 0, cur.graduated);
          renderRepDots();
          renderGradStatus();
        } else if (autoFailStreak >= 3) {
          autoFailStreak = 0;
          setBpm(Math.max(45, bpm - 5));
        }
      }
    }
  }).catch(() => {});
}

window.calibrateLatency = function() {
  if (isCalibrating) return;
  if (isPlaying) stopPlayback();
  ensureAudio();

  const runCalibSequence = () => {
    isCalibrating = true;
    const sumEl = document.getElementById('judge-summary-text');
    sumEl.className = 'judge-summary-text fail';
    sumEl.textContent = '🎯 GET READY: Chuck a muted guitar string right on beats 1 – 2 – 3 – 4!';

    const startT = audioCtx.currentTime + 0.85;
    const step = 0.65; // ~92 BPM comfortable quarter notes
    const clickTimes = [startT, startT + step, startT + 2 * step, startT + 3 * step];

    clickTimes.forEach((ct, idx) => {
      playSoftJazzClick(ct, idx === 1 || idx === 3, idx === 0, true);
      const delayMs = Math.max(0, (ct - audioCtx.currentTime) * 1000);
      setTimeout(() => renderBeatPads(idx + 1), delayMs);
    });

    const finishDelayMs = Math.max(200, (clickTimes[3] + 0.32 - audioCtx.currentTime) * 1000);
    setTimeout(() => {
      renderBeatPads(0);
      const nowT = audioCtx.currentTime;
      const agos = clickTimes.map(ct => Math.max(0.05, nowT - ct));
      window.pywebview.api.calibrate_guitar_latency(agos).then(res => {
        isCalibrating = false;
        if (res && res.ok) {
          autoJudgeLatencyMs = res.latency_ms;
          document.getElementById('judge-lat-readout').textContent = `${Math.round(autoJudgeLatencyMs)} ms`;
          persistState();
          sumEl.className = 'judge-summary-text pass';
          sumEl.textContent = `✓ Calibrated input latency: ${res.latency_ms} ms (${res.hits_detected}/4 strums locked).`;
        } else {
          sumEl.className = 'judge-summary-text fail';
          sumEl.textContent = `⚠ Calibration: ${(res && res.error) ? res.error : 'Try strumming louder on 1-2-3-4.'}`;
        }
      }).catch(() => { isCalibrating = false; });
    }, finishDelayMs);
  };

  if (!autoJudgeEnabled) {
    toggleAutoJudge().then(ok => { if (ok) runCalibSequence(); });
  } else {
    runCalibSequence();
  }
};

window.replayLastTake = function() {
  if (!(window.pywebview && window.pywebview.api && window.pywebview.api.replay_last_chorus)) return;
  window.pywebview.api.replay_last_chorus().then(res => {
    const sumEl = document.getElementById('judge-summary-text');
    if (res && !res.ok) {
      sumEl.className = 'judge-summary-text fail';
      sumEl.textContent = `⚠ ${res.error || 'Play at least 1 chorus with Auto-Judge ON first.'}`;
    }
  }).catch(() => {});
};

function updateAiContextBar() {
  const el = document.getElementById('ai-ctx-bar');
  if (!el) return;
  const k = getKeyObj();
  const v = getVoicingsForKey(k);
  const ch = [v.iiName, v.VName, v.IName, v.IName][activeBarIdx];
  el.textContent = `📍 Live State: ${activeModuleId.toUpperCase()} • ${activeBlockId.toUpperCase()} • ${k.id} Major (${ch}) • ${bpm} BPM`;
}

function buildInstantLocalAnswer(kind) {
  const k = getKeyObj();
  const v = getVoicingsForKey(k);
  const lay = getKeyLayout(k);
  const bnd = getBoxBounds(lay);
  const chordNames = [v.iiName, v.VName, v.IName, v.IName];
  const chordObjs = [v.ii, v.V, v.I, v.I];
  const curName = chordNames[activeBarIdx];
  const curObj = chordObjs[activeBarIdx];

  if (kind === 'help') {
    return `🧭 **Jazz Guitar Practice Studio — Quick Guide:**\n` +
      `• **Blocks & Drills (Keys 1–4 + Top-Left Menu):** Pair Drop-3 / Pure Drop-2 voicings (Block 1) with in-box 7th Arpeggios (Block 2), Dorian/Mixolydian/Lydian #4 (Block 3), and Trio Soloing (Block 4).\n` +
      `• **Loop Engine (C):** Toggle Single Key Loop or Continuous 12-Key Circle (4ths / 5ths / Random).\n` +
      `• **Live Guitar Auto-Judge (J):** Listens via WASAPI, grades each 4-bar chorus, and auto-advances Clean Reps, +5 BPM, and Circle keys (use 🎯 Calibrate once to lock latency; 🔊 Replay Take plays back your last chorus).\n` +
      `• **Fretboard & Zoom (Z):** Click any fret/card to audition; press Z to zoom into the active fret box.`;
  }
  if (kind === 'chord') {
    const lines = curObj.notes.map(n =>
      `• String ${n.s}, Fret ${n.f} → ${n.name} (Degree: ${n.role}${n.isGuide ? ' ★ Guide Tone' : ''}, LH ${n.finger === 0 ? 'Open' : 'Finger ' + n.finger})`
    ).join('\n');
    return `🎸 **${curName}** (${k.id} Major, Bar ${activeBarIdx + 1}) Voicing Breakdown:\n` +
      `Tab Grip (6→1): ${curObj.shapeText}\n` +
      `Voicing Family: ${getShapeBadgeLabel(lay, k)}\n\n` +
      `Voice Construction:\n${lines}\n\n` +
      `Flesh-mute the (×) strings lightly with your fretting fingers to keep the low register clean and punchy.`;
  }
  if (kind === 'guide') {
    const gIi = v.ii.notes.filter(n => n.isGuide);
    const gV  = v.V.notes.filter(n => n.isGuide);
    const gI  = v.I.notes.filter(n => n.isGuide);
    const fmt = arr => arr.map(n => `Str ${n.s} Fr ${n.f} (${n.name}=${n.role})`).join(' & ');
    return `🎯 **${k.id} Major (Frets ${bnd.min}–${bnd.max})** Guide-Tone (3rd & 7th) Voice Leading:\n\n` +
      `1) ${v.iiName}: ${fmt(gIi)}\n` +
      `2) ${v.VName}: ${fmt(gV)}  ← (b7 of ii resolves down a half-step to 3rd of V7!)\n` +
      `3) ${v.IName}: ${fmt(gI)}  ← (b7 of V7 resolves down a half-step to 3rd of IMaj7!)\n\n` +
      `Anchor both your comping and solo target notes around these half-step Guide-Tone resolutions.`;
  }
  if (kind === 'tip') {
    if (activeBlockId === 'b1') {
      return `🖐 **Comping Articulation Tip (${activeModuleId.toUpperCase()}):**\n` +
        `Release left-hand pressure by ~1 mm right after striking each chord while keeping fingers touching the strings—this creates crisp Freddie Green / Charleston swing articulation without open-string ring.`;
    }
    return `🖐 **Fretting & Picking Tip (${activeBlockId.toUpperCase()}):**\n` +
      `Stay strictly 1-finger-per-fret inside Frets ${bnd.min}–${bnd.max}. Play smooth legato eighth notes and lightly accent the upbeats ('&'s) for authentic jazz swing phrasing.`;
  }
  const m1b1 = getBlockProgress('b1', 'm1');
  if (m1b1.graduated) {
    return `🗺️ **Recommended Practice Focus Today:**\n` +
      `• You already graduated Chord 1.1 (6th-Str Drop-3 at ${m1b1.bpm} BPM)!\n` +
      `• **Block 1 (45m Chords):** Work on **Chord 1.2 (5-4-3-2 Pure Drop-2)** around the Circle of 4ths.\n` +
      `• **Blocks 2 & 3 (Arpeggios & Modes):** Lock in **Arp 2.1** & **Mode 3.1** inside the 6th-string box up to 95/90 BPM.`;
  }
  return `🗺️ **Recommended Practice Focus:**\nGraduate Block 1 voicings at 100 BPM across all 12 keys first, then immediately lock in the matching Block 2 voice-led 7th arpeggios in the same fret box.`;
}

function appendAiMessage(role, text) {
  const box = document.getElementById('ai-messages');
  const div = document.createElement('div');
  div.className = `ai-msg ${role}`;
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

window.toggleAiDrawer = function() {
  const dr = document.getElementById('ai-drawer');
  const opening = !dr.classList.contains('open');
  dr.classList.toggle('open', opening);
  if (opening) {
    updateAiContextBar();
    refreshAiStatusBadge();
    if (document.getElementById('ai-messages').children.length === 0) {
      appendAiMessage(
        'assistant',
        'Welcome! Ask me anything about using Jazz Guitar Practice Studio (Auto-Judge, Calibration, 12-Key Circle, Blocks, Shortcuts) or the jazz concepts on your screen (Drop-2/Drop-3, Guide Tones, Modes, Improvisation).\n\n' +
        'Works immediately offline without an API key, or open ⚙ AI Setup anytime to connect Gemini, OpenAI, or Local Ollama.'
      );
    }
    setTimeout(() => document.getElementById('ai-input').focus(), 80);
  }
};

window.toggleAiSettings = function() {
  document.getElementById('ai-settings-box').classList.toggle('open');
};

window.onAiProviderSelect = function() {
  const p = document.getElementById('ai-provider').value;
  document.getElementById('ai-key-row').style.display = (p === 'ollama') ? 'none' : 'block';
  document.getElementById('ai-url-row').style.display = (p === 'ollama') ? 'block' : 'none';
  const modelEl = document.getElementById('ai-model');
  if (p === 'gemini') modelEl.value = 'gemini-3.8-flash';
  else if (p === 'openai') modelEl.value = 'gpt-4o-mini';
  else modelEl.value = 'llama3.1';
};

window.openGeminiKeyPage = function() {
  const url = 'https://aistudio.google.com/apikey';
  if (window.pywebview && window.pywebview.api && window.pywebview.api.open_external_url) {
    window.pywebview.api.open_external_url(url);
  } else {
    window.open(url, '_blank');
  }
};

function refreshAiStatusBadge() {
  if (window.pywebview && window.pywebview.api && window.pywebview.api.get_ai_status) {
    window.pywebview.api.get_ai_status().then(st => {
      document.getElementById('ai-provider').value = st.provider || 'gemini';
      document.getElementById('ai-model').value = st.model || 'gemini-3.8-flash';
      document.getElementById('ai-base-url').value = st.base_url || 'http://localhost:11434';
      document.getElementById('ai-key-row').style.display = (st.provider === 'ollama') ? 'none' : 'block';
      document.getElementById('ai-url-row').style.display = (st.provider === 'ollama') ? 'block' : 'none';
      const sub = document.getElementById('ai-status-sub');
      if (st.configured) {
        sub.textContent = `✓ Connected: ${st.provider.toUpperCase()} (${st.model}) • Scoped to App & Jazz`;
        sub.style.color = '#34d399';
      } else {
        sub.textContent = '✓ Built-in App Help & Theory Coach Active (Optional API key in ⚙ AI Setup)';
        sub.style.color = '#38bdf8';
      }
    }).catch(() => {});
  }
}

window.saveAiSettings = function() {
  if (!(window.pywebview && window.pywebview.api && window.pywebview.api.save_ai_config)) return;
  const payload = {
    provider: document.getElementById('ai-provider').value,
    model: document.getElementById('ai-model').value,
    api_key: document.getElementById('ai-api-key').value,
    base_url: document.getElementById('ai-base-url').value
  };
  window.pywebview.api.save_ai_config(payload).then(st => {
    document.getElementById('ai-api-key').value = '';
    document.getElementById('ai-save-msg').textContent = st.configured ? '✓ Saved & connected!' : 'Saved';
    refreshAiStatusBadge();
    setTimeout(() => {
      document.getElementById('ai-save-msg').textContent = '';
      document.getElementById('ai-settings-box').classList.remove('open');
    }, 1000);
  });
};

window.askQuickQuestion = function(kind) {
  const labels = {
    help: 'How do I use the program UI, Live Auto-Judge, Calibration, and 12-Key Circle features?',
    chord: 'Analyze the current chord voicing, Drop structure, and degrees.',
    guide: 'Show the b7 → 3 Guide-Tone resolution strings and frets in this key.',
    tip: 'Give me a fretting-hand and picking articulation tip for this drill.',
    next: 'Based on my progress, what should I focus on next?'
  };
  const q = labels[kind] || labels.help;
  if (kind === 'help' && window.pywebview && window.pywebview.api && window.pywebview.api.ask_ai_coach) {
    document.getElementById('ai-input').value = q;
    sendAiQuestion();
    return;
  }
  if (window.pywebview && window.pywebview.api && window.pywebview.api.get_ai_status) {
    window.pywebview.api.get_ai_status().then(st => {
      if (st.configured) {
        document.getElementById('ai-input').value = q;
        sendAiQuestion();
      } else {
        appendAiMessage('user', q);
        appendAiMessage('assistant', buildInstantLocalAnswer(kind));
      }
    });
  } else {
    appendAiMessage('user', q);
    appendAiMessage('assistant', buildInstantLocalAnswer(kind));
  }
};

window.sendAiQuestion = function() {
  if (aiBusy) return;
  const inputEl = document.getElementById('ai-input');
  const q = inputEl.value.trim();
  if (!q) return;
  inputEl.value = '';
  appendAiMessage('user', q);

  if (!(window.pywebview && window.pywebview.api && window.pywebview.api.ask_ai_coach)) {
    appendAiMessage('assistant', buildInstantLocalAnswer('chord'));
    return;
  }

  aiBusy = true;
  document.getElementById('btn-ai-send').textContent = '...';
  const ctx = getStudioContextSnapshot();

  window.pywebview.api.ask_ai_coach(q, ctx, aiChatHistory).then(res => {
    aiBusy = false;
    document.getElementById('btn-ai-send').textContent = 'Send';
    if (res && res.needs_key) {
      document.getElementById('ai-settings-box').classList.add('open');
      appendAiMessage('assistant', res.answer + '\n\n---\n' + buildInstantLocalAnswer('chord'));
    } else {
      const reply = (res && res.answer) ? res.answer : 'No response received.';
      appendAiMessage('assistant', reply);
      if (res && res.ok) {
        aiChatHistory.push({ role: 'user', text: q });
        aiChatHistory.push({ role: 'assistant', text: reply });
      }
    }
  }).catch(err => {
    aiBusy = false;
    document.getElementById('btn-ai-send').textContent = 'Send';
    appendAiMessage('assistant', `Error: ${err}`);
  });
};

document.getElementById('ai-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendAiQuestion();
  }
});

// --- Guitarist Hands-Free Keyboard Shortcuts ---
window.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') {
    document.getElementById('roadmap-backdrop').classList.remove('open');
    document.getElementById('ai-drawer').classList.remove('open');
    return;
  }

  const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
  if (tag === 'textarea' || tag === 'select' || (tag === 'input' && e.target.type !== 'checkbox' && e.target.type !== 'range')) {
    return;
  }

  if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
  else if (e.code === 'KeyJ') { e.preventDefault(); toggleAutoJudge(); }
  else if (e.code === 'KeyR') { e.preventDefault(); toggleRoadmapModal(); }
  else if (e.code === 'KeyA') { e.preventDefault(); toggleAiDrawer(); }
  else if (e.code === 'KeyM') { e.preventDefault(); toggleMetroOnly(); }
  else if (e.code === 'KeyC') { e.preventDefault(); setPracticeLoopMode(practiceLoopMode === 'circle' ? 'single' : 'circle'); }
  else if (e.code === 'KeyN') { e.preventDefault(); skipToNextKey(); }
  else if (e.code === 'Enter') { e.preventDefault(); markCleanRep(); }
  else if (e.code === 'Backspace') { e.preventDefault(); markStumble(); }
  else if (e.code === 'ArrowUp') { e.preventDefault(); adjustBpm(5); }
  else if (e.code === 'ArrowDown') { e.preventDefault(); adjustBpm(-5); }
  else if (e.code === 'KeyT') { e.preventDefault(); toggleTimer(); }
  else if (e.code === 'KeyZ') { e.preventDefault(); toggleBoxZoom(); }
  else if (e.code === 'Digit1') { selectBlock('b1'); }
  else if (e.code === 'Digit2') { selectBlock('b2'); }
  else if (e.code === 'Digit3') { selectBlock('b3'); }
  else if (e.code === 'Digit4') { selectBlock('b4'); }
  else if (e.code === 'F11') { e.preventDefault(); requestAppFullscreen(); }
});

// --- Boot & Hydrate State ---
function applyHydratedState(data) {
  if (!data || typeof data !== 'object') return;
  appStateCache = data;
  if (data.perBlockModule && typeof data.perBlockModule === 'object') {
    perBlockModule = { ...perBlockModule, ...data.perBlockModule };
  }
  if (data.lastBlockId && ['b1', 'b2', 'b3', 'b4'].includes(data.lastBlockId)) {
    activeBlockId = data.lastBlockId;
  }
  if (perBlockModule[activeBlockId] && ['m1', 'm2', 'm3', 'm4'].includes(perBlockModule[activeBlockId])) {
    activeModuleId = perBlockModule[activeBlockId];
  } else if (['m1', 'm2', 'm3', 'm4'].includes(data.activeModuleId)) {
    activeModuleId = data.activeModuleId;
  }
  // Auto-advance Blok 1 default pointer to Akor 1.2 (Saf Drop-2) if Akor 1.1 is already graduated and user hasn't picked a perBlockModule yet!
  if (!data.perBlockModule && getBlockProgress('b1', 'm1').graduated) {
    perBlockModule.b1 = 'm2';
    if (activeBlockId === 'b1') activeModuleId = 'm2';
  }
  if (data.lastKeyId && KEYS.some(k => k.id === data.lastKeyId)) {
    currentKeyId = data.lastKeyId;
  }
  if (data.posMode === 'zone' || data.posMode === 'slide') {
    posMode = data.posMode;
    document.getElementById('select-pos-mode').value = posMode;
  }
  if (data.practiceLoopMode === 'circle' || data.practiceLoopMode === 'single') {
    practiceLoopMode = data.practiceLoopMode;
  }
  if (['fourths', 'fifths', 'random'].includes(data.circleOrderMode)) {
    circleOrderMode = data.circleOrderMode;
    document.getElementById('select-circle-order').value = circleOrderMode;
  }
  if (data.circleUnitMode === 'minutes' || data.circleUnitMode === 'chorus') {
    circleUnitMode = data.circleUnitMode;
  }
  if (typeof data.circleChorusesPerKey === 'number') circleChorusesPerKey = data.circleChorusesPerKey;
  if (typeof data.circleMinutesPerKey === 'number') circleMinutesPerKey = data.circleMinutesPerKey;
  if (typeof data.circleBreathBar === 'boolean') {
    circleBreathBar = data.circleBreathBar;
    document.getElementById('chk-circle-breath').checked = circleBreathBar;
  }
  if (['plus5', 'loop', 'stop'].includes(data.circleEndAction)) {
    circleEndAction = data.circleEndAction;
    document.getElementById('select-circle-end').value = circleEndAction;
  }
  if (data.b1RhythmMode === 'four' || data.b1RhythmMode === 'charleston') {
    b1RhythmMode = data.b1RhythmMode;
    document.getElementById('btn-rhythm-four').classList.toggle('active', b1RhythmMode === 'four');
    document.getElementById('btn-rhythm-charleston').classList.toggle('active', b1RhythmMode === 'charleston');
  }
  if (typeof data.metroVol === 'number') {
    metroVol = data.metroVol;
    const mvEl = document.getElementById('slider-metro-vol');
    if (mvEl) mvEl.value = Math.round(metroVol * 100);
  }
  if (data.autoJudgeDeviceIdx !== undefined && data.autoJudgeDeviceIdx !== null) {
    autoJudgeDeviceIdx = Number(data.autoJudgeDeviceIdx);
  }
  if (['sum', 'ch1', 'ch2'].includes(data.autoJudgeChannel)) {
    autoJudgeChannel = data.autoJudgeChannel;
  }
  if ([80, 85, 90].includes(Number(data.autoJudgeThreshold))) {
    autoJudgeThreshold = Number(data.autoJudgeThreshold);
  }
  if (typeof data.autoJudgeLatencyMs === 'number') {
    autoJudgeLatencyMs = data.autoJudgeLatencyMs;
  }
  if (typeof data.autoJudgeHoldKey === 'boolean') {
    autoJudgeHoldKey = data.autoJudgeHoldKey;
  }
  if (typeof data.autoJudgeMuteLead === 'boolean') {
    autoJudgeMuteLead = data.autoJudgeMuteLead;
  }
  renderJudgeBarUI();
  if (data.uiScalePx) setUiScale(Number(data.uiScalePx));
  if (data.zoomBoxOnly) {
    zoomBoxOnly = true;
    document.getElementById('btn-box-zoom').classList.add('active');
    document.getElementById('fretboard-section').classList.add('zoom-box-mode');
  }

  renderTopDrillSelect();

  const b = getBlockObj();
  const prog = getBlockProgress(activeBlockId);
  bpm = prog.bpm || b.startBpm;
  schedBpm = bpm;
  cleanReps = prog.reps || 0;
  leadEnabled = b.defaultLead;
  compEnabled = b.defaultComp;
  document.getElementById('chk-lead').checked = leadEnabled;
  document.getElementById('chk-comp').checked = compEnabled;

  rebuildUiCirclePreview();
  resetTimer();
  buildBlockEvents();
  renderAll();
  updateAiContextBar();
}

rebuildUiCirclePreview();
applyHydratedState(loadLocalStore());
buildBlockEvents();
renderAll();

window.addEventListener('pywebviewready', () => {
  if (window.pywebview && window.pywebview.api && window.pywebview.api.load_state) {
    window.pywebview.api.load_state().then(diskData => {
      if (diskData && Object.keys(diskData).length > 0) {
        applyHydratedState(diskData);
      }
      populateAudioInputs();
      syncJudgeParamsToBackend();
      refreshAiStatusBadge();
    }).catch(() => {});
  }
});
