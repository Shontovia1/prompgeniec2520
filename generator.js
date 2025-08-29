const templates = {
  "Fantasy Hero": {
    subject: "warrior hero",
    ethnicity: "elven",
    hairstyle: "braided long hair",
    clothing: "enchanted armor",
    accessories: "glowing amulet",
    lighting: "moody rimlight",
    camera: "dramatic upward angle",
    mood: "epic and powerful",
    background: "misty battlefield"
  },
  "Editorial Fashion": {
    subject: "fashion model",
    ethnicity: "Latina",
    hairstyle: "voluminous curls",
    clothing: "designer gown",
    accessories: "rhinestone earrings",
    lighting: "golden hour softbox",
    camera: "front-facing studio shot",
    mood: "luxurious and confident",
    background: "minimalist dark set"
  }
};

let storyboardShots = [];

function generatePrompt(templateName) {
  const t = templates[templateName];
  if (!t) return;

  const prompt = `A ${t.ethnicity} ${t.subject} with ${t.hairstyle}, wearing ${t.clothing}, accessorized with ${t.accessories}, in a ${t.background}, lit by ${t.lighting}, captured with ${t.camera}, evoking ${t.mood}.`;

  const shot = {
    id: "S" + (storyboardShots.length + 1),
    start: storyboardShots.length * 3.2,
    end: (storyboardShots.length + 1) * 3.2,
    prompt: prompt,
    negativePrompt: "",
    camera: {
      lens: "35mm",
      fov: 60,
      movement: "slow dolly-in",
      stabilization: "steady",
      focus: "face",
      aperture: 2.8
    },
    composition: {
      framing: "medium close-up",
      subject: `${t.ethnicity} ${t.subject}`,
      lookDirection: "camera-left",
      ruleOfThirds: true
    },
    lighting: {
      setup: t.lighting,
      key: "soft warm",
      fill: "subtle",
      rim: "gentle",
      colorTemp: 5600
    },
    environment: {
      location: t.background,
      weather: "neutral",
      props: []
    },
    action: {
      beats: ["pose shift", "expression change", "breathing motion"]
    },
    artDirection: {
      colorGrade: "amber-teal cinematic",
      texture: "fine film grain",
      references: ["cinematic portrait", "editorial lighting"]
    },
    audio: {
      fx: ["ambient atmosphere"],
      musicCue: "subtle underscore"
    },
    transitionOut: {
      type: "match cut",
      toShot: "S" + (storyboardShots.length + 2),
      duration: 0.32
    }
  };

  storyboardShots.push(shot);
  document.getElementById("jsonOutput").value = prompt;
  alert("✨ Prompt generated!");
}

function exportStoryboardPrompts() {
  const lines = storyboardShots.map(s => `🎬 ${s.id}: ${s.prompt}`);
  document.getElementById("jsonOutput").value = lines.join("\\n\\n");
}

function exportStoryboardJSON() {
  const json = {
    version: "1.0",
    engine: "veo-3-flow",
    fps: 24,
    durationSec: storyboardShots.length * 3.2,
    resolution: "1920x1080",
    stylePreset: "cinematic-natural",
    seed: null,
    shots: storyboardShots
  };
  document.getElementById("jsonOutput").value = JSON.stringify(json, null, 2);
}
