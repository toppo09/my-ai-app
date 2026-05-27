import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, AlertTriangle, UserCheck, RefreshCw, Play, Check, ShieldAlert, HeartHandshake } from "lucide-react";
import { Task, AllergyCheck } from "../types";

// 初期タスクリスト
const INITIAL_TASKS: Task[] = [
  { id: "1", time: "07:30", patientName: "渡辺 一郎", room: "301", type: "起床配薬", assignee: "未割当", status: "pending" },
  { id: "2", time: "07:45", patientName: "加藤 恵子", room: "305", type: "起床配薬", assignee: "未割当", status: "pending" },
  { id: "3", time: "08:00", patientName: "田中 茂", room: "302", type: "配膳", assignee: "未割当", status: "pending" },
  { id: "4", time: "08:00", patientName: "小林 ヨシ", room: "303", type: "配膳", assignee: "未割当", status: "pending" },
  { id: "5", time: "08:15", patientName: "佐藤 明", room: "308", type: "点滴", assignee: "未割当", status: "pending" },
  { id: "6", time: "08:30", patientName: "高橋 健治", room: "306", type: "体位変換", assignee: "未割当", status: "pending" },
  { id: "7", time: "08:45", patientName: "木村 ハナ", room: "307", type: "バイタル", assignee: "未割当", status: "pending" },
];

const STAFFS = ["佐藤（看護師）", "鈴木（看護師）", "斉藤（准看護師）"];

export default function TaskSafetyDemo() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isDistributed, setIsDistributed] = useState(false);
  const [log, setLog] = useState<string[]>(["システムが起動されました。朝のタスクは未割当です。"]);

  // 禁忌チェッカーの状態
  const [patient, setPatient] = useState("ikeya"); // ikeya (ヨードアレルギー), suzuki (ペニシリンアレルギー), sato (なし)
  const [drug, setDrug] = useState("saline"); // saline (生理食塩水), iodine (ヨード造影剤), penicillin (ペニシリン系抗生剤)
  const [checkStatus, setCheckStatus] = useState<AllergyCheck["status"]>("idle");
  const [checkMessage, setCheckMessage] = useState("");

  // 自動タスク分配シミュレーション
  const handleDistribute = () => {
    setIsDistributed(true);
    const updatedTasks = tasks.map((task, index) => {
      // 負荷を平準化して割り当て
      const assignee = STAFFS[index % STAFFS.length];
      return { ...task, assignee };
    });
    setTasks(updatedTasks);
    setLog(prev => [
      `[${new Date().toLocaleTimeString()}] AIが業務順位とスタッフの現在負荷（移動効率含む）からタスクを「自動最適分配」しました。`,
      ...prev
    ]);
  };

  // タスクのDone
  const handleTaskDone = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "done" } : t));
    setLog(prev => [
      `[${new Date().toLocaleTimeString()}] 【Done完了ログ】患者 [${task.patientName}] の${task.type}を、担当：${task.assignee}が完了しました。「先入力」なし、二重検証ログ記録。`,
      ...prev
    ]);
  };

  // 禁忌薬チェックの実行
  const handleCheckAllergy = () => {
    setCheckStatus("checking");
    setCheckMessage("患者情報（Ubie診療データベース等）と電子カルテ、注射指示をAIダブルチェック中...");

    setTimeout(() => {
      if (patient === "ikeya" && drug === "iodine") {
        setCheckStatus("danger");
        setCheckMessage("【警告】患者 斉藤さま（カルテ:ヨードアレルギーあり）に対して「ヨード造影剤」が指示されました！投与禁忌です。");
      } else if (patient === "suzuki" && drug === "penicillin") {
        setCheckStatus("danger");
        setCheckMessage("【警告】患者 鈴木さま（カルテ:ペニシリン・セフェムアレルギー強）に対し、該当アレルギー誘発マスタ「ペニシリン」が一致！画面ロックされました。");
      } else {
        setCheckStatus("safe");
        const patientLabel = patient === "ikeya" ? "斉藤さま (ヨードアレルギー)" : patient === "suzuki" ? "鈴木さま (ペニシリンアレルギー)" : "佐藤さま (アレルギーなし)";
        const drugLabel = drug === "saline" ? "生理食塩水 250ml" : drug === "iodine" ? "ヨード造影剤" : "ペニシリン系抗生剤";
        setCheckMessage(`【安全確認】${patientLabel} に対する ${drugLabel} の投与にアレルギー競合はありません。安全が確保されています。`);
      }
    }, 1200);
  };

  // リセット
  const handleResetTasks = () => {
    setTasks(INITIAL_TASKS);
    setIsDistributed(false);
    setLog(["タスク分配をリセットしました。"]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="task-safety-demo">
      {/* 1. 朝の過密タスク自動分配 */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-emerald-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <UserCheck className="w-5 h-5" />
              </span>
              <h3 className="font-semibold text-gray-900 text-lg">朝の過密タスクAI自動分配 & Doneログ</h3>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              ミドル・現場向け
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            起床や配膳等、朝の過酷かつバッティングしやすいタスクをAIがわずか1秒で最適分配。「Done」ボタンを押すだけのリアルタイム行動記録で、「確認忘れ」や「先入力」といった事故を劇的に削減します。
          </p>

          <div className="space-y-3 mb-6 max-h-[290px] overflow-y-auto pr-1">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                  task.status === "done"
                    ? "bg-slate-50 border-slate-100 text-gray-400"
                    : isDistributed
                    ? "bg-white border-emerald-100 hover:border-emerald-200"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                    {task.time}
                  </span>
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      <span className={task.status === "done" ? "line-through text-gray-400" : "text-gray-800"}>
                        {task.room}号室: {task.patientName}
                      </span>
                      <span className="text-xs font-normal text-slate-50 relative top-[0.5px]">|</span>
                      <span className={`text-xs font-medium px-2 py-0.2 rounded-full ${
                        task.type === "起床配薬" || task.type === "点滴"
                          ? "bg-rose-50 text-rose-700 border border-rose-100"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      }`}>
                        {task.type}
                      </span>
                    </div>
                    {isDistributed && (
                      <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        責任担当: {task.assignee}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  {task.status === "done" ? (
                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold px-2 py-1 bg-emerald-50 rounded-lg">
                      <Check className="w-4.5 h-4.5" /> 実施記録済
                    </span>
                  ) : isDistributed ? (
                    <button
                      onClick={() => handleTaskDone(task.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1 px-3 rounded-lg shadow-sm hover:shadow transition"
                      id={`done-btn-${task.id}`}
                    >
                      Done!
                    </button>
                  ) : (
                    <span className="text-xs text-rose-500">分配後に操作可能</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* コントロール・ログ */}
        <div className="border-t border-slate-100 pt-4 mt-auto">
          <div className="flex gap-2 mb-3">
            {!isDistributed ? (
              <button
                onClick={handleDistribute}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2"
                id="btn-distribute-tasks"
              >
                <Play className="w-4 h-4" /> AI過密タスク最適分配
              </button>
            ) : (
              <button
                onClick={handleResetTasks}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2 px-4 rounded-xl transition flex items-center justify-center gap-2"
                id="btn-reset-tasks"
              >
                <RefreshCw className="w-4 h-4" /> 分配リセット
              </button>
            )}
          </div>
          
          <div className="p-3 bg-slate-950 text-slate-300 font-mono text-[11px] rounded-xl h-[80px] overflow-y-auto">
            <p className="text-emerald-400 border-b border-emerald-950 pb-1 mb-1 font-bold">● MEDISIS-AI 現場配信ログ</p>
            {log.map((entry, idx) => (
              <p key={idx} className="leading-relaxed">{entry}</p>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 確定的禁忌・安全チェッカー */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-emerald-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h3 className="font-semibold text-gray-900 text-lg">確定的禁忌・安全チェッカー（Ubie連携対応）</h3>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-700 rounded-full">
              医療安全・師長熱望
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Ubieの病名・アレルギーデータベースから、患者の特異体質（ペニシリン・ヨード等）を完全に把握。誤った注射指示や投薬指示があると、投与・施行前にシステムが自動照合して強力なロック・警告画面を表示。
          </p>

          <div className="space-y-4 mb-6">
            {/* 患者の選択 */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                1. 患者を選択（アレルギー既往歴情報）
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { setPatient("ikeya"); setCheckStatus("idle"); }}
                  className={`p-3 rounded-xl text-center border text-xs font-medium transition ${
                    patient === "ikeya"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold"
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                  }`}
                  id="patient-opt-ikeya"
                >
                  <p className="font-bold">斉藤 さま</p>
                  <p className="text-[10px] text-rose-600 mt-1">ヨード既往あり</p>
                </button>
                <button
                  onClick={() => { setPatient("suzuki"); setCheckStatus("idle"); }}
                  className={`p-3 rounded-xl text-center border text-xs font-medium transition ${
                    patient === "suzuki"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold"
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                  }`}
                  id="patient-opt-suzuki"
                >
                  <p className="font-bold">鈴木 さま</p>
                  <p className="text-[10px] text-rose-600 mt-1">ペニシリン強アレルギー</p>
                </button>
                <button
                  onClick={() => { setPatient("sato"); setCheckStatus("idle"); }}
                  className={`p-3 rounded-xl text-center border text-xs font-medium transition ${
                    patient === "sato"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold"
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                  }`}
                  id="patient-opt-sato"
                >
                  <p className="font-bold">佐藤 さま</p>
                  <p className="text-[10px] text-slate-500 mt-1">アレルギーなし</p>
                </button>
              </div>
            </div>

            {/* 薬品の選択 */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                2. 投与される薬品マスタ指示（電子指示 / バーコード検知）
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { setDrug("saline"); setCheckStatus("idle"); }}
                  className={`py-2 px-1 rounded-xl text-center border text-xs font-medium transition ${
                    drug === "saline"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold"
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                  }`}
                  id="drug-opt-saline"
                >
                  生理食塩水 250ml
                </button>
                <button
                  onClick={() => { setDrug("iodine"); setCheckStatus("idle"); }}
                  className={`py-2 px-1 rounded-xl text-center border text-xs font-medium transition ${
                    drug === "iodine"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold"
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                  }`}
                  id="drug-opt-iodine"
                >
                  ヨード系血管造影剤
                </button>
                <button
                  onClick={() => { setDrug("penicillin"); setCheckStatus("idle"); }}
                  className={`py-2 px-1 rounded-xl text-center border text-xs font-medium transition ${
                    drug === "penicillin"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold"
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                  }`}
                  id="drug-opt-penicillin"
                >
                  ペニシリン系抗生物質
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* チェック判定表示 */}
        <div className="border-t border-slate-100 pt-4 mt-auto">
          {checkStatus === "idle" && (
            <button
              onClick={handleCheckAllergy}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow transition duration-200 flex items-center justify-center gap-2"
              id="btn-run-safety-check"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              禁忌一致チェックを実行する（ダブル照合）
            </button>
          )}

          {checkStatus === "checking" && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-3">
              <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
              <p className="text-sm font-medium text-slate-700 animate-pulse">{checkMessage}</p>
            </div>
          )}

          {checkStatus === "danger" && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="p-4 rounded-xl bg-red-50 border-2 border-red-300 text-red-900 flex flex-col gap-2 relative overflow-hidden"
            >
              <div className="absolute right-2 bottom-0 text-red-200/50 transform translate-y-2 pointer-events-none">
                <AlertTriangle className="w-24 h-24" />
              </div>
              <div className="flex items-start gap-3 relative z-10">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-800 text-sm flex items-center gap-1.5">
                    !! 投与前禁忌警告ロック !!
                  </h4>
                  <p className="text-xs text-red-700 font-semibold mt-1 leading-relaxed">
                    {checkMessage}
                  </p>
                  <p className="text-[10px] text-red-500 mt-2 font-semibold">
                    ※スタッフのスマートウォッチ、現場iPad、ナースステーションの主モニターへ強制ポップアップが即時送信されました。
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {checkStatus === "safe" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3"
            >
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-800 text-sm">医療安全確認済 (Pass)</h4>
                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                  {checkMessage}
                </p>
                <p className="text-[10px] text-emerald-500 mt-1 uppercase font-semibold">
                  MEDISIS: 照合OK (Ubie/カルテマスタ安全整合性確認ログを自動生成)
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
