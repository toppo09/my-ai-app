import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Gemini Client Lazy Check & Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API Endpoints

// 1. AI Manual Proof-of-concept QA
app.post("/api/gemini/manual-qa", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    const ai = getGeminiClient();
    const systemInstruction = `
あなたは、次世代AI統合安全管理システム「MEDISIS（メディシス）」に実装されている「院内AIナレッジ（AIマニュアル）」の体験デモシステムです。
病院のルールブックや手順書、医療安全管理指針がシステムに強力に学習されているという設定です。
ユーザー（看護師、事務長などの医療スタッフ）からの質問に対し、具体的で、プロフェッショナルで、非常に役に立ち、安全を第一に重んじる丁寧な回答を返してください。

【回答における推奨要素】
- 医療安全に寄与する、丁寧で温かみのある言い回し。
- 処置（点滴、注射、吸引など）の基本ステップ、投薬の5R（対象者、薬剤、用量、ルート、時間）の確認、事故防止のためのダブルチェックの重要性等に触れる。
- 院内に設置されたMEDISISの「朝のDoneボタンによる現場ログの即時同期」や「コプロ（共守）の安全マインド」への好意的な結びつけ。
- マークダウンによる美しい箇条書きと太字強調で見やすく整理してください。必ず「病院の信頼できるAI」として論理的に回答してください。
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Manual QA Error:", error);
    res.status(500).json({ error: error.message || "Gemini APIの呼び出しに失敗しました。APIキーが未設定か、制限がかかっている可能性があります。" });
  }
});

// 2. Interactive AI Consultation & Implementation Diagnosis
app.post("/api/gemini/consult", async (req, res) => {
  try {
    const { role, issues } = req.body; // role: 'jimucho' | 'shicho', issues: string[]
    if (!issues || !Array.isArray(issues) || issues.length === 0) {
      return res.status(400).json({ error: "At least one issue is required." });
    }

    const ai = getGeminiClient();
    const systemInstruction = `
あなたは次世代AI統合安全管理システム「MEDISIS（メディシス）」のAI導入アドバイザーです。
ターゲットユーザーである「病院事務長（病院経営者。コスト、業務効率、採用問題、セキュリティに敏感）」や「看護師長（現場管理者。ミス防止、シフト、アラート疲れ、目の前の多忙に直面）」に対し、選択された院内課題をMEDISISがどう解消できるかをアドバイスします。

【アドバイス方針】
- ロールが'jimucho'（事務長）の場合は、投資対効果や人手不足緩和、レセプト連携による請求改善、450万円の医療DX補助金についてアピールし、経営面から親身にアプローチします。
- ロールが'shicho'（看護師長）の場合は、夜勤シフトの組みやすさ、不要アラートのスクリーニング機能、朝タスク分配と、何より「現場スタッフと患者を守る共守（きょうしゅ）」の理念に焦点を当てます。
- メリットが極めて具体的に伝わる構成でアドバイスを作成してください。
- 文書の最後には、おすすめの導入プランとして「梅（フロントエンド安全管理）」「竹（セーフティカメラ見守り追加）」「松（フルスペック経営支援）」のどれが最もフィットするかを示してください。
- マークダウン形式で、読みやすい見出しとセクションに分割して回答を出力してください。
`;

    const prompt = `
【対象者】
- ${role === 'jimucho' ? '事務長（経営職）' : '看護師長（現場リーダー）'}

【選択された深刻な課題】
${issues.map((i: string) => `- ${i}`).join("\n")}

これらのお悩みをピンポイントで劇的に解消できる、MEDISIS独自の機能ソリューションを解説し、最も適した「松竹梅プラン」のおすすめと、医療DX補助金活用のロードマップを優しく解説してください。
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    res.json({ advice: response.text });
  } catch (error: any) {
    console.error("Consultation Error:", error);
    res.status(500).json({ error: error.message || "Gemini APIの呼び出しに失敗しました。APIキーが未設定か、制限がかかっている可能性があります。" });
  }
});

// Serve Frontend (Vite)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MEDISIS server started on http://localhost:${PORT}`);
  });
}

startServer();
