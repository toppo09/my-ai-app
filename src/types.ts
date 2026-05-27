export interface Task {
  id: string;
  time: string;
  patientName: string;
  room: string;
  type: "配膳" | "起床配薬" | "点滴" | "体位変換" | "バイタル";
  assignee: string;
  status: "pending" | "done";
}

export interface AllergyCheck {
  patientName: string;
  allergy: string;
  prescribedDrug: string;
  isContradicated: boolean;
  status: "idle" | "checking" | "danger" | "safe";
}

export interface CameraEvent {
  id: string;
  time: string;
  patientName: string;
  room: string;
  rawMotion: string;
  aiClassification: "離床検知（極めて危険）" | "寝返り（不要な通知として無視）" | "体位変更（自動記録のみ）" | "起き上がり（注視状態）";
  urgency: "high" | "low" | "none";
  notificationSent: boolean;
}

export interface QuoteFeature {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
}

export interface RoadmapStep {
  step: number;
  title: string;
  period: string;
  owner: string;
  actions: string[];
  outcomes: string[];
}
