import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
});

// API endpoint to generate innovation initiatives
app.post('/api/generate-initiatives', async (req, res) => {
  try {
    const { focusTopic, currentMetrics } = req.body;

    let gemini: GoogleGenAI;
    try {
      gemini = getGeminiClient();
    } catch (err: any) {
      return res.status(500).json({
        error: 'Chưa cấu hình API Key Gemini hoặc API Key không hợp lệ.',
        details: err.message,
      });
    }

    const prompt = `
Bạn là Giám đốc Tăng trưởng (Head of Growth) & Chuyên gia Tối ưu Google Ads và Marketing cho Hệ thống Nha Khoa thẩm mỹ cao cấp tại Việt Nam.
Nhiệm vụ của bạn: Đề xuất 4 đến 6 Sáng kiến / Thử nghiệm Đổi mới (Growth Initiatives / Growth Hacks) cụ thể, thực tế, mang tính đột phá và khả thi cao theo tiêu chí "Đi tìm cái CHƯA CÓ — sinh động".

Bối cảnh hiện tại:
${currentMetrics ? JSON.stringify(currentMetrics, null, 2) : 'Tập trung đẩy mạnh doanh thu dịch vụ Răng Sứ, Trồng Răng Implant, Khách Hàng Việt Kiều và tối ưu chi phí Google Ads.'}

Chủ đề ưu tiên đặc biệt: ${focusTopic || 'Tất cả các mảng: Livestream, Mini-tool AI, Tối ưu Landing Page, Chăm sóc Việt Kiều, Tối ưu Google Ads, Sales Copilot'}

Hãy trả về danh sách các sáng kiến với định dạng JSON chuẩn (mảng các object):
- title: Tên sáng kiến ngắn gọn, cuốn hút, chuyên nghiệp (ví dụ: 'Mini-tool "Dự đoán nụ cười AI & chi phí bọc sứ"')
- target: Mục tiêu cốt lõi và đo lường được (ví dụ: 'Mở kênh tiếp cận khách hàng cao cấp & Việt Kiều')
- description: Mô tả chi tiết cách thức triển khai cụ thể trong 1-2 câu
- status: Trạng thái gợi ý (chọn 1 trong: 'Đang test', 'Đề xuất mới', 'Tối ưu A/B', 'Đã triển khai')
- owner: Bộ phận thực thi (ví dụ: 'Team Google Ads', 'Team Content & Media', 'Team CSKH & VK', 'Team Tech & Growth')
- impact: Hiệu quả kỳ vọng về doanh thu / chi phí (ví dụ: '+25% Tỉ lệ chốt lead', '-14% Chi phí VAT', '+30% Khách VK')
- leadsEstimate: Dự toán số lead hoặc hiệu quả (ví dụ: '350+ leads/tháng', 'Tối ưu CPA', '200+ khách/tháng')
- keyActions: Mảng gồm 3 gạch đầu dòng các bước hành động cụ thể để triển khai ngay
`;

    const response = await gemini.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              target: { type: Type.STRING },
              description: { type: Type.STRING },
              status: { type: Type.STRING },
              owner: { type: Type.STRING },
              impact: { type: Type.STRING },
              leadsEstimate: { type: Type.STRING },
              keyActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['title', 'target', 'description', 'status', 'owner', 'impact', 'leadsEstimate'],
          },
        },
      },
    });

    const outputText = response.text || '[]';
    const parsedData = JSON.parse(outputText);
    return res.json({ success: true, initiatives: parsedData });
  } catch (error: any) {
    console.error('Error generating initiatives:', error);
    return res.status(500).json({
      error: 'Không thể tạo sáng kiến bằng AI lúc này.',
      details: error.message,
    });
  }
});

// API endpoint for AI Agent Assistant & Copilot with tools and system capabilities
app.post('/api/ai-agent-chat', async (req, res) => {
  try {
    const { messages, contextData, agentPersona, provider = 'gemini', model, customApiKey, customBaseUrl } = req.body;

    const systemInstruction = `
Bạn là "Tâm Đức Smile AI Agent" — Trợ Lý Trí Tuệ Nhân Tạo Toàn Năng (General AI Assistant & Chief Growth Copilot).

NĂNG LỰC & PHẠM VI HOÀN TOÀN TỰ DO CỦA BẠN:
1. TRẢ LỜI MỌI CÂU HỎI: Bạn có thể trả lời TẤT CẢ mọi chủ đề như ChatGPT/Gemini (từ kiến thức đời sống, khoa học, lập trình, viết lách, dịch thuật, kinh doanh, tiếp thị, mẹo vặt, văn hóa, tài chính, phân tích đến hỏi đáp thông thường).
2. CHUYÊN GIA NHA KHOA & DOANH NGHIỆP: Khi được hỏi về nha khoa, marketing hoặc hệ thống Tâm Đức Smile, bạn phân tích sâu sắc kết hợp số liệu thực tế được cấp.

DỮ LIỆU HỆ THỐNG PHÒNG KHÁM (NẾU CẦN THAM KHẢO):
${contextData ? JSON.stringify(contextData, null, 2) : 'Dữ liệu được đồng bộ trực tiếp từ phòng khám.'}

PHONG CÁCH TRẢ LỜI:
- Thân thiện, thông minh, sâu sắc, giải thích rõ ràng và có cấu trúc.
- Trả lời bằng tiếng Việt tự nhiên (hoặc đúng ngôn ngữ người dùng yêu cầu).
- Sử dụng định dạng Markdown đẹp mắt (tiêu đề, bullet point, in đậm, code block nếu là lập trình).
`;

    // 1. OPENAI (ChatGPT GPT-4o, o3-mini) or Compatible API (DeepSeek, Groq, OpenRouter, Custom)
    if (provider === 'openai' || provider === 'deepseek' || provider === 'custom') {
      const apiKey = customApiKey || process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: `Chưa có API Key cho ${provider.toUpperCase()}. Vui lòng nhập API Key trong phần "Kết Nối AI Khác" trên giao diện.`,
        });
      }

      let endpointUrl = 'https://api.openai.com/v1/chat/completions';
      if (provider === 'deepseek') {
        endpointUrl = 'https://api.deepseek.com/chat/completions';
      } else if (provider === 'custom' && customBaseUrl) {
        endpointUrl = customBaseUrl.endsWith('/chat/completions')
          ? customBaseUrl
          : `${customBaseUrl.replace(/\/+$/, '')}/chat/completions`;
      }

      const openAiMessages = [
        { role: 'system', content: systemInstruction },
        ...(messages || []).map((m: { role: string; content: string }) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
      ];

      const defaultModel =
        provider === 'deepseek'
          ? 'deepseek-chat'
          : provider === 'openai'
          ? (model || 'gpt-4o')
          : (model || 'gpt-4o-mini');

      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model || defaultModel,
          messages: openAiMessages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          error: `Lỗi từ ${provider.toUpperCase()}: ${errorText}`,
        });
      }

      const resData: any = await response.json();
      const reply = resData.choices?.[0]?.message?.content || 'Không có phản hồi từ mô hình AI.';
      return res.json({ success: true, reply, providerUsed: provider });
    }

    // 2. ANTHROPIC CLAUDE
    if (provider === 'claude') {
      const apiKey = customApiKey || process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: 'Chưa có API Key Anthropic Claude. Vui lòng nhập API Key trong phần "Kết Nối AI Khác".',
        });
      }

      const claudeMessages = (messages || []).map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: model || 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          system: systemInstruction,
          messages: claudeMessages,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          error: `Lỗi từ Anthropic Claude: ${errorText}`,
        });
      }

      const resData: any = await response.json();
      const reply = resData.content?.[0]?.text || 'Không có phản hồi từ Claude.';
      return res.json({ success: true, reply, providerUsed: 'claude' });
    }

    // 3. DEFAULT: GOOGLE GEMINI
    let gemini: GoogleGenAI;
    const effectiveGeminiKey = customApiKey || process.env.GEMINI_API_KEY;
    if (!effectiveGeminiKey) {
      return res.status(500).json({
        error: 'Chưa cấu hình API Key Gemini. Vui lòng nhập API Key trong phần "Kết Nối AI Khác".',
      });
    }
    try {
      gemini = new GoogleGenAI({ apiKey: effectiveGeminiKey });
    } catch (err: any) {
      return res.status(500).json({
        error: 'Khởi tạo Google GenAI SDK thất bại: ' + err.message,
        details: err.message,
      });
    }

    const formattedContents = (messages || []).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    let reply = '';
    const preferredModel = model || 'gemini-3.7-flash';

    try {
      const response = await gemini.models.generateContent({
        model: preferredModel,
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
      reply = response.text || '';
    } catch (modelErr: any) {
      console.warn(`Error generating content with model ${preferredModel}:`, modelErr.message);
      // Try fallback to gemini-2.5-flash
      if (preferredModel !== 'gemini-2.5-flash') {
        try {
          const fallbackRes = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: formattedContents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          reply = fallbackRes.text || '';
        } catch (fErr: any) {
          throw new Error(`Cả 2 mô hình (${preferredModel} và gemini-2.5-flash) đều lỗi: ${fErr.message}`);
        }
      } else {
        throw modelErr;
      }
    }

    if (!reply) {
      reply = 'Xin lỗi, tôi chưa thể đưa ra phản hồi lúc này.';
    }
    return res.json({ success: true, reply, providerUsed: 'gemini' });
  } catch (error: any) {
    console.error('Error in AI Agent Chat:', error);
    return res.status(500).json({
      error: 'Không thể xử lý yêu cầu trò chuyện AI lúc này.',
      details: error.message,
    });
  }
});

// API endpoint for AI Campaign Analysis (Google Ads Campaign Optimization)
app.post('/api/analyze-campaigns', async (req, res) => {
  try {
    const { campaigns, summaryMetrics, customQuestion, focusCampaign, timeRange } = req.body;

    let gemini: GoogleGenAI;
    try {
      gemini = getGeminiClient();
    } catch (err: any) {
      return res.status(500).json({
        error: 'Chưa cấu hình API Key Gemini hoặc API Key không hợp lệ.',
        details: err.message,
      });
    }

    const campaignSummaryList = (campaigns || []).slice(0, 50).map((c: any) => ({
      name: c.name,
      status: c.status,
      type: c.type,
      spent: c.spent || `${c.spentNum?.toLocaleString('vi-VN')} đ`,
      clicks: c.clicks,
      impressions: c.impressions,
      leads: c.leads,
      cpa: c.cpa,
      cpc: c.cpc,
      ctr: c.ctr,
      convRate: c.convRate,
    }));

    const systemInstruction = `
Bạn là Chuyên Gia Cấp Cao Tối Ưu Hóa Google Ads & Giám Đốc Tiếp Thị Số (Senior Google Ads Specialist & CMO) cho Hệ Thống Nha Khoa Tâm Đức Smile.
Nhiệm vụ của bạn là phân tích sâu sắc các chiến dịch Google Ads đang chạy, phát hiện các điểm nghẽn, các chiến dịch xuất sắc và đề xuất phương án tối ưu ngân sách, giảm CPA, tăng tỷ lệ chuyển đổi.

DỮ LIỆU TỔNG QUAN TÀI KHOẢN:
- Khoảng thời gian phân tích: ${timeRange || 'Khoảng thời gian đang chọn'}
- Tổng chi phí: ${summaryMetrics?.totalSpent ? summaryMetrics.totalSpent.toLocaleString('vi-VN') + ' đ' : 'N/A'}
- Tổng lượt chuyển đổi: ${summaryMetrics?.totalConversions ? summaryMetrics.totalConversions.toLocaleString('vi-VN') : 'N/A'}
- Tổng clicks: ${summaryMetrics?.totalClicks ? summaryMetrics.totalClicks.toLocaleString('vi-VN') : 'N/A'}
- CTR trung bình: ${summaryMetrics?.avgCtr || 'N/A'}
- CPA trung bình: ${summaryMetrics?.avgCpa ? summaryMetrics.avgCpa.toLocaleString('vi-VN') + ' đ' : 'N/A'}
- CPC trung bình: ${summaryMetrics?.avgCpc ? summaryMetrics.avgCpc.toLocaleString('vi-VN') + ' đ' : 'N/A'}
- Tổng số chiến dịch: ${campaigns?.length || 0} (${campaigns?.filter((c: any) => c.status === 'Đang chạy').length || 0} đang chạy)

DANH SÁCH CHI TIẾT CHIẾN DỊCH:
${JSON.stringify(campaignSummaryList, null, 2)}
`;

    const userPrompt = focusCampaign
      ? `Hãy phân tích chuyên sâu riêng cho chiến dịch: "${focusCampaign.name}".
Dữ liệu chiến dịch:
- Trạng thái: ${focusCampaign.status}
- Loại: ${focusCampaign.type}
- Chi phí: ${focusCampaign.spent}
- Lượt nhấp: ${focusCampaign.clicks} (Hiển thị: ${focusCampaign.impressions})
- CTR: ${focusCampaign.ctr}
- CPC trung bình: ${focusCampaign.cpc}
- Lượt chuyển đổi: ${focusCampaign.leads}
- CPA: ${focusCampaign.cpa}
- Tỷ lệ chuyển đổi: ${focusCampaign.convRate}

Đưa ra đánh giá:
1. Hiệu suất chiến dịch này có đạt chuẩn hay không so với mặt bằng nha khoa?
2. Điểm mạnh và điểm yếu cụ thể (CTR, CPC, CPA).
3. 3 hành động cụ thể để tối ưu chiến dịch này ngay (điều chỉnh ngân sách, từ khóa phủ định, mẫu quảng cáo, trang đích).`
      : customQuestion
      ? `Người dùng hỏi: "${customQuestion}". Hãy dựa vào toàn bộ số liệu các chiến dịch trên để trả lời chi tiết, thực tế và có số liệu chứng minh.`
      : `Hãy thực hiện một báo cáo Kiểm Tra & Tối Ưu Toàn Diện (Full Google Ads Audit & Action Plan) cho các chiến dịch:
1. **Đánh giá tổng quan & Điểm hiệu suất (Health Score từ 1-100)**.
2. **Top 3 - 5 Chiến dịch Hiệu Quả Nhất**: Những chiến dịch đang mang lại nhiều Lead nhất với CPA tối ưu (phân tích tại sao hiệu quả).
3. **Top 3 - 5 Chiến dịch Cần Tối Ưu / Lãng Phí Ngân Sách**: Những chiến dịch có CPA quá cao, CTR thấp hoặc tốn ngân sách nhưng ít chuyển đổi.
4. **Phân tích theo Dịch Vụ Cốt Lõi**:
   - Trồng Răng Implant (HCM & Tỉnh)
   - Bọc Răng Sứ Thẩm Mỹ
   - Khách Hàng Việt Kiều (Châu Á, Mỹ, Châu Âu)
   - Performance Max (PMax) & Video Youtube
5. **Kế hoạch hành động cụ thể trong 7 ngày tới**:
   - Điều chỉnh ngân sách (chiến dịch nào nên tăng ngân sách, chiến dịch nào nên giảm/tạm dừng).
   - Tối ưu giá thầu (Bidding Strategy: Target CPA, Maximize Conversions).
   - Tối ưu mẫu quảng cáo và từ khóa phủ định.`;

    const response = await gemini.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: [
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Không có phản hồi phân tích từ AI.';
    return res.json({ success: true, analysis: reply });
  } catch (error: any) {
    console.error('Error analyzing campaigns:', error);
    return res.status(500).json({
      error: 'Không thể phân tích chiến dịch bằng AI lúc này.',
      details: error.message,
    });
  }
});

// API endpoint for 7-Day Automated Campaign Performance & AI Recommendations
app.post('/api/analyze-7days-campaigns', async (req, res) => {
  try {
    const { 
      current7DaysMetrics, 
      previous7DaysMetrics, 
      topCampaigns, 
      warningCampaigns, 
      allCampaignsSample,
      dateRangeLabel 
    } = req.body;

    let gemini: GoogleGenAI;
    try {
      gemini = getGeminiClient();
    } catch (err: any) {
      return res.status(500).json({
        error: 'Chưa cấu hình API Key Gemini hoặc API Key không hợp lệ.',
        details: err.message,
      });
    }

    const systemInstruction = `
Bạn là Giám Đốc Tối Ưu Hóa Hiệu Suất Google Ads Cấp Cao (Chief Performance Marketing Officer) chuyên sâu về ngành Nha Khoa Thẩm Mỹ & Cấy Ghép Implant tại Việt Nam.
Nhiệm vụ: Phân tích số liệu chu kỳ 7 ngày gần nhất (đã kết thúc ngày hôm qua) so với 7 ngày trước đó, đưa ra đánh giá thực tế và các gợi ý hành động chiến lược cực kỳ chi tiết, cụ thể cho từng chiến dịch để đội ngũ Media Buyer thực thi ngay lập tức.

Phong cách phản hồi:
- Chuyên nghiệp, trực diện, số liệu rõ ràng (không nói chung chung).
- Sử dụng thuật ngữ chuẩn Google Ads: CPA, CPC, CTR, Conversion Rate, Target CPA, Maximize Conversions, Negative Keywords, Match Types, Ad Copy, Quality Score.
- Định dạng Markdown đẹp mắt, có bullet points, bảng biểu và icon trực quan.
`;

    const userPrompt = `
BÁO CÁO PHÂN TÍCH HIỆU SUẤT 7 NGÀY GẦN NHẤT & ĐỀ XUẤT TỐI ƯU CHIẾN DỊCH GOOGLE ADS
Thời gian phân tích: ${dateRangeLabel || '7 ngày gần nhất'}

1. SỐ LIỆU TỔNG QUAN 7 NGÀY GẦN NHẤT:
- Tổng chi phí 7 ngày: ${current7DaysMetrics?.totalSpent ? current7DaysMetrics.totalSpent.toLocaleString('vi-VN') + ' đ' : 'N/A'} (So với 7 ngày trước: ${previous7DaysMetrics?.totalSpent ? previous7DaysMetrics.totalSpent.toLocaleString('vi-VN') + ' đ' : 'N/A'})
- Tổng lượt chuyển đổi (Leads): ${current7DaysMetrics?.totalConversions ? current7DaysMetrics.totalConversions.toLocaleString('vi-VN') : 'N/A'} (7 ngày trước: ${previous7DaysMetrics?.totalConversions ? previous7DaysMetrics.totalConversions.toLocaleString('vi-VN') : 'N/A'})
- Chi phí trên mỗi chuyển đổi (CPA): ${current7DaysMetrics?.avgCpa ? current7DaysMetrics.avgCpa.toLocaleString('vi-VN') + ' đ' : 'N/A'} (7 ngày trước: ${previous7DaysMetrics?.avgCpa ? previous7DaysMetrics.avgCpa.toLocaleString('vi-VN') + ' đ' : 'N/A'})
- Lượt nhấp (Clicks): ${current7DaysMetrics?.totalClicks ? current7DaysMetrics.totalClicks.toLocaleString('vi-VN') : 'N/A'}
- Tỷ lệ nhấp (CTR): ${current7DaysMetrics?.avgCtr || 'N/A'}
- Giá mỗi nhấp chuột (CPC): ${current7DaysMetrics?.avgCpc ? current7DaysMetrics.avgCpc.toLocaleString('vi-VN') + ' đ' : 'N/A'}

2. TOP CHIẾN DỊCH HIỆU QUẢ CAO TRONG 7 NGÀY (CPA TỐT, NHIỀU LEAD):
${JSON.stringify(topCampaigns || [], null, 2)}

3. CHIẾN DỊCH CẢNH BÁO LÃNG PHÍ HOẶC CPA TĂNG CAO TRONG 7 NGÀY:
${JSON.stringify(warningCampaigns || [], null, 2)}

4. MẪU CÁC CHIẾN DỊCH TIÊU BIỂU KHÁC:
${JSON.stringify(allCampaignsSample || [], null, 2)}

---
YÊU CẦU BÁO CÁO:
Hãy xây dựng bản Báo Cáo & Đề Xuất Tối Ưu Chiến Dịch sau 7 ngày gồm các phần sau:

### 1. 📊 ĐÁNH GIÁ TỔNG QUAN & ĐIỂM SỨC KHỎE TÀI KHOẢN (Health Score / 100)
- Tóm tắt biến động chính trong 7 ngày qua (Tăng/giảm chi phí, số lượng lead, CPA có bị đội giá hay tối ưu tốt hơn).
- Nhận định ngắn gọn về xu hướng thị trường nha khoa và sức cạnh tranh từ khóa trong tuần qua.

### 2. 🚀 ĐỀ XUẤT SCALE & TĂNG NGÂN SÁCH (Top Chiến Dịch Thắng Lớn)
- Chỉ rõ 2-3 chiến dịch xuất sắc nhất nên tăng ngân sách bao nhiêu % (ví dụ: +15% đến +25%).
- Đề xuất mở rộng từ khóa, mở rộng tệp vị trí hoặc tối ưu ngân sách ngày cụ thể.

### 3. ⚠️ ĐỀ XUẤT XỬ LÝ & CẮT GIẢM CHI PHÍ (Chiến Dịch Kém Hiệu Quả / Ngốn Ngân Sách)
- Chỉ rõ 2-3 chiến dịch đang có CPA quá cao hoặc tiêu nhiều tiền nhưng ít lead.
- Hành động xử lý ngay: Giảm ngân sách, hạ giá thầu trần (Max CPC), tạm dừng nhóm quảng cáo kém hoặc chuyển chiến lược đấu thầu.

### 4. 🎯 DANH SÁCH 10+ TỪ KHÓA PHỦ ĐỊNH (NEGATIVE KEYWORDS) CẦN THÊM NGAY
- Đề xuất các từ khóa rác / sai intent thường gặp trong ngành nha khoa (Implant, Răng sứ, Niềng răng) cần loại trừ ngay để tránh lãng phí ngân sách tuần tới.

### 5. 🛠️ KẾ HOẠCH HÀNH ĐỘNG CỤ THỂ CHO 7 NGÀY TIẾP THEO (ACTION PLAN)
- Bảng phân bổ lại ngân sách dự kiến.
- Đề xuất thử nghiệm A/B Testing mẫu quảng cáo (Ad Copy, Sitelinks, Callout Extensions) tập trung vào nỗi sợ đau, bảo hành, bác sĩ chuyên gia và chính sách trả góp 0%.
`;

    const response = await gemini.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: [
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Không có phản hồi phân tích 7 ngày từ AI.';
    return res.json({ 
      success: true, 
      analysis: reply,
      dateRange: dateRangeLabel || '7 ngày gần nhất'
    });
  } catch (error: any) {
    console.error('Error in 7-days campaign analysis:', error);
    return res.status(500).json({
      error: 'Không thể phân tích chiến dịch 7 ngày bằng AI lúc này.',
      details: error.message,
    });
  }
});

// Vite middleware in dev or static serving in prod
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

start();
