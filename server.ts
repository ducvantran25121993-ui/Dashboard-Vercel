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
