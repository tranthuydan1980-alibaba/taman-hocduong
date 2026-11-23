import { CategoryType, QuizQuestion } from '../types';

export interface CategoryInfo {
  id: CategoryType;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  iconName: string;
  accentColor: string;
  lightBg: string;
  borderColor: string;
  buttonGradient: string;
  commonTopics: {
    id: string;
    title: string;
    starterPrompt: string;
  }[];
}

export const COUNSELING_CATEGORIES: Record<CategoryType, CategoryInfo> = {
  school: {
    id: 'school',
    title: 'Tư Vấn Tâm Lý Học Đường',
    shortTitle: 'Học Đường',
    tagline: 'Gỡ bỏ áp lực điểm số, thi cử và tìm lại niềm vui đến trường',
    description: 'Nơi san sẻ những mệt mỏi về bài tập, kỳ thi chuyển cấp, chọn khối/chọn ngành, mâu thuẫn bạn bè trong lớp hay áp lực từ thầy cô.',
    iconName: 'GraduationCap',
    accentColor: 'text-sky-600',
    lightBg: 'bg-sky-50',
    borderColor: 'border-sky-200',
    buttonGradient: 'from-sky-500 to-blue-600',
    commonTopics: [
      {
        id: 'math-exam-stress',
        title: 'Áp lực điểm số & Sợ thi trượt',
        starterPrompt: 'Gần đây mình cảm thấy vô cùng áp lực với các bài kiểm tra và kỳ thi sắp tới. Mỗi lần nhìn điểm kém là mình lại run sợ và mất hết động lực học tập...'
      },
      {
        id: 'school-burnout',
        title: 'Kiệt sức vì lịch học thêm dày đặc',
        starterPrompt: 'Lịch học chính khóa và học thêm kín cả tuần khiến mình lúc nào cũng buồn ngủ, đầu óc trống rỗng và không còn chút thời gian nào cho bản thân...'
      },
      {
        id: 'peer-competition',
        title: 'Tự ti vì thấy các bạn trong lớp quá giỏi',
        starterPrompt: 'Ở lớp ai cũng học giỏi, năng động và đạt nhiều giải thưởng, còn mình cố gắng mãi vẫn thấy mình tầm thường và tụt lại phía sau...'
      },
      {
        id: 'career-confusion',
        title: 'Mông lung chọn ban / chọn ngành cấp 3',
        starterPrompt: 'Mình đang học cấp 2/cấp 3 mà vẫn chưa biết mình thích gì hay hợp với ngành nào, trong khi mọi người xung quanh đã có định hướng rõ ràng...'
      }
    ]
  },
  family: {
    id: 'family',
    title: 'Tư Vấn Tâm Lý Gia Đình',
    shortTitle: 'Gia Đình',
    tagline: 'Hàn gắn khoảng cách thế hệ và giải tỏa kỳ vọng từ cha mẹ',
    description: 'Lắng nghe những xung đột quan điểm với phụ huynh, sự so sánh "con nhà người ta", cảm giác cô đơn hay thiếu sự thấu hiểu trong chính tổ ấm của mình.',
    iconName: 'Home',
    accentColor: 'text-blue-600',
    lightBg: 'bg-blue-50',
    borderColor: 'border-blue-200',
    buttonGradient: 'from-blue-500 to-indigo-600',
    commonTopics: [
      {
        id: 'parental-comparison',
        title: 'Bị bố mẹ so sánh với "con nhà người ta"',
        starterPrompt: 'Mỗi lần nói chuyện là bố mẹ lại lấy anh chị em hoặc bạn khác ra so sánh, chê bai mình lười biếng dù mình đã rất nỗ lực thức khuya học bài...'
      },
      {
        id: 'generation-gap',
        title: 'Bố mẹ không lắng nghe và áp đặt sở thích',
        starterPrompt: 'Bố mẹ luôn cho rằng suy nghĩ của mình là trẻ con, bắt mình phải theo ý phụ huynh từ cách ăn mặc đến sở thích và ước mơ sau này...'
      },
      {
        id: 'family-conflict',
        title: 'Không khí gia đình căng thẳng, hay cãi vã',
        starterPrompt: 'Bố mẹ hay to tiếng hoặc chiến tranh lạnh trong nhà khiến mình mỗi lần về nhà đều thấy nặng nề, lo âu và không thể tập trung học được...'
      },
      {
        id: 'high-expectations',
        title: 'Áp lực kỳ vọng quá lớn từ gia đình',
        starterPrompt: 'Gia đình đặt hết hy vọng vào mình phải đỗ trường chuyên/trường top. Mình sợ nếu không làm được thì sẽ khiến cả nhà thất vọng và xấu hổ...'
      }
    ]
  },
  social: {
    id: 'social',
    title: 'Tư Vấn Tâm Lý Xã Hội & Bạn Bè',
    shortTitle: 'Xã Hội & Bạn Bè',
    tagline: 'Xây dựng mối quan hệ lành mạnh, tình bạn và bản lĩnh tuổi teen',
    description: 'Đồng hành cùng bạn qua những trắc trở tình bạn, bị tẩy chay hay cô lập, rung động đầu đời, áp lực mạng xã hội và định hình cá tính riêng.',
    iconName: 'Users',
    accentColor: 'text-teal-600',
    lightBg: 'bg-teal-50',
    borderColor: 'border-teal-200',
    buttonGradient: 'from-sky-500 to-teal-600',
    commonTopics: [
      {
        id: 'left-out-clique',
        title: 'Bị bạn thân xa lánh / Cô lập trong nhóm',
        starterPrompt: 'Nhóm bạn thân bỗng dưng lập nhóm chat riêng không có mình, đi chơi cũng không rủ nữa. Mình cảm thấy bơ vơ và đau lòng khi đến lớp...'
      },
      {
        id: 'social-media-envy',
        title: 'Tự ti ngoại hình & Áp lực mạng xã hội',
        starterPrompt: 'Lướt Facebook/TikTok thấy ai cũng da đẹp, dáng xinh, nhiều like. Nhìn lại mình thì đầy khuyết điểm khiến mình không dám chụp ảnh hay tự tin giao tiếp...'
      },
      {
        id: 'first-crush-heartbreak',
        title: 'Rung động tuổi học trò & Bối rối tình cảm',
        starterPrompt: 'Mình đang có tình cảm với một bạn trong trường nhưng không biết phải làm sao, vừa sợ ảnh hưởng học tập vừa sợ bị bạn bè trêu chọc hoặc từ chối...'
      },
      {
        id: 'cyberbullying-rumor',
        title: 'Bị đồn thổi, nói xấu sau lưng',
        starterPrompt: 'Có một số bạn tung tin đồn thất thiệt về mình trên trang Confession trường hoặc trong nhóm kín. Mình rất sợ hãi và không dám đối diện với ai...'
      }
    ]
  }
};

export const CUTE_STUDENT_NAMES = [
  'Mây Trắng Lơ Lửng',
  'Ngôi Sao Nhỏ Chờ Sáng',
  'Chiếc Lá Mùa Thu',
  'Mèo Con Lạc Lối',
  'Cỏ Ba Lá Xanh',
  'Tia Nắng Sớm',
  'Hạt Dẻ Ấm Áp',
  'Cá Vàng Bơi Lội',
  'Chú Cú Mèo Đêm',
  'Bồ Công Anh Bay Xa',
  'Bầu Trời Bình Yên',
  'Cây Sen Đá Nhỏ'
];

export const FEELING_TAGS = [
  { id: 'anxious', label: '😰 Lo âu, bồn chồn', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'exhausted', label: '😫 Kiệt sức, mệt mỏi', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'lonely', label: '🥺 Lạc lõng, cô đơn', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'pressured', label: '🤯 Quá tải, áp lực', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'sad', label: '😢 Buồn tủi, dễ khóc', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'angry', label: '😤 Bực bội, ức chế', color: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'confused', label: '🤔 Mông lung, mất phương hướng', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'hopeful', label: '🌱 Mong muốn tìm lối thoát', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
];

export const DAILY_AFFIRMATIONS = [
  'Bạn không cần phải hoàn hảo để xứng đáng được yêu thương và tôn trọng.',
  'Một bài kiểm tra điểm kém không thể định nghĩa tương lai hay giá trị của bạn.',
  'Cảm thấy yếu đuối là điều bình thường. Bạn dũng cảm hơn bạn nghĩ rất nhiều!',
  'Hãy hít thở thật sâu. Mọi chuyện khó khăn rồi cũng sẽ có cách giải quyết.',
  'Hôm nay, bạn đã cố gắng hết sức rồi. Hãy tự ôm lấy mình một cái nhé!'
];

export const EMERGENCY_HOTLINES = [
  {
    name: 'Tổng đài Quốc gia Bảo vệ Trẻ em',
    number: '111',
    note: 'Miễn phí 24/7, tiếp nhận tư vấn bạo lực, xâm hại, tâm lý học sinh',
    badge: 'Khẩn cấp 24/7'
  },
  {
    name: 'Đường dây nóng Ngày Mai (Hỗ trợ trầm cảm & khủng hoảng)',
    number: '096 306 1414',
    note: 'Lắng nghe và hỗ trợ tinh thần chuyên sâu cho thanh thiếu niên',
    badge: 'Tư vấn tâm lý'
  },
  {
    name: 'Tổng đài Tâm sự Bạn trẻ (Viện Sức khỏe Tâm thần)',
    number: '1900 6444',
    note: 'Hỗ trợ giải đáp sức khỏe tâm thần và căng thẳng học đường',
    badge: 'Chuyên môn y tế'
  }
];

export const STRESS_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Trong 7 ngày qua, bạn có thường cảm thấy khó thư giãn, bồn chồn hoặc đứng ngồi không yên không?',
    options: [
      { label: 'Hầu như không bao giờ', points: 0 },
      { label: 'Thỉnh thoảng (1-2 ngày)', points: 1 },
      { label: 'Khá thường xuyên (3-4 ngày)', points: 2 },
      { label: 'Hầu như mỗi ngày', points: 3 }
    ]
  },
  {
    id: 2,
    question: 'Bạn có cảm thấy lo lắng thái quá về việc học tập, điểm số hoặc kỳ thi sắp tới?',
    options: [
      { label: 'Không lo lắng, mình thấy bình thản', points: 0 },
      { label: 'Có chút lo nhưng vẫn kiểm soát được', points: 1 },
      { label: 'Lo nhiều, đôi khi mất ngủ vì nghĩ tới', points: 2 },
      { label: 'Cực kỳ hoảng sợ và ám ảnh mỗi khi nghĩ đến', points: 3 }
    ]
  },
  {
    id: 3,
    question: 'Khi ở nhà hoặc ở trường, bạn có cảm giác dễ cáu gắt, nóng nảy hoặc muốn thu mình lại không?',
    options: [
      { label: 'Tâm trạng ổn định, vui vẻ', points: 0 },
      { label: 'Thỉnh thoảng hơi bực nếu bị làm phiền', points: 1 },
      { label: 'Hay khó chịu với bố mẹ hoặc bạn bè', points: 2 },
      { label: 'Rất dễ bùng nổ hoặc hoàn toàn thu mình lại', points: 3 }
    ]
  },
  {
    id: 4,
    question: 'Chất lượng giấc ngủ và năng lượng cơ thể của bạn gần đây như thế nào?',
    options: [
      { label: 'Ngủ ngon giấc, thức dậy sảng khoái', points: 0 },
      { label: 'Hơi khó ngủ một vài hôm', points: 1 },
      { label: 'Trằn trọc nhiều, sáng dậy mệt mỏi rã rời', points: 2 },
      { label: 'Mất ngủ thường xuyên hoặc luôn thấy kiệt sức', points: 3 }
    ]
  },
  {
    id: 5,
    question: 'Bạn có cảm thấy bản thân đang phải gánh vác quá nhiều kỳ vọng mà không thể chia sẻ cùng ai?',
    options: [
      { label: 'Mình có người thân thiết để tâm sự thoải mái', points: 0 },
      { label: 'Đôi lúc có giữ trong lòng nhưng không quá nặng', points: 1 },
      { label: 'Thấy cô đơn, ít ai thực sự hiểu mình', points: 2 },
      { label: 'Hoàn toàn bế tắc, cảm giác như một mình gánh cả thế giới', points: 3 }
    ]
  },
  {
    id: 6,
    question: 'Khả năng tập trung nghe giảng trên lớp hoặc khi tự học ở nhà của bạn dạo này ra sao?',
    options: [
      { label: 'Tập trung tốt, tiếp thu bài hiệu quả', points: 0 },
      { label: 'Đôi khi bị xao nhãng nhưng nhanh chóng quay lại được', points: 1 },
      { label: 'Rất khó tập trung, đầu óc hay trôi dạt lo âu', points: 2 },
      { label: 'Gần như không thể tập trung nổi, đọc mãi không vào chữ', points: 3 }
    ]
  },
  {
    id: 7,
    question: 'Cơ thể bạn có xuất hiện dấu hiệu căng thẳng (như đau đầu, tim đập nhanh, đau bụng, chán ăn hoặc ăn không kiểm soát) không?',
    options: [
      { label: 'Cơ thể khỏe mạnh, ăn uống điều độ', points: 0 },
      { label: 'Thỉnh thoảng hơi mệt nhẹ sau giờ học căng', points: 1 },
      { label: 'Thường xuyên đau đầu, hồi hộp hoặc rối loạn ăn uống', points: 2 },
      { label: 'Triệu chứng cơ thể rõ rệt gần như mỗi ngày', points: 3 }
    ]
  },
  {
    id: 8,
    question: 'Bạn có hay tự ti, so sánh bản thân với bạn bè đồng trang lứa hoặc chịu áp lực từ mạng xã hội không?',
    options: [
      { label: 'Mình tự tin vào giá trị và nhịp độ riêng của bản thân', points: 0 },
      { label: 'Đôi chút chạnh lòng nhưng nhanh chóng cân bằng lại', points: 1 },
      { label: 'Khá hay tự trách mình kém cỏi hơn người khác', points: 2 },
      { label: 'Luôn thấy mình thua kém, vô dụng và sợ bị đánh giá', points: 3 }
    ]
  },
  {
    id: 9,
    question: 'Mức độ hứng thú của bạn với những sở thích cá nhân (nghe nhạc, vẽ, thể thao, trò chuyện cùng bạn) hiện tại thế nào?',
    options: [
      { label: 'Vẫn hào hứng và tận hưởng các hoạt động yêu thích', points: 0 },
      { label: 'Ít thời gian hơn trước nhưng vẫn thấy vui khi tham gia', points: 1 },
      { label: 'Không còn nhiều hứng thú, làm cho có lệ', points: 2 },
      { label: 'Hoàn toàn chán nản, chẳng muốn làm bất cứ điều gì', points: 3 }
    ]
  },
  {
    id: 10,
    question: 'Khi nghĩ về lịch học tập và tương lai sắp tới, cảm giác chủ đạo trong bạn là gì?',
    options: [
      { label: 'Bình tĩnh, chủ động và có kế hoạch từng bước', points: 0 },
      { label: 'Hơi áp lực nhưng vẫn nhìn thấy hướng đi', points: 1 },
      { label: 'Rất ngột ngạt, sợ hãi mình sẽ thất bại', points: 2 },
      { label: 'Hoàn toàn quá tải, muốn bỏ cuộc hoặc trốn chạy tất cả', points: 3 }
    ]
  }
];
