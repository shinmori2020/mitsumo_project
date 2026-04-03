# デザインシステム

MitsuMOアプリのデザイン仕様。すべてのUI実装はこのファイルに従うこと。

---

## 全体の印象

親しみやすい柔らかさ（パステル・丸みのあるUI）。
クライアントに見せるアプリのため、専門的すぎず、温かみのあるデザインにする。

## カラーパレット

| 用途 | カラー名 | コード |
|------|---------|--------|
| メインカラー | グリーン | #1D9E75 |
| サブカラー1 | パステルグリーン（最も薄い） | #E1F5EE |
| サブカラー2 | パステルグリーン（中間） | #9FE1CB |
| サブカラー3 | パステルグリーン（やや濃い） | #5DCAA5 |
| ダークカラー | ダークグリーン | #085041 |
| テキスト（見出し） | ダークグリーン | #085041 |
| テキスト（補足） | ミドルグリーン | #0F6E56 |
| 非選択・OFF | グレー | ブラウザデフォルトのborder色 |
| 背景 | ホワイト | #FFFFFF |

## フォント

- 種類：丸ゴシック系（フレンドリー）
- 推奨：`"Rounded Mplus 1c", "Hiragino Maru Gothic ProN", sans-serif`
- Google Fonts使用の場合：`M PLUS Rounded 1c`

## レイアウト

- フルサイズ（画面全体を大きく使う。モーダル型ではない）
- 最大幅の制限なし（コンテナ幅に合わせる）
- パディング：左右24px、上下28px

## ステップインジケーター（上部固定）

- 背景：メインカラー（#1D9E75）
- タイトル：「MitsuMO」、16px、#E1F5EE
- ステップ丸：36px × 36px、border-radius: 50%
  - 現在のステップ：白背景、メインカラー文字
  - 完了済み：#E1F5EE背景、メインカラーでチェックマーク（✓）
  - 未到達：#5DCAA5背景、白文字
- ステップ間の線：幅40px、高さ2px
  - 完了済み区間：#E1F5EE
  - 未到達区間：#5DCAA5
- ステップラベル：12px
  - アクティブ/完了：#E1F5EE
  - 未到達：#9FE1CB

## 金額バー（下部固定）

- 背景：ダークカラー（#085041）
- 左側：
  - ラベル「現在の見積もり金額」12px、#9FE1CB
  - 「税抜」ラベル 12px、#5DCAA5
  - 金額 24px、font-weight: 500、#FFFFFF
  - 「円」14px、#9FE1CB
- 右側：
  - 「税込」ラベル 12px、#9FE1CB
  - 金額 17px、font-weight: 500、#5DCAA5

## ピル型ボタン（選択系）

- border-radius: 24px
- padding: 10px 20px
- font-size: 14px
- 選択状態（ON）：背景 #1D9E75、文字 #FFFFFF、font-weight: 500
- 非選択状態（OFF）：背景 #E1F5EE、文字 #085041
- cursor: pointer

## トグルスイッチ

- トラック：幅48px、高さ26px、border-radius: 13px
  - ON：背景 #1D9E75
  - OFF：背景 グレー（border-secondary相当）
- ノブ：幅22px、高さ22px、白（#FFFFFF）、border-radius: 50%
  - ON時：left: 24px
  - OFF時：left: 2px
- アニメーション：transition 0.15s

## トグル行（項目＋トグル）

- display: flex、align-items: center、justify-content: space-between
- padding: 14px 16px
- 下線：border-bottom 0.5px solid（最後の行は無し）
- 項目名：15px、プライマリカラー
- 補足テキスト：12px、テキスト薄色、margin-top: 2px

## スライダー

- スライダー本体：ブラウザデフォルトのrange input
- 数値バッジ（右端）：
  - 背景 #E1F5EE、border-radius: 14px、padding: 8px 18px
  - 数値：22px、font-weight: 500、#085041
  - 単位「page」：13px、#0F6E56

## グループラベル

- 背景：メインカラー（#1D9E75）
- 文字：13px、font-weight: 500、#FFFFFF
- padding: 8px 16px
- border-radius: 12px 12px 0 0（上のみ丸）

## グループボックス

- border: 0.5px solid（ボーダーカラー）
- border-top: none（グループラベルと接続）
- border-radius: 0 0 12px 12px（下のみ丸）
- padding: 4px 0
- margin-bottom: 8px

## ドロップダウン（擬似）

- 背景：#E1F5EE
- border-radius: 10px
- padding: 6px 14px
- font-size: 13px、#085041、font-weight: 500
- 右側に下向き三角アイコン（▼）

## カラースウォッチカード

- border: 0.5px solid（ボーダーカラー）
- border-radius: 14px
- padding: 12px
- スウォッチ部分：width: 100%、height: 48px、border-radius: 10px
- ラベル：12px、テキスト薄色
- カラーコード：14px、font-weight: 500

## レイアウトプレビューカード

- border: 0.5px solid（ボーダーカラー）
- border-radius: 14px
- padding: 12px
- 選択状態：border 2px solid #1D9E75
- プレビュー部分：height: 80px、border-radius: 8px
- パターン名：13px、font-weight: 500
- 説明：11px、テキスト薄色

## ボタン（ナビゲーション）

- 「戻る」ボタン：
  - flex: 1、border-radius: 16px
  - border: 0.5px solid、背景 白、テキスト薄色
- 「次へ進む」ボタン：
  - flex: 2、border-radius: 16px
  - border: none、背景 #1D9E75、文字 #FFFFFF、font-weight: 500
- 共通：padding: 14px、font-size: 15px

## 出力ボタン（Step5）

- 2×2グリッド配置、gap: 10px
- 各ボタン：
  - 背景 #E1F5EE、文字 #085041
  - border-radius: 14px、padding: 14px
  - font-size: 14px、font-weight: 500
  - アイコン：20px角丸4px、白文字、各色背景
    - Excel: #0F6E56
    - PDF: #C00000
    - テキストコピー: #085041
    - メール: #2B4C7E

## 結果カード（Step5合計金額）

- 背景：#085041、border-radius: 20px、padding: 28px 24px
- テキスト中央配置
- ラベル「お見積り金額」：14px、#9FE1CB
- お客様名：16px、#5DCAA5、font-weight: 500
- 税込金額：40px、font-weight: 500、#FFFFFF
- 「円」：18px、#9FE1CB
- 区切り線：border-top 0.5px solid #0F6E56
- 税抜・消費税：18px、#5DCAA5

## 内訳テーブル（Step5）

- 角丸12px、overflow: hidden、border: 0.5px solid
- ヘッダー行：背景 #1D9E75、文字 #FFFFFF、12px、font-weight: 500
- データ行：13px、padding: 10px 12px
- 偶数行：背景 #E1F5EE
- 集計行：border-top 2px solid #1D9E75、font-weight: 500
- 合計行：15px、#085041

## セクションタイトル

- font-size: 20px、font-weight: 500、#085041
- 説明文：14px、テキスト薄色、margin-bottom: 28px

## フィールドラベル

- font-size: 13px、font-weight: 500、テキスト薄色
- margin-bottom: 8〜10px

## テキスト入力

- width: 100%、padding: 12px 16px
- border-radius: 14px、border: 0.5px solid
- font-size: 14px

## テキストエリア

- width: 100%、padding: 12px 16px
- border-radius: 14px、border: 0.5px solid
- font-size: 14px、min-height: 80px、resize: vertical
