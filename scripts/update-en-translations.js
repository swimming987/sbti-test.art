const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'data');

function loadJSON(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA, name), 'utf8'));
}

function saveJSON(name, obj) {
  fs.writeFileSync(path.join(DATA, name), JSON.stringify(obj, null, 2), 'utf8');
}

const typesEn = {
  CTRL: {
    cn: 'The Controller',
    intro: 'How’s that? Got you handled, right?',
    desc: 'Congratulations, you just landed one of the rarest personalities around. You are a natural-born rebel against chaos. For you, the so-called rules of the world are just default settings, and plans are little more than spontaneous sketches. A CTRL friend is the kind of person who keeps your life on track: precise, efficient, and impossible to ignore. When your life is about to derail, CTRL is the one who hits Ctrl+S, pulls you back, and saves the whole timeline.'
  },
  'ATM-er': {
    cn: 'The Giver',
    intro: 'You really think I’m rich?',
    desc: 'You turned out to be one of the rarest personalities in the world. You may be the great mystery of finance: not necessarily someone who gives money, but someone who is always paying. Time, energy, patience, and peace of mind all get spent. Like an old but sturdy ATM, you absorb other people’s anxiety and problems and return one thing in exchange: “Don’t worry, I’ve got it.” Your life is one long, unglamorous solo payment performance.'
  },
  'Dior-s': {
    cn: 'The Slacker',
    intro: 'Just wait until my loser comeback.',
    desc: 'Congratulations, you are not a loser in the usual sense. You are more like the spiritual heir of Diogenes: a brutal realist who sees through consumerism and success-culture nonsense. Dior-s people do not lack ambition; they have simply seen that the end of “getting ahead” is often just a fancier cage. Their wisdom is simple: lying down is more comfortable than standing, and when it is time to eat, you eat.'
  },
  BOSS: {
    cn: 'The Leader',
    intro: 'Give me the wheel. I’ll drive.',
    desc: 'BOSS is the person who always has the wheel in hand. Even when the tank is flashing red and the navigation system is lying, they still say, “I’ll drive,” and somehow get everyone to the destination. They live by their own physics: an eternal upward-drive law. BOSS sees the world like a player who already beat the game and is now watching the tutorial. Efficiency is their faith, order is their breathing, and self-improvement is basically a form of self-punishment.'
  },
  'THAN-K': {
    cn: 'The Grateful One',
    intro: 'I thank the heavens! I thank the earth!',
    desc: 'You turned out to be one of the rarest personalities in China. You are the kind of person who can thank the heavens for everything. Even if traffic jams your commute, you can still say thank you for the extra time, the music, and the chance to watch the anxious faces outside the window. THAN-K people are warm, generous, and hard to hate. In their world, there are no completely bad people, only friends who have not yet been touched by gratitude.'
  },
  'OH-NO': {
    cn: 'The Alarmist',
    intro: 'Oh no! How did I get this type?!',
    desc: '“Oh no!” is not a scream of fear; it is a form of high-level wisdom. Where ordinary people see a cup on the edge of a table, OH-NO sees a chain reaction ending in disaster. With a single, soul-deep “Oh, no!”, they move the cup to the center and add a coaster. OH-NO has an almost obsessive respect for boundaries: yours is yours, mine is mine. They are the guardians of order, the last properly dressed people in a chaotic world.'
  },
  GOGO: {
    cn: 'The Doer',
    intro: 'Go go go~ let’s move!',
    desc: 'GOGO people live in a world of pure cause and effect. Their life creed is brutally simple: if I close my eyes, it is dark; if I spend all my money, I have no money left; if I stand on the crosswalk, I am a pedestrian. Their logic is perfectly closed-loop, impossible to argue with. While others debate “chicken or egg,” GOGO has already cooked both into a single dish and moved on to the next task.'
  },
  SEXY: {
    cn: 'The Charmer',
    intro: 'You were born to be irresistible!',
    desc: 'When you walk into a room, the lighting system would politely dim itself to avoid wasting energy on your natural charisma. When you smile, the air seems to get warmer, as if moisture itself has turned into heart shapes. SEXY people do not need to force their presence; simply existing already feels like an overly glamorous poem. If enough of them gather for a party, the atmosphere might bend time just a little.'
  },
  'LOVE-R': {
    cn: 'The Lover',
    intro: 'Your love is overflowing; reality feels underfed.',
    desc: 'LOVE-R is like a rare species that somehow survived from ancient myth into the present day. Your emotional processor is not binary; it runs on rainbow logic. A falling leaf is not just “autumn has arrived” to you, but a whole tragedy about rebirth, sacrifice, and silent love. Your inner world is an amusement park that never closes, and you spend your life looking for someone who can read the map and ride the carousel to the end of the universe with you.'
  },
  MUM: {
    cn: 'Mom',
    intro: 'Maybe... can I call you mom...? ',
    desc: 'Congratulations, you are one of the rarest “mom” personalities. Before the world had time, before the first star even burped into existence, Mom was already there. This personality is gentle, emotionally aware, and deeply empathetic. Mom knows when to stop, when to pause, and when to tell herself “fine, let it go.” MUM people often use their warmth to heal others, but the medicine they give themselves is always a smaller dose.'
  },
  FAKE: {
    cn: 'The Pretender',
    intro: 'At last, there are no humans left.',
    desc: 'SCP emergency report: Subject SCP-CN-████, code name FAKE. In social situations, FAKE people are masters of disguise because they switch masks faster than a phone keyboard changes input modes. One second they are your best friend, the next they are the stable, reliable employee when the boss walks in. You think you met someone who truly understands you? Wake up. You just met a high-performance humanoid built for camouflage. When the lights go out, they peel off mask after mask and discover that the masks are what built the self.'
  },
  OJBK: {
    cn: 'The Chill One',
    intro: 'I say “whatever” and I mean it.',
    desc: 'OJBK is not just a personality; it is a ruling philosophy. When ordinary people face a grand dilemma like rice or noodles for lunch, they burn brain cells over it. OJBK people calmly answer, “Either is fine,” as if signing a decree. This is not indecision. It is a declaration that ordinary choices are beneath them. Why argue with insects? Why care which way the dust drifts? The answer is simple: you do not.'
  },
  MALO: {
    cn: 'Monkey',
    intro: 'Life is a level, and I’m just a monkey.',
    desc: 'Friend, you are not just “young at heart” - you never fully evolved. Your soul is still stuck in the era of swinging from trees and getting excited over bananas. The ancestors of human civilization climbed down, learned to walk upright, and wore suits; the ancestor of MALO watched them from a nearby tree, scratched itself, and gave a dismissive “chh.” MALO sees through civilization as the most boring paid game ever made. Rules are there to be broken, ceilings are for hanging from, and conference rooms are for doing backflips in.'
  },
  'JOKE-R': {
    cn: 'The Clown',
    intro: 'Turns out we were all clowns.',
    desc: 'JOKE-R is less of a “person” and more like a clown wearing the joke itself. Peel one layer and you get a joke, peel another and you get a bit, keep going and you find the inside is empty except for a faint echo saying, “Haha, didn’t expect that, did you?” JOKE-R is the designated mood-maker and the only firepower in the room. As long as they are there, the room stays warm. Everyone laughs loudly - especially them - using the biggest laugh to cover the sound of a heart breaking.'
  },
  'WOC!': {
    cn: 'The Shocker',
    intro: 'Holy crap, how am I this type?',
    desc: 'We discovered a strange creature: the WOC! person. They have two entirely separate operating systems: the “surface system,” which reacts with all the usual “whoa,” “damn,” and “what?!” noises, and the “background system,” which calmly concludes: yep, that’s exactly what I expected. WOC! people do not waste time arguing. They know that lecturing an idiot is like trying to push mud up a wall. So they just grab a big blade of wisdom and shout “WOC!” at the universe.'
  },
  'THIN-K': {
    cn: 'The Thinker',
    intro: 'Deep in thought for 100s.',
    desc: 'THIN-K brains are built differently. As the name suggests, your mind spends a lot of time in thought. You judge information carefully, weigh evidence, logic, bias, and even the author’s entire family tree of possible motives. In an age of information overload, you do not follow blindly. You evaluate relationships, calculate tradeoffs, and fiercely guard your personal space. If people think you are spacing out, they are wrong - your brain is simply filing, classifying, and deleting the day’s data.'
  },
  SHIT: {
    cn: 'The Cynic',
    intro: 'This world is a complete mess.',
    desc: 'Congratulations, SHIT is a truly rare personality. “Shit” here is not just a complaint - it is a ritual language. SHIT people live in a paradox: they curse the project while quietly opening Excel to build models and charts; they call coworkers “shit” while staying up all night cleaning up the mess; they declare the world doomed, then get up at 7 a.m. and go to the same terrible commute and the same terrible job. Do not worry - that is not the end of the world. It is the charge signal before they go save it.'
  },
  ZZZZ: {
    cn: 'The Sleepyhead',
    intro: 'I’m not dead. I’m sleeping.',
    desc: 'Congratulations, you have the rarest “playing dead” personality in China. You can ignore 99+ messages in a group chat, but the moment someone says “half an hour left,” you wake up like a thousand-year-old corpse, type “received,” and somehow still submit a passable answer. You do not truly move until the deadline becomes the only command that matters. You have proven one truth to the universe: sometimes doing nothing is the safest way not to do it wrong.'
  },
  POOR: {
    cn: 'The Underdog',
    intro: 'I’m poor, but I’m laser-focused.',
    desc: 'Congratulations, you scored POOR. This kind of “poor” is not about the number in your bank account; it is about reorganized desire and concentrated resources. Other people scatter their energy everywhere; you compress yours into a laser beam, and whatever gets hit starts smoking. POOR people are simple: irrelevant things get muted, important things get pursued all the way. You are not short on resources - you just put them all into one pit, so it looks like poverty when it is really a mine.'
  },
  MONK: {
    cn: 'The Hermit',
    intro: 'I have no worldly desires.',
    desc: 'While others debate love and hate in karaoke rooms, MONK people sit at home contemplating the Dao. They have already seen through the dust of the world and do not want anyone disturbing their cultivation. Their personal space is a boundary, a sacred mountain, an absolute territory. Step inside and you may feel a strange suffocation from the soul. MONK people are not clingy because they believe everything has its own orbit. Planets need distance to make a universe; people are no different.'
  },
  IMSB: {
    cn: 'The Fool',
    intro: 'Seriously? Am I really a fool?',
    desc: 'Congratulations! You are not even in the usual human category. You got the once-in-a-million IMSB type. In your head live two impossible warriors: one shouting “I’m going for it!”, the other screaming “I’m such an idiot!” When you like someone, one side urges you to ask for their number, invite them to eat, and confess boldly, while the other insists they would never like you back. The result: you stare at their back until it disappears, then search “how to overcome social anxiety.” IMSB is not stupid - your inner drama is simply longer than the entire Marvel universe.'
  },
  SOLO: {
    cn: 'The Orphan',
    intro: 'I’m crying - how am I an orphan?',
    desc: 'Congratulations, you got the rare SOLO type. Don’t cry yet - a king’s coronation is usually a solo event. SOLO people often have lower self-worth and may distance themselves first. They build a Great Wall around their soul labeled “Do not touch me.” Each brick is an old wound. Like a hedgehog, they hide every soft spot and face the world with their sharpest spines. Those spines are not attacks; they are unsaid pleas: “Please don’t come closer, I might get hurt,” and “Please don’t leave.”'
  },
  FUCK: {
    cn: 'The Wild One',
    intro: 'Damn, what kind of type is this?',
    desc: 'Congratulations! You are not even in the human category. You got the once-in-a-million FUCK type. In the civilized city of humankind, a human-shaped wild weed appeared - impossible to kill with any herbicide, and impossible to tame. In the FUCK worldview, social rules mean almost nothing. The emotional switch is a physical toggle: FUCK YEAH and FUCK OFF. This type is not just chasing pleasure; it is chasing a life force that charges through the body like a storm. While everyone else gets domesticated, FUCK is the last howl in the wilderness.'
  },
  DEAD: {
    cn: 'The Dead One',
    intro: 'Am I still alive?',
    desc: 'Congratulations, you got one of the rarest personalities in China. The name sounds unlucky, so you can also think of it as “Don’t Expect Any Drives.” DEAD has seen through all the pointless philosophy and has lost interest in everything that is merely “gain or loss.” They look at the world like a top player who has beaten every main quest, side quest, and hidden mission so many times that they finally realize the game itself is the joke. DEAD is the ultimate sage beyond desire and goals.'
  },
  IMFW: {
    cn: 'The Worthless One',
    intro: 'Am I really... worthless?',
    desc: 'Congratulations, you did not get an ordinary personality - you got one of the rarest in the world: IMFW. Their self-esteem is fragile, their sense of safety is low, and they can be indecisive, which makes them remarkably good at detecting the strongest Wi-Fi in the room - the person they trust most. Entering an IMFW life is like stepping into a high-end orchid greenhouse: careful temperature, exact humidity, and daily “I love you” sunlight. Give them a little kindness and they will give you absolute trust in return.'
  },
  HHHH: {
    cn: 'The Giggler',
    intro: 'Hahahahahahaha.',
    desc: 'Congratulations! Your mental wiring is so unusual that the standard personality library has collapsed. When your best normal match falls below 60%, the system forces this fallback type: HHHH, the Giggler. What are its traits? Hahahahahahahahaha - sorry, that is basically the whole trait list. You can look at the fifteen dimensions for a very unscientific analysis, but frankly, this result exists because the author did not account for every possible brain layout. Laughing and crying at the same time is the only reasonable response.'
  },
  DRUNK: {
    cn: 'The Drunkard',
    intro: 'Strong liquor burns the throat; drunkenness is unavoidable.',
    desc: 'Why are you always swaying? Why are your emotions always high? Why do things look doubled? Because what flows in your body is not blood but liquor. You are the kind of person who pours baijiu into a thermos and drinks it like water. DRUNK is the mighty white liquor that burns, boils, and turns you into a poet at the dinner table and a man hugging the toilet at midnight. By 10 a.m. the next day, you finally understand that the loud, confident person from last night has become a drunkard.'
  }
};

const dimensionEn = {
  dimensionMeta: {
    S1: { name: 'S1 Self-Esteem', model: 'Self Model' },
    S2: { name: 'S2 Self-Clarity', model: 'Self Model' },
    S3: { name: 'S3 Core Values', model: 'Self Model' },
    E1: { name: 'E1 Attachment Security', model: 'Emotional Model' },
    E2: { name: 'E2 Emotional Investment', model: 'Emotional Model' },
    E3: { name: 'E3 Boundaries & Dependence', model: 'Emotional Model' },
    A1: { name: 'A1 Worldview', model: 'Attitude Model' },
    A2: { name: 'A2 Rules & Flexibility', model: 'Attitude Model' },
    A3: { name: 'A3 Sense of Meaning', model: 'Attitude Model' },
    Ac1: { name: 'Ac1 Motivation', model: 'Action Drive Model' },
    Ac2: { name: 'Ac2 Decision Style', model: 'Action Drive Model' },
    Ac3: { name: 'Ac3 Execution Mode', model: 'Action Drive Model' },
    So1: { name: 'So1 Social Initiative', model: 'Social Model' },
    So2: { name: 'So2 Interpersonal Boundaries', model: 'Social Model' },
    So3: { name: 'So3 Expression & Authenticity', model: 'Social Model' }
  },
  dimExplanations: {
    S1: {
      L: 'You are harder on yourself than anyone else could be, and even praise makes you want to verify it first.',
      M: 'Your confidence rises and falls with the weather; you fly with a tailwind and shrink against a headwind.',
      H: 'You have a fairly solid read on yourself and are not easily shaken by a random remark.'
    },
    S2: {
      L: 'Your inner channel is full of static, and you keep looping on the question of who you are.',
      M: 'Most of the time you can still recognize yourself, though emotions occasionally swap the channel.',
      H: 'You know your temperament, desires, and boundaries pretty well.'
    },
    S3: {
      L: 'You care more about comfort and safety; there is no need to run life in sprint mode every day.',
      M: 'You want to improve, but you also want to lie down; your values keep holding internal meetings.',
      H: 'You are easily pushed forward by goals, growth, or a belief that matters to you.'
    },
    E1: {
      L: 'Your relationship alarm is very sensitive, and even left-on-read can become a whole ending in your head.',
      M: 'You are half trusting, half testing, and often feel the tug-of-war inside relationships.',
      H: 'You are more willing to trust the relationship itself and are not easily scared off by small fluctuations.'
    },
    E2: {
      L: 'You invest in emotions cautiously; the heart is not closed, just heavily gated.',
      M: 'You do invest, but you keep a backup plan so you do not go all in at once.',
      H: 'Once you commit, you tend to take it seriously and give plenty of emotion and energy.'
    },
    E3: {
      L: 'You can get clingy and can also be clung to; the temperature of a relationship matters a lot.',
      M: 'You want both closeness and independence, so your dependence is adjustable.',
      H: 'You value personal space highly; even when you love deeply, you still need your own ground.'
    },
    A1: {
      L: 'You look at the world through a defensive filter: suspect first, approach later.',
      M: 'You are neither naive nor a full conspiracy theorist; keeping watch is your instinct.',
      H: 'You are more willing to trust human nature and goodwill, and do not rush to condemn the world.'
    },
    A2: {
      L: 'You bend rules when you can, and comfort and freedom usually come first.',
      M: 'You keep rules when needed and flex when necessary; no point dying on every hill.',
      H: 'You have a stronger sense of order and do not enjoy improvising chaos when a process will do.'
    },
    A3: {
      L: 'Your sense of meaning is low, and many things can feel like you are just going through the motions.',
      M: 'Sometimes you have goals, sometimes you want to give up; your worldview is only half booted.',
      H: 'You tend to move with a clearer direction and know roughly where you want to go.'
    },
    Ac1: {
      L: 'You think about avoiding failure before anything else; your risk system starts before your ambition does.',
      M: 'Sometimes you want to win, sometimes you just want to avoid trouble; your motives are mixed.',
      H: 'You are more easily driven by results, growth, and the feeling of progress.'
    },
    Ac2: {
      L: 'You tend to spin your wheels before deciding; the internal meeting often runs over time.',
      M: 'You do think, but not to the point of freezing; it is normal hesitation.',
      H: 'You decide quickly and do not like circling back to fuss over it afterwards.'
    },
    Ac3: {
      L: 'Execution and deadlines have a deep relationship with you; the later it gets, the more you seem to awaken.',
      M: 'You can do it, but your state depends on the moment; sometimes steady, sometimes sloppy.',
      H: 'You have a strong drive to push things through, and unfinished tasks feel like a thorn in your side.'
    },
    So1: {
      L: 'Your social engine warms up slowly, and taking initiative usually requires a lot of buildup.',
      M: 'If people come to you, you respond; if not, you do not force it. Your social elasticity is average.',
      H: 'You are more willing to open the room yourself and are not too afraid of being seen in a crowd.'
    },
    So2: {
      L: 'In relationships, you want closeness and fusion, and once you know someone you pull them into the inner circle.',
      M: 'You want closeness but also some room to breathe; boundaries depend on the person.',
      H: 'Your boundaries are strong; if someone gets too close, you instinctively step back half a pace.'
    },
    So3: {
      L: 'You speak directly; if something is on your mind, you usually do not like to circle around it.',
      M: 'You speak to the vibe of the room; truth and politeness each get a little space.',
      H: 'You are skilled at switching yourself for different situations, and your authenticity arrives in layers.'
    }
  }
};

const types = loadJSON('types-i18n.json');
for (const [code, data] of Object.entries(typesEn)) {
  if (types.types[code]) {
    types.types[code].cn.en = data.cn;
    types.types[code].intro.en = data.intro;
    types.types[code].desc.en = data.desc;
  }
}

const dimensions = loadJSON('dimensions-i18n.json');
for (const [key, data] of Object.entries(dimensionEn.dimensionMeta)) {
  if (dimensions.dimensionMeta[key]) {
    dimensions.dimensionMeta[key].name.en = data.name;
    dimensions.dimensionMeta[key].model.en = data.model;
  }
}
for (const [dim, levels] of Object.entries(dimensionEn.dimExplanations)) {
  for (const [level, text] of Object.entries(levels)) {
    if (dimensions.dimExplanations[dim] && dimensions.dimExplanations[dim][level]) {
      dimensions.dimExplanations[dim][level].en = text;
    }
  }
}

saveJSON('types-i18n.json', types);
saveJSON('dimensions-i18n.json', dimensions);
console.log('English translations updated from curated mapping.');
