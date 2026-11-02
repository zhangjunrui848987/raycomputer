import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // Shared Gemini client
  const getAIClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
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
  };

  // Siri / Apple Intelligence AI endpoint
  app.post('/api/siri', async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const ai = getAIClient();

      if (!ai) {
        return res.json({
          reply: `你好！我是 macOS 智慧助理 Siri。目前運作於本機離線模式。你可以讓我開啟應用程式、查看時間、計算數學算式，或在系統設定中探索更多功能！`
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt || '你好',
        config: {
          systemInstruction: systemInstruction || '你是內建於蘋果電腦 macOS Sequoia 系統的智慧助理 Siri (Apple Intelligence)。你的回答風格簡潔、優雅、富有親和力，具備專業的 Mac 知識。請一律使用繁體中文（台灣習慣用語）回答，回答盡量精煉優雅。',
        }
      });

      const text = response.text || '請問有什麼我可以協助您的？';
      res.json({ reply: text });
    } catch (error: any) {
      console.error('Siri API Error:', error);
      res.status(500).json({ 
        error: 'Siri 服務暫時無法使用',
        reply: '抱歉，網路連線暫時有些狀況，不過您依然可以使用所有本機 macOS 功能。'
      });
    }
  });

  // Real Google Search endpoint using Google Search Grounding
  app.post('/api/google-search', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: '請提供搜尋關鍵字' });
      }

      // 1. Fetch live Google search suggestions from Google's official suggest service
      let liveGoogleSuggestions: string[] = [];
      try {
        const suggestRes = await fetch(
          `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`
        );
        if (suggestRes.ok) {
          const suggestData = await suggestRes.json();
          if (Array.isArray(suggestData) && Array.isArray(suggestData[1])) {
            liveGoogleSuggestions = suggestData[1].slice(0, 6);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch google suggestions:', err);
      }

      // 2. Fetch live Wikipedia results if available
      let wikiResults: Array<{ title: string; url: string; snippet: string }> = [];
      try {
        const wikiRes = await fetch(
          `https://zh.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=3&namespace=0&format=json`
        );
        if (wikiRes.ok) {
          const wikiData = await wikiRes.json();
          const titles = wikiData[1] || [];
          const urls = wikiData[3] || [];
          for (let i = 0; i < titles.length; i++) {
            wikiResults.push({
              title: `${titles[i]} - 維基百科`,
              url: urls[i],
              snippet: `維基百科中關於「${titles[i]}」的即時百科詞條與相關歷史背景介紹。`,
            });
          }
        }
      } catch (err) {
        console.warn('Failed to fetch wikipedia:', err);
      }

      const ai = getAIClient();
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `你現在是 Google 搜尋引擎後端。使用者正在搜尋：「${query}」。請使用 Google 搜尋工具檢索即時網路資訊，並提供繁體中文（台灣用語）的精簡摘要回答。`,
            config: {
              tools: [{ googleSearch: {} }],
            },
          });

          const summary = response.text || `找到與「${query}」相符的即時搜尋結果。`;
          const candidate = response.candidates?.[0];
          const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];
          const webSearchQueries = candidate?.groundingMetadata?.webSearchQueries || liveGoogleSuggestions;

          const webResults: Array<{ title: string; url: string; snippet: string }> = [];
          for (const chunk of groundingChunks) {
            if (chunk.web?.uri) {
              webResults.push({
                title: chunk.web.title || query,
                url: chunk.web.uri,
                snippet: chunk.web.title || summary.slice(0, 80),
              });
            }
          }

          // Combine with wiki results
          const combinedResults = [...webResults, ...wikiResults];

          if (combinedResults.length > 0) {
            return res.json({
              query,
              summary,
              results: combinedResults,
              searchQueries: webSearchQueries.length > 0 ? webSearchQueries : liveGoogleSuggestions,
            });
          }
        } catch (genAiError) {
          console.warn('Gemini search grounding fallback:', genAiError);
        }
      }

      // Direct destination website suggestions mapping
      const getDirectWebsite = (q: string): { title: string; url: string; snippet: string } | null => {
        const lower = q.toLowerCase().trim();
        if (lower.includes('台北捷運') || lower.includes('捷運')) {
          return {
            title: '臺北大眾捷運股份有限公司 (官方網站)',
            url: 'https://web.metro.taipei',
            snippet: '臺北捷運官方網站，提供路網圖、各站票價查詢、乘車時間、首末班車時刻表與營運即時訊息。',
          };
        }
        if (lower.includes('高鐵')) {
          return {
            title: '台灣高鐵 (Taiwan High Speed Rail 官方網站)',
            url: 'https://www.thsrc.com.tw',
            snippet: '台灣高鐵官方網站，提供時刻表與票價查詢、線上即時訂票系統、最新營運公告與車次服務。',
          };
        }
        if (lower.includes('天氣') || lower.includes('氣象')) {
          return {
            title: '交通部中央氣象署 (全球資訊網)',
            url: 'https://www.cwa.gov.tw',
            snippet: '中央氣象署官方網站，即時更新台灣各縣市氣溫、降雨雷達回波、颱風警報與地震即時速報。',
          };
        }
        if (lower.includes('台積電') || lower.includes('tsmc')) {
          return {
            title: '台灣積體電路製造股份有限公司 (TSMC 官方網站)',
            url: 'https://www.tsmc.com',
            snippet: '全球頂尖半導體代工龍頭，提供最先進晶圓製程技術、技術論壇、投資人專區與企業最新資訊。',
          };
        }
        if (lower.includes('維基') || lower.includes('wiki')) {
          return {
            title: '維基百科，自由的百科全書 (中文首頁)',
            url: 'https://zh.wikipedia.org',
            snippet: '全球最大的線上多語言開放式百科全書，任何人都能自由閱讀與編輯豐富條目。',
          };
        }
        if (lower.includes('github')) {
          return {
            title: 'GitHub: Where the world builds software',
            url: 'https://github.com',
            snippet: '全球開發者必備的雲端程式碼託管平台，支援版本控制協作、開源社群專案與 CI/CD 流程。',
          };
        }
        if (lower.includes('apple') || lower.includes('蘋果')) {
          return {
            title: 'Apple (台灣) - 官方網站',
            url: 'https://www.apple.com/tw',
            snippet: '探索 Apple 創新世界，選購 iPhone、Mac、iPad、Apple Watch 與探索全新 Apple Intelligence。',
          };
        }
        if (lower.includes('hackernews') || lower.includes('hacker news')) {
          return {
            title: 'Hacker News (Y Combinator 科技社群)',
            url: 'https://news.ycombinator.com',
            snippet: '矽谷與全球最著名的科技創業、程式開發與電腦科學資訊社群討論看板。',
          };
        }
        if (lower.includes('yahoo') || lower.includes('奇摩')) {
          return {
            title: 'Yahoo 奇摩 (台灣入口首頁)',
            url: 'https://tw.yahoo.com',
            snippet: 'Yahoo 奇摩提供即時新聞速報、台股股市行情、拍賣商城與生活實用查詢服務。',
          };
        }
        return null;
      };

      const directSite = getDirectWebsite(query);
      const fallbackResults: Array<{ title: string; url: string; snippet: string }> = [];

      if (directSite) {
        fallbackResults.push(directSite);
      }

      if (wikiResults.length > 0) {
        fallbackResults.push(...wikiResults);
      } else {
        fallbackResults.push({
          title: `「${query}」 - 維基百科百科條目`,
          url: `https://zh.wikipedia.org/wiki/${encodeURIComponent(query)}`,
          snippet: `點擊直接進入維基百科，閱讀關於「${query}」的完整歷史脈絡、背景定義與詳細目錄。`,
        });
      }

      fallbackResults.push({
        title: `中央通訊社 (CNA) - 探索更多即時政經新聞`,
        url: `https://www.cna.com.tw`,
        snippet: `台灣國家通訊社，提供客觀、即時、權威的國內外要聞與深度專題報導。`,
      });

      const searchQueries = liveGoogleSuggestions.length > 0
        ? liveGoogleSuggestions
        : [query, `${query} 推薦`, `${query} 是什麼`, `${query} 官方網站`];

      return res.json({
        query,
        summary: `已為您完成針對「${query}」的檢索。點擊任一搜尋結果將直接進入目標網站！`,
        results: fallbackResults,
        searchQueries,
      });
    } catch (error: any) {
      console.error('Google Search API Error:', error);
      res.json({
        query: req.body?.query || '',
        summary: `為您搜尋「${req.body?.query}」的即時網頁資訊。`,
        results: [
          {
            title: `${req.body?.query} - Google 搜尋`,
            url: `https://www.google.com/search?q=${encodeURIComponent(req.body?.query || '')}`,
            snippet: `前往 Google 查看「${req.body?.query}」的最新即時搜尋結果與網頁快取。`,
          },
        ],
        searchQueries: [req.body?.query],
      });
    }
  });

  // Universal Web Proxy endpoint for Safari to bypass X-Frame-Options & CSP
  app.get('/api/proxy', async (req, res) => {
    try {
      const rawUrl = req.query.url as string;
      if (!rawUrl) {
        return res.status(400).send('缺少目標網址 (url)');
      }

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
      } catch {
        return res.status(400).send('無效的網址格式');
      }

      // Fetch the webpage from target origin
      const response = await fetch(parsedUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        redirect: 'follow',
      });

      const contentType = response.headers.get('content-type') || 'text/html';

      // If it's an HTML page, remove frame headers, inject base tag and navigation link interceptor
      if (contentType.includes('text/html')) {
        let html = await response.text();

        const injection = `
<base href="${parsedUrl.toString()}">
<script>
  // Intercept link clicks to maintain browsing within Safari
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a');
    if (a && a.href && !a.href.startsWith('javascript:')) {
      e.preventDefault();
      window.parent.postMessage({ type: 'safari-navigate', url: a.href }, '*');
    }
  }, true);
</script>
`;
        if (html.includes('<head>')) {
          html = html.replace('<head>', `<head>${injection}`);
        } else if (html.includes('<HEAD>')) {
          html = html.replace('<HEAD>', `<HEAD>${injection}`);
        } else {
          html = injection + html;
        }

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.removeHeader('X-Frame-Options');
        res.removeHeader('Content-Security-Policy');
        return res.send(html);
      } else {
        const buffer = await response.arrayBuffer();
        res.setHeader('Content-Type', contentType);
        return res.send(Buffer.from(buffer));
      }
    } catch (error: any) {
      console.error('Proxy Error:', error);
      res.status(502).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Safari 無法開啟網頁</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #334155; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: white; padding: 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); max-width: 480px; text-align: center; }
            h2 { margin-top: 0; color: #0f172a; font-size: 20px; }
            p { font-size: 13px; line-height: 1.6; color: #64748b; }
            .btn { display: inline-block; margin-top: 16px; padding: 10px 22px; background: #0284c7; color: white; border-radius: 9999px; text-decoration: none; font-weight: 500; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Safari 無法開啟網頁</h2>
            <p>伺服器在嘗試代理載入該網頁時遇到連線限制。您可以點擊下方按鈕直接在真實獨立視窗中開啟：</p>
            <a href="${req.query.url}" target="_blank" class="btn">在新視窗中開啟原始網頁 ↗</a>
          </div>
        </body>
        </html>
      `);
    }
  });

  // System status endpoint
  app.get('/api/system-info', (req, res) => {
    res.json({
      os: 'macOS Sequoia 15.2',
      chip: 'Apple M4 Max',
      memory: '36 GB',
      storageTotal: 1000,
      storageUsed: 312,
      uptime: process.uptime(),
    });
  });

  // Setup Vite dev server middlewares
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(port, '0.0.0.0', () => {
    console.log(`macOS Sequoia server running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
