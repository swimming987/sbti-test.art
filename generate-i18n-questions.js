const fs = require('fs');
const path = require('path');

// Read original questions
const original = JSON.parse(fs.readFileSync('data/questions.json', 'utf8'));

// Translation mappings
const translations = {
  // Common options
  "确实": { "zh-TW": "確實", "en": "True" },
  "有时": { "zh-TW": "有時", "en": "Sometimes" },
  "不是": { "zh-TW": "不是", "en": "Not really" },
  "不认同": { "zh-TW": "不認同", "en": "Disagree" },
  "中立": { "zh-TW": "中立", "en": "Neutral" },
  "认同": { "zh-TW": "認同", "en": "Agree" },
  "是的": { "zh-TW": "是的", "en": "Yes" },
  "偶尔": { "zh-TW": "偶爾", "en": "Sometimes" },
  "保持中立": { "zh-TW": "保持中立", "en": "Neutral" },
  "看情况": { "zh-TW": "看情況", "en": "Depends" }
};

// Manual translations for questions (simplified -just use similar text without nested quotes)
const result = {
  questions: original.questions.map(q => {
    // Normalize curly quotes to ASCII quotes for consistent matching
    const normalizeQuotes = (text) => {
      if (typeof text !==  'string') return text;
      return text.replace(/\u201C/g, '"').replace(/\u201D/g, '"')  // " "
                 .replace(/\u2018/g, "'").replace(/\u2019/g, "'")  // ' '
                 .replace(/\u300C/g, '"').replace(/\u300D/g, '"'); // 「 」
    };
    
    const textCN = normalizeQuotes(q.text);
    const base = {
      id: q.id,
      dim: q.dim,
      text: {
        "zh-CN": textCN,
        "zh-TW": simplifiedToChinese(textCN),
        "en": translateText(q.id, textCN)
      },
      options: q.options.map(opt => {
        const labelCN = normalizeQuotes(opt.label);
        return {
          label: {
            "zh-CN": labelCN,
            "zh-TW": translations[labelCN]?.["zh-TW"] || simplifiedToChinese(labelCN),
            "en": translations[labelCN]?.["en"] || translateOption(q.id, labelCN)
          },
          value: opt.value
        };
      })
    };
    return base;
  }),
  specialQuestions: original.specialQuestions.map(q => {
    // Normalize curly quotes
    const normalizeQuotes = (text) => {
      if (typeof text !== 'string') return text;
      return text.replace(/\u201C/g, '"').replace(/\u201D/g, '"')  // " "
                 .replace(/\u2018/g, "'").replace(/\u2019/g, "'")  // ' '
                 .replace(/\u300C/g, '"').replace(/\u300D/g, '"'); // 「 」
    };
    
    const textCN = normalizeQuotes(q.text);
    const base = {
      id: q.id,
      special: true,
      kind: q.kind,
      text: {
        "zh-CN": textCN,
        "zh-TW": simplifiedToChinese(textCN),
        "en": q.id === 'drink_gate_q1' ? 
          "What are your usual hobbies?" : 
          "What's your attitude toward drinking?"
      },
      options: q.options.map(opt => {
        const labelCN = normalizeQuotes(opt.label);
        return {
          label: {
            "zh-CN": labelCN,
            "zh-TW": simplifiedToChinese(labelCN),
            "en": translateSpecialOption(q.id, labelCN, opt.value)
          },
          value: opt.value
        };
      })
    };
    return base;
  })
};

function simplifiedToChinese(text) {
  // Basic simplified to traditional Chinese conversion
  const map = {
    '爱': '愛', '国': '國', '学': '學', '谢': '謝', '说': '說',
    '识': '識', '观': '觀', '时': '時', '间': '間', '经': '經',
    '难': '難', '为': '為', '实': '實', '认': '認', '样': '樣',
    '应': '應', '还': '還', '这': '這', '会': '會', '听': '聽',
    '头': '頭', '真': '真', '梦': '夢', '关': '關', '条': '條',
    '单': '單', '场': '場', '议': '議', '动': '動', '现': '現',
    '给': '給', '过': '過', '觉': '覺', '战': '戰', '历': '歷',
    '让': '讓', '恋': '戀', '对': '對', '带': '帶', '书': '書',
    '层': '層', '坏': '壞', '怀': '懷', '态': '態', '离': '離',
    '务': '務', '决': '決', '贝': '貝', '发': '發', '远': '遠',
    '义': '義', '虑': '慮', '传': '傳', '尽': '盡', '纯': '純',
    '压': '壓', '选': '選', '缭': '繚', '干': '乾', '兴': '興',
    '响': '響', '扰': '擾', '闹': '鬧', '区': '區', '欢': '歡',
    '导': '導',  '练': '練', '环': '環', '当': '當', '独': '獨',
    '怒': '怒', '挥': '揮', '吵': '吵', '辩': '辯', '斗': '鬥',
    '窜': '竄', '随': '隨', '种': '種', '没': '沒', '许': '許',
    '顾': '顧', '声': '聲', '设': '設', '办': '辦', '饮': '飲',
    '艺': '藝', '调': '調', '啥': '啥', '却': '卻', '胆': '膽',
    '谈': '談', '怯': '怯', '丝': '絲', '读': '讀', '惯': '慣',
    '习': '習', '运': '運', '规': '規', '级': '級', '积': '積',
    '乱': '亂', '弥': '彌', '纷': '紛', '阴': '陰', '暗': '暗',
    '温': '溫', '责': '責', '确': '確', '碍': '礙', '担': '擔',
    '挚': '摯', '妈': '媽', '满': '滿', '张': '張', '肉': '肉',
    '块': '塊', '凉': '涼', '烧': '燒', '热': '熱', '问': '問',
    '题': '題', '绪': '緒', '临': '臨', '预': '預', '极': '極',
    '紧': '緊', '紧': '緊', '剑': '劍', '团': '團', '审': '審',
    '坚': '堅', '触': '觸', '邪': '邪', '恶': '惡', '怜': '憐',
    '击': '擊', '坚': '堅', '态': '態', '边': '邊', '摸': '摸',
    '奖': '獎', '态': '態', '晚': '晚', '辩': '辯', '辱': '辱',
    '戳': '戳', '萌': '萌', '递': '遞', '谈': '談', '谓': '謂',
    '评': '評', '价': '價', '严': '嚴', '断': '斷', '摆': '擺',
    '痔': '痔', '疮': '瘡', '颠': '顛', '笼': '籠', '扣': '扣',
    '搬': '搬', '垫': '墊', '跷': '蹺', '辑': '輯', '诈': '詐',
    '骗': '騙', '战': '戰', '拉': '拉', '稀': '稀', '肚': '肚',
    '隐': '隱', '瞒': '瞞', '誓': '誓', '愧': '愧', '谓': '謂',
    '骄': '驕', '傲': '傲', '昵': '暱', '吞': '吞', '跃': '躍',
    '虽': '雖', '圈': '圈', '热': '熱', '忐': '忐', '忑': '忑',
    '驱': '驅', '绝': '絕', '爆': '爆', '结': '結', '旋': '旋',
    '盟': '盟', '秘': '秘', '态': '態', '废': '廢', '庆': '慶',
    '拭': '拭', '拳': '拳', '夺': '奪', '踪': '蹤', '络': '絡',
    '测': '測', '遥': '遙', '牺': '犧', '监': '監', '须': '須',
    '陷': '陷', '幻': '幻', '窥': '窺', '敌': '敵', '败': '敗',
    '郑': '鄭', '娱': '娛', '狂': '狂', '羞': '羞', '撒': '撒',
    '窜': '竄', '迷': '迷', '牵': '牽', '魅': '魅', '勾': '勾',
    '怨': '怨', '滚': '滾', '叫': '叫', '唤': '喚', '讯': '訊',
    '畅': '暢', '乐': '樂', '黏': '黏', '资': '資', '脏': '髒'
  };
  
  let result = text;
  for (const [s, t] of Object.entries(map)) {
    result = result.replace(new RegExp(s, 'g'), t);
  }
  // Replace quotation marks
  result = result.replace(/"/g, '『').replace(/"/g, '』');
  result = result.replace(/"/g, '『').replace(/"/g, '』');
  return result;
}

function translateText(id, text) {
  const enMap = {
    "q1": "I'm not just a loser—I'm the joker, the deadweight. Never been in a relationship, too scared and too insecure. My whole youth was just one big fantasy loop, daydream about having a girl to walk the streets with. Reality? Burned my parents' money, went to a trash school, then drifted into a dead-end job. No dreams, no goals, no skills—a complete nobody. Every time I see people making fun of losers online, I want to cry. I'm the rat below, peeking through sewer grates at the beauty above. Every joke is a knife to my soul. Please, just give us clowns a chance. I don't want to wake up with tears on my pillow again.",
    "q2": "I'm not good enough. Everyone around me is better than me.",
    "q3": "I have a clear sense of who I really am.",
    "q4": "I have something I truly pursue deep inside.",
    "q5": "I must keep climbing up and becoming more capable.",
    "q6": "What others think of me doesn't really matter.",
    "q7": "Your partner hasn't replied for over 5 hours and says they had diarrhea. What do you think?",
    "q8": "I often worry about being abandoned in relationships.",
    "q9": "I swear, I take every relationship seriously!",
    "q10": "Your romantic partner is kind, gentle, upright, eloquent, observant, knowledgeable, humble, kind-hearted, ambitious, and stunningly attractive—basically perfect. How would you react?",
    "q11": "After getting into a relationship, your partner is super clingy. How do you feel?",
    "q12": "I value personal space in any relationship.",
    "q13": "Most people are kind.",
    "q14": "You're walking down the street when an adorable little girl bounces toward you and hands you a lollipop. What's your reaction?",
    "q15": "Exams are coming up. School requires evening study hall, and skipping means losing points. But tonight, you have plans to play PUBG with your crush. What do you do?",
    "q16": "I like breaking the rules and hate being constrained.",
    "q17": "I usually have goals when I do things.",
    "q18": "One day I realized that life has no damn meaning. Humans are just like animals, controlled by desires and hormones. Hungry? Eat. Tired? Sleep. Horny? Mate. We're basically no different from pigs or dogs.",
    "q19": "I do things mainly to achieve results and progress, not to avoid trouble or risk.",
    "q20": "You've been sitting on the toilet for 30 minutes with constipation, struggling to go. In this moment, you're more like:",
    "q21": "I make decisions decisively and don't like hesitating.",
    "q22": "This question has no prompt. Just pick blindly.",
    "q23": "Someone says you have 'strong execution.' Which statement feels closer to your truth?",
    "q24": "I often plan things out, ____",
    "q25": "You've made many online friends through playing Identity V, and they invite you to meet offline. What's your thought?",
    "q26": "Your friend brings their friend along to hang out. You're most likely to:",
    "q27": "I interact with people like there's an invisible electric fence—get too close and alarms go off.",
    "q28": "I crave close relationships with people I trust, like long-lost relatives reunited.",
    "q29": "Sometimes you clearly have a different, negative opinion about something, but you don't say it. Most of the time, it's because:",
    "q30": "I show different versions of myself to different people."
  };
  return enMap[id] || text;
}

function translateOption(id, label) {
  const optMap = {
    "q1": {
      "我哭了。。": "I'm crying...",
      "这是什么。。": "What even is this...",
      "这不是我！": "This ain't me!"
    },
    "q7": {
      "拉稀不可能5小时，也许ta隐瞒了我。": "Diarrhea doesn't last 5 hours. Maybe they're hiding something.",
      "在信任和怀疑之间摇摆。": "I'm torn between trusting and doubting.",
      "也许今天ta真的不太舒服。": "Maybe they really weren't feeling well today."
    },
    "q9": {
      "并没有": "Not really",
      "也许？": "Maybe?",
      "是的！（问心无愧骄傲脸）": "Yes! (proud and guilt-free)"
    },
    "q10": {
      "就算ta再优秀我也不会陷入太深。": "Even if they're that perfect, I wouldn't fall too deep.",
      "会介于A和C之间。": "I'd be somewhere between A and C.",
      "会非常珍惜ta，也许会变成恋爱脑。": "I'd treasure them deeply, maybe even become love-obsessed."
    },
    "q11": {
      "那很爽了": "That's awesome",
      "都行无所谓": "Whatever, I'm fine with it",
      "我更喜欢保留独立空间": "I prefer keeping my personal space"
    },
    "q12": {
      "我更喜欢依赖与被依赖": "I prefer depending on and being depended on",
      "是的！（斩钉截铁地说道）": "Yes! (firmly stated)"
    },
    "q13": {
      "其实邪恶的人心比世界上的痔疮更多。": "Actually, there are more evil hearts than hemorrhoids in the world.",
      "也许吧。": "Maybe.",
      "是的，我愿相信好人更多。": "Yes, I choose to believe good people outnumber the bad."
    },
    "q14": {
      "呜呜她真好真可爱！居然给我棒棒糖！": "Aww she's so sweet and cute! She gave me candy!",
      "一脸懵逼，作挠头状": "Confused, scratching my head",
      "这也许是一种新型诈骗？还是走开为好。": "This might be a new scam. Better walk away."
    },
    "q15": {
      "翘了！反正就一次！": "Skip it! Just this once!",
      "干脆请个假吧。": "Just take official leave.",
      "都快考试了还去啥。": "Exams are coming, no way I'm going."
    },
    "q18": {
      "是这样的。": "That's true.",
      "也许是，也许不是。": "Maybe yes, maybe no.",
      "这简直是胡扯": "This is total nonsense"
    },
    "q20": {
      "再坐三十分钟看看，说不定就有了。": "Sit for another 30 minutes, maybe it'll happen.",
      '用力拍打自己的屁股并说："死屁股，快拉啊！"': "Slap my butt hard and yell at it to cooperate.",
      "用力拍打自己的屁股并说：'死屁股，快拉啊！'": "Slap my butt hard and yell at it to cooperate.",
      "使用开塞露，快点拉出来才好。": "Use a laxative suppository to get it out fast."
    },
    "q22": {
      "反复思考后感觉应该选A？": "After thinking it over, maybe A?",
      "啊，要不选B？": "Uh, how about B?",
      "不会就选C？": "When in doubt, pick C?"
    },
    "q23": {
      "我被逼到最后确实执行力超强。。。": "I do execute well... when pushed to the deadline...",
      "啊，有时候吧。": "Uh, sometimes.",
      "是的，事情本来就该被推进": "Yes, things should naturally get pushed forward"
    },
    "q24": {
      "然而计划不如变化快。": "but plans change faster than I can keep up.",
      "有时能完成，有时不能。": "sometimes I follow through, sometimes I don't.",
      "我讨厌被打破计划。": "and I hate when my plans get disrupted."
    },
    "q25": {
      "网上口嗨下就算了，真见面还是有点忐忑。": "Chatting online is fine, but meeting in person makes me nervous.",
      "见网友也挺好，反正谁来聊我就聊两句。": "Meeting online friends is cool. I'll chat with whoever shows up.",
      "我会打扮一番并热情聊天，万一呢，我是说万一呢？": "I'll dress up and chat enthusiastically. Who knows, right?"
    },
    "q26": {
      "对'朋友的朋友'天然有点距离感，怕影响二人关系": "Feel naturally distant, worried it'll affect the duo vibe",
      '对"朋友的朋友"天然有点距离感，怕影响二人关系': "Feel naturally distant, worried it'll affect the duo vibe",
      "看对方，能玩就玩。": "See how it goes. If we vibe, cool.",
      "朋友的朋友应该也算我的朋友！要热情聊天": "Friend of a friend is my friend too! Gotta chat warmly"
    },
    "q29": {
      "这种情况较少。": "This rarely happens.",
      "可能碍于情面或者关系。": "Probably to save face or maintain the relationship.",
      "不想让别人知道自己是个阴暗的人。": "Don't want others to know I'm this dark inside."
    }
  };
  return optMap[id]?.[label] || label;
}

function translateSpecialOption(id, label, value) {
  if (id === 'drink_gate_q1') {
    const map = {1: "Eating, drinking, the usual", 2: "Artistic pursuits", 3: "Drinking alcohol", 4: "Working out"};
    return map[value] || label;
  }
  if (id === 'drink_gate_q2') {
    const map = {1: "A little is fine, can't drink much.", 2: "I keep baijiu in my thermos and drink it like water. Alcohol rules."};
    return map[value] || label;
  }
  return label;
}

// Write output
fs.writeFileSync('data/questions-i18n.json', JSON.stringify(result, null, 2), 'utf8');
console.log('✅ Created questions-i18n.json with translations');
