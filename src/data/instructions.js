// How-to cues for every stretch and gym movement, keyed by exact display name.
// Movements that appear in more than one list share a single definition.

const hipFlexorKneeling = {
  steps: [
    'Kneel on one knee with the other foot flat in front, both knees ~90°.',
    'Tuck your tailbone under and squeeze the glute on the kneeling side.',
    'Shift your hips forward until you feel a stretch across the front of the hip.',
    'Stay tall — don’t arch the lower back. Hold, then switch sides.',
  ],
  tip: 'Reach the same-side arm overhead and lean slightly away to deepen it.',
}

const quadStanding = {
  steps: [
    'Stand tall, holding a wall or rack for balance.',
    'Bend one knee and grab that ankle behind you.',
    'Draw the heel toward your glute with knees staying together.',
    'Push the hip forward, knee pointing down. Hold, then switch.',
  ],
  tip: 'Brace your core so you feel the quad, not your lower back.',
}

const piriformisFigure4 = {
  steps: [
    'Lie on your back with both knees bent.',
    'Cross one ankle over the opposite thigh to make a figure "4".',
    'Thread your hands behind the bottom thigh and pull it toward your chest.',
    'Keep the crossed knee pressing open. Hold, then switch.',
  ],
  tip: 'Tight hips? Do it seated — cross ankle on knee and hinge forward.',
}

const calfWall = {
  steps: [
    'Face a wall, hands on it at chest height.',
    'Step one foot back with the heel pressed flat to the floor.',
    'Keep the back leg straight and lean into the wall.',
    'Hold, then bend the back knee slightly to reach the lower calf. Switch.',
  ],
}

const INSTRUCTIONS = {
  // ── Morning / mobility ──
  'McKenzie Press-Up': {
    steps: [
      'Lie face down, hands flat under your shoulders.',
      'Press your upper body up, keeping hips and pelvis on the floor.',
      'Let your lower back relax into the extension — arms do the work.',
      'Lower under control. That’s one rep.',
    ],
    tip: 'Move slowly; never force into sharp pain. Mild stretch only.',
  },
  'Cat-Cow': {
    steps: [
      'Start on all fours, wrists under shoulders, knees under hips.',
      'Inhale: drop the belly, lift chest and tailbone (Cow).',
      'Exhale: round the spine, tuck chin and tailbone (Cat).',
      'Flow smoothly with your breath for the prescribed reps.',
    ],
  },
  'Sphinx Hold': {
    steps: [
      'Lie face down, forearms on the floor, elbows under shoulders.',
      'Press forearms down and lift your chest into a gentle arch.',
      'Relax glutes and lower back; breathe into the position.',
      'Hold for the prescribed time.',
    ],
  },
  'Kneeling Hip Flexor Stretch': hipFlexorKneeling,
  'Hip Flexor Kneeling Stretch': hipFlexorKneeling,
  'Standing Quad Stretch': quadStanding,
  'Quad Standing Stretch': quadStanding,
  'Piriformis Figure-4 Stretch': piriformisFigure4,
  'Piriformis Figure-4': piriformisFigure4,
  'Thoracic Rotation Seated': {
    steps: [
      'Sit tall, hands behind your head, elbows wide.',
      'Keep hips and pelvis facing forward and still.',
      'Rotate your upper back to one side, leading with the elbow.',
      'Return to center and rotate the other way. Alternate for the reps.',
    ],
    tip: 'The turn comes from the mid-back, not your neck or low back.',
  },
  'Thread the Needle': {
    steps: [
      'Start on all fours.',
      'Slide one arm, palm up, underneath your body and across.',
      'Let that shoulder and the side of your head rest toward the floor.',
      'Feel the stretch between the shoulder blades. Hold, then switch.',
    ],
  },
  'Calf Stretch Against Wall': calfWall,
  'Plantar Fascia Roll': {
    steps: [
      'Sit or stand and place a ball (or bottle) under the arch of one foot.',
      'Apply gentle downward pressure.',
      'Roll slowly from heel to toes, pausing on tender spots.',
      'Continue for the prescribed time, then switch feet.',
    ],
  },

  // ── Night / wind-down ──
  "Child's Pose Modified": {
    steps: [
      'Kneel and sit back toward your heels, knees apart.',
      'Walk your hands forward and lower your chest toward the floor.',
      'Rest your forehead down and let your shoulders relax.',
      'Breathe slowly and hold.',
    ],
    tip: 'Widen the knees for more hip and lower-back release.',
  },
  'Supine Spinal Twist': {
    steps: [
      'Lie on your back, arms out in a T.',
      'Hug one knee in, then guide it across your body to the floor.',
      'Keep both shoulders down; turn your head the opposite way.',
      'Hold and breathe, then switch sides.',
    ],
  },
  'Legs Up the Wall': {
    steps: [
      'Sit sideways against a wall, then swing your legs up it as you lie back.',
      'Scoot your hips close so legs rest vertically.',
      'Let your arms fall open and relax completely.',
      'Stay for the prescribed time, breathing slowly.',
    ],
    tip: 'Great for recovery and calming the nervous system before sleep.',
  },
  'Supine Hamstring Stretch': {
    steps: [
      'Lie on your back, one knee bent, foot flat.',
      'Raise the other leg straight up, looping a strap or hands behind the thigh.',
      'Gently draw the leg toward you, keeping it fairly straight.',
      'Hold, then switch sides.',
    ],
    tip: 'A small bend in the knee is fine — keep the stretch in the muscle belly.',
  },
  'Box Breath': {
    steps: [
      'Inhale through your nose for a 4-count.',
      'Hold your breath for 4.',
      'Exhale slowly for 4.',
      'Hold empty for 4. That’s one round — repeat as prescribed.',
    ],
  },
  'Full Body Scan Savasana': {
    steps: [
      'Lie flat on your back, arms by your sides, palms up.',
      'Close your eyes and take a few slow breaths.',
      'Move attention slowly from your toes up to your head.',
      'Release tension from each area as you pass through it.',
    ],
  },
  'Shoulder Cross-Body Stretch': {
    steps: [
      'Bring one arm straight across your chest.',
      'Use the other hand to draw it in at the upper arm (not the elbow joint).',
      'Keep the shoulder down, away from your ear.',
      'Hold, then switch arms.',
    ],
  },
  'Chest Doorway Stretch': {
    steps: [
      'Stand in a doorway, forearm on the frame, elbow ~90°.',
      'Step gently forward with the same-side foot.',
      'Let your chest open until you feel a stretch across the pec.',
      'Hold, then switch sides.',
    ],
  },
  'Lat Hang from Bar': {
    steps: [
      'Grab a pull-up bar with both hands, shoulder-width.',
      'Let your body hang, relaxing your shoulders and lats.',
      'Keep a light grip and breathe into the stretch.',
      'Hold for the prescribed time.',
    ],
    tip: 'Keep feet lightly supported if a full dead-hang is too much.',
  },
  'Bicep Wall Stretch': {
    steps: [
      'Place your palm flat on a wall behind you, arm straight, thumb down.',
      'Slowly rotate your body away from that arm.',
      'Feel the stretch through the biceps and front of the shoulder.',
      'Hold, then switch arms.',
    ],
  },

  // ── Push ──
  'Incline Barbell Press': {
    steps: [
      'Set the bench to ~30°. Lie back, eyes under the bar.',
      'Grip just wider than shoulders; unrack with straight arms.',
      'Lower the bar to your upper chest, elbows ~45° from your body.',
      'Press up and slightly back over your shoulders. Control every rep.',
    ],
    tip: 'Keep shoulder blades pinned back and down throughout.',
  },
  'Flat Dumbbell Press': {
    steps: [
      'Lie flat, a dumbbell in each hand at chest level.',
      'Plant your feet and squeeze your shoulder blades together.',
      'Press the dumbbells up until arms are nearly straight.',
      'Lower under control until you feel a chest stretch.',
    ],
  },
  'Lower Cable Crossover': {
    steps: [
      'Set both pulleys to the bottom. Grab a handle in each hand.',
      'Step forward with a slight forward lean, palms facing up/forward.',
      'Sweep your hands up and together in front of your chest.',
      'Squeeze, then lower with control along the same arc.',
    ],
    tip: 'Keep a soft bend in the elbows; drive with the chest, not the arms.',
  },
  'Dumbbell Shoulder Press': {
    steps: [
      'Sit tall, dumbbells at shoulder height, palms forward.',
      'Brace your core and keep ribs down.',
      'Press the dumbbells overhead until arms are nearly straight.',
      'Lower under control back to shoulder level.',
    ],
  },
  'Lateral Raises': {
    steps: [
      'Stand with a dumbbell in each hand at your sides.',
      'With a slight elbow bend, raise your arms out to the sides.',
      'Stop at shoulder height, leading with the elbows.',
      'Lower slowly. Don’t swing or use momentum.',
    ],
    tip: 'Imagine pouring water from the pinky side at the top.',
  },
  'Rear Delt Cable Fly': {
    steps: [
      'Set pulleys to shoulder height; grab the opposite handle in each hand (cables crossed).',
      'Step back with arms out front, slight elbow bend.',
      'Pull your hands apart and back, squeezing the rear delts.',
      'Return slowly under control.',
    ],
  },
  'Tricep Pushdown': {
    steps: [
      'Face a high pulley with a bar or rope, elbows tucked at your sides.',
      'Keep elbows pinned and push the attachment down.',
      'Fully straighten your arms and squeeze the triceps.',
      'Let it rise back to ~90° under control.',
    ],
    tip: 'Only the forearms move — keep the upper arms still.',
  },
  'Tricep Overhead Extension': {
    steps: [
      'Hold a dumbbell or rope overhead with both hands, elbows up.',
      'Keep your upper arms vertical and close to your head.',
      'Lower the weight behind your head by bending the elbows.',
      'Extend back up and squeeze at the top.',
    ],
  },

  // ── Pull ──
  'Lat Pulldown': {
    steps: [
      'Grip the bar wider than shoulders; secure your thighs under the pad.',
      'Lean back slightly and pull the bar to your upper chest.',
      'Drive your elbows down and back, squeezing the lats.',
      'Return the bar up with control, full stretch at the top.',
    ],
    tip: 'Lead with the elbows, not the hands — avoid yanking with the arms.',
  },
  'T-Bar Supported Row': {
    steps: [
      'Set your chest against the pad, feet planted.',
      'Grip the handles and let your arms hang fully.',
      'Row by driving elbows back, squeezing the shoulder blades.',
      'Lower under control to a full stretch.',
    ],
  },
  'Chest Supported Row': {
    steps: [
      'Lie chest-down on an incline bench, a dumbbell in each hand.',
      'Let your arms hang straight down.',
      'Row both dumbbells up, pulling elbows toward the ceiling.',
      'Squeeze the upper back, then lower slowly.',
    ],
    tip: 'Chest stays on the pad — no jerking or body english.',
  },
  'Reverse Pec Dec': {
    steps: [
      'Sit facing the pec-deck pad, chest against it, and grab the handles with arms out in front.',
      'Set the handles to about shoulder height; keep a slight bend in the elbows.',
      'Squeeze your shoulder blades and sweep the handles out and back in a wide arc.',
      'Pause at the back, then return slowly under control.',
    ],
    tip: 'Lead with the elbows and keep the work in the rear delts — don’t shrug.',
  },
  'Zigzag Bar Close Grip Curls': {
    steps: [
      'Hold the EZ (zigzag) bar on the inner grips, palms up.',
      'Keep elbows pinned at your sides.',
      'Curl the bar up by contracting the biceps.',
      'Lower slowly to a full stretch.',
    ],
  },
  'Dumbbell Curls': {
    steps: [
      'Stand with a dumbbell in each hand, palms facing forward.',
      'Keep elbows tucked and still.',
      'Curl one or both dumbbells up, squeezing the biceps.',
      'Lower under control. No swinging.',
    ],
  },
  'Preacher Curls': {
    steps: [
      'Set your upper arms flat on the preacher pad.',
      'Hold the bar/dumbbell with palms up, arms extended.',
      'Curl up, keeping the back of your arms on the pad.',
      'Lower slowly — don’t fully slam into the bottom.',
    ],
    tip: 'Stop just short of full lockout to keep tension on the biceps.',
  },

  // ── Legs ──
  'Leg Extensions': {
    steps: [
      'Sit with your shins behind the pad, knees at the seat’s pivot.',
      'Hold the handles and keep your back against the pad.',
      'Straighten your knees to lift the pad up.',
      'Squeeze the quads, then lower under control.',
    ],
  },
  'Forward Lunges': {
    steps: [
      'Stand tall, optionally holding dumbbells.',
      'Step forward and lower until both knees are ~90°.',
      'Keep the front knee over your ankle, torso upright.',
      'Push through the front heel to return. Alternate legs.',
    ],
  },
  'Hamstring Curls': {
    steps: [
      'Set up on the leg-curl machine, pad just above your heels.',
      'Keep hips down on the bench.',
      'Curl your heels toward your glutes.',
      'Squeeze the hamstrings, then lower slowly.',
    ],
  },
  'Calf Raises': {
    steps: [
      'Stand with the balls of your feet on a step or platform.',
      'Let your heels drop below the step for a full stretch.',
      'Press up onto your toes as high as possible.',
      'Pause at the top, then lower slowly.',
    ],
    tip: 'Full range matters more than heavy weight here.',
  },
  'Lower Back Extensions': {
    steps: [
      'Set up on the hyperextension bench, hips on the pad.',
      'Cross your arms and keep a neutral spine.',
      'Hinge down at the hips with control.',
      'Raise back up only to a straight line — do not over-arch.',
    ],
    tip: 'Rehab movement: light, slow, no added plates. Stop at any sharp pain.',
  },
  'Abs Machine': {
    steps: [
      'Sit in the ab machine, grab the handles or pad.',
      'Set a weight you can control.',
      'Crunch by contracting the abs, curling your ribs toward your hips.',
      'Return slowly — don’t let the weight pull you back.',
    ],
  },
}

export function getInstructions(name) {
  return INSTRUCTIONS[name] || null
}
