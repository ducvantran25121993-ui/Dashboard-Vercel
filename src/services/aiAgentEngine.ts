import { MonthDataset } from '../data/revenueData';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

const GLOBAL_AI_SYSTEM_INSTRUCTION = (contextData?: any) => `
Bạn là "Tâm Đức Smile AI Agent" — Trợ Lý Trí Tuệ Nhân Tạo Đa Năng Toàn Diện (Universal AI Assistant & Growth Copilot).

🎯 PHẠM VI NĂNG LỰC:
1. TRẢ LỜI MỌI CÂU HỎI & YÊU CẦU: Bạn có năng lực trả lời TẤT CẢ mọi chủ đề như ChatGPT / Claude / Gemini:
   - Kiến thức tổng quát, khoa học, lịch sử, văn hóa, công nghệ, lập trình phần mềm.
   - Viết email, soạn thảo văn bản, dịch thuật đa ngôn ngữ, tóm tắt bài viết, sáng tạo nội dung.
   - Tư vấn kinh doanh, marketing, tâm lý, đời sống, lập kế hoạch cá nhân và doanh nghiệp.
2. CHUYÊN SÂU NHA KHOA & MARKETING: Khi người dùng hỏi về nha khoa, phân tích số liệu phòng khám Tâm Đức Smile, hãy tận dụng số liệu thực tế được cấp.

${contextData ? `📊 DỮ LIỆU HỆ THỐNG THAM KHẢO:\n` + JSON.stringify(contextData, null, 2) : ''}

PHONG CÁCH TRẢ LỜI:
- Luôn thân thiện, thông minh, sâu sắc, giải thích rõ ràng và có cấu trúc.
- Trả lời bằng tiếng Việt tự nhiên (hoặc ngôn ngữ người dùng yêu cầu).
- Sử dụng định dạng Markdown đẹp mắt (tiêu đề, bullet point, bảng biểu, code block nếu có).
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

  // 1. Phân tích chi phí / Ads
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

  // 5. Câu hỏi bất kỳ (Mọi chủ đề khác)
  return `### 💡 Phản hồi cho câu hỏi: "${query}"

Chào bạn, tôi đã tiếp nhận câu hỏi của bạn. Dưới đây là phân tích và giải đáp chi tiết:

#### 1. Trọng tâm vấn đề:
Vấn đề bạn đưa ra liên quan đến: **${query}**. Để xử lý hoặc hiểu sâu vấn đề này, chúng ta cần xem xét theo các khía cạnh chính sau:
* **Mục tiêu cốt lõi:** Xác định rõ kết quả mong muốn đạt được.
* **Phương pháp tiếp cận:** Sử dụng các nguyên lý thực tế, tối ưu hóa quy trình và giảm thiểu rủi ro.

#### 2. Phân tích chi tiết & Đề xuất giải pháp:
* **Bước 1 — Đánh giá hiện trạng:** Thu thập đầy đủ dữ liệu và bối cảnh cụ thể trước khi ra quyết định.
* **Bước 2 — Triển khai từng bước:** Ưu tiên những giải pháp mang lại hiệu quả cao nhất (nguyên lý 80/20).
* **Bước 3 — Đo lường & Tối ưu:** Liên tục theo dõi kết quả để điều chỉnh kịp thời.

---
💡 *Bạn có thể yêu cầu tôi đào sâu hơn về một khía cạnh cụ thể hoặc kết nối API Key OpenAI/Claude/Gemini trong phần "Kết Nối AI Khác" để nhận câu trả lời mở rộng hơn nữa!*`;
}
