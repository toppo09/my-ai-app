import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  ShieldAlert,
  Sparkles, 
  BookOpen, 
  UserCheck, 
  Cpu, 
  ArrowRight, 
  Activity, 
  FileText, 
  Layers, 
  Workflow, 
  HelpCircle, 
  Calendar,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  TrendingUp,
  LineChart,
  Boxes,
  Stethoscope,
  ChevronRight,
  Calculator,
  Laptop
} from "lucide-react";

import TaskSafetyDemo from "./components/TaskSafetyDemo";
import SafetyCameraDemo from "./components/SafetyCameraDemo";
import ManualQA from "./components/ManualQA";
import ConsultationTool from "./components/ConsultationTool";

// タイムラインステップの型定義
interface TimelineStep {
  step: string;
  title: string;
  period: string;
  actor: string;
  desc: string;
  details: string[];
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    step: "Step 1",
    title: "コンテンツの確定と実地素材準備",
    period: "今週 〜 来週前半",
    actor: "佐藤朋氏 (開発) ＆ 今井先生 (監修)",
    desc: "これまでに完成させた各プロトタイプ画面（シフト作成、禁忌照合、AI在庫発注等）の洗練されたスクリーンショットを機能紹介用のリアルビジュアル素材として選定・整理し、今井先生によるフィードバック監修を完了させます。",
    details: [
      "実際の病院現場（事務長、師長）に最も刺さる機能の表示優先順位の最終微調整",
      "デモデータ（おむつ交換・離床リスク・NGシフト）の臨床的整合性のファクトチェック",
      "チラシ・QRコードに連携する機能モジュールのリスト選定"
    ]
  },
  {
    step: "Step 2",
    title: "デモサイトへの統合 ＆ クリック型プロトタイプの融合",
    period: "来週後半 〜 再来週",
    actor: "佐藤朋氏",
    desc: "今回構築した構成案と高度なシミュレーター機能を、既存の『MEDISISデモサイト（Googleサイト等のポータル）』へと綺麗に統合。iPadをタップするだけで稼働するデモ環境をマージします。",
    details: [
      "AI自動タスク分配画面・Ubie禁忌チェッカーの双方向検証可能モジュールのマージ",
      "Safie等と組み合わせたセーフティカメラの不要アラート自動除去テストデモのバインド",
      "院内AIマニュアルチャットボットがその場で応答する実機結合"
    ]
  },
  {
    step: "Step 3",
    title: "１枚フックチラシ（病院事務長専用）との導線連動",
    period: "3週間後",
    actor: "佐藤朋氏 ＆ 今井先生",
    desc: "既存の『ペラ1枚の病院事務長向け販促チラシ』の右下等へ、美しくデザインされたデモサイトQRコードおよびアクセスURLを連携配置。直感的に興味を持った事務長がすぐにスマホから実機同様の診断を試せる流れを作ります。",
    details: [
      "チラシ表面のキャッチコピー『鳴り止まないアラートにお困りではありませんか？』から、本デモサイト側『不要アラート90%削減診断』へのシームレスな解決論の用意",
      "QR経由からスマホによる『導入プラン＆医療DX補助金シミュレータ』即座見積もり確認経路の解放"
    ]
  },
  {
    step: "Step 4",
    title: "厚生連病院・尾鷲市関係者への一対一デモ提案投入",
    period: "1ヶ月後 〜 随時展開",
    actor: "今井先生 ＆ 佐藤朋氏",
    desc: "今井先生が厚生連病院の経営層や、尾鷲市の地域医療推進関係者、病院事務長・師長一同様との面談の場へ、手元のiPad等で当ポータルを表示しながら提案。各病院固有の課題に応じた『松竹梅』メニューをおかずを選ぶように親身にコンサルティングします。",
    details: [
      "その場でお悩みにチェックを入れ、Geminiによる個別Solutionシートを印刷・共有",
      "最大450万円の医療DX補助金申請に必要な書類要件リストをシステムから自動ロード提示",
      "安全・DX・働き方改革のトリプル承認獲得デモの実施"
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"safety" | "camera" | "manual" | "advisor">("safety");
  const [beds, setBeds] = useState<number>(80); // シミュレータ
  const [planType, setPlanType] = useState<"ume" | "take" | "matsu">("take");
  
  // 補助金計算
  const getPlanPrice = () => {
    if (planType === "ume") return 3000000;
    if (planType === "take") return 5500000;
    return 8500000;
  };

  const calculateSubsidy = () => {
    const price = getPlanPrice();
    // 一般的な医療DX補助金 / 働き方改革IT導入補助金(2/3補助、最大450万円)
    const rawSubsidy = Math.floor(price * (2 / 3));
    const subsidy = Math.min(rawSubsidy, 4500000);
    const selfPay = price - subsidy;
    return { subsidy, selfPay };
  };

  const { subsidy, selfPay } = calculateSubsidy();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between" id="medisis-app">
      {/* 
        Aesthetic Layout Header
        Sophisticated dark forest borders with clean mint green buttons
      */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-xs" id="medisis-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-sm shadow-emerald-600/20">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 font-sans uppercase">MEDISIS</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-emerald-100 uppercase">Ver 3.0</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold font-mono">Medical AI Integrated system</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold tracking-wide">
            <a href="#about-medisis" className="text-slate-600 hover:text-emerald-600 transition">コンセプト</a>
            <a href="#demo-playground" className="text-slate-600 hover:text-emerald-600 transition">実機デモ体験</a>
            <a href="#plans-simulator" className="text-slate-600 hover:text-emerald-600 transition">導入プラン</a>
            <a href="#roadmap-timeline" className="text-slate-600 hover:text-emerald-600 transition">導入ロードマップ</a>
            <a href="#demo-playground" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full shadow-sm hover:shadow transition flex items-center gap-1.5 text-xs font-bold leading-none">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              AIマニュアル・診断を体験する
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white px-6 py-12 lg:py-16 border-b border-slate-200 relative overflow-hidden" id="about-medisis">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-radial-gradient from-emerald-50/40 via-transparent to-transparent opacity-60 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>人手不足時代の病院安全管理＆業務効率ポータルサイト</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-950 leading-tight">
              現場の限界を、テクノロジーで越える。<br/>
              <span className="text-emerald-600">病院全体をつなぐAIフルスペック安全管理システム</span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl font-medium">
              慢性的な人手不足、鳴り止まないアラート、分断された電子カルテによる確認漏れ。MEDISIS（メディシス）は、既存の縦割りシステムではカバーしきれない現場の「リアルタイムな横の連携（隙間）」をAIでシームレスに強固に繋ぎます。
            </p>
            <p className="text-xs text-slate-500 max-w-2xl font-semibold border-l-2 border-emerald-500 pl-3 italic">
              「監視」ではなく「共守（きょうしゅ）」の理念。スタッフに過度な入力不可を強いることなく、患者様の安全と働きやすい職場環境の構築を同時に達成します。
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a href="#demo-playground" className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3.5 px-6 rounded-xl hover:shadow transition flex items-center justify-center gap-1.5 shadow-md">
                実機シミュレーションを起動
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </a>
              <a href="#roadmap-timeline" className="bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold py-3.5 px-6 rounded-xl border border-slate-200 transition text-center">
                導入からプレゼンへの展開ロードマップを見る
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            {/* クイック統計パネル（ラテラルイメージ） */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 tracking-wider">MEDISIS インパクト実証データ</span>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/60">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">不要な離床アラート音</p>
                  <p className="text-2xl font-black text-rose-400 mt-1 font-mono">90% <span className="text-xs font-bold">削減</span></p>
                  <p className="text-[9px] text-slate-500 mt-1">寝返りをAIが除去</p>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/60">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">朝の業務分配時間</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">1秒 <span className="text-xs font-bold">自動整理</span></p>
                  <p className="text-[9px] text-slate-500 mt-1">Doneボタンで先入力防止</p>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/60">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">医師・救急搬送トリアージ</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">1次対応 <span className="text-xs font-bold">往復ゼロ</span></p>
                  <p className="text-[9px] text-slate-500 mt-1">MAXHUB映像連携</p>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/60">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">医療DX国庫補助金枠</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">最大450万 <span className="text-xs font-bold">支援</span></p>
                  <p className="text-[9px] text-slate-500 mt-1">申請まで専門スタッフ代行</p>
                </div>
              </div>
              <div className="p-3 bg-emerald-950/50 rounded-xl border border-emerald-900/50 flex gap-2.5 items-start">
                <Notebook className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-emerald-300 font-medium">
                  <strong>今井先生監修実績</strong>：分厚く形骸化していた院内安全マニュアルを、スマホ対応の「AIクラーク（NotebookLM等）」へと電子化。現場スタッフが現場で手順や禁忌薬を1秒で自然言語QAできる仕組みを実証。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4つの機能カテゴリ：メニュー構造の網羅 */}
      <section className="bg-slate-50 py-12 px-6 border-b border-slate-200" id="medisis-features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              全機能網羅メニュー
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-950 mt-3 font-sans">
              必要な機能（おかず）だけを選べる「松竹梅」メニュー表
            </h3>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              病院の規模や課題に応じ、パーツを組み合わせて段階的に導入頂けます。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* カテゴリ1 */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 hover:border-emerald-500 transition-all duration-300">
              <span className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 inline-block mb-4">
                <UserCheck className="w-5 h-5" />
              </span>
              <h4 className="font-bold text-base text-slate-950 mb-2">① 医療現場の効率化＆安全</h4>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed font-semibold">
                現場の負担を極限まで減らし、医療事故を未然に防ぐ中核機能です。
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <div>
                    <strong>朝タスク分配 & Doneボタン</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">先入力を防ぎ、二重ログ自動生成</span>
                  </div>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <div>
                    <strong>確定的禁忌安全チェッカー</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Ubie連携でアレルギー投与前ロック</span>
                  </div>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <div>
                    <strong>音声入力・電子カルテAI支援</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">SOAP形式での下書き瞬時生成</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* カテゴリ2 */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 hover:border-emerald-500 transition-all duration-300">
              <span className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 inline-block mb-4">
                <Cpu className="w-5 h-5" />
              </span>
              <h4 className="font-bold text-base text-slate-950 mb-2">② 見守りカメラ ＆ 搬送トリアージ</h4>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed font-semibold">
                不要アラートとスタッフの無駄な病棟内往復をゼロにする。
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium font-sans">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <div>
                    <strong>AIセーフティカメラ検知</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Safie連携、寝返りと危険離床の識別</span>
                  </div>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <div>
                    <strong>遠隔MAXHUBナースコール</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">1回の往復で完璧な初期看護対応</span>
                  </div>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <div>
                    <strong>救急車リアルタイム映像連携</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">医師が車内に指示、最速受入態勢</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* カテゴリ3 */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 hover:border-emerald-500 transition-all duration-300">
              <span className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 inline-block mb-4">
                <Workflow className="w-5 h-5" />
              </span>
              <h4 className="font-bold text-base text-slate-950 mb-2">③ 組織・人事管理の最適化</h4>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed font-semibold">
                管理職（看護師長等）の手作業負担と労務超過を劇的に抑制。
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium font-sans">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <div>
                    <strong>AIシフト・勤務表自動作成</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">NG相性、夜勤回数、スキル自動調整</span>
                  </div>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <div>
                    <strong>スマホ勤怠 ＆ 超過予測アラート</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">時間外をシステムが事前検知</span>
                  </div>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <div>
                    <strong>AI採用 ＆ 離職リスク予測</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">統計から妊娠・育休予測と事前採用</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* カテゴリ4 */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 hover:border-emerald-500 transition-all duration-300">
              <span className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 inline-block mb-4">
                <Boxes className="w-5 h-5" />
              </span>
              <h4 className="font-bold text-base text-slate-950 mb-2">④ 裏側の自動化＆経営支援</h4>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed font-semibold">
                病院の利益を守り、レセプト事務などの管理業務を省力化。
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium font-sans">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <div>
                    <strong>医療物資自動発注アシスト</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Doneログ連動、事務長LINE承認</span>
                  </div>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <div>
                    <strong>AIクラーク会計レセプト連携</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">入力漏れ除去・レセプト請求支援</span>
                  </div>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <div>
                    <strong>院内マニュアルNotebookLM連携</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">スマホから質問可能なAIナレッジ</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 
        Interactive Demo Area 
        Includes fully functional Task Safety, Camera Scrutiny, and Manual QA in intuitive Tabs
      */}
      <section className="bg-slate-100 py-16 px-6" id="demo-playground">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              MEDISIS Live Sandbox
            </span>
            <h3 className="text-3xl font-extrabold text-slate-990 mt-3 font-sans">
              機能の真価を。インタラクティブ実機デモ
            </h3>
            <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">
              佐藤朋氏が開発中の実機と同等ロジックが、以下タブを切り替えてその場で直接体験可能です。
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-200/70 p-1 rounded-2xl max-w-2xl mx-auto mb-10 border border-slate-300/40">
            <button
              onClick={() => setActiveTab("safety")}
              className={`flex-1 py-3 text-center rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === "safety"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              id="playground-tab-safety"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              朝タスク分配 ＆ 禁忌照合
            </button>
            <button
              onClick={() => setActiveTab("camera")}
              className={`flex-1 py-3 text-center rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === "camera"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              id="playground-tab-camera"
            >
              <Cpu className="w-4 h-4 text-emerald-600" />
              カメラ見守り ＆ トリアージ
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={`flex-1 py-3 text-center rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === "manual"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              id="playground-tab-manual"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              院内AIマニュアル検索
            </button>
            <button
              onClick={() => setActiveTab("advisor")}
              className={`flex-1 py-3 text-center rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === "advisor"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              id="playground-tab-advisor"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              AI導入適合＆課題診断
            </button>
          </div>

          <div className="bg-white/40 p-1.5 rounded-3xl border border-slate-200/60 shadow-xs">
            {activeTab === "safety" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TaskSafetyDemo />
              </motion.div>
            )}

            {activeTab === "camera" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SafetyCameraDemo />
              </motion.div>
            )}

            {activeTab === "manual" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-12 xl:col-span-4 bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-base mb-3">AIマニュアル（NotebookLM）実績の強調</h4>
                      <p className="text-xs text-gray-600 leading-relaxed font-semibold mb-4">
                        当システムの目玉の一つが、今井先生の指導の下、院内での実働実績を持つ<strong>「院内AIナレッジ連携」</strong>です。
                      </p>
                      <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
                        <p className="font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 分厚いファイルが死蔵しない
                        </p>
                        <p className="pl-5 text-slate-500">
                          安全管理マニュアルやヒヤリハット報告を、スマートフォンや現場タブレットから自然言語で瞬時に照会。新人の指導時間を大幅削減。
                        </p>
                        
                        <p className="font-bold text-emerald-800 flex items-center gap-1 mt-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ローカル高セキュリティ
                        </p>
                        <p className="pl-5 text-slate-500">
                          銀行オンラインレベルの暗号化。病院内の閉域ネットワークを活用することで、外部への医療情報漏洩リスクを完全にブロックします。
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mt-6">
                      <p className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold mb-1">今井先生の太鼓判コメント</p>
                      <p className="text-[11px] font-semibold text-emerald-800 leading-relaxed">
                        「新人看護師から『これ何だっけ？』と聞かれた際、マニュアルのページを必死に探す時間がゼロになりました。スマホからMEDISIS-AIに聞けば、安全第一の5Rルールに則ってその場で最適な手順を提示してくれます」
                      </p>
                    </div>
                  </div>
                  <div className="lg:col-span-12 xl:col-span-8">
                    <ManualQA />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "advisor" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ConsultationTool />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 
        導入プラン比較 & 450万円補助金計算シミュレーター
      */}
      <section className="bg-white py-16 px-6 border-b border-slate-200" id="plans-simulator">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              PRICING & CALCULATOR
            </span>
            <h3 className="text-3xl font-extrabold text-slate-950 mt-3 font-sans">
              段階的な「松竹梅」プランと補助金活用シミュレーター
            </h3>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              フルスペック導入だけでなく、スモールスタートも可能。補助金還付率を考慮したその場簡易見積もり。
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* 梅プラン */}
            <div className={`rounded-2xl p-6 md:p-8 flex flex-col justify-between border ${
              planType === "ume" ? "border-emerald-500 bg-emerald-50/10 shadow-md" : "border-slate-200 bg-white"
            }`}>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase">梅（安全管理スモール）</span>
                  {planType === "ume" && <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full">選択中</span>}
                </div>
                <p className="text-3xl font-black text-slate-900 font-mono">¥300<span className="text-base font-bold text-slate-500">万円〜</span></p>
                <p className="text-xs text-slate-500 mt-1 font-semibold">保守費用: 月額¥3.5万〜</p>
                <p className="text-xs text-slate-600 mt-4 leading-relaxed font-medium">
                  「朝のタスク管理」と「アレルギー・禁忌チェック」を現場に最速で展開する、最も手軽な安全確約スタータープランです。タブレット数台・PCからの運用可能。
                </p>
                
                <div className="mt-6 space-y-3 pt-6 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-800">● 含まれる主要機能</p>
                  <ul className="text-xs text-slate-600 space-y-2 font-medium">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 朝の過密タスクAI自動分配 & Done</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 確定的禁忌・安全チェッカー (Ubie)</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 院内AIマニュアル検索 (基本)</li>
                  </ul>
                </div>
              </div>
              
              <button
                onClick={() => setPlanType("ume")}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold py-2.5 px-4 rounded-xl mt-8 transition"
                id="btn-select-ume"
              >
                梅プランで見積もり
              </button>
            </div>

            {/* 竹プラン */}
            <div className={`rounded-2xl p-6 md:p-8 flex flex-col justify-between border-2 ${
              planType === "take" ? "border-emerald-500 bg-emerald-50/20 shadow-lg" : "border-slate-300 bg-slate-50/50"
            }`}>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-emerald-700 uppercase">竹（セーフティ見守り標準）</span>
                  <span className="text-[10px] bg-red-100 text-red-700 font-extrabold px-2 py-0.5 rounded-full">人気No.1</span>
                </div>
                <p className="text-3xl font-black text-slate-900 font-mono">¥550<span className="text-base font-bold text-slate-500">万円〜</span></p>
                <p className="text-xs text-slate-500 mt-1 font-semibold">保守費用: 月額¥5.5万〜</p>
                <p className="text-xs text-slate-600 mt-4 leading-relaxed font-medium">
                  Safieセーフティカメラと、ナースコール遠隔トリアージ（MAXHUB）、現場驚喜の「AI不満ゼロシフト作成」をパッケージした病棟看護安全基準プラン。
                </p>
                
                <div className="mt-6 space-y-3 pt-6 border-t border-slate-200/40">
                  <p className="text-xs font-bold text-slate-800">● 含まれる主要機能</p>
                  <ul className="text-xs text-slate-600 space-y-2 font-medium">
                    <li className="flex items-center gap-1.5 text-slate-900 font-semibold"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 梅プランの全コア安全機能</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Safieカメラ連携・不要アラート事前遮断</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 遠隔トリアージ司令塔 ＆ MAXHUB接続</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> AI不満ゼロ・勤務シフト自動作成作成</li>
                  </ul>
                </div>
              </div>
              
              <button
                onClick={() => setPlanType("take")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-2.5 px-4 rounded-xl mt-8 shadow transition"
                id="btn-select-take"
              >
                竹プランで見積もり
              </button>
            </div>

            {/* 松プラン */}
            <div className={`rounded-2xl p-6 md:p-8 flex flex-col justify-between border ${
              planType === "matsu" ? "border-emerald-500 bg-emerald-50/10 shadow-md" : "border-slate-200 bg-white"
            }`}>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase">松（フルスペック病院統合）</span>
                  {planType === "matsu" && <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full">選択中</span>}
                </div>
                <p className="text-3xl font-black text-slate-900 font-mono">¥850<span className="text-base font-bold text-slate-500">万円〜</span></p>
                <p className="text-xs text-slate-500 mt-1 font-semibold">保守費用: 月額¥8.5万〜</p>
                <p className="text-xs text-slate-600 mt-4 leading-relaxed font-medium">
                  救急搬送車内リアルタイム直結、医療DXに最適化された消耗資材のLINE連動自動在庫発注、さらに中長期のベテラン離職予測やレセプト会計システム連携までを統合。
                </p>
                
                <div className="mt-6 space-y-3 pt-6 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-800">● 含まれる主要機能</p>
                  <ul className="text-xs text-slate-600 space-y-2 font-medium">
                    <li className="flex items-center gap-1.5 text-slate-900 font-semibold"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 竹プランの全見守り＆シフト機能</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 救急搬送・車内医師ダイレクト音声映像</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 医療物資Doneボタン連動 → 自動発注(LINE)</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> AIクラーク・レセプト（会計）補正連携</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> AI離職・育休リスク中長期人事予測</li>
                  </ul>
                </div>
              </div>
              
              <button
                onClick={() => setPlanType("matsu")}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold py-2.5 px-4 rounded-xl mt-8 transition"
                id="btn-select-matsu"
              >
                松プランで見積もり
              </button>
            </div>
          </div>

          {/* 補助金電卓シミュレータ本体 */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" /> 医療DX推進国庫補助金・活用シミュレーター
                </span>
                <h4 className="text-xl font-bold mt-2 text-white">
                  IT導入・働き方改革推進補助金(最大450万円)適用試算
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-semibold">
                  MEDISISは、国庫IT導入枠の「DX特別推進枠」にシステムベンダーとして指定されております。補助金を申請することで、イニシャルの約2/3（上限450万円）が公的に補填され、実質負担を大幅に縮小した導入が可能です。
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">● 対象病院の計画ベッド(床)数目安</label>
                    <div className="flex gap-2">
                      {[
                        { label: "~99床", val: 80 },
                        { label: "100~199床", val: 150 },
                        { label: "200床以上", val: 300 }
                      ].map((b, idx) => (
                        <button
                          key={idx}
                          onClick={() => setBeds(b.val)}
                          className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg border transition ${
                            beds === b.val
                              ? "bg-emerald-600 text-white border-emerald-500"
                              : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                          }`}
                          id={`bed-btn-${idx}`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed font-semibold">
                    <span className="text-emerald-400 font-bold block mb-1">【代行体制の特記事項】</span>
                    今井先生と佐藤朋氏の窓口が、複雑怪奇な「国庫補助金の申請事業計画書」の作成・提出までを完全マンツーマンでサポート。現場事務職員に重い書類負担をかけません。
                  </div>
                </div>
              </div>

              {/* シミュレーション数値結果 */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase">見積シミュレーション内訳</span>
                    <span className="text-xs font-semibold bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-800">
                      現在プラン: {planType === "ume" ? "梅" : planType === "take" ? "竹" : "松"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>システム標準価格 (見積目安) :</span>
                      <span className="font-mono text-white text-sm">¥{getPlanPrice().toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs font-bold text-emerald-400">
                      <span>国庫補助金(2/3還付上限あり)分 :</span>
                      <span className="font-mono text-sm">- ¥{subsidy.toLocaleString()}</span>
                    </div>

                    <div className="border-t border-slate-800 pt-4 mt-2 flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-200">実質自己負担金（見込） :</span>
                      <div className="text-right">
                        <span className="font-serif font-black text-2xl text-emerald-400 font-mono">¥{selfPay.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5 font-bold font-sans">※消費税別途</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-950/40 text-emerald-300 p-3 rounded-xl mt-6 border border-emerald-900 text-[11px] leading-relaxed font-semibold">
                  💡 <strong>特別支援特典</strong>：200床未満の地域急性期・療養病院については、「DX補助金申請サポート手数料」は<strong>完全無料</strong>にて事務代行サポート（佐藤朋氏の窓口）が付属いたします。
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        導入ロードマップ / プロジェクトタイムライン (Step 1 ~ Step 4)
        佐藤朋氏、今井先生、事務長・現場の関係性と活動スピードを美しくダイアローグ
      */}
      <section className="bg-slate-50 py-16 px-6 relative" id="roadmap-timeline">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              IMPLEMENTATION ROADMAP
            </span>
            <h3 className="text-3xl font-extrabold text-slate-950 mt-3 font-sans">
              実際の営業や導入フェーズに落とし込むプロジェクト具体フロー
            </h3>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              今井先生の親身な提案体制と、佐藤朋氏の開発・サイト構築とチラシQR動線が見事にシンクロする実践的ロードマップ。
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {TIMELINE_STEPS.map((t, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex flex-col justify-between hover:border-emerald-500 transition-all duration-300"
                id={`timeline-card-${idx}`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
                    <span className="p-1 px-2 text-[10px] font-black uppercase tracking-wider bg-slate-900 text-slate-100 rounded">
                      {t.step}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md">
                      {t.period}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-950 mb-1 leading-snug">{t.title}</h4>
                  <p className="text-[10px] text-emerald-700 font-bold mb-3 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                    主担当: {t.actor}
                  </p>
                  
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">
                    {t.desc}
                  </p>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100/70 space-y-2 mt-auto">
                    <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">主なタスク ＆ アウトプット</p>
                    {t.details.map((detail, dIdx) => (
                      <p key={dIdx} className="text-[10px] text-slate-600 font-medium pl-3 relative leading-relaxed">
                        <span className="absolute left-0 top-0.5 text-emerald-600 font-bold">・</span>
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                  <span className="text-[10px] font-extrabold text-emerald-700 tracking-wider">
                    {idx === 0 ? "初期準備期" : idx === 1 ? "デモ統合期" : idx === 2 ? "認知フック期" : "現場提案・導入期"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-emerald-600 text-white rounded-3xl p-6 md:p-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center shadow-lg shadow-emerald-600/10">
            <div className="lg:col-span-8 space-y-2">
              <h4 className="text-lg font-bold">佐藤朋氏 ＆ 今井先生による「ポータル・チラシQR・デモ環境」最適アライアンス</h4>
              <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                本Webサイトは、単なる機能羅列ではありません。今井先生が尾鷲市や急性期・労務病院の先生方と面談する際、iPadを取り出して患者アレルギーデモを見せながら、「貴院ならこの構成で、これほど補助金が出ます」と。さらに、その場でお悩みに応じて生成したAI提案テキストをプリンターへ出力し、配布できる一連の商談最適パッケージとして佐藤朋氏が精緻に組み上げています。
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <span className="bg-white/10 backdrop-blur-md p-4.5 rounded-2xl text-center border border-white/20 block text-xs">
                <p className="font-bold">デモサイトQR連動率</p>
                <p className="text-3xl font-black text-emerald-200 mt-1 font-mono">100%</p>
                <p className="text-[9px] text-emerald-100 mt-0.5">現場コンバージョン導線マージ済</p>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 
        銀行レベルのセキュリティ & 国家機密レベル階層ブロック
      */}
      <section className="bg-white py-14 px-6 border-b border-slate-200" id="medisis-security">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-12 xl:col-span-7 space-y-4">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
              SECURITY FIRST
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-950 font-sans">
              ランサムウェア等のサイバー攻撃から電子カルテ並びに病院資産を完全に守る「銀行レベル」のAI暗号化セキュリティ
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-semibold">
              近年、中小の公立・急性期病院をターゲットにしたサイバー強請（ランサムウェア等）によるバックアップ患者データの漏洩事例が増加しています。
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs">
                <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg inline-block mb-2 font-bold uppercase">
                  防衛①：国家機密レベル階層分離
                </span>
                <p className="text-slate-600 font-semibold leading-relaxed">
                  患者の個人氏名・カルテデータと、AI映像および Done ログマスタを物理的に別の暗号化ブロック内に格納。万が一、病棟PCがウイルス等に感染しても、MEDISISの中央DBは階層分離にて防御し、侵入を完全に拒絶します。
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs">
                <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg inline-block mb-2 font-bold uppercase">
                  防衛②：権限外自動ロックアウト
                </span>
                <p className="text-slate-600 font-semibold leading-relaxed">
                  異常なデバイスアクセス、あるいは連続したデータ抽出挙動をシステムが検知した瞬間、該当する病院側ログインアカウントを強制セキュリティロック。管理者へ即座に緊急通報が行われ、情報漏洩を未然に遮断します。
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-12 xl:col-span-5">
            <div className="bg-slate-950 p-6 rounded-3xl border border-rose-950/40 text-rose-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-slate-700 tracking-widest font-bold">
                ENCRYPT-LEVEL: AES-256 / SHA3
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
                <h4 className="font-bold text-white text-sm">MEDISIS-SEC 暗号盾統合コンソール</h4>
              </div>

              <div className="space-y-3.5 mb-6 text-xs text-slate-400 font-semibold">
                <div className="flex justify-between items-center text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                  <span>電子カルテ Ubie 連携暗号トンネル</span>
                  <span className="text-emerald-400 font-mono">● LIVE SECURE</span>
                </div>
                <div className="flex justify-between items-center text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                  <span>Safieカメラ AI映像スクリーニング</span>
                  <span className="text-emerald-400 font-mono">● ENCRYPT-END</span>
                </div>
                <div className="flex justify-between items-center text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                  <span>全現場 Done ログ・トリガー防壁</span>
                  <span className="text-emerald-400 font-mono">● ACTIVE (3LAYER)</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic mt-4 leading-relaxed font-semibold">
                ※MEDISISは、厚生労働省・経済産業省・総務省の『3省2ガイドライン（医療情報の安全管理・セキュリティ規程）』に完全準拠し、設計・展開されております。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Aesthetic Footer with elegant buttons */}
      <footer className="bg-slate-900 text-white p-6 md:p-10" id="medisis-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="font-black text-white text-lg font-sans tracking-tight uppercase">MEDISIS</span>
              <span className="text-xs bg-emerald-900 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">COPR SYSTEM</span>
            </div>
            <p className="text-[10px] text-slate-400">
              次世代AI統合現場管理システム「MEDISIS（メディシス）」ポータルポータル 
            </p>
            <p className="text-[9px] text-slate-500 italic">
              Developed by 佐藤朋 & 監修：今井先生 | All Rights Reserved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#demo-playground" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 transition text-xs flex items-center justify-center gap-1.5 leading-none">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              資料請求・AIデモ申込はこちら
            </a>
            <span className="bg-slate-800/80 px-4 py-3 rounded-full text-[11px] font-semibold text-slate-300 border border-slate-700/50 flex items-center justify-center gap-1.5">
              <span>医療DX補助金サポート窓口：稼働中</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export function Notebook(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 6h4" />
      <path d="M2 10h4" />
      <path d="M2 14h4" />
      <path d="M2 18h4" />
      <rect width="16" height="20" x="6" y="2" rx="2" />
      <path d="M16 2v20" />
    </svg>
  );
}
