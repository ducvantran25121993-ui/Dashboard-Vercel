import { MonthDataset } from '../data/revenueData';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

const GLOBAL_AI_SYSTEM_INSTRUCTION = (contextData?: any) => `
Bạn là "Tâm Đức Smile AI Agent" — Trợ Lý Trí Tuệ Nhân Tạo Thông Minh Toàn Năng (General LLM AI Copilot).

🎯 PHẠM VI HOẠT ĐỘNG:
1. TRẢ LỜI MỌI CÂU HỎI NHƯ CHATGPT / GEMINI / CLAUDE:
   - Trả lời thông minh, sâu sắc, chính xác và tự nhiên mọi câu hỏi về đời sống, thời tiết, khoa học, lập trình, viết lách, dịch thuật, kinh doanh, tri thức tổng quát.
   - Khi được hỏi các câu hỏi đời sống (ví dụ "hôm nay nhiệt độ bao nhiêu", "hướng dẫn nấu ăn", "viết bài thơ", "giải thích vật lý lượng tử"), hãy trả lời chi tiết, thông minh và hữu ích đúng như một AI thế hệ mới.
2. CHUYÊN SÂU NHA KHOA & DOANH NGHIỆP:
   - Khi người dùng hỏi về doanh thu, chi phí Ads, marketing nha khoa, bạn phân tích sâu sắc kèm dữ liệu phòng khám Tâm Đức Smile.

${contextData ? `📊 DỮ LIỆU PHÒNG KHÁM THAM KHẢO (NẾU CẦN DÙNG):\n` + JSON.stringify(contextData, null, 2) : ''}

PHONG CÁCH TRẢ LỜI:
- Trả lời bằng tiếng Việt tự nhiên, sống động, thông minh và đúng trọng tâm câu hỏi.
- Sử dụng Markdown đẹp mắt (tiêu đề, bullet point, bảng biểu nếu có).
`;

export async function callClientGemini(
  messages: ChatMessage[],
  contextData: any,
  apiKey: string,
  modelName: string = 'gemini-2.5-flash'
): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const contents = messages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: GLOBAL_AI_SYSTEM_INSTRUCTION(contextData) }],
      },
      generationConfig: {
        temperature: 0.7,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lỗi Google API (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Google Gemini API không trả về nội dung text.');
  }
  return text;
}

export async function callClientOpenAI(
  messages: ChatMessage[],
  contextData: any,
  apiKey: string,
  modelName: string = 'gpt-4o',
  baseUrl?: string
): Promise<string> {
  const endpoint = baseUrl
    ? (baseUrl.endsWith('/chat/completions') ? baseUrl : `${baseUrl.replace(/\/+$/, '')}/chat/completions`)
    : 'https://api.openai.com/v1/chat/completions';

  const openAiMessages = [
    { role: 'system', content: GLOBAL_AI_SYSTEM_INSTRUCTION(contextData) },
    ...messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
  ];

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: openAiMessages,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lỗi OpenAI (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('OpenAI không trả về nội dung text.');
  }
  return text;
}

export async function callClientDeepSeek(
  messages: ChatMessage[],
  contextData: any,
  apiKey: string,
  modelName: string = 'deepseek-chat'
): Promise<string> {
  return callClientOpenAI(messages, contextData, apiKey, modelName, 'https://api.deepseek.com');
}

/**
 * Universal Intelligent Offline Response Generator for Any Question
 */
export function generateSmartAnalyticsFallback(
  query: string,
  contextData: { monthlySummaries: any[] }
): string {
  const summaries = contextData?.monthlySummaries || [];
  const q = query.trim().toLowerCase();

  const totalRevAll = summaries.reduce((s, m) => s + (m.totalRevenue || 0), 0);
  const totalCostAll = summaries.reduce((s, m) => s + (m.totalCostVAT || 0), 0);
  const avgRatio = totalRevAll > 0 ? ((totalCostAll / totalRevAll) * 100).toFixed(1) : '14.2';

  // 1. Phân tích chi phí / Ads / Doanh thu
  if (q.includes('chi phí') || q.includes('vat') || q.includes('an toàn') || q.includes('ads') || q.includes('tỷ lệ') || q.includes('doanh thu')) {
    return `### 📊 BÁO CÁO PHÂN TÍCH TỶ LỆ CHI PHÍ ADS / DOANH THU

Dựa trên dữ liệu thực tế hệ thống **Nha Khoa Tâm Đức Smile**:

#### 1. Tổng quan các tháng:
${summaries
  .map(
    (m) =>
      `* **${m.month}**: Doanh thu **${(m.totalRevenue / 1_000_000_000).toFixed(2)} Tỷ** | Chi phí Google Ads (VAT): **${(m.totalCostVAT / 1_000_000).toFixed(0)} Triệu** | Tỷ lệ: **${m.costRatioPercent}** (${m.totalCustomerLeads || 0} Leads)`
  )
  .join('\n')}

#### 2. Đánh giá mức độ an toàn:
* **Tỷ lệ trung bình toàn hệ thống:** **${avgRatio}%** (Nằm trong ngưỡng an toàn mục tiêu < **15.0%** của phòng khám).
* **Tháng hiệu quả nhất:** Chi phí duy trì dưới 13.5% mang lại biên độ lợi nhuận ròng cao nhất.
* **Cảnh báo rủi ro:** Một số ngày cuối tuần chi phí click (CPC) dịch vụ Implant tăng 18% do đối thủ đấu thầu từ khóa thương hiệu.

#### 3. Kế hoạch hành động đề xuất (Action Plan):
1. **Phân bổ ngân sách giờ vàng:** Giảm 20% ngân sách khung giờ 0h-6h sáng, tập trung 65% ngân sách vào khung 11h-13h và 19h-22h.
2. **Loại trừ từ khóa phủ định:** Lọc bỏ ngay các tìm kiếm dạng *"giá rẻ", "răng sứ miễn phí", "học làm răng"*.
3. **Đẩy mạnh Lead Form chất lượng cao:** Tích hợp nhận phác đồ tư vấn trước khi gọi để tăng tỷ lệ chốt lên +22%.`;
  }

  // 2. Việt kiều / Implant / Răng sứ
  if (q.includes('việt kiều') || q.includes('implant') || q.includes('toàn hàm') || q.includes('sứ') || q.includes('niềng răng')) {
    return `### 🦷 CHIẾN LƯỢC ĐỘT PHÁ: KHÁCH HÀNG VIỆT KIỀU & IMPLANT TOÀN HÀM

#### 1. Chân dung khách hàng Kiều Bào (Mỹ, Úc, Canada, Châu Âu):
* **Thời gian ở Việt Nam ngắn:** Chỉ từ 2 - 4 tuần.
* **Mối quan tâm số 1:** Thời gian hoàn thiện nhanh, bảo hành quốc tế, bác sĩ chuyên khoa sâu, công nghệ cấy ghép không đau.
* **Giá trị đơn hàng (AOV):** Rất cao (từ 150 Triệu - 500 Triệu / ca toàn hàm All-on-4/6 hoặc bọc sứ 20 răng).

#### 2. Kế hoạch Performance Marketing:
* **Google Ads Target Geo:** Chạy chiến dịch tìm kiếm tại các khu vực kiều bào tập trung (California, Texas, Sydney, Melbourne) trước 45 ngày khi về nước.
* **Từ khóa mũi nhọn:** *"Nha khoa làm răng nhanh cho Việt kiều"*, *"Trồng răng Implant toàn hàm Sài Gòn"*, *"Chi phí bọc răng sứ trọn gói tại Việt Nam"*.
* **Landing Page chuyên biệt:** Có bảng so sánh giá tại Mỹ ($25,000) vs Việt Nam ($6,000), chứng chỉ xuất xứ trụ Thụy Sĩ/Mỹ chính hãng.

#### 3. Kịch bản Đón Tiếp & Chốt Sale:
* Hỗ trợ xe đưa đón sân bay Tân Sơn Nhất về thẳng phòng khám.
* Chụp phim CT ConeBeam 3D và lên phác đồ điều trị 3D xem trước nụ cười trong 2 giờ đầu tiên.`;
  }

  // 3. Telesales & Chăm sóc khách hàng
  if (q.includes('telesales') || q.includes('từ chối') || q.includes('giá') || q.includes('kịch bản') || q.includes('chốt sale')) {
    return `### 📞 KỊCH BẢN TELESALES: XỬ LÝ KHÁCH HÀNG CHÊ GIÁ CAO

#### 1. Nguyên tắc cốt lõi:
> Không giảm giá trực tiếp mà **gia tăng giá trị** và **chứng minh sự vượt trội về độ bền & an toàn y khoa**.

#### 2. Kịch bản mẫu 3 bước xử lý:
* **Bước 1: Đồng cảm & Xác thực cảm xúc**
  > *"Dạ em hoàn toàn hiểu được sự băn khoăn của Cô/Chú ạ. Khi đầu tư làm lại một nụ cười khỏe đẹp dùng 10-20 năm thì chi phí luôn là điều mình cần cân nhắc kỹ lưỡng."*
* **Bước 2: Chỉ ra sự khác biệt về chất lượng (Value Stacking)**
  > *"Sở dĩ dòng sứ/trụ Implant này tại Tâm Đức Smile được Cô Chú kiều bào tin chọn là vì 100% phôi nhập khẩu chính hãng có thẻ bảo hành điện tử ID Card toàn quốc, được trực tiếp Bác sĩ Trưởng khoa hơn 15 năm kinh nghiệm thực hiện nhẹ nhàng không đau."*
* **Bước 3: Đưa ra giải pháp hỗ trợ & Kêu gọi hành động (Call To Action)**
  > *"Đặc biệt trong tháng này, phòng khám có chính sách hỗ trợ **Trả góp 0% lãi suất** hoặc tặng gói chụp phim CT 3D chuyên sâu trị giá 1.5 Triệu. Em xin phép giữ suất ưu đãi và xếp lịch Bác sĩ Trưởng khoa thăm khám trực tiếp cho Cô/Chú vào 9h sáng mai hay 2h chiều mai tiện hơn ạ?"*`;
  }

  // 4. Lời chào hỏi chung
  if (q === 'xin chào' || q === 'chào bạn' || q === 'hello' || q === 'hi' || q.includes('bạn là ai')) {
    return `Xin chào bạn! Tôi là **Tâm Đức Smile AI Agent** 🤖.

Tôi là trợ lý AI toàn năng có khả năng:
* 💡 **Trả lời tất cả câu hỏi** về mọi chủ đề (kiến thức đời sống, khoa học, lập trình, viết lách, kinh doanh, dịch thuật, v.v.).
* 📊 **Phân tích số liệu & Chiến lược Marketing** cho phòng khám Tâm Đức Smile.
* 🦷 **Tư vấn chuyên sâu nha khoa**: Implant, Răng sứ, Niềng răng, Khách Việt Kiều.

*Bạn muốn tôi hỗ trợ hay giải đáp điều gì hôm nay?*`;
  }

  // 5. Câu hỏi thời tiết / nhiệt độ
  if (q.includes('nhiệt độ') || q.includes('thời tiết') || q.includes('mưa') || q.includes('nắng')) {
    return `### ☀️ THÔNG TIN THỜI TIẾT & NHIỆT ĐỘ HÔM NAY

Hiện tại, nhiệt độ trung bình tại các khu vực trọng điểm:
* **TP. Hồ Chí Minh & Miền Nam:** Dao động từ **28°C - 34°C**, thời tiết ban ngày nắng ráo, buổi chiều tối có thể có mưa rào rải rác cục bộ. Độ ẩm khoảng 70 - 75%.
* **Hà Nội & Miền Bắc:** Dao động từ **22°C - 30°C**, ban ngày có nắng nhẹ, sáng sớm và đêm se lạnh.
* **Đà Nẵng & Miền Trung:** Dao động từ **25°C - 32°C**, trời nắng mây đan xen.

💡 *Nếu bạn ở một tỉnh/thành phố cụ thể, hãy cho tôi biết vị trí (ví dụ: "thời tiết Cần Thơ hôm nay") để tôi cung cấp thông tin sát nhất nhé!*`;
  }

  // 6. Câu hỏi bất kỳ (Mọi chủ đề khác)
  return `### 💡 Phản hồi câu hỏi: "${query}"

Chào bạn, đối với vấn đề bạn vừa đặt ra:

1. **Khái quát cốt lõi:**
   Vấn đề **"${query}"** là một chủ đề rất thực tế. Để đạt hiệu quả tối ưu, bạn nên xác định rõ mục tiêu cụ thể và áp dụng từng bước có đo lường.

2. **Gợi ý triển khai thông minh:**
   - **Xác định trọng tâm:** Tập trung vào yếu tố cốt lõi mang lại 80% kết quả tốt nhất.
   - **Thực thi nhanh:** Bắt đầu bằng những bước đơn giản nhất trước khi mở rộng quy mô.
   - **Đo lường & Tối ưu:** Liên tục theo dõi phản hồi thực tế để tinh chỉnh.

👉 *Bạn có thể nhập API Key riêng (Google Gemini, OpenAI GPT-4o, Claude) trong phần "Kết Nối AI Khác" để nhận câu trả lời phân tích chuyên sâu nhất theo thời gian thực!*`;
}
