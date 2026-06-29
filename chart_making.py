import datetime
import openpyxl
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation


def create_beautiful_gantt():
    # ワークブックの新規作成
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "プロジェクト管理"

    # グリッド線（目盛線）を常に表示する設定
    ws.views.sheetView[0].showGridLines = True

    # ==========================================
    # 1. デザイン・カラーの定義
    # ==========================================
    FONT_FAMILY = "Yu Gothic"  # 游ゴシック

    font_title = Font(name=FONT_FAMILY, size=16, bold=True, color="1A252C")
    font_header = Font(name=FONT_FAMILY, size=10, bold=True, color="FFFFFF")
    font_data = Font(name=FONT_FAMILY, size=10, color="2C3E50")
    font_date = Font(name=FONT_FAMILY, size=9, color="7F8C8D")

    fill_header = PatternFill(
        start_color="2C3E50", end_color="2C3E50", fill_type="solid"
    )  # 濃いネイビーグレー
    fill_timeline_hd = PatternFill(
        start_color="F8F9FA", end_color="F8F9FA", fill_type="solid"
    )  # タイムライン背景（薄グレー）

    # 完了時専用のスタイル（薄いグレーの背景 ＋ 薄いグレーの文字）
    fill_done = PatternFill(
        start_color="F1F3F4", end_color="F1F3F4", fill_type="solid"
    )
    font_done = Font(name=FONT_FAMILY, size=10, color="9AA0A6")

    # 罫線
    border_thin = Side(border_style="thin", color="E2E8F0")
    cell_border = Border(
        left=border_thin, right=border_thin, top=border_thin, bottom=border_thin
    )

    align_center = Alignment(horizontal="center", vertical="center")
    align_left = Alignment(horizontal="left", vertical="center")

    # ==========================================
    # 2. タイトルとヘッダーの配置 (3行目)
    # ==========================================
    ws["A1"] = "Project Gantt Chart"
    ws["A1"].font = font_title

    headers = ["種類", "タスク内容", "進捗", "開始日", "終了予定日"]
    ws.row_dimensions[3].height = 28

    for col_idx, text in enumerate(headers, 1):
        cell = ws.cell(row=3, column=col_idx, value=text)
        cell.font = font_header
        cell.fill = fill_header
        cell.alignment = align_center
        cell.border = cell_border

    # ==========================================
    # 3. 右側タイムライン（日付・曜日）の生成 (2〜3行目)
    # ==========================================
    # 2026年7月1日から31日間分を自動生成
    start_date = datetime.date(2026, 7, 1)
    total_days = 31
    weekdays_j = ["月", "火", "水", "木", "金", "土", "日"]

    ws.row_dimensions[2].height = 18

    for i in range(total_days):
        col_idx = 6 + i  # F列(6列目)からスタート
        target_date = start_date + datetime.timedelta(days=i)

        # 2行目：曜日
        day_cell = ws.cell(row=2, column=col_idx, value=weekdays_j[target_date.weekday()])
        is_weekend = target_date.weekday() >= 5
        day_cell.font = Font(
            name=FONT_FAMILY,
            size=8,
            bold=is_weekend,
            color=(
                "E53E3E"
                if target_date.weekday() == 6
                else ("3182CE" if target_date.weekday() == 5 else "718096")
            ),
        )
        day_cell.fill = fill_timeline_hd
        day_cell.alignment = align_center
        day_cell.border = cell_border

        # 3行目：日にち
        date_cell = ws.cell(row=3, column=col_idx, value=target_date)
        date_cell.number_format = "d"
        date_cell.font = font_date
        date_cell.fill = fill_timeline_hd
        date_cell.alignment = align_center
        date_cell.border = cell_border

    # ==========================================
    # 4. データ入力エリアの作成（4〜25行目）
    # ==========================================
    start_row = 4
    end_row = 25

    # 動作確認用のサンプルデータ（不要なら削除してください）
    samples = [
        [
            "企画",
            "要件定義・スコープ決定",
            "進行中",
            datetime.date(2026, 7, 1),
            datetime.date(2026, 7, 7),
        ],
        [
            "デザイン",
            "画面UIデザイン作成",
            "完了",
            datetime.date(2026, 7, 5),
            datetime.date(2026, 7, 12),
        ],
    ]

    for r in range(start_row, end_row + 1):
        ws.row_dimensions[r].height = 24

        # サンプルデータの流し込み（3行目以降は空の行を作る）
        s_data = (
            samples[r - start_row]
            if (r - start_row) < len(samples)
            else [None, None, None, None, None]
        )

        for c in range(1, 6):
            cell = ws.cell(row=r, column=c, value=s_data[c - 1])
            cell.font = font_data
            cell.border = cell_border
            cell.alignment = align_left if c in [1, 2] else align_center

        # 日付フォーマットの適用
        ws.cell(row=r, column=4).number_format = "yyyy/mm/dd"
        ws.cell(row=r, column=5).number_format = "yyyy/mm/dd"

        # タイムラインエリア（F列以降）の空枠と罫線
        for c in range(6, 6 + total_days):
            ws.cell(row=r, column=c).border = cell_border

    # ==========================================
    # 5. プルダウンと入力規則の埋め込み
    # ==========================================
    dv_status = DataValidation(
        type="list", formula1='"未着手,進行中,確認中,完了"', allow_blank=True
    )
    ws.add_data_validation(dv_status)
    dv_status.add(f"C{start_row}:C{end_row}")

    dv_date = DataValidation(
        type="date",
        formula1="2026-01-01",
        formula2="2026-12-31",
        allow_blank=True,
    )
    ws.add_data_validation(dv_date)
    dv_date.add(f"D{start_row}:E{end_row}")

    # ==========================================
    # 6. 【ここをアップデート】条件付き書式の設定
    # ==========================================
    end_col_letter = get_column_letter(5 + total_days)  # 最後の列（AP列）を取得

    # ① 【最優先】「完了」時のグレーアウト規則（A列〜最後のタイムライン列まで全体に適用）
    rule_done = FormulaRule(
        formula=['$C4="完了"'], stopIfTrue=True, fill=fill_done, font=font_done
    )
    ws.conditional_formatting.add(
        f"A{start_row}:{end_col_letter}{end_row}", rule_done
    )

    # ② 期間の自動カラーバー規則（F列〜最後のタイムライン列までに適用）
    fill_bar = PatternFill(
        start_color="CBD5E0", end_color="CBD5E0", fill_type="solid"
    )  # 上品なブルーグレー
    rule_gantt = FormulaRule(
        formula=["AND(F$3>=$D4, F$3<=$E4)"], stopIfTrue=True, fill=fill_bar
    )
    ws.conditional_formatting.add(
        f"F{start_row}:{end_col_letter}{end_row}", rule_gantt
    )

    # ==========================================
    # 7. 列幅の微調整
    # ==========================================
    ws.column_dimensions["A"].width = 14
    ws.column_dimensions["B"].width = 30
    ws.column_dimensions["C"].width = 12
    ws.column_dimensions["D"].width = 15
    ws.column_dimensions["E"].width = 15

    for c in range(6, 6 + total_days):
        ws.column_dimensions[get_column_letter(c)].width = 4.0

    # 保存
    file_name = "beautiful_gantt_with_done.xlsx"
    wb.save(file_name)
    print(f"グレーアウト機能付きガントチャート『{file_name}』を出力しました！")


if __name__ == "__main__":
    create_beautiful_gantt()