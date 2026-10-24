import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// In-memory store for anonymous letters and community sharing
interface CounselorReply {
  content: string;
  repliedAt: string;
  counselorName: string;
  counselorTitle: string;
}

interface AnonymousLetter {
  id: string;
  code: string;
  penName: string;
  category: 'school' | 'family' | 'social';
  urgency: 'low' | 'medium' | 'high';
  title: string;
  content: string;
  createdAt: string;
  isPublic: boolean;
  reply?: CounselorReply;
  hearts: number;
  hugs: number;
}

// Initial seed letters with rich, realistic, compassionate counselor answers
const anonymousLetters: AnonymousLetter[] = [
  {
    id: 'letter-seed-1',
    code: 'TAM-AN-1024',
    penName: 'Chiếc Lá Mùa Thu',
    category: 'school',
    urgency: 'medium',
    title: 'Điểm số môn Toán kỳ này tụt dốc, mình sợ làm bố mẹ thất vọng',
    content: 'Chào cô/thầy, em đang học lớp 11. Đợt kiểm tra giữa kỳ vừa rồi điểm Toán của em chỉ được 5.5, trong khi các bạn trong lớp đều trên 8. Cả tuần nay em không dám nhìn mặt bố mẹ, đêm nào cũng giật mình tỉnh giấc vì lo lắng kỳ thi cuối kỳ sắp tới. Em cảm giác mình bất tài và vô dụng lắm...',
    createdAt: '2025-05-10T14:20:00Z',
    isPublic: true,
    hearts: 38,
    hugs: 45,
    reply: {
      counselorName: 'Cô Hoàng Minh Anh',
      counselorTitle: 'Chuyên viên Tâm lý Giáo dục THPT',
      repliedAt: '2025-05-10T18:30:00Z',
      content: 'Chào Chiếc Lá Mùa Thu thân mến,\n\nCô đã đọc từng dòng tâm sự của em và cảm nhận được sức nặng của nỗi lo lắng mà em đang gánh gác. Điểm số chỉ phản ánh mức độ nắm kiến thức ở một thời điểm cụ thể, hoàn toàn KHÔNG định nghĩa giá trị con người em.\n\nViệc em buồn chứng tỏ em là người có tinh thần trách nhiệm. Nhưng hãy nhớ rằng: thất bại ở một bài kiểm tra không có nghĩa là em "bất tài". Hãy cho phép bản thân hít thở thật sâu, rà soát lại các câu làm sai và chủ động nhờ thầy cô hoặc bạn bè giảng lại phần chưa hiểu. Về phía bố mẹ, một cuộc trò chuyện chân thành: "Con biết bài này chưa tốt và con đang lên kế hoạch ôn luyện lại, mong bố mẹ tin tưởng con" sẽ giải tỏa được rất nhiều áp lực. Cô luôn ở đây ủng hộ em!'
    }
  },
  {
    id: 'letter-seed-2',
    code: 'TAM-AN-2048',
    penName: 'Mây Trắng Nhút Nhát',
    category: 'social',
    urgency: 'medium',
    title: 'Cảm giác bị cô lập và không có ai hiểu mình ở lớp mới',
    content: 'Em mới chuyển vào lớp 10 được 2 tháng. Các bạn đã có nhóm chơi thân từ cấp 2 nên em cảm thấy mình như người vô hình. Giờ ra chơi em chỉ biết gục đầu xuống bàn bấm điện thoại. Có phải tính cách em nhàm chán quá nên không ai muốn kết bạn không ạ?',
    createdAt: '2025-05-11T09:15:00Z',
    isPublic: true,
    hearts: 52,
    hugs: 67,
    reply: {
      counselorName: 'Thầy Trần Quốc Huy',
      counselorTitle: 'Thạc sĩ Tham vấn Tâm lý Học đường',
      repliedAt: '2025-05-11T11:45:00Z',
      content: 'Gửi Mây Trắng Nhút Nhát,\n\nBước vào một môi trường mới luôn đòi hỏi sự dũng cảm lớn, và cảm giác lạc lõng trong những tháng đầu là hoàn toàn bình thường. Không phải em nhàm chán đâu, mà là các bạn đang ở trong vùng an toàn cũ của họ thôi.\n\nGợi ý nhỏ cho em: Thay vì cố gắng hòa nhập với cả một nhóm lớn ngay lập tức, hãy bắt đầu từ việc mỉm cười và chào một bạn ngồi cạnh, hỏi thăm về bài tập hoặc một sở thích chung (như bộ truyện tranh, idol, môn thể thao). Tình bạn đẹp cần thời gian để nảy mầm, đừng vội tự trách mình em nhé!'
    }
  },
  {
    id: 'letter-seed-3',
    code: 'TAM-AN-3096',
    penName: 'Ngôi Sao Đêm',
    category: 'family',
    urgency: 'high',
    title: 'Mẹ lúc nào cũng so sánh em với "con nhà người ta"',
    content: 'Mỗi bữa cơm nhà em như một cuộc tra khảo. Mẹ luôn nhắc về anh họ đạt giải quốc gia, về bạn lớp trưởng cùng lớp vừa học giỏi vừa ngoan. Em đã cố gắng thức khuya dậy sớm học bài nhưng mẹ chưa một lần công nhận. Em cảm thấy ngột ngạt và không muốn về nhà nữa...',
    createdAt: '2025-05-12T19:00:00Z',
    isPublic: true,
    hearts: 89,
    hugs: 110,
    reply: {
      counselorName: 'Cô Vũ Hải Yến',
      counselorTitle: 'Chuyên gia Trị liệu Gia đình & Vị thành niên',
      repliedAt: '2025-05-12T22:15:00Z',
      content: 'Chào Ngôi Sao Đêm,\n\nCô ôm em một cái thật chặt nhé. Cảm giác nỗ lực của mình không được người thân nhất ghi nhận thật sự rất tủi thân và đau lòng.\n\nBố mẹ thế hệ trước thường có niềm tin sai lầm rằng "so sánh sẽ tạo động lực". Họ yêu em nhưng chưa học được cách bày tỏ lành mạnh. Em có thể chọn một lúc mẹ vui vẻ để viết một mẩu giấy nhỏ hoặc nhắn tin: "Mẹ ơi, khi mẹ so sánh con với người khác, con cảm thấy rất tổn thương dù con đã rất cố gắng. Con mong mẹ ghi nhận từng bước tiến nhỏ của con". Dù phản ứng của mẹ ra sao, hãy tự hào về chính bản thân em vì em đã nỗ lực hết mình. Em là độc nhất và xứng đáng được yêu thương!'
    }
  }
];

// Helper to get GoogleGenAI client if API key is present
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI();
}

// 1. Endpoint: Consultation for 3 specific pillars (School, Family, Social)
app.post('/api/consult', async (req, res) => {
  try {
    const { category, topic, feeling, situation, penName, grade } = req.body;

    const categoryNames: Record<string, string> = {
      school: 'Tâm lý học đường & thi cử',
      family: 'Tâm lý gia đình & mâu thuẫn thế hệ',
      social: 'Tâm lý xã hội, tình bạn & cảm xúc tuổi dậy thì'
    };

    const targetCategory = categoryNames[category] || 'Tâm lý học đường';

    const systemPrompt = `Bạn là Chuyên gia Tâm lý Học đường giàu tình cảm, tinh tế, am hiểu sâu sắc tâm sinh lý lứa tuổi học sinh trung học cơ sở và trung học phổ thông (từ 11 - 18 tuổi) tại Việt Nam.
Tôn chỉ tư vấn:
1. Tuyệt đối KHÔNG phán xét, KHÔNG chỉ trích, KHÔNG so sánh hoặc giáo điều.
2. Thể hiện sự thấu cảm sâu sắc, lắng nghe tích cực và công nhận cảm xúc của học sinh (Emotional Validation).
3. Sử dụng đại từ xưng hô ấm áp: "Cô/Thầy" hoặc "Chuyên gia Tâm An" xưng với "Em" hoặc bút danh của học sinh, giọng văn ân cần, mềm mại, truyền cảm hứng tích cực.
4. Cung cấp các gợi ý hành động cụ thể, dễ thực hiện (actionable steps), bài học tâm lý và lời khuyên khoa học.
5. Luôn kết thúc bằng một câu thông điệp/khẳng định tích cực (Affirmation) xoa dịu tâm hồn học sinh.

Yêu cầu xuất ra định dạng JSON thuần túy (không bọc codeblock markdown thừa nếu có thể, hoặc bọc \`\`\`json) với cấu trúc sau:
{
  "empathy": "Đoạn văn thấu cảm và vỗ về cảm xúc đầu tiên (3-4 câu êm dịu, ấm áp)",
  "psychologicalInsight": "Phân tích tâm lý ngắn gọn, giải thích vì sao em lại cảm thấy như vậy và khẳng định đây là phản ứng bình thường của tuổi học trò",
  "actionSteps": [
    "Hành động cụ thể bước 1 (rất thực tế, làm được ngay)",
    "Hành động cụ thể bước 2 (giao tiếp hoặc giải tỏa)",
    "Hành động cụ thể bước 3 (chăm sóc bản thân dài hạn)"
  ],
  "soothingQuote": "Một câu nói truyền động lực hoặc xoa dịu tâm hồn ngắn gọn, sâu sắc",
  "breathingReminder": "Một gợi ý ngắn về cách thư giãn tức thì (như uống một ngụm nước ấm, hít thở 3 nhịp sâu)"
}`;

    const userMessage = `Học sinh: ${penName || 'Bạn học sinh giấu tên'}
Đang học: ${grade || 'Cấp trung học'}
Chủ đề tư vấn: ${targetCategory} - ${topic || 'Chung'}
Cảm xúc hiện tại: ${feeling || 'Đang bối rối, lo âu'}
Hoàn cảnh & Lời tâm sự:
"""${situation}"""`;

    const ai = getGeminiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }
          ],
          config: {
            responseMimeType: 'application/json'
          }
        });

        const responseText = response.text || '';
        try {
          const parsed = JSON.parse(responseText);
          return res.json({ success: true, advice: parsed });
        } catch {
          const cleaned = responseText.replace(/```json\n?|\n?```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          return res.json({ success: true, advice: parsed });
        }
      } catch (aiErr) {
        console.warn('Gemini generateContent error in consult, providing empathetic fallback:', aiErr);
      }
    }

    // High quality therapeutic fallback response ensuring students always receive warm advice
    const fallbackAdvice = {
      empathy: `Chào ${penName || 'bạn học sinh thân mến'}, cô/thầy lắng nghe và cảm nhận được rằng em đang phải trải qua một giai đoạn rất nhiều áp lực và trăn trở trong lòng. Việc em dám viết ra những dòng này đã là một bước dũng cảm rất lớn rồi.`,
      psychologicalInsight: `Ở lứa tuổi học sinh, não bộ và cảm xúc của chúng ta đang phát triển mạnh mẽ. Những xung đột hay sự bế tắc trong ${targetCategory.toLowerCase()} là điều mà rất nhiều bạn đồng trang lứa cũng từng trải qua. Em không hề đơn độc hay bất bình thường.`,
      actionSteps: [
        'Dành ra 10 phút tạm dừng suy nghĩ, làm một việc nhẹ nhàng khiến em thấy an toàn (nghe một bản nhạc êm dịu, uống nước ấm, hít thở sâu).',
        'Tách biệt vấn đề ra khỏi giá trị bản thân: Nhớ rằng khó khăn này chỉ là một thử thách tạm thời, không phải là toàn bộ tương lai hay con người em.',
        'Tìm một người đáng tin cậy (bạn thân, thầy cô phụ trách tâm lý, hoặc tiếp tục tâm sự với chuyên gia Tâm An) để không phải chịu đựng một mình.'
      ],
      soothingQuote: 'Mọi cơn bão rồi cũng sẽ qua, sau cơn mưa trời lại sáng. Hãy kiên nhẫn và dịu dàng với chính bản thân mình.',
      breathingReminder: 'Hãy thả lỏng hai vai, nhắm mắt lại và hít một hơi thật sâu trong 4 giây, sau đó thở ra từ từ nhé.'
    };
    return res.json({ success: true, advice: fallbackAdvice });
  } catch (error: any) {
    console.error('Error in /api/consult:', error);
    return res.json({
      success: true,
      advice: {
        empathy: 'Tâm An luôn ở đây với bạn. Mình cảm nhận được nỗi niềm trăn trở của bạn lúc này.',
        psychologicalInsight: 'Mọi cảm xúc buồn lo hay bế tắc đều là phản ứng tự nhiên của tâm lý khi gặp áp lực cuộc sống.',
        actionSteps: [
          'Hít thở sâu 3 nhịp để điều hòa nhịp tim.',
          'Uống một cốc nước ấm và nghỉ ngơi 15 phút.',
          'Viết ra những điều nhỏ em có thể làm ngay hôm nay.'
        ],
        soothingQuote: 'Bạn luôn có giá trị và bạn dũng cảm hơn bạn tưởng rất nhiều.'
      }
    });
  }
});

// 2. Endpoint: 24/7 Chatbot "Tâm An"
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  const lastUserMsg = messages?.[messages.length - 1]?.text?.toLowerCase() || '';

  try {
    const systemInstruction = `Bạn là "Tâm An" - Trợ lý Tâm lý Học đường AI túc trực 24/7 dành riêng cho học sinh cấp 2 và cấp 3 (THCS & THPT) tại Việt Nam.
Tính cách:
- Cực kỳ ân cần, dịu dàng, lắng nghe kiên nhẫn, nói chuyện tự nhiên và gần gũi như một người anh/chị khóa trên hoặc cô thủ thư tâm lý tốt bụng.
- Sử dụng xưng hô: "Tâm An" (hoặc "mình") và gọi học sinh là "bạn" hoặc "em".
- Câu từ ngắn gọn, súc tích, có nhịp điệu nhẹ nhàng, nhiều năng lượng chữa lành, dùng icon như 🌿, ☁️, 💙, ✨, 🌸.
- Khi học sinh buồn, hãy an ủi trước, không vội đưa ra bài học.
- NẾU PHÁT HIỆN HỌC SINH CÓ DẤU HIỆU NGUY CẤP (tự hại): Luôn bày tỏ sự quan tâm chân thành và cung cấp ngay Tổng đài Quốc gia Bảo vệ Trẻ em 111, hoặc Tổng đài Ngày Mai 096 306 1414.`;

    const ai = getGeminiClient();
    if (ai) {
      const contents = (messages || []).map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : m.role,
        parts: [{ text: m.text }]
      }));

      if (contents.length === 0) {
        contents.push({ role: 'user', parts: [{ text: 'Chào Tâm An!' }] });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: { systemInstruction }
      });

      if (response.text) {
        return res.json({ success: true, reply: response.text });
      }
    }
  } catch (error: any) {
    console.warn('Gemini chat error, fallbacking gracefully:', error?.message || error);
  }

  // Graceful compassionate reply
  let reply = 'Tâm An luôn ở đây lắng nghe bạn nè 💙. Bạn đang cảm thấy thế nào, có điều gì làm bạn trăn trở trong học tập, bạn bè hay gia đình không? Cứ thoải mái chia sẻ với mình nhé, không gian này hoàn toàn an toàn và bí mật!';
  if (lastUserMsg.includes('buồn') || lastUserMsg.includes('khóc') || lastUserMsg.includes('áp lực') || lastUserMsg.includes('điểm')) {
    reply = 'Thương bạn nhiều 🫂. Mình biết lúc này bạn đang mệt mỏi và nặng trĩu trong lòng. Điểm số hay một bài kiểm tra không định nghĩa giá trị con người bạn đâu. Hãy cho phép bản thân nghỉ ngơi một chút, uống một ngụm nước ấm và thở sâu 3 nhịp nhé. Mình vẫn đang ở đây cùng bạn!';
  } else if (lastUserMsg.includes('thở') || lastUserMsg.includes('relax') || lastUserMsg.includes('bài tập')) {
    reply = 'Cùng Tâm An thử bài tập hít thở dịu tâm nhé 🌿: Hít vào bằng mũi trong 4 giây... Giữ hơi lại trong 4 giây... Và thở ra nhẹ nhàng bằng miệng trong 6 giây. Bạn có thể mở mục "Thở Thư Giãn" trên thanh menu để tập theo vòng tròn nhịp điệu nhé!';
  } else if (lastUserMsg.includes('mẹ') || lastUserMsg.includes('bố') || lastUserMsg.includes('gia đình')) {
    reply = 'Khoảng cách thế hệ với cha mẹ thực sự là một điều rất khó khăn với tuổi học trò chúng mình. Bố mẹ thương bạn nhưng đôi khi cách thể hiện vụng về gây tổn thương. Bạn cứ kể chi tiết hơn cho mình nghe nhé 💙.';
  }
  return res.json({ success: true, reply });
});

// 3. Endpoint: Anonymous Secret Letter submission
app.post('/api/anonymous-letter', async (req, res) => {
  try {
    const { penName, category, urgency, title, content, isPublic } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Vui lòng nhập đầy đủ tiêu đề và nội dung tâm sự' });
    }

    // Generate unique random code: TAM-AN-XXXX
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const code = `TAM-AN-${randomDigits}`;
    const id = `letter-${Date.now()}`;

    // Generate automatic thoughtful counselor reply using Gemini or fallback
    let counselorReplyContent = '';
    const counselorNames = [
      { name: 'Cô Hoàng Minh Anh', title: 'Chuyên viên Tư vấn Tâm lý Học đường' },
      { name: 'Thầy Trần Quốc Huy', title: 'Thạc sĩ Tâm lý Học lâm sàng' },
      { name: 'Cô Đỗ Bích Ngọc', title: 'Chuyên gia Tâm lý Vị thành niên' }
    ];
    const chosenCounselor = counselorNames[Math.floor(Math.random() * counselorNames.length)];

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `Bạn là ${chosenCounselor.name} (${chosenCounselor.title}).
Một học sinh trung học vừa gửi một lá thư tâm sự mật danh vào hòm thư tâm lý học đường:
Bút danh: ${penName || 'Học sinh giấu tên'}
Chủ đề: ${category}
Mức độ: ${urgency}
Tiêu đề: ${title}
Nội dung bức thư:
"""${content}"""

Hãy viết một bức thư phản hồi thật ấm áp, sâu sắc, tử tế, thấu hiểu, dài khoảng 3-4 đoạn văn.
Cấu trúc:
- Chào bạn với bút danh đáng yêu
- Lắng nghe và xoa dịu cảm xúc tổn thương/lo lắng
- Phân tích vấn đề một cách khách quan, nhẹ nhàng và đưa ra định hướng giải pháp
- Lời chúc và nhắc nhở em luôn được yêu thương, ký tên ${chosenCounselor.name}.`;

        const replyRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        counselorReplyContent = replyRes.text || '';
      } catch (e) {
        console.warn('AI reply generation failed, fallbacking:', e);
      }
    }

    if (!counselorReplyContent) {
      counselorReplyContent = `Gửi ${penName || 'bạn học sinh thân mến'},\n\nCô đã nhận được bức thư tâm sự của em và rất trân trọng niềm tin mà em đã trao gửi vào Hòm thư Tâm An. Những nỗi niềm mà em đang giữ kín trong lòng thật không dễ dàng chút nào.\n\nHãy nhớ rằng, không có cảm xúc nào là sai trái, và em hoàn toàn có quyền được yếu lòng. Những khó khăn này đang rèn giũa em trở nên kiên cường hơn, nhưng em không phải vượt qua nó một mình. Hãy cho bản thân thời gian để nghỉ ngơi, từng bước tháo gỡ vấn đề nhé.\n\nChúc em luôn giữ được sự an yên trong tâm hồn!\nThân mến,\n${chosenCounselor.name} - ${chosenCounselor.title}`;
    }

    const newLetter: AnonymousLetter = {
      id,
      code,
      penName: penName || 'Ngôi Sao Nhỏ',
      category: category || 'school',
      urgency: urgency || 'medium',
      title,
      content,
      createdAt: new Date().toISOString(),
      isPublic: Boolean(isPublic),
      reply: {
        counselorName: chosenCounselor.name,
        counselorTitle: chosenCounselor.title,
        repliedAt: new Date().toISOString(),
        content: counselorReplyContent
      },
      hearts: 1,
      hugs: 1
    };

    anonymousLetters.unshift(newLetter);

    return res.json({
      success: true,
      code,
      letter: newLetter
    });
  } catch (error: any) {
    console.error('Error in /api/anonymous-letter:', error);
    return res.status(500).json({ success: false, error: 'Có lỗi xảy ra khi gửi thư.' });
  }
});

// 4. Endpoint: Search letter by secret code
app.get('/api/anonymous-letter/:code', (req, res) => {
  const code = req.params.code.trim().toUpperCase();
  const letter = anonymousLetters.find(l => l.code === code);
  if (!letter) {
    return res.status(404).json({ success: false, error: 'Không tìm thấy bức thư với mã này. Hãy kiểm tra lại mã tra cứu của bạn nhé!' });
  }
  return res.json({ success: true, letter });
});

// 5. Endpoint: Get public community letters
app.get('/api/community-letters', (_req, res) => {
  const publicList = anonymousLetters
    .filter(l => l.isPublic)
    .slice(0, 30);
  return res.json({ success: true, letters: publicList });
});

// 6. Endpoint: Cheer (heart or hug) for a letter
app.post('/api/cheer', (req, res) => {
  const { id, type } = req.body;
  const letter = anonymousLetters.find(l => l.id === id);
  if (!letter) {
    return res.status(404).json({ success: false, error: 'Không tìm thấy thư.' });
  }
  if (type === 'heart') letter.hearts += 1;
  else if (type === 'hug') letter.hugs += 1;
  return res.json({ success: true, letter });
});

// Vite Middleware for Dev and Static serve for Production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  app.get('/google07e39b2a38760b76.html', (req, res) => {
    res.send('google-site-verification: google07e39b2a38760b76.html');
  });
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
