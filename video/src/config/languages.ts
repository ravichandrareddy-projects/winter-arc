export type Language = "en" | "hi" | "te";

export interface CinematicScriptLine {
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
  spokenText: string;
  onScreenText?: string;
}

export interface LanguageConfig {
  code: Language;
  name: string;
  audioFile: string;
  voiceCharacter: string;
  voiceStyle: string;
  pacing: string;
  energy: string;
  delivery: string;
  fullSpokenScript: string;
  scripts: CinematicScriptLine[];
}

export const LANGUAGES: Record<Language, LanguageConfig> = {
  en: {
    code: "en",
    name: "English",
    audioFile: "audio/voice-en.wav",
    voiceCharacter:
      "Young Indian male, 20–28 age impression. Warm, calm, naturally deep, grounded, educated urban Indian accent (clean global tone). Not an announcer, not a guru, not robotic.",
    voiceStyle: "Cinematic, intimate, natural, confident, contemplative.",
    pacing:
      "Measured and deliberate (approx 120 words per minute). Let thoughts land. Allow natural breaths between lines.",
    energy: "Grounded quiet confidence. Understated strength without hyping or selling.",
    delivery:
      "Speak as if narrating a cinematic documentary or reflecting honestly with an old friend. Effortless, unhurried, sincere.",
    fullSpokenScript:
      "Winter is a quiet season. A time to step back, choose what truly matters, and build. Whether it's your sleep, your fitness, your nutrition, or your focus... the challenge is personal. Every day, you log the small actions. And slowly, the numbers stop being just data. They become a pattern. A quiet proof that consistency compounds. Winter Arc makes that progress visible. Log. See. Understand. Improve. Start your Winter Arc.",
    scripts: [
      {
        startSec: 0,
        endSec: 5.0,
        startFrame: 0,
        endFrame: 150,
        spokenText: "",
        onScreenText: "WINTER ARC • THE CHALLENGE BEGINS",
      },
      {
        startSec: 5.0,
        endSec: 10.0,
        startFrame: 150,
        endFrame: 300,
        spokenText: "Winter is a quiet season. A time to step back, choose what truly matters, and build.",
        onScreenText: "A SEASON TO STEP BACK AND BUILD",
      },
      {
        startSec: 10.0,
        endSec: 15.0,
        startFrame: 300,
        endFrame: 450,
        spokenText: "Whether it's your sleep, your fitness, your nutrition, or your focus... the challenge is personal.",
        onScreenText: "SLEEP • FITNESS • FOOD • STUDY • HABITS",
      },
      {
        startSec: 15.0,
        endSec: 20.0,
        startFrame: 450,
        endFrame: 600,
        spokenText: "Every day, you log the small actions.",
        onScreenText: "WINTER ARC • PERSONAL PROGRESS TRACKER",
      },
      {
        startSec: 20.0,
        endSec: 25.0,
        startFrame: 600,
        endFrame: 750,
        spokenText: "And slowly, the numbers stop being just data.",
        onScreenText: "STEPS • PROTEIN • SLEEP • FOCUS",
      },
      {
        startSec: 25.0,
        endSec: 30.0,
        startFrame: 750,
        endFrame: 900,
        spokenText: "They become a pattern. A quiet proof that consistency compounds.",
        onScreenText: "THE PATTERN EMERGES",
      },
      {
        startSec: 30.0,
        endSec: 34.5,
        startFrame: 900,
        endFrame: 1035,
        spokenText: "Log. See. Understand. Improve.",
        onScreenText: "LOG → SEE → UNDERSTAND → IMPROVE",
      },
      {
        startSec: 34.5,
        endSec: 39.0,
        startFrame: 1035,
        endFrame: 1170,
        spokenText: "Winter Arc makes that progress visible. Start your Winter Arc.",
        onScreenText: "YOUR ARC. YOUR DATA. YOUR PROGRESS.",
      },
    ],
  },

  hi: {
    code: "hi",
    name: "Hindi",
    audioFile: "audio/voice-hi.wav",
    voiceCharacter:
      "Young Indian male, 20–28 age impression. Contemporary spoken Hindi (natural urban cadence), warm, thoughtful, mature, confident.",
    voiceStyle: "Shaant, gehra, cinematic, organic, bilkul natural.",
    pacing:
      "Sehaj aur thehra hua. Har baat ko saaf aur aaram se bolna hai.",
    energy: "Quiet confidence. Koi show-off ya drama nahi.",
    delivery:
      "Ek sachi aur ahem baat kehte hue jaise koi apne mann ki baat bata raha ho.",
    fullSpokenScript:
      "Winter ek shaant season hai. Ek waqt, thoda theherne ka, zaroori cheezon ko chunne ka, aur banane ka. Chahe aapki sleep ho, fitness, nutrition, ya aapka focus... yeh challenge bilkul personal hai. Har roz, aap chhote-chhote steps log karte hain. Aur dheere-dheere, yeh sirf numbers nahi rehte. Yeh ek pattern ban jaate hain. Ek saboot, ki consistency sach mein badlav laati hai. Winter Arc aapki progress ko visible banata hai. Log. See. Understand. Improve. Start your Winter Arc.",
    scripts: [
      {
        startSec: 0,
        endSec: 5.0,
        startFrame: 0,
        endFrame: 150,
        spokenText: "",
        onScreenText: "WINTER ARC • THE CHALLENGE BEGINS",
      },
      {
        startSec: 5.0,
        endSec: 10.0,
        startFrame: 150,
        endFrame: 300,
        spokenText: "Winter ek shaant season hai. Ek waqt, thoda theherne ka, zaroori cheezon ko chunne ka, aur banane ka.",
        onScreenText: "A SEASON TO STEP BACK AND BUILD",
      },
      {
        startSec: 10.0,
        endSec: 15.0,
        startFrame: 300,
        endFrame: 450,
        spokenText: "Chahe aapki sleep ho, fitness, nutrition, ya aapka focus... yeh challenge bilkul personal hai.",
        onScreenText: "SLEEP • FITNESS • FOOD • STUDY • HABITS",
      },
      {
        startSec: 15.0,
        endSec: 20.0,
        startFrame: 450,
        endFrame: 600,
        spokenText: "Har roz, aap chhote-chhote steps log karte hain.",
        onScreenText: "WINTER ARC • PERSONAL PROGRESS TRACKER",
      },
      {
        startSec: 20.0,
        endSec: 25.0,
        startFrame: 600,
        endFrame: 750,
        spokenText: "Aur dheere-dheere, yeh sirf numbers nahi rehte.",
        onScreenText: "STEPS • PROTEIN • SLEEP • FOCUS",
      },
      {
        startSec: 25.0,
        endSec: 30.0,
        startFrame: 750,
        endFrame: 900,
        spokenText: "Yeh ek pattern ban jaate hain. Ek saboot, ki consistency sach mein badlav laati hai.",
        onScreenText: "THE PATTERN EMERGES",
      },
      {
        startSec: 30.0,
        endSec: 34.5,
        startFrame: 900,
        endFrame: 1035,
        spokenText: "Log. See. Understand. Improve.",
        onScreenText: "LOG → SEE → UNDERSTAND → IMPROVE",
      },
      {
        startSec: 34.5,
        endSec: 39.0,
        startFrame: 1035,
        endFrame: 1170,
        spokenText: "Winter Arc aapki progress ko visible banata hai. Start your Winter Arc.",
        onScreenText: "YOUR ARC. YOUR DATA. YOUR PROGRESS.",
      },
    ],
  },

  te: {
    code: "te",
    name: "Telugu",
    audioFile: "audio/voice-te.wav",
    voiceCharacter:
      "Young Indian male, 20–28 age impression. Natural contemporary Telugu, warm, calm, confident, contemplative, respectful.",
    voiceStyle: "Prashaanthamaina, intimate, cinematic, genuine.",
    pacing:
      "Aalochinchi, spastamga, natural ga maatlade cadence. No rushing.",
    energy: "Quiet confidence. Sincere invitation.",
    delivery:
      "Spastamaina uccharana, conversational feel, realistic voiceover.",
    fullSpokenScript:
      "Winter chaala prashaanthamaina season. Konchem aagi, mana life lo emi mukhyamo choose chesukoni, build chesukune samayam. Mee sleep ayina, fitness, nutrition, leda mee focus ayina... ee challenge meeku chaala personal. Prathi roju, meeru chese chinna actions ni log chesthaaru. Dheenthone, a numbers simple data ga migilipovvu. Oka pattern la maarathaayi. Consistency nijamga compound avuthundani cheppe oka saakshyam. Winter Arc mee progress ni spastamga kanipinchela chesthundhi. Log. See. Understand. Improve. Start your Winter Arc.",
    scripts: [
      {
        startSec: 0,
        endSec: 5.0,
        startFrame: 0,
        endFrame: 150,
        spokenText: "",
        onScreenText: "WINTER ARC • THE CHALLENGE BEGINS",
      },
      {
        startSec: 5.0,
        endSec: 10.0,
        startFrame: 150,
        endFrame: 300,
        spokenText: "Winter chaala prashaanthamaina season. Konchem aagi, mana life lo emi mukhyamo choose chesukoni, build chesukune samayam.",
        onScreenText: "A SEASON TO STEP BACK AND BUILD",
      },
      {
        startSec: 10.0,
        endSec: 15.0,
        startFrame: 300,
        endFrame: 450,
        spokenText: "Mee sleep ayina, fitness, nutrition, leda mee focus ayina... ee challenge meeku chaala personal.",
        onScreenText: "SLEEP • FITNESS • FOOD • STUDY • HABITS",
      },
      {
        startSec: 15.0,
        endSec: 20.0,
        startFrame: 450,
        endFrame: 600,
        spokenText: "Prathi roju, meeru chese chinna actions ni log chesthaaru.",
        onScreenText: "WINTER ARC • PERSONAL PROGRESS TRACKER",
      },
      {
        startSec: 20.0,
        endSec: 25.0,
        startFrame: 600,
        endFrame: 750,
        spokenText: "Dheenthone, a numbers simple data ga migilipovvu.",
        onScreenText: "STEPS • PROTEIN • SLEEP • FOCUS",
      },
      {
        startSec: 25.0,
        endSec: 30.0,
        startFrame: 750,
        endFrame: 900,
        spokenText: "Oka pattern la maarathaayi. Consistency nijamga compound avuthundani cheppe oka saakshyam.",
        onScreenText: "THE PATTERN EMERGES",
      },
      {
        startSec: 30.0,
        endSec: 34.5,
        startFrame: 900,
        endFrame: 1035,
        spokenText: "Log. See. Understand. Improve.",
        onScreenText: "LOG → SEE → UNDERSTAND → IMPROVE",
      },
      {
        startSec: 34.5,
        endSec: 39.0,
        startFrame: 1035,
        endFrame: 1170,
        spokenText: "Winter Arc mee progress ni spastamga kanipinchela chesthundhi. Start your Winter Arc.",
        onScreenText: "YOUR ARC. YOUR DATA. YOUR PROGRESS.",
      },
    ],
  },
};
