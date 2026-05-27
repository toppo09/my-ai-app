import { useState } from "react";
import { motion } from "motion/react";
import { ClipboardCheck, Sparkles, Building2, ShieldAlert, Heart, TrendingUp, AlertTriangle } from "lucide-react";

interface Issue {
  id: string;
  label: string;
  category: "jimucho" | "shicho";
}

const ISSUES_LIST: Issue[] = [
  // 事務長（経営職）向けお悩み
  { id: "jim-1", label: "慢性的な看護師不足と高い採用コスト・離職率", category: "jimucho" },
  { id: "jim-2", label: "属人的で不公平感が出やすい月給シフト作成の負荷", category: "jimucho" },
  { id: "jim-3", label: "レセプト請求漏れや、現場実績との確認作業のオーバーワーク", category: "jimucho" },
  { id: "jim-4", label: "医療物資（グローブ、シリンジ等）の在庫過剰・欠品ロス", category: "jimucho" },
  { id: "jim-5", label: "サイバー攻撃（ランサムウェア）から患者データを守るセキュリティ不安", category: "jimucho" },
  
  // 看護師長（現場リーダー）向けお悩み
  { id: "shi-1", label: "夜間のセンサーマット（不要検知）の不要アラート疲れ（狼少年化）", category: "shicho" },
  { id: "shi-2", label: "朝の時間帯に投薬、点滴、測定が集中する業務過密・事故リスク", category: "shicho" },
  { id: "shi-3", label: "注射アレルギー・禁忌薬の紙チェック見落とし、二重確認の形骸化", category: "shicho" },
  { id: "shi-4", label: "新人教育における形骸化したマニュアルの検索・実地指導の限界", category: "shicho" },
  { id: "shi-5", label: "救急搬送の受入要請時、患者情報の事前把握が遅れ準備がバタバタする", category: "shicho" }
];

export default function ConsultationTool() {
  const [role, setRole] = useState<"jimucho" | "shicho">("jimucho");
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [advice, setAdvice] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleToggleIssue = (id: string) => {
    setSelectedIssues((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRoleChange = (newRole: "jimucho" | "shicho") => {
    setRole(newRole);
    setSelectedIssues([]); // リセット
    setAdvice("");
    setErrorMsg("");
  };

  const handleDiagnose = async () => {
    if (selectedIssues.length === 0) {
      setErrorMsg("課題項目を少なくとも1つ選択してください。");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    setAdvice("");

    // 選択された課題テキストの配列
    const issuesText = ISSUES_LIST.filter(i => selectedIssues.includes(i.id)).map(i => i.label);

    try {
      const response = await fetch("/api/gemini/consult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          issues: issuesText,
        }),
      });

      if (!response.ok) {
        throw new Error("サーバーレスポンスに失敗しました。");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAdvice(data.advice);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "診断エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-slate-200" id="consultation-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-950 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-emerald-600" />
            【経営層・現場責任者向け】MEDISIS AI 導入適合診断
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            自院の立場と直面している課題を選択。AIが最適な導入メニュー、松竹梅プラン、医療DX補助金適用の道筋をご提示。
          </p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-xl shrink-0 self-start md:self-auto">
          <button
            onClick={() => handleRoleChange("jimucho")}
            className={`px-4.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
              role === "jimucho"
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-950"
            }`}
            id="role-tab-jimucho"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            病院事務長 (経営視点)
          </button>
          <button
            onClick={() => handleRoleChange("shicho")}
            className={`px-4.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
              role === "shicho"
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-950"
            }`}
            id="role-tab-shicho"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            看護師長 (現場視点)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左側: チェックボックス (7カラム) */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">
              当てはまる院内・病棟の課題（複数選択可）
            </span>

            <div className="space-y-2">
              {ISSUES_LIST.filter((issue) => issue.category === role).map((issue) => {
                const isChecked = selectedIssues.includes(issue.id);
                return (
                  <label
                    key={issue.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      isChecked
                        ? "border-emerald-500 bg-emerald-50/40 text-slate-950"
                        : "border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:border-slate-200"
                    }`}
                    id={`issue-lbl-${issue.id}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleIssue(issue.id)}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4.5 w-4.5 shrink-0"
                    />
                    <span className="text-xs leading-relaxed font-medium">{issue.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            {errorMsg && (
              <p className="text-xs text-rose-600 font-bold mb-3 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {errorMsg}
              </p>
            )}

            <button
              onClick={handleDiagnose}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white text-sm font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              id="btn-run-diagnosis"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              {loading ? "MEDISIS-AI 課題マッピング & シミュレーション中..." : "AI 導入ソリューション提案を生成する"}
            </button>
          </div>
        </div>

        {/* 右側: AI生成結果 (5カラム) */}
        <div className="lg:col-span-12 xl:col-span-7">
          <div className="bg-slate-950 text-slate-300 rounded-2xl p-6 h-full min-h-[380px] flex flex-col justify-between border border-slate-900">
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
                <span className="p-1 px-2.2 text-[9px] font-bold uppercase tracking-widest bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-900/40">
                  AI Solution
                </span>
                <span className="text-xs font-mono text-slate-500">MEDISIS-AI診断エンジン (3.5-flash)</span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-slate-400 tracking-wider animate-pulse">
                    国庫補助金(医療DX枠)と安全管理基準を適合算出中...
                  </p>
                </div>
              ) : advice ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-invert prose-xs text-xs space-y-3 leading-relaxed max-h-[380px] overflow-y-auto pr-1"
                >
                  {advice.split("\n").map((line, lIdx) => {
                    let text = line;
                    let isHeading = false;
                    let isBullet = false;

                    if (line.startsWith("###")) {
                      text = line.replace("###", "").trim();
                      isHeading = true;
                    } else if (line.startsWith("##")) {
                      text = line.replace("##", "").trim();
                      isHeading = true;
                    } else if (line.startsWith("- ") || line.startsWith("* ")) {
                      text = line.substring(2).trim();
                      isBullet = true;
                    }

                    // 強調太字の簡易変換 **text** -> span
                    const parts = text.split(/\*\*(.*?)\*\*/g);
                    const formatted = parts.map((part, pIdx) => {
                      if (pIdx % 2 === 1) {
                        return <strong key={pIdx} className="font-bold text-emerald-400">{part}</strong>;
                      }
                      return part;
                    });

                    if (isHeading) {
                      return <h4 key={lIdx} className="font-bold text-white text-sm mt-4 border-l-2 border-emerald-500 pl-2 pb-0.5">{formatted}</h4>;
                    }
                    if (isBullet) {
                      return (
                        <div key={lIdx} className="flex items-start gap-1 ml-2 mt-1 text-slate-300">
                          <span className="text-emerald-500 shrink-0">■</span>
                          <span>{formatted}</span>
                        </div>
                      );
                    }
                    return <p key={lIdx} className="text-slate-300 mt-1">{formatted}</p>;
                  })}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-16 gap-3">
                  <ClipboardCheck className="w-12 h-12 text-slate-800" />
                  <p className="text-xs text-slate-500 font-medium max-w-xs leading-relaxed">
                    お悩みを選択して診断ボタンを押してください。病院向け導入構成、イニシャル＆ランニング算出目安、医療DX・働き方改革推進補助金(最大450万)の適合レポートを即時生成いたします。
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-slate-900 pt-4 bg-slate-950 flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              <span>共守安全管理パッケージ (MEDISIS-SAFE V3)</span>
              <span>MEDISIS 診療連携・補助金申請窓口担当</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
