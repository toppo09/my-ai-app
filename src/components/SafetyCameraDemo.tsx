import { useState, useEffect } from "react";
import { Camera, AlertCircle, VolumeX, ShieldCheck, MonitorCheck, Bell, Smartphone, UserRoundCheck, Network } from "lucide-react";
import { CameraEvent } from "../types";

const INITIAL_EVENTS: CameraEvent[] = [
  {
    id: "e1",
    time: "10分前",
    patientName: "斉藤 三郎 (91)",
    room: "402",
    rawMotion: "ベッド面に対して上体の大きな揺れ、及び柵へ手足をかけたシグナルを検知",
    aiClassification: "離床検知（極めて危険）",
    urgency: "high",
    notificationSent: true
  },
  {
    id: "e2",
    time: "25分前",
    patientName: "小林 ハナ (87)",
    room: "405",
    rawMotion: "ベッド中央部での急激なロール運動（体位変換・寝返り運動）",
    aiClassification: "寝返り（不要な通知として無視）",
    urgency: "none",
    notificationSent: false
  },
  {
    id: "e3",
    time: "40分前",
    patientName: "田中 茂 (79)",
    room: "401",
    rawMotion: "上半身が45度以上起き上がった状態（安静保持が必要な制限指示）",
    aiClassification: "起き上がり（注視状態）",
    urgency: "low",
    notificationSent: true
  },
  {
    id: "e4",
    time: "1時間前",
    patientName: "渡辺 一郎 (74)",
    room: "403",
    rawMotion: "定位置での微細な重心移動（就寝中のリラックス動作）",
    aiClassification: "体位変更（自動記録のみ）",
    urgency: "none",
    notificationSent: false
  }
];

export default function SafetyCameraDemo() {
  const [events, setEvents] = useState<CameraEvent[]>(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<CameraEvent | null>(INITIAL_EVENTS[0]);
  const [simulationActive, setSimulationActive] = useState(true);

  // カメラ画像のセンサースクリーニングシミュレーション（簡易インターバル）
  useEffect(() => {
    if (!simulationActive) return;

    const timer = setInterval(() => {
      // ランダムでイベント追加
      const rand = Math.random();
      const now = new Date().toLocaleTimeString().slice(0, 5);
      
      let newEvent: CameraEvent;
      if (rand < 0.3) {
        newEvent = {
          id: `e-${Date.now()}`,
          time: "たった今",
          patientName: "鈴木 美智子 (85)",
          room: "406",
          rawMotion: "ベッド左側方向への著しい加重移動、ベッド外側のセンサ感知寸前",
          aiClassification: "離床検知（極めて危険）",
          urgency: "high",
          notificationSent: true
        };
      } else if (rand < 0.6) {
        newEvent = {
          id: `e-${Date.now()}`,
          time: "たった今",
          patientName: "斉藤 三郎 (91)",
          room: "402",
          rawMotion: "睡眠中における両下肢の緩慢な回旋動作、シーツ摩擦",
          aiClassification: "寝返り（不要な通知として無視）",
          urgency: "none",
          notificationSent: false
        };
      } else {
        newEvent = {
          id: `e-${Date.now()}`,
          time: "たった今",
          patientName: "加藤 恵子 (82)",
          room: "408",
          rawMotion: "ベッドヘッドボード側へ自力で体をスライドさせた動作",
          aiClassification: "体位変更（自動記録のみ）",
          urgency: "none",
          notificationSent: false
        };
      }

      setEvents(prev => [newEvent, ...prev.slice(0, 5)]); // 最大6件保持
      if (newEvent.urgency === "high" || newEvent.urgency === "low") {
        setSelectedEvent(newEvent);
      }
    }, 12000);

    return () => clearInterval(timer);
  }, [simulationActive]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="safety-camera-demo">
      {/* 左: セーフィティカメラリアルタイムスクリーニング（7コラム） */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-emerald-100 lg:col-span-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Camera className="w-5 h-5" />
              </span>
              <h3 className="font-semibold text-gray-900 text-lg">AIセーフティカメラ ＆ 不要アラート除去</h3>
            </div>
            <button
              onClick={() => setSimulationActive(!simulationActive)}
              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-1 px-2.5 rounded border border-emerald-100 transition"
              id="toggle-camera-sim"
            >
              {simulationActive ? "シミュレーション一時停止" : "自動更新の開始"}
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            ベッドサイドに設置されたセーフティカメラ。従来の圧力センサーと異なり、AIが「単なる寝返り」か「深刻な端坐位・転倒」かをミリ秒で見極め、看護師へ無意味に鳴り響く「狼少年アラート（おむつ交換や寝返り等）」を最大90%削減します。
          </p>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              直近のカメラセンシング＆スクリーニングログ（自動解析）
            </h4>
            
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                    selectedEvent && selectedEvent.id === event.id
                      ? "border-emerald-500 bg-emerald-50/70"
                      : "border-slate-100 bg-white hover:border-emerald-200"
                  }`}
                  id={`camera-ev-${event.id}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`p-2 rounded-lg mt-0.5 ${
                      event.urgency === "high"
                        ? "bg-rose-50 text-rose-600"
                        : event.urgency === "low"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-slate-50 text-slate-500"
                    }`}>
                      <Camera className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                        <span>{event.room}号室: {event.patientName}</span>
                        <span className="text-[11px] font-normal text-gray-400 font-mono">({event.time})</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {event.rawMotion}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      event.urgency === "high"
                        ? "bg-rose-100 text-rose-800"
                        : event.urgency === "low"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {event.aiClassification}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-xl p-4 mt-6">
          <div className="flex items-center gap-2 mb-2 text-rose-400 font-bold text-xs font-mono">
            <Network className="w-4 h-4 animate-pulse" />
            <span>MEDISIS-AI アラート削減自動システム：正常稼働中</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            本システムは安全レベルを維持したまま、1日平均で1ベッドあたり<strong>41回発生していた不要センサー音（寝返り等）</strong>を事前フィルタリング。不要に鳴らない静かな病棟を実現します。
          </p>
        </div>
      </div>

      {/* 右: スマホプレビュー ＆ MAXHUB 遠隔トリアージ（5コラム） */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-emerald-100 lg:col-span-12 xl:col-span-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <MonitorCheck className="w-5 h-5" />
            </span>
            <h3 className="font-semibold text-gray-900 text-lg">遠隔トリアージ ＆ ナースコール連携</h3>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            ナースコール発生時、すぐに走って往復する必要はありません。スマートフォン（ナース用）や大型会議液晶「MAXHUB」に患者のアラート深刻度・カメラ画像・アレルギー情報などをリアルタイム統合。看護師が必要な資材を持って<strong>「1回で解決」</strong>を果たす遠隔司令塔です。
          </p>

          {selectedEvent ? (
            <div className="space-y-4">
              {/* スマートフォン画面の模倣 */}
              <div className="outline-dashed outline-slate-200 outline-offset-4 rounded-2xl p-4 bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px] font-bold text-slate-800 tracking-wider">MEDISIS モバイル連携</span>
                  </div>
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                    ! EMERGENCY !
                  </span>
                </div>

                <div className="bg-white rounded-xl p-3 shadow-xs border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-[11px] text-gray-400 font-bold uppercase">対象エリア / 患者</p>
                      <h5 className="font-bold text-slate-900 text-sm">
                        {selectedEvent.room}号室: {selectedEvent.patientName}
                      </h5>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full font-semibold">
                      トリアージレベル: {selectedEvent.urgency === "high" ? "高度緊急" : "要経過観察"}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-2.5 mb-2.5">
                    <p className="text-[10px] text-slate-400 font-bold">自動AIセンシング検知詳細</p>
                    <p className="text-xs text-slate-700 font-medium mt-0.5 leading-relaxed">
                      {selectedEvent.rawMotion}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-bold">
                    <div className="bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-100">
                      <p className="text-[9px] text-emerald-600 block">AI推奨アクション</p>
                      ベッド固定資材(抑制具等)の用意
                    </div>
                    <div className="bg-red-50 text-red-800 p-2 rounded-lg border border-red-100 flex items-center justify-center">
                      <p className="leading-tight text-[10px]">Ubie禁忌: ヨード不可</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" /> 遠隔MAXHUB通話
                  </button>
                  <button className="flex-1 bg-slate-950 hover:bg-slate-900 text-slate-100 text-xs font-bold py-1.5 px-3 rounded-lg transition flex items-center justify-center gap-1.5">
                    <UserRoundCheck className="w-3.5 h-3.5 text-emerald-400" /> 看護師対応中へ変更
                  </button>
                </div>
              </div>

              {/* 大型モニタMAXHUBでの受診画面イメージ */}
              <div className="p-4 rounded-xl bg-slate-950 text-white border border-slate-800 flex items-start gap-4">
                <div className="p-3 bg-slate-900 rounded-lg text-emerald-400 animate-pulse border border-slate-800">
                  <MonitorCheck className="w-8 h-8" />
                </div>
                <div>
                  <h5 className="font-semibold text-xs text-slate-400">MAXHUB（大型モニター司令塔）連携中</h5>
                  <p className="text-sm font-semibold mt-1">
                    救急隊からの音声・車内映像が病院のMAXHUBへ直結
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    医師が大型画面で救急車内の容態を注視し、搬送中に的確な1次処置の口頭指示が可能。受け入れミスや資材不整合を完全に防止します。
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic text-center py-12">
              直近の検知ログをクリックすると、スマートフォンナースコール画面とトリアージ対策コマンドのイメージが表示されます。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
