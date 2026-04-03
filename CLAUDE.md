# MitsuMO

WEBサイト制作のコーディング見積もりをシミュレーションするReactアプリ。

## 概要

- 制作者がクライアントに見せながら、ページ数や機能を選んでいくとリアルタイムで金額が変化する
- 専門知識がなくても操作できるユーザーフレンドリーなUI
- 制作方式：WordPress（テーマ自作フルスクラッチ）、HTML/CSS（静的サイト）
- 対応案件：コーポレートサイト、LP、ブログ・メディアサイト、ECサイト
- 制作範囲：コーディングのみ（デザインは別）

## 技術スタック

- React（JSX）
- SheetJS（Excel出力）
- jsPDF等（PDF出力）
- クリップボードAPI（テキストコピー）
- mailto:リンク（メール送信）

## プロジェクト構造

```
mitsumo_project/
├── .claude/commands/    # タスク別の実装指示
├── skills/              # 参照知識（仕様データ）
├── src/                 # アプリのソースコード（実装時に作成）
└── CLAUDE.md            # このファイル
```

## skills/ — 参照知識

アプリのソースコード作成時は、必ず該当する skills/ 配下の SKILL.md を参照してから作業すること。

| フォルダ | 内容 |
|----------|------|
| skills/pricing/ | 全43項目の単価データ・消費税・割引・有効期限 |
| skills/app-spec/ | アプリの基本仕様（UI方式・金額表示・出力機能等） |
| skills/design-system/ | デザインシステム（カラー・フォント・UIパーツの詳細） |
| skills/excel-spec/ | Excel出力の3シート構成の詳細仕様 |
| skills/step-screens/ | 全5画面の構成・入力項目・金額計算ロジック |

## .claude/commands/ — 実装指示

| コマンド | 内容 |
|----------|------|
| /build-step1 | Step1「サイトの基本情報」画面の実装 |
| /build-step2 | Step2「機能選択」画面の実装 |
| /build-step3 | Step3「デザイン仕様」画面の実装 |
| /build-step4 | Step4「その他オプション」画面の実装 |
| /build-step5 | Step5「見積もり結果」画面の実装 |
| /build-excel-output | Excel出力機能の実装 |
| /build-pdf-output | PDF出力機能の実装 |
| /build-export | テキストコピー・メール送信の実装 |
| /coding-rules | コーディングルールの確認 |
| /design-ui | デザインUI指示の確認 |

## ルール

- 実装前に必ず関連する skills/ の SKILL.md を読むこと
- 単価データは skills/pricing/SKILL.md が唯一の正（Single Source of Truth）
- デザインは skills/design-system/SKILL.md に厳密に従うこと
- 画面仕様は skills/step-screens/SKILL.md を参照すること
