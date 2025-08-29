// Templates (use/extend these as needed)
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
const SHOT_DURATION = 3.2;

// Populate template select on load
document.addEventListener("DOMContentLoaded", () => {
  const sel = document.getElementById("templateSelect");
  Object.keys(templates).forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    sel.appendChild(opt);
  });

  // Wire up buttons
  document.getElementById("generateBtn").addEventListener("click", () => {
    const templateName = document.getElementById("templateSelect").value;
    generatePrompt(templateName);
  });
  document.getElementById("exportPromptsBtn").addEventListener("click", exportStoryboardPrompts);
  document.getElementById("exportJSONBtn").addEventListener("click", exportStoryboardJSON);
  document.getElementById("clearShotsBtn").addEventListener("click", () => {
    if (!confirm("Clear all shots?")) return;
    storyboardShots = [];
    renderShots();
    document.getElementById("jsonOutput").value = "";
  });

  renderShots();
});

// Generate a single shot from templateName and push to storyboardShots
function generatePrompt(templateName) {
  const t = templates[templateName];
  if (!t) {
    alert("Template not found.");
    return;
  }

  const prompt = `A ${t.ethnicity} ${t.subject} with ${t.hairstyle}, wearing ${t.clothing}, accessorized with ${t.accessories}, in a ${t.background}, lit by ${t.lighting}, captured with ${t.camera}, evoking ${t.mood}.`;

  const shotIndex = storyboardShots.length; // zero-based
  const shot = {
    id: "S" + (shotIndex + 1),
    start: shotIndex * SHOT_DURATION,
    end: (shotIndex + 1) * SHOT_DURATION,
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
      // Keep a placeholder to the next shot id (S<n+2>). If there is no next shot yet,
      // this will refer to a future shot once created.
      toShot: "S" + (shotIndex + 2),
      duration: 0.32
    }
  };

  storyboardShots.push(shot);
  renderShots();

  // Put the generated prompt in the output area and notify user
  document.getElementById("jsonOutput").value = prompt;
  alert("✨ Prompt generated!");
}

// Render the current shots list in the page
function renderShots() {
  const container = document.getElementById("shotsList");
  container.innerHTML = "";
  if (storyboardShots.length === 0) {
    container.textContent = "No shots yet. Click 'Generate Shot' to add one.";
    return;
  }
  storyboardShots.forEach(s => {
    const div = document.createElement("div");
    div.className = "shot-item";
    div.innerHTML = `<strong>${s.id}</strong> — ${s.start.toFixed(2)}s to ${s.end.toFixed(2)}s<br><em>${s.prompt}</em>`;
    container.appendChild(div);
  });
}

// Export prompts as readable text lines (one shot per block)
function exportStoryboardPrompts() {
  if (storyboardShots.length === 0) {
    alert("No shots to export.");
    return;
  }
  const lines = storyboardShots.map(s => `🎬 ${s.id}: ${s.prompt}`);
  document.getElementById("jsonOutput").value = lines.join("\n\n");
  // Optionally copy to clipboard
  try {
    navigator.clipboard.writeText(lines.join("\n\n"));
  } catch (e) {
    // ignore silently if clipboard not allowed
  }
  alert("Prompts exported to the output box (and copied to clipboard if allowed).");
}

// Export the whole storyboard as JSON
function exportStoryboardJSON() {
  const json = {
    version: "1.0",
    engine: "veo-3-flow",
    fps: 24,
    durationSec: storyboardShots.length * SHOT_DURATION,
    resolution: "1920x1080",
    stylePreset: "cinematic-natural",
    seed: null,
    shots: storyboardShots
  };
  document.getElementById("jsonOutput").value = JSON.stringify(json, null, 2);
  // copy to clipboard where possible
  try {
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
  } catch (e) {}
  alert("JSON exported to the output box.");
}
