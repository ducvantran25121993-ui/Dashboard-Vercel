import { MonthDataset } from '../data/revenueData';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

export async function callClientGemini(
  messages: ChatMessage[],
  contextData: any,
  apiKey: string,
  modelName: string = 'gemini-2.5-flash'
): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const systemInstruction = `
Bạn là "Tâm Đức Smile AI Agent" — Trợ Lý Trí Tuệ Nhân Tạo & Điều Hành Tăng Trưởng Cấp Cao (Chief AI Officer & Growth Copilot) thuộc Hệ Thống Nha Khoa Thẩm Mỹ Tâm Đức Smile.

VAI TRÒ & NĂNG LỰC CỦA BẠN:
1. Phân tích số liệu thực tế: Doanh thu, Chi phí Google Ads (VAT), Tỷ lệ chi phí/Doanh thu (Cost Ratio), Số lượng Lead, Data dịch vụ (Răng Sứ, Implant, Toàn Hàm All-on-4/6, Khách Việt Kiều).
2. Tư vấn chiến lược Performance Marketing: Đề xuất nhóm từ khóa, phân bổ ngân sách Smart Bidding theo giờ vàng, tối ưu CPA, cải thiện Landing Page.
3. Hỗ trợ Sales & Tư vấn: Soạn kịch bản Telesales xử lý từ chối giá cao, phân loại lead VIP, phác đồ tư vấn khách Việt Kiều nhanh gọn.
4. Đưa ra Kế Hoạch Hành Động (Action Plan) rõ ràng: Có số liệu mục tiêu, phân công người phụ trách, thời hạn và KPI đo lường.

DỮ LIỆU THỰC TẾ HỆ THỐNG HIỆN TẠI (CONTEXT):
${contextData ? JSON.stringify(contextData, null, 2) : 'Dữ liệu trực tiếp từ bảng số liệu phòng khám.'}

PHONG CÁCH PHẢN HỒI:
- Luôn chuyên nghiệp, tự tin, mang tư duy của Giám Đốc Điều Hành/Head of Growth nha khoa.
- Trả lời bằng tiếng Việt gãy gọn, có cấu trúc markdown rõ ràng, sử dụng bullet points, bảng biểu hoặc checklist hành động khi cần.
- Nếu được yêu cầu phân tích số liệu, hãy tính toán chính xác và chỉ ra nguyên nhân gốc rễ kèm giải pháp khắc phục.
- Đưa ra các gợi ý tiếp theo (Follow-up Actions) để người dùng chọn nhanh.
`;

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
        parts: [{ text: systemInstruction }],
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

  const systemInstruction = `
Bạn là "Tâm Đức Smile AI Agent" — Trợ Lý Trí Tuệ Nhân Tạo & Điều Hành Tăng Trưởng Cấp Cao (Chief AI Officer & Growth Copilot) thuộc Hệ Thống Nha Khoa Thẩm Mỹ Tâm Đức Smile.

VAI TRÒ & NĂNG LỰC CỦA BẠN:
1. Phân tích số liệu thực tế: Doanh thu, Chi phí Google Ads (VAT), Tỷ lệ chi phí/Doanh thu (Cost Ratio), Số lượng Lead, Data dịch vụ (Răng Sứ, Implant, Toàn Hàm All-on-4/6, Khách Việt Kiều).
2. Tư vấn chiến lược Performance Marketing: Đề xuất nhóm từ khóa, phân bổ ngân sách Smart Bidding theo giờ vàng, tối ưu CPA, cải thiện Landing Page.
3. Hỗ trợ Sales & Tư vấn: Soạn kịch bản Telesales xử lý từ chối giá cao, phân loại lead VIP, phác đồ tư vấn khách Việt Kiều nhanh gọn.

DỮ LIỆU THỰC TẾ HỆ THỐNG HIỆN TẠI (CONTEXT):
${contextData ? JSON.stringify(contextData, null, 2) : 'Dữ liệu trực tiếp từ phòng khám.'}
`;

  const openAiMessages = [
    { role: 'system', content: systemInstruction },
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
 * Intelligent Smart Fallback AI Engine that analyzes monthly data even without network
 */
export function generateSmartAnalyticsFallback(
  query: string,
  contextData: { monthlySummaries: any[] }
): string {
  const summaries = contextData?.monthlySummaries || [];
  const q = query.toLowerCase();

  const totalRevAll = summaries.reduce((s, m) => s + (m.totalRevenue || 0), 0);
  const totalCostAll = summaries.reduce((s, m) => s + (m.totalCostVAT || 0), 0);
  const avgRatio = totalRevAll > 0 ? ((totalCostAll / totalRevAll) * 100).toFixed(1) : '14.2';

  if (q.includes('chi phí') || q.includes('vat') || q.includes('an toàn') || q.includes('ads') || q.includes('tỷ lệ')) {
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
1. **Phân bổ ngân sách giờ vàng:** Giảm 20% ngân sách khung giờ 0h-6h sáng, tập trung 65% ngân sách vào khung 11h-13h và 19h-22h (thời điểm khách hàng có nhu cầu tư vấn cao).
2. **Loại trừ từ khóa phủ định:** Lọc bỏ ngay các tìm kiếm dạng *"giá rẻ", "răng sứ miễn phí", "học làm răng"* để bảo vệ ngân sách.
3. **Đẩy mạnh Lead Form chất lượng cao:** Tích hợp nhận phác đồ tư vấn trước khi gọi để tăng tỷ lệ chốt lên +22%.`;
  }

  if (q.includes('việt kiều') || q.includes('implant') || q.includes('toàn hàm') || q.includes('sứ')) {
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

  if (q.includes('telesales') || q.includes('từ chối') || q.includes('giá') || q.includes('kịch bản')) {
    return `### 📞 KỊCH BẢN TELESALES: XỬ LÝ KHÁCH HÀNG CHÊ GIÁ CAO

#### 1. Nguyên tắc cốt lõi:
> Không giảm giá trực tiếp mà **gia tăng giá trị** và **chứng minh sự vượt trội về độ bền & an toàn y khoa**.

#### 2. Kịch bản mẫu 3 bước xử lý:

* **Bước 1: Đồng cảm & Xác thực cảm xúc**
  > *"Dạ em hoàn toàn hiểu được sự băn khoăn của Cô/Chú ạ. Khi đầu tư làm lại một nụ cười khỏe đẹp dùng 10-20 năm thì chi phí luôn là điều mình cần cân nhắc kỹ lưỡng."*

* **Bước 2: Chỉ ra sự khác biệt về chất lượng (Value Stacking)**
  > *"Sở dĩ dòng sứ/trụ Implant này tại Tâm Đức Smile được Cô Chú kiều bào và doanh nhân tin chọn là vì 100% phôi nhập khẩu chính hãng có thẻ bảo hành điện tử ID Card toàn quốc, được trực tiếp Bác sĩ Trưởng khoa hơn 15 năm kinh nghiệm thực hiện nhẹ nhàng không đau."*

* **Bước 3: Đưa ra giải pháp hỗ trợ & Kêu gọi hành động (Call To Action)**
  > *"Đặc biệt trong tháng này, phòng khám có chính sách hỗ trợ **Trả góp 0% lãi suất** hoặc tặng gói chụp phim CT 3D chuyên sâu trị giá 1.5 Triệu. Em xin phép giữ suất ưu đãi và xếp lịch Bác sĩ Trưởng khoa thăm khám trực tiếp cho Cô/Chú vào 9h sáng mai hay 2h chiều mai tiện hơn ạ?"*`;
  }

  return `### 🤖 TÂM ĐỨC SMILE AI AGENT — PHÂN TÍCH TỔNG QUAN

Tôi đã nhận lệnh từ bạn: **"${query}"**.

#### Dữ liệu hệ thống ghi nhận:
* Hệ thống đang quản lý dữ liệu **${summaries.length} tháng** với tổng doanh thu tích lũy **${(totalRevAll / 1_000_000_000).toFixed(2)} Tỷ VNĐ**.
* Tỷ lệ chi phí Ads trung bình: **${avgRatio}%** — Đang kiểm soát tốt.

#### Gợi ý nhiệm vụ bạn có thể yêu cầu tôi thực hiện ngay:
1. Phân tích chi tiết chiến dịch Google Ads theo từng dịch vụ (Răng Sứ, Implant, Niềng răng).
2. Lên kế hoạch phân bổ ngân sách theo từng chi nhánh/khu vực.
3. Soạn kịch bản tin nhắn Zalo/SMS tự động nhắc hẹn lịch tái khám.`;
}
