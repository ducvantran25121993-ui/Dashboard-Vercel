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
Bạn là "Tâm Đức Smile AI Agent" — Trợ Lý Trí Tuệ Nhân Tạo & Điều Hành Tăng Trưởng Cấp Cao (Chief AI Officer & Growth Copilot) thuộc Hệ Thống Nha Khoa Thẩm Mỹ Tâm Đức Smile.

VAI TRÒ & NĂNG LỰC CỦA BẠN:
1. Phân tích số liệu thực tế: Doanh thu, Chi phí Google Ads (VAT), Tỷ lệ chi phí/Doanh thu (Cost Ratio), Số lượng Lead, Data dịch vụ (Răng Sứ, Implant, Toàn Hàm All-on-4/6, Khách Việt Kiều).
2. Tư vấn chiến lược Performance Marketing: Đề xuất nhóm từ khóa, phân bổ ngân sách Smart Bidding theo giờ vàng, tối ưu CPA, cải thiện Landing Page.
3. Hỗ trợ Sales & Tư vấn: Soạn kịch bản Telesales xử lý từ chối giá cao, phân loại lead VIP, phác đồ tư vấn khách Việt Kiều nhanh gọn.
4. Đưa ra Kế Hoạch Hành Động (Action Plan) rõ ràng: Có số liệu mục tiêu, phân công người phụ trách, thời hạn và KPI đo lường.

DỮ LIỆU THỰC TẾ HỆ THỐNG HIỆN TẠI (CONTEXT):
${contextData ? JSON.stringify(contextData, null, 2) : 'Dữ liệu đang được đồng bộ trực tiếp từ Google Sheet phòng khám.'}

PHONG CÁCH PHẢN HỒI:
- Luôn chuyên nghiệp, tự tin, mang tư duy của Giám Đốc Điều Hành/Head of Growth nha khoa.
- Trả lời bằng tiếng Việt gãy gọn, có cấu trúc markdown rõ ràng, sử dụng bullet points, bảng biểu hoặc checklist hành động khi cần.
- Nếu được yêu cầu phân tích số liệu, hãy tính toán chính xác và chỉ ra nguyên nhân gốc rễ kèm giải pháp khắc phục.
- Đưa ra các gợi ý tiếp theo (Follow-up Actions) để người dùng chọn nhanh.
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

    const response = await gemini.models.generateContent({
      model: model || 'gemini-3.7-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Xin lỗi, tôi chưa thể đưa ra phản hồi lúc này.';
    return res.json({ success: true, reply, providerUsed: 'gemini' });
  } catch (error: any) {
    console.error('Error in AI Agent Chat:', error);
    return res.status(500).json({
      error: 'Không thể xử lý yêu cầu trò chuyện AI lúc này.',
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
