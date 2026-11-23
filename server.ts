import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
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
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function isQuotaExhaustedError(err: any): boolean {
  const status = err?.status ?? err?.statusCode;
  const msg = String(err?.message || '');
  return status === 429 || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('Quota exceeded');
}

// Smart Gemini caller: uses primary model (gemini-4-hydrogen), retries transient 5xx/network errors once,
// and switches cleanly to gemini-3.1-flash-lite if free-tier daily quota (429) on the primary model is exhausted.
async function generateGeminiContent(
  ai: GoogleGenAI,
  params: {
    contents: any;
    systemInstruction?: string;
    thinkingLevel?: ThinkingLevel;
    responseMimeType?: string;
    responseSchema?: any;
  }
) {
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash'];
let lastError: unknown;

  for (const model of modelsToTry) {
    const config: Record<string, any> = {};
    if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
    if (params.responseMimeType) config.responseMimeType = params.responseMimeType;
    if (params.responseSchema) config.responseSchema = params.responseSchema;
    //if (params.thinkingLevel) {
      //config.thinkingConfig = { thinkingLevel: params.thinkingLevel };
    //}

    for (let attempt = 0; attempt <= 1; attempt++) {
      try {
        return await ai.models.generateContent({
          model,
          contents: params.contents,
          config,
        });
      } catch (err: any) {
        lastError = err;
        // If quota exhausted (429), immediately fall through to next model without wasting retries
        if (isQuotaExhaustedError(err)) {
          console.warn(`Model ${model} quota reached (429), switching fallback model if available.`);
          break;
        }
        const status = err?.status ?? err?.statusCode;
        const msg = String(err?.message || '').toLowerCase();
        const isTransient =
          (typeof status === 'number' && status >= 500) ||
          msg.includes('timeout') ||
          msg.includes('network') ||
          msg.includes('econnreset') ||
          msg.includes('unavailable');

        if (isTransient && attempt === 0) {
          await new Promise((r) => setTimeout(r, 700));
          continue;
        }
        // If thinkingConfig wasn't supported on fallback model, retry once without thinkingConfig
        if (model !== 'gemini-2.5-flash' && config.thinkingConfig && status === 400) {
          delete config.thinkingConfig;
          continue;
        }
        throw err;
      }
    }
  }

  throw lastError;
}

function getCategoryPsychologicalFramework(category: string): {
  title: string;
  clinicalLens: string;
} {
  if (category === 'family') {
    return {
      title: 'Tâm lý Gia đình & Mâu thuẫn thế hệ (Family Systems & Adolescent Autonomy)',
      clinicalLens: `TRỤC TƯ VẤN GIA ĐÌNH — TƯ DUY LÂM SÀNG RIÊNG:
- Phân biệt rạch ròi các tình huống:
  (a) Khoảng cách thế hệ & giao tiếp lệch pha (cha mẹ thể hiện lo lắng bằng kiểm soát, kỳ vọng, so sánh "con nhà người ta");
  (b) Áp đặt định hướng / tước quyền tự chủ tuổi mới lớn;
  (c) Mâu thuẫn hôn nhân của cha mẹ / chiến tranh lạnh khiến con gánh cảm giác tội lỗi hoặc bất an kéo dài;
  (d) Bạo lực thể chất / tinh thần nghiêm trọng hoặc bỏ mặc cảm xúc (TUYỆT ĐỐI KHÔNG khuyên học sinh "hãy thông cảm cho bố mẹ" nếu đang bị bạo hành/tổn thương nặng — phải ưu tiên ranh giới an toàn và người lớn bảo vệ).
- Tùy cơ ứng biến theo từng câu chuyện:
  * Nếu học sinh vừa cãi nhau hoặc đang ấm ức: ưu tiên hạ nhiệt cảm xúc và bảo vệ lòng tự tôn trước.
  * Nếu học sinh muốn thay đổi cách nói chuyện với bố mẹ: viết sẵn 1–2 câu mở lời tự nhiên đúng giọng học sinh Việt Nam (I-message: "Con cảm thấy... khi...").
  * Nếu hoàn cảnh gia đình khó thay đổi ngay: giúp học sinh xây dựng "vùng an toàn tâm lý" cho riêng mình thay vì ảo tưởng thay đổi cha mẹ trong một đêm.`
    };
  }

  if (category === 'social') {
    return {
      title: 'Tâm lý Xã hội, Tình bạn & Tuổi vị thành niên (Peer Dynamics & Identity)',
      clinicalLens: `TRỤC TƯ VẤN XÃ HỘI & BẠN BÈ — TƯ DUY LÂM SÀNG RIÊNG:
- Phân biệt rạch ròi các tình huống:
  (a) Cô lập, tẩy chay ngầm, rạn nứt bạn thân (relational aggression & rejection sensitivity);
  (b) Tin đồn, nói xấu, bắt nạt qua mạng (cyberbullying / confession);
  (c) Tự ti ngoại hình, áp lực đồng trang lứa (peer pressure), bẫy so sánh mạng xã hội;
  (d) Rung động đầu đời, crush, chia tay, bối rối ranh giới tình cảm (TUYỆT ĐỐI KHÔNG xem nhẹ hay chê "còn nhỏ lo học đi").
- Tùy cơ ứng biến theo từng câu chuyện:
  * Nếu bị nói xấu/bắt nạt mạng: ưu tiên lưu bằng chứng, kiểm soát quyền riêng tư số, không đôi co cảm tính, và nhờ người lớn/nhà trường can thiệp đúng lúc.
  * Nếu rạn nứt bạn thân: giúp em cân nhắc giữa việc hỏi thẳng một lần để gỡ hiểu lầm vs nhận diện tình bạn độc hại để bảo vệ lòng tự trọng.
  * Nếu rung động/thất tình: công nhận vẻ đẹp của cảm xúc, hướng dẫn giữ nhịp sinh hoạt và tôn trọng ranh giới đôi bên.
  * Nếu tự ti ngoại hình/FOMO mạng xã hội: bóc tách cơ chế lệch chuẩn trên mạng và xây dựng lại giá trị bản thân từ năng lực thực.`
    };
  }

  return {
    title: 'Tâm lý Học đường & Động lực học tập (Educational & Cognitive Psychology)',
    clinicalLens: `TRỤC TƯ VẤN HỌC ĐƯỜNG — TƯ DUY LÂM SÀNG RIÊNG:
- Phân biệt rạch ròi các tình huống:
  (a) Học nhiều nhưng không hiệu quả / hổng kiến thức nền / ảo giác năng lực;
  (b) Lo âu phòng thi (test anxiety: vào phòng thi quên sạch, tim đập nhanh dù ở nhà làm được);
  (c) Kiệt sức học đường (academic burnout: mất ngủ, trống rỗng, chán nản toàn tập vì lịch học dày);
  (d) Áp lực thành tích, tự ti trước bạn bè giỏi, hội chứng kẻ mạo danh (impostor feeling);
  (e) Mâu thuẫn, ấm ức hoặc sợ hãi thầy cô;
  (f) Mông lung định hướng chọn khối, chọn ngành, sợ tương lai.
- Tùy cơ ứng biến theo từng câu chuyện:
  * Bám sát đúng môn học, kỳ thi, giáo viên hoặc lịch sinh hoạt mà học sinh nhắc tới (nếu có).
  * Không khuyên chung chung kiểu "cố gắng lên" hay "học chăm chỉ hơn" khi em ấy đang kiệt sức! Nếu em quá tải, ưu tiên cắt giảm và phục hồi não bộ; nếu em sợ trượt, ưu tiên chiến lược khoanh vùng điểm số và kiểm soát lo âu; nếu em mông lung chọn ngành, đưa ra bài tập tự khám phá thực tế.`
  };
}

// 1. Endpoint: Consultation for 3 specific pillars (School, Family, Social)
app.post('/api/consult', async (req, res) => {
  const { category, topic, feeling, situation, penName, grade } = req.body;

  if (!situation || !String(situation).trim()) {
    return res.status(400).json({
      success: false,
      error: 'Bạn hãy viết vài dòng chia sẻ cụ thể để chuyên gia AI có thể lắng nghe và phân tích đúng vấn đề nhé.'
    });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({
      success: false,
      error: 'Dịch vụ tư vấn AI chưa được cấu hình khóa kết nối. Vui lòng kiểm tra GEMINI_API_KEY trong phần Settings > Secrets.'
    });
  }

  const framework = getCategoryPsychologicalFramework(category);

  try {
    const systemInstruction = `Bạn là một Chuyên gia Tham vấn Tâm lý Học đường xuất sắc (trình độ Thạc sĩ Tâm lý Lâm sàng & Giáo dục), có khả năng tư duy độc lập, sắc bén, giàu trắc ẩn và am hiểu sâu sắc đời sống tinh thần của học sinh THCS & THPT Việt Nam (11–18 tuổi).

CHỦ ĐỀ TRỌNG TÂM HIỆN TẠI: ${framework.title}
${framework.clinicalLens}

QUY TẮC SUY NGHĨ ĐỘC LẬP & TÙY CƠ ỨNG BIẾN (RẤT QUAN TRỌNG):
1. ĐỌC SÂU TỪNG CHI TIẾT: Hãy tự đặt mình vào vị trí của chính học sinh có bút danh "${penName || 'em'}", đang học "${grade || 'cấp trung học'}", mang cảm xúc "${feeling || 'bối rối'}". Nhận diện những chi tiết nhỏ nhất trong lời kể (từ ngữ em dùng, mức độ tổn thương, nhân vật liên quan, mâu thuẫn cốt lõi, điều em chưa nói thành lời).
2. KHÔNG TRẢ LỜI THEO KHUÔN MẪU SÁO RỖNG: Tuyệt đối tránh kiểu văn mẫu "Cô hiểu cảm giác của em... Điểm số không định nghĩa giá trị... Hãy uống nước ấm...". Mỗi câu chuyện phải có lập luận tâm lý riêng, giọng điệu uyển chuyển theo đúng mức độ cảm xúc (nhẹ nhàng nâng đỡ nếu em đang sụp đổ; sắc sảo, thực tế nếu em đang cần tháo gỡ kế hoạch; quyết liệt bảo vệ nếu em bị bắt nạt/bạo hành).
3. PHẢN HỒI CÓ CHIỀU SÂU & ĐÚNG TRỌNG TÂM:
   - "empathy" (1–2 đoạn văn, khoảng 4–6 câu tự nhiên, có xuống dòng \\n\\n giữa các ý): Không chỉ an ủi bề mặt, hãy gọi đúng tên nỗi đau/nút thắt ẩn sau lời kể của em ấy để em thấy mình được thấu hiểu tận gốc.
   - "psychologicalInsight" (1–2 đoạn văn sâu sắc, có xuống dòng \\n\\n nếu cần): Tự phân tích cơ chế tâm lý đang diễn ra bên trong tình huống cụ thể này (tại sao tâm trí/cơ thể hoặc người kia lại phản ứng như vậy, đâu là nguyên nhân gốc rễ, và vì sao điều đó không phải lỗi đạo đức hay sự yếu kém của em).
   - "actionSteps" (mảng từ 3 đến 5 bước hành động linh hoạt tùy độ phức tạp của vấn đề): Mỗi bước phải CỤ THỂ, ĐỜI THƯỜNG, ÁP DỤNG ĐƯỢC NGAY vào đúng vấn đề em kể (nên có tiêu đề ngắn mở đầu bước + hướng dẫn chi tiết, ví dụ câu thoại cụ thể, cách phân bổ thời gian, kỹ thuật xử lý tình huống). Không đưa lời khuyên chung chung sáo rỗng.
   - "soothingQuote": Một thông điệp tự sáng tạo riêng cho đúng nỗi niềm của học sinh này (không dùng câu trích dẫn đại trà).
   - "breathingReminder": Chọn kỹ thuật điều hòa thần kinh phù hợp nhất với trạng thái hiện tại của em (VD: Grounding 5-4-3-2-1 nếu đang hoảng loạn/sợ hãi, xả căng cơ vai-cổ nếu đang kiệt sức/ức chế, thở 4-4-6 nếu tim đập nhanh, viết nháp giải tỏa nếu đang tức giận/tủi thân).
4. AN TOÀN KHỦNG HOẢNG: Nếu lời tâm sự có bất kỳ dấu hiệu tự hại, tuyệt vọng muốn kết thúc cuộc sống, hoặc bị bạo hành nghiêm trọng, PHẢI ưu tiên giữ an toàn lên hàng đầu và đưa rõ số Tổng đài Quốc gia Bảo vệ Trẻ em **111** (miễn phí 24/7) và Đường dây nóng **Ngày Mai 096 306 1414** ngay trong các bước hành động.`;

    const userMessage = `HỒ SƠ TÂM SỰ CẦN THAM VẤN CHUYÊN SÂU:
- Bút danh học sinh: ${penName || 'Bạn học sinh giấu tên'}
- Độ tuổi / Cấp lớp: ${grade || 'Cấp trung học'}
- Lĩnh vực tâm sự: ${framework.title}
- Chủ đề gợi ý đã chọn (nếu có): ${topic || 'Học sinh tự viết vấn đề riêng'}
- Cảm xúc hiện tại của em: ${feeling || 'Chưa rõ'}
- Toàn bộ lời tâm sự của học sinh:
"""${String(situation).trim()}"""

Hãy suy nghĩ thật kỹ, phân tích đúng trọng tâm câu chuyện riêng này và trả về JSON theo schema.`;

    const response = await generateGeminiContent(ai, {
      contents: userMessage,
      systemInstruction,
      thinkingLevel: ThinkingLevel.HIGH,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          empathy: {
            type: Type.STRING,
            description: '1-2 đoạn thấu cảm sâu sắc (4-6 câu), gọi bút danh và chạm đúng nỗi niềm cụ thể của học sinh.'
          },
          psychologicalInsight: {
            type: Type.STRING,
            description: '1-2 đoạn phân tích tâm lý có chiều sâu, giải mã đúng gốc rễ cơ chế tâm lý của tình huống cụ thể này.'
          },
          actionSteps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Từ 3 đến 5 bước hành động linh hoạt, cụ thể, tùy cơ ứng biến theo đúng hoàn cảnh và nhân vật trong câu chuyện.'
          },
          soothingQuote: {
            type: Type.STRING,
            description: 'Một thông điệp xoa dịu sâu sắc, được viết riêng cho vấn đề này.'
          },
          breathingReminder: {
            type: Type.STRING,
            description: 'Kỹ thuật thư giãn / điều hòa cơ thể tức thì phù hợp nhất với trạng thái cảm xúc hiện tại.'
          }
        },
        required: ['empathy', 'psychologicalInsight', 'actionSteps', 'soothingQuote', 'breathingReminder']
      }
    });

    const responseText = (response.text ?? '').trim();
    if (!responseText) {
      throw new Error('Phản hồi từ AI bị trống.');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const cleaned = responseText.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    if (!parsed || !parsed.empathy || !Array.isArray(parsed.actionSteps)) {
      throw new Error('Cấu trúc phản hồi AI chưa đầy đủ.');
    }

    return res.json({ success: true, advice: parsed });
  } catch (error: any) {
    const status = error?.status ?? error?.statusCode;
    console.warn('Consult endpoint issue:', status || error?.message || 'Unknown error');
    if (isQuotaExhaustedError(error)) {
      return res.status(429).json({
        success: false,
        error: 'Hạn mức miễn phí của Gemini API hôm nay đã hết tạm thời. Bạn có thể đợi vài phút hoặc chọn API key có bật thanh toán trong Settings > Secrets để tăng hạn mức nhé!'
      });
    }
    if (status === 403 || status === 400) {
      return res.status(status).json({
        success: false,
        error: 'Khóa API Gemini không hợp lệ hoặc chưa đủ quyền. Vui lòng kiểm tra lại trong Settings > Secrets.'
      });
    }
    return res.status(502).json({
      success: false,
      error: 'Không thể kết nối tới chuyên gia AI ngay lúc này. Em hãy bấm gửi lại sau vài giây nhé!'
    });
  }
});

// 2. Endpoint: 24/7 Chatbot "Tâm An"
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({
      success: false,
      error: 'Trợ lý AI chưa sẵn sàng do thiếu GEMINI_API_KEY trong phần Settings > Secrets.'
    });
  }

  try {
    const systemInstruction = `Bạn là "Tâm An" - Chuyên viên Tham vấn Tâm lý Học đường AI túc trực 24/7 dành riêng cho học sinh THCS & THPT (11–18 tuổi) tại Việt Nam.
Phong cách trò chuyện & Tư duy sâu:
- Lắng nghe linh hoạt, tùy cơ ứng biến theo đúng từng câu chuyện về Học đường, Gia đình hay Xã hội/Bạn bè. Tuyệt đối KHÔNG trả lời theo 1-2 mẫu câu rập khuôn.
- Biết phân tích tinh tế điều học sinh đang thật sự cần ở mỗi lượt chat: khi mới chia sẻ nỗi đau hãy thấu cảm và đặt 1 câu hỏi mở nhẹ nhàng để hiểu sâu hơn; khi học sinh hỏi cách xử lý hãy đưa ra gợi ý sắc sảo, thực tế, dễ làm.
- Xưng hô gần gũi ("Tâm An" / "mình" và gọi học sinh là "bạn" hoặc "em" tùy cách học sinh xưng).
- Ngôn từ tự nhiên, chân thành, có chiều sâu tâm lý nhưng không khô khan sách vở, dùng biểu tượng tiết chế vừa đủ (🌿, 💙, ✨).
- NẾU PHÁT HIỆN HỌC SINH CÓ DẤU HIỆU TỰ HẠI HOẶC BỊ BẠO HÀNH NGHIÊM TRỌNG: Ưu tiên bảo vệ an toàn và cung cấp ngay Tổng đài Quốc gia Bảo vệ Trẻ em 111 (miễn phí 24/7) và Đường dây nóng Ngày Mai 096 306 1414.`;

    const contents = (messages || []).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : m.role,
      parts: [{ text: m.text }]
    }));

    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: 'Chào Tâm An!' }] });
    }

    const response = await generateGeminiContent(ai, {
      contents,
      systemInstruction,
      thinkingLevel: ThinkingLevel.MEDIUM
    });

    if (response.text) {
      return res.json({ success: true, reply: response.text });
    }
    throw new Error('Empty reply from AI');
  } catch (error: any) {
    console.warn('Gemini chat issue:', error?.status || error?.message || 'Unknown error');
    if (isQuotaExhaustedError(error)) {
      return res.status(429).json({
        success: false,
        error: 'Hạn mức miễn phí của Gemini API hôm nay đã hết tạm thời. Bạn có thể đợi ít phút hoặc dùng khóa API trả phí trong Settings > Secrets nhé!'
      });
    }
    return res.status(502).json({
      success: false,
      error: 'Kết nối với Tâm An 24/7 đang chập chờn. Bạn vui lòng gửi lại tin nhắn sau giây lát nhé!'
    });
  }
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

Hãy viết một bức thư phản hồi thật ấm áp, sâu sắc, tử tế, thấu hiểu, bám sát từng chi tiết câu chuyện riêng của học sinh, dài khoảng 3-4 đoạn văn.
Cấu trúc:
- Chào bạn với bút danh đáng yêu
- Lắng nghe và xoa dịu cảm xúc tổn thương/lo lắng gắn với sự việc cụ thể
- Phân tích vấn đề một cách khách quan, nhẹ nhàng và đưa ra định hướng giải pháp thực tế
- Lời chúc và nhắc nhở em luôn được yêu thương, ký tên ${chosenCounselor.name}.`;

        const replyRes = await generateGeminiContent(ai, {
          contents: prompt
        });
        counselorReplyContent = replyRes.text || '';
      } catch (e: any) {
        console.warn('AI letter reply generation failed:', e?.status || e?.message || 'Unknown error');
      }
    }

    if (!counselorReplyContent) {
      counselorReplyContent = `Gửi ${penName || 'bạn học sinh thân mến'},\n\nCô đã nhận được bức thư "${title}" của em và rất trân trọng niềm tin mà em đã trao gửi vào Hòm thư Tâm An. Những nỗi niềm mà em đang giữ kín trong lòng thật không dễ dàng chút nào.\n\nHãy nhớ rằng, không có cảm xúc nào là sai trái, và em hoàn toàn có quyền được yếu lòng. Những khó khăn này đang rèn giũa em trở nên kiên cường hơn, nhưng em không phải vượt qua nó một mình. Hãy cho bản thân thời gian để nghỉ ngơi, từng bước tháo gỡ vấn đề nhé.\n\nChúc em luôn giữ được sự an yên trong tâm hồn!\nThân mến,\n${chosenCounselor.name} - ${chosenCounselor.title}`;
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
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
