# 【初心者向け】Power Automate Desktopでデスクトップとダウンロードを自動整理！年・月・ファイル形式に自動で仕分ける魔法のフロー作成ガイド

「気づけばデスクトップがファイルで埋め尽くされている…」
「ダウンロードフォルダの中身がぐちゃぐちゃで、目的のファイルが見つからない…」

そんな悩みを抱えていませんか？

本記事では、Windowsに標準搭載されている無料の自動化ツール**「Power Automate Desktop（以下、PAD）」**を使い、デスクトップとダウンロードフォルダにあるファイルを**「最終更新日の年 ＞ 月 ＞ ファイル形式」**ごとに自動でフォルダ分けして整理する魔法のようなフローの作り方を、初心者向けに優しく解説します！

さらに、特定の「禁止ファイル」フォルダに入っているものは除外したり、アプリのショートカット（.lnk）は年月分類せずに「ショートカット」フォルダにまとめたりする、実用的なカスタマイズも盛り込んでいます。

この記事を読めば、毎日実行ボタンを1回押すだけで、あなたのPCは見違えるほどスッキリ整理整頓されます。それではさっそく作っていきましょう！

---

## 1. この記事で実現できること（完成イメージ）

このフローを実行すると、デスクトップとダウンロードフォルダ内（サブフォルダの中身も含む）のファイルが、最終更新日の日付をもとに以下のような階層で自動分類されます。

### 整理後のフォルダ構造イメージ
分類されたファイルは、すべてデスクトップに新しく作られる「アーカイブ」フォルダの傘下にまとまります。

```text
デスクトップ/
├── 禁止ファイル/ （← この中のファイルは整理から除外されます）
└── アーカイブ/
    ├── ショートカット/ （← アプリのショートカット .lnk はここに集約）
    ├── 2026/
    │   ├── 05/
    │   │   ├── Excel/ （← Excelファイルが入ります）
    │   │   ├── PDF/   （← PDFファイルが入ります）
    │   │   └── その他/
    │   └── 06/
    │       ├── WORD/
    │       └── PPT/
    └── 2025/
        └── 12/
            └── TXT/
```

### 自動分類のルール
* **対象フォルダ**: 「デスクトップ」および「ダウンロード」フォルダ（サブフォルダ内も含みます）
* **除外条件**: デスクトップにある「禁止ファイル」フォルダの中身は**分類しません**。
* **ショートカットの扱い**: `.lnk` 拡張子のファイルは年月分類せず、`アーカイブ/ショートカット` フォルダへ直接移動します。
* **年月フォルダの形式**: 月は「01」「02」のように2桁の数字で統一します。
* **ファイル形式の分類**:
  * **Excel**: `.xlsx` / `.xls`
  * **PDF**: `.pdf`
  * **PPT**: `.pptx` / `.ppt`
  * **WORD**: `.docx` / `.doc`
  * **TXT**: `.txt`
  * **その他**: 上記以外のすべての拡張子

---

## 2. 事前準備

フローを作成する前に、以下の準備を行いましょう。

### 1. Power Automate Desktop (PAD) のインストール
Windows 11には標準で搭載されています。スタートメニューから「Power Automate」と検索して起動してください。
Windows 10をご利用の場合は、Microsoftの公式サイトから無料でダウンロード・インストールが可能です。

### 2. 除外用のフォルダを作成しておく
デスクトップに以下の2つのフォルダを手動で作成しておきます。
1. **「禁止ファイル」**: 整理したくないファイルを一時的に避難させておくためのフォルダです。
2. **「アーカイブ」**: 整理されたファイルが格納される大元のフォルダです。

---

## 3. PADフロー全体の設計図（メインとサブフロー）

PADでは、同じ処理を何度も書くのを防ぐために**「サブフロー」**という機能が使えます。
今回は、デスクトップとダウンロードフォルダのそれぞれに対して全く同じ「ファイル整理」の処理を行うため、処理の中身をサブフローとして1つにまとめ、メインフローからそれを呼び出すスマートな設計にします。

### フローの全体構成
* **メインフロー (Main)**:
  1. デスクトップとダウンロードのフォルダパスを取得する。
  2. それぞれのフォルダからファイル一覧を（サブフォルダ含めて）取得する。
  3. 取得したファイル1つずつに対して、サブフロー「FileOrganization」を実行する。
* **サブフロー (FileOrganization)**:
  1. そのファイルが「禁止ファイル」や「アーカイブ」内のものであれば処理をスキップする。
  2. ショートカットファイルなら専用フォルダへ移動して処理を抜ける。
  3. 最終更新日から「年」と「月（2桁）」を取得する。
  4. 拡張子に応じてファイル形式（Excel, PDFなど）を判別する。
  5. 移動先フォルダを作成し、ファイルを移動する。

---

## 4. ステップ・バイ・ステップ作成手順

それでは、PADを開いて「新しいフロー」を作成し、手順通りにアクションを配置していきましょう！

### 【手順1】メインフローの作成

まずは、フォルダーの場所を設定し、ファイルの一覧を取得する部分を作ります。

#### 1-1. デスクトップパスの取得
アクション一覧の「フォルダー」グループから**「特殊なフォルダーを取得」**をドラッグ＆ドロップします。
* **特殊フォルダーの名前**: `デスクトップ`
* **生成された変数**: `%DesktopPath%` に変更（デフォルトは `%SpecialFolderPath%` になっているので、名前をダブルクリックして書き換えます）

#### 1-2. ダウンロードフォルダパスの取得
ダウンロードフォルダは環境によってユーザー名が変わるため、システムの変数を利用して取得します。
アクション一覧の「フォルダー」グループから**「特殊なフォルダーを取得」**を再度配置します。
* **特殊なフォルダーの名前**: `ユーザー プロファイル`
* **生成された変数**: `%UserProfilePath%`

次に、アクション一覧の「変数」グループから**「変数の設定」**を配置します。
* **宛先**: `%DownloadPath%`
* **値**: `%UserProfilePath%\Downloads`

#### 1-3. アーカイブと禁止ファイルのパスを設定
同じく「変数の設定」を使って、整理先と除外対象のパスを定義します。
* **変数の設定 1**:
  * **宛先**: `%ArchivePath%`
  * **値**: `%DesktopPath%\アーカイブ`
* **変数の設定 2**:
  * **宛先**: `%ExcludePath%`
  * **値**: `%DesktopPath%\禁止ファイル`

#### 1-4. ファイル一覧の取得（デスクトップ）
アクション一覧の「フォルダー」グループから**「フォルダー内のファイルを取得」**を配置します。
* **フォルダー**: `%DesktopPath%`
* **ファイルフィルター**: `*`
* **サブフォルダーを含める**: **ON**（← ここをONにすることで、デスクトップ内のフォルダの中身も対象になります）
* **生成された変数**: `%DesktopFiles%`

#### 1-5. ファイル一覧の取得（ダウンロード）
同じく**「フォルダー内のファイルを取得」**をもう一つ配置します。
* **フォルダー**: `%DownloadPath%`
* **ファイルフィルター**: `*`
* **サブフォルダーを含める**: **ON**
* **生成された変数**: `%DownloadFiles%`

#### 1-6. ループ処理の設定
取得したファイルを1つずつ処理するため、ループを回します。
アクション一覧の「ループ」グループから**「For Each」**を配置します。
* **反復処理を行う値**: `%DesktopFiles%`
* **保存先（変数）**: `%CurrentFile%` （※デフォルトのままでOKです）

「For Each」と「End」の間に、アクションの「フローコントロール」グループから**「サブフローの実行」**を配置します。
* **サブフローの実行**: `FileOrganization`（※事前に画面上部の「サブフロー」タブのプラスボタンから「FileOrganization」という名前のサブフローを新規作成しておいてください）

同様に、ダウンロードフォルダ用にもう一つ**「For Each」**をその下に配置します。
* **反復処理を行う値**: `%DownloadFiles%`
* **保存先（変数）**: `%CurrentFile%`
* 「For Each」と「End」の間に、**「サブフローの実行」**（`FileOrganization`）を配置します。

---

### 【手順2】サブフロー「FileOrganization」の作成

画面上部のタブから「FileOrganization」サブフローに切り替え、ファイル1個に対する具体的な仕分け処理を書いていきます。

#### 2-1. 除外条件の判定（禁止フォルダとアーカイブフォルダのスキップ）
すでに整理済みの「アーカイブ」フォルダの中身や、整理したくない「禁止ファイル」フォルダの中身を処理すると、エラーや無限ループの原因になります。これらを除外します。

アクション一覧の「条件」グループから**「If」**を配置します。
* **最初のオペランド**: `%CurrentFile.Directory%` （ファイルの存在するフォルダパス）
* **演算子**: `で始まる`
* **2番目のオペランド**: `%ExcludePath%`

この「If」のすぐ下に、アクション一覧の「条件」グループから**「Else If」**を配置します。
* **最初のオペランド**: `%CurrentFile.Directory%`
* **演算子**: `で始まる`
* **2番目のオペランド**: `%ArchivePath%`

さらにその下に**「Else If」**を追加します（※フォルダ自体がアーカイブフォルダそのものである場合や、禁止ファイルフォルダそのものである場合を念のため防ぎます）。
* **最初のオペランド**: `%CurrentFile.FilePath%`
* **演算子**: `と等しい`
* **2番目のオペランド**: `%ArchivePath%`

これら3つの条件のいずれかに当てはまる場合は処理をスキップさせます。
「If」〜「End」のブロック内に、アクションの「フローコントロール」グループから**「サブフローの終了」**を配置します。これで条件に合致したファイルは何も処理されずに次のファイルへ進みます。

#### 2-2. ショートカット（.lnk）ファイルの処理
ショートカットファイルは年月で分けず、一括で「アーカイブ/ショートカット」フォルダに集約します。

アクション一覧の「条件」グループから**「If」**を配置します。
* **最初のオペランド**: `%CurrentFile.NameExtension%` （ファイルの拡張子）
* **演算子**: `と等しい`
* **2番目のオペランド**: `.lnk` （※すべて小文字で入力します）

「If」と「End」のブロック内に以下のアクションを追加します：
1. **変数の設定**:
   * **宛先**: `%TargetFolder%`
   * **値**: `%ArchivePath%\ショートカット`
2. **フォルダーの存在を確認**（「フォルダー」グループ）:
   * **フォルダーパス**: `%TargetFolder%`
   * **フォルダーが存在する場合**: `何もしない`
   * **フォルダーが存在しない場合**: `フォルダーの作成`（※作成先：`%ArchivePath%`、新しいフォルダー名：`ショートカット`）
3. **ファイルの移動**（「ファイル」グループ）:
   * **移動するファイル**: `%CurrentFile%`
   * **宛先フォルダー**: `%TargetFolder%`
   * **ファイルが存在する場合**: `名前を変更して保存`（※同名のショートカットがあっても上書きされず安全です）
4. **サブフローの終了**:
   * 移動が完了したので、このファイルの処理をここで終わらせます。

#### 2-3. 最終更新日から「年」と「月（2桁）」を取得する
ショートカット以外の通常ファイルについて、更新日時を取得します。

アクション一覧の「テキスト」グループから**「datetime をテキストに変換」**を配置します。
* **変換する datetime**: `%CurrentFile.LastModifiedTime%`
* **使用する書式**: `カスタム`
* **カスタム書式**: `yyyy` （西暦4桁）
* **生成された変数**: `%FileYear%`

もう一度**「datetime をテキストに変換」**を配置します。
* **変換する datetime**: `%CurrentFile.LastModifiedTime%`
* **使用する書式**: `カスタム`
* **カスタム書式**: `MM` （※大文字のMを2つ。これで1月〜9月も「01」「09」のように2桁になります）
* **生成された変数**: `%FileMonth%`

#### 2-4. 拡張子によるファイル形式の判定
拡張子を判定して、移動先の末尾のフォルダ名（Excel, PDFなど）を決定します。

アクション一覧の「条件」グループから**「Switch」**を配置します。
* **評価する値**: `%CurrentFile.NameExtension%` （※拡張子は自動的に「.xlsx」のようにドットから始まる小文字で取得されます）

「Switch」と「End」の間に、**「Case」**と**「変数の設定」**を組み合わせて配置していきます。

* **Case 1**: Excel用
  * **値**: `.xlsx`
  * （Caseのすぐ下に別のCaseを追加）**値**: `.xls`
  * その下に**「変数の設定」**: 宛先 `%FileFormat%`、値 `Excel`
* **Case 2**: PDF用
  * **値**: `.pdf`
  * その下に**「変数の設定」**: 宛先 `%FileFormat%`、値 `PDF`
* **Case 3**: PPT用
  * **値**: `.pptx`
  * （もう一つCaseを追加）**値**: `.ppt`
  * その下に**「変数の設定」**: 宛先 `%FileFormat%`、値 `PPT`
* **Case 4**: WORD用
  * **値**: `.docx`
  * （もう一つCaseを追加）**値**: `.doc`
  * その下に**「変数の設定」**: 宛先 `%FileFormat%`、値 `WORD`
* **Case 5**: TXT用
  * **値**: `.txt`
  * その下に**「変数の設定」**: 宛先 `%FileFormat%`、値 `TXT`
* **Default Case**（その他のファイルすべて）:
  * その下に**「変数の設定」**: 宛先 `%FileFormat%`、値 `その他`

#### 2-5. 移動先フォルダーの決定と自動作成
仕分け先のフルパスを組み立て、フォルダがなければ自動作成します。

1. **変数の設定**:
   * **宛先**: `%TargetFolder%`
   * **値**: `%ArchivePath%\%FileYear%\%FileMonth%\%FileFormat%`
2. **フォルダーの存在を確認**:
   * **フォルダーパス**: `%TargetFolder%`
   * **フォルダーが存在しない場合**: `フォルダーの作成`
     * **新しいフォルダーの作成先**: `%ArchivePath%`
     * **新しいフォルダー名**: `%FileYear%\%FileMonth%\%FileFormat%`
     * （※PADの「フォルダーの作成」は、`2026\06\Excel` のように途中の階層が存在しなくても、一気に関連するすべてのフォルダを自動作成してくれます）

#### 2-6. ファイルの移動
最後に、ファイルを目的のフォルダへ移動します。

* **ファイルの移動**:
  * **移動するファイル**: `%CurrentFile%`
  * **宛先フォルダー**: `%TargetFolder%`
  * **ファイルが存在する場合**: `名前を変更して保存`（※同じ名前のファイルがあっても「ファイル名_1.xlsx」のように自動リネームされて安全です）

---

## 5. 【超時短】コピー＆ペーストでフローを即座に作成する方法

Power Automate Desktopには、**「アクションのテキスト表現をコピー＆ペーストできる」**という非常に便利な隠し機能があります。

以下のコードをコピーし、PADの編集画面（メインフロー、およびサブフローのそれぞれの白いエリア）に直接 `Ctrl + V` で貼り付けるだけで、上記で説明したアクション群が一瞬で自動生成されます！

### メインフロー用コード
（メインタブを開いて、以下の枠内をすべてコピーし、貼り付けてください）

```text
Folder.GetSpecialFolder SpecialFolder: Folder.SpecialFolder.DesktopDirectory UseMusicDirectory: False Value=> DesktopPath
Folder.GetSpecialFolder SpecialFolder: Folder.SpecialFolder.UserProfile UseMusicDirectory: False Value=> UserProfilePath
Variables.SetVariable Value: $'''%UserProfilePath%\\Downloads''' Variable=> DownloadPath
Variables.SetVariable Value: $'''%DesktopPath%\\アーカイブ''' Variable=> ArchivePath
Variables.SetVariable Value: $'''%DesktopPath%\\禁止ファイル''' Variable=> ExcludePath
Folder.GetFiles Folder: DesktopPath FileFilter: $'''*''' IncludeSubfolders: True FailOnAccessDenied: False SortBy1: Folder.SortBy.NoSort SortDescending1: False SortBy2: Folder.SortBy.NoSort SortDescending2: False SortBy3: Folder.SortBy.NoSort SortDescending3: False SortBy4: Folder.SortBy.NoSort SortDescending4: False SortBy5: Folder.SortBy.NoSort SortDescending5: False Files=> DesktopFiles
Folder.GetFiles Folder: DownloadPath FileFilter: $'''*''' IncludeSubfolders: True FailOnAccessDenied: False SortBy1: Folder.SortBy.NoSort SortDescending1: False SortBy2: Folder.SortBy.NoSort SortDescending2: False SortBy3: Folder.SortBy.NoSort SortDescending3: False SortBy4: Folder.SortBy.NoSort SortDescending4: False SortBy5: Folder.SortBy.NoSort SortDescending5: False Files=> DownloadFiles
LOOP FOREACH CurrentFile IN DesktopFiles
    CALL SUBFLOW FileOrganization
END
LOOP FOREACH CurrentFile IN DownloadFiles
    CALL SUBFLOW FileOrganization
END
```

### サブフロー「FileOrganization」用コード
（サブフロー「FileOrganization」のタブを作成・選択した状態で、以下を貼り付けてください）

```text
IF Text.StartsWithText Text: CurrentFile.Directory SubText: ExcludePath CaseSensitive: False OR Text.StartsWithText Text: CurrentFile.Directory SubText: ArchivePath CaseSensitive: False THEN
    EXIT SUBFLOW
END
IF Text.EndsWithText Text: CurrentFile.NameExtension SubText: $'''.lnk''' CaseSensitive: False THEN
    Variables.SetVariable Value: $'''%ArchivePath%\\ショートカット''' Variable=> TargetFolder
    IF (Folder.FolderExists.FolderExists Folder: TargetFolder) = (False) THEN
        Folder.CreateFolder FolderPath: ArchivePath NewFolderName: $'''ショートカット''' Folder=> TargetFolder
    END
    File.Move Files: CurrentFile Destination: TargetFolder IfFileExists: File.IfExists.Rename Value=> MovedFiles
    EXIT SUBFLOW
END
Text.FormatDateTime DateTime: CurrentFile.LastModifiedTime CustomFormat: $'''yyyy''' FormattedDateTime=> FileYear
Text.FormatDateTime DateTime: CurrentFile.LastModifiedTime CustomFormat: $'''MM''' FormattedDateTime=> FileMonth
SWITCH CurrentFile.NameExtension
    CASE = $'''.xlsx'''
    CASE = $'''.xls'''
        Variables.SetVariable Value: $'''Excel''' Variable=> FileFormat
    CASE = $'''.pdf'''
        Variables.SetVariable Value: $'''PDF''' Variable=> FileFormat
    CASE = $'''.pptx'''
    CASE = $'''.ppt'''
        Variables.SetVariable Value: $'''PPT''' Variable=> FileFormat
    CASE = $'''.docx'''
    CASE = $'''.doc'''
        Variables.SetVariable Value: $'''WORD''' Variable=> FileFormat
    CASE = $'''.txt'''
        Variables.SetVariable Value: $'''TXT''' Variable=> FileFormat
    DEFAULT
        Variables.SetVariable Value: $'''その他''' Variable=> FileFormat
END
Variables.SetVariable Value: $'''%ArchivePath%\\%FileYear%\\%FileMonth%\\%FileFormat%''' Variable=> TargetFolder
IF (Folder.FolderExists.FolderExists Folder: TargetFolder) = (False) THEN
    Folder.CreateFolder FolderPath: ArchivePath NewFolderName: $'''%FileYear%\\%FileMonth%\\%FileFormat%''' Folder=> TargetFolder
END
File.Move Files: CurrentFile Destination: TargetFolder IfFileExists: File.IfExists.Rename Value=> MovedFiles
```

---

## 6. 動作確認と注意点

### 動作確認のやり方
1. デスクトップ上に「禁止ファイル」「アーカイブ」フォルダを作成します。
2. デスクトップやダウンロードフォルダに適当なテスト用ファイル（例: `test_excel.xlsx`、`test_pdf.pdf`など）をいくつか配置します。
3. デスクトップにショートカットファイル（`.lnk`）も用意しておきます。
4. PADの画面上部にある「実行」ボタン（緑色の再生マーク）を押します。
5. ファイルが瞬時に「アーカイブ」フォルダの中に綺麗に仕分けられるか確認してください。また、「禁止ファイル」フォルダの中身が移動していないことを確認してください。

### ⚠️ 使用上の注意
* **アプリ起動中のファイル**: ExcelやWordなどのファイルを開いた状態でフローを実行すると、ファイルがロックされていて移動エラーが発生することがあります。フローを実行する前に、編集中のファイルは保存して閉じておいてください。
* **移動オプション**: 万が一、移動先に同名のファイルがある場合、自動的にファイル名の末尾に数字（`_1`など）が追加されて保存される設定（名前を変更して保存）にしています。これにより、古いファイルが上書き消去される心配はありません。

---

## 7. まとめ

いかがでしたでしょうか？

今回は、PC作業の生産性を大きく下げる原因となる「散らかったデスクトップ」と「ダウンロードフォルダ」を、Power Automate Desktopで一瞬でクリーンアップする手順を解説しました。

一度このフローを作っておけば、退社前や朝一番にボタンをポチッと押すだけで、常に整理整頓された最高のデスクトップ環境を維持できます。

ぜひこの記事を参考に、自分専用のPCクリーンアップ環境を作ってみてください！
もし役に立ったと思ったら、いいね（スキ）やシェアをお願いします！
