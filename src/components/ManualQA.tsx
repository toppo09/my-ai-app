import { useState } from "react";
import { Send, Sparkles, BookOpen, AlertCircle, BookmarkCheck } from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

const PRESET_QUESTIONS = [
  { label: "注射実施時の5R手順", q: "注射や点滴を行う際、インシデントを防止するための5R基本マニュアルについて教えてください。" },
  { label: "不要アラート削減基準", q: "MEDISISセーフティカメラにおける、寝返り動作と本当に危険な離床動作のAI判別基準は？" },
  { label: "医療DX補助金の申請", q: "病院でMEDISISを導入する場合、国から最大450万円の医療DX補助金を申請するフローと必要条件は何ですか？" }
];

export default function ManualQA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "こんにちは。MEDISIS「院内AIナレッジ（AIマニュアル）」の体験デモです。当院で学習済みの医療安全マニュアルや業務手順、インシデント防止指針について、何でも自然言語で質問してください。実際のシステム感覚で回答いたします。"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSend = async (question: string) => {
    if (!question.trim() || loading) return;

    setErrorMsg("");
    setLoading(true);
    setInputValue("");
    
    // ユーザーメッセージを追加
    const userMsg: Message = { role: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch("/api/gemini/manual-qa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("サーバーレスポンスに失敗しました。");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { role: "model", text: data.answer }]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "予期しないエラーが発生しました。");
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "⚠️ 申し訳ありません。デモ用のAI接続エラーが発生しました。APIキーが正しく設定されているかご確認ください。なお、実機では院内に安全にローカルデプロイ（閉域網構築）されたセキュリティ万全の環境で動作します。"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-emerald-100 flex flex-col h-[520px]" id="manual-qa-section">
      {/* タイトル & アイコン */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">院内AIナレッジ (AIマニュアル) 瞬時検索デモ</h3>
            <p className="text-xs text-slate-500 mt-0.5">病院仕様の指示書やヒヤリハット報告を実学習した対話システム</p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          AI実機接続
        </span>
      </div>

      {/* プリセット質問 */}
      <div className="mb-4 shrink-0">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">よくある質問のプリセット体験（タップで送信）</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUESTIONS.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(pq.q)}
              disabled={loading}
              className="px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 rounded-lg text-xs font-medium transition disabled:opacity-50 text-left"
              id={`preset-q-${idx}`}
            >
              {pq.label}
            </button>
          ))}
        </div>
      </div>

      {/* チャットウィンドウ */}
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-slate-50/70 rounded-xl space-y-4 border border-slate-100 min-h-0">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-slate-900 text-white rounded-br-none shadow-sm"
                  : "bg-white text-slate-800 rounded-bl-none shadow border border-slate-100"
              }`}
            >
              {msg.role === "model" ? (
                <div className="whitespace-pre-wrap font-sans space-y-1">
                  {msg.text.split("\n").map((line, lIdx) => {
                    // 簡単な擬似マークダウン箇条書き & 太字変換
                    let displayLine = line;
                    let isHeading = false;
                    let isBullet = false;

                    if (line.startsWith("###")) {
                      displayLine = line.replace("###", "").trim();
                      isHeading = true;
                    } else if (line.startsWith("##")) {
                      displayLine = line.replace("##", "").trim();
                      isHeading = true;
                    } else if (line.startsWith("- ") || line.startsWith("* ")) {
                      displayLine = line.substring(2).trim();
                      isBullet = true;
                    }

                    // 太字変換 **text** -> strong
                    const parts = displayLine.split(/\*\*(.*?)\*\*/g);
                    const formatted = parts.map((part, pIdx) => {
                      if (pIdx % 2 === 1) {
                        return <strong key={pIdx} className="font-bold text-slate-950 bg-yellow-50 px-0.5">{part}</strong>;
                      }
                      return part;
                    });

                    if (isHeading) {
                      return <h4 key={lIdx} className="font-bold text-slate-900 mt-2.5 mb-1.5 text-sm flex items-center gap-1 border-b border-rose-100 pb-0.5">{formatted}</h4>;
                    }
                    if (isBullet) {
                      return (
                        <div key={lIdx} className="flex items-start gap-1 ml-2 mt-1">
                          <span className="text-emerald-500 font-bold shrink-0">・</span>
                          <span className="text-slate-700">{formatted}</span>
                        </div>
                      );
                    }
                    return <p key={lIdx} className="text-slate-700 mt-1">{formatted}</p>;
                  })}
                </div>
              ) : (
                <p className="font-semibold">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-none p-3.5 text-xs shadow border border-slate-100 flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
              <span className="text-slate-500 font-mono animate-pulse">MEDISIS AI ナレッジがマニュアルを瞬間監査中...</span>
            </div>
          </div>
        )}
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-900 rounded-xl text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}
      </div>

      {/* 入力欄 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputValue);
        }}
        className="flex gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="点滴のインシデント防止手順は？..."
          disabled={loading}
          className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 hover:border-slate-300 transition"
          id="manual-qa-input"
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white rounded-xl p-2.5 transition flex items-center justify-center font-bold"
          id="btn-manual-qa-submit"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
