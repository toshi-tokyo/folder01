// 施設データ
// 出典: 千代田区「児童福祉法による障害児通所支援サービス」区内事業所一覧（2025年9月8日更新）
//   https://www.city.chiyoda.lg.jp/koho/kosodate/kosodate/ko-shogai/tsushoshien.html
// 座標: 国土地理院 住所検索API によるジオコーディング
// 概要: 各施設の公式サイト記載内容を要約（2026年9月時点）
//
// services に使えるキー: "jihatsu"（児童発達支援） / "houday"（放課後等デイサービス） / "houmon"（居宅訪問型児童発達支援）
// 施設を追加するときは、下の配列に1件ずつ足してください。

window.FACILITIES_META = {
  area: "千代田区",
  updated: "2026-09-25",
  sourceName: "千代田区 障害児通所支援サービス 区内事業所一覧（2025年9月8日更新）",
  sourceUrl: "https://www.city.chiyoda.lg.jp/koho/kosodate/kosodate/ko-shogai/tsushoshien.html"
};

window.FACILITIES = [
  {
    name: "LITALICOジュニア お茶の水教室",
    services: ["jihatsu", "houday"],
    address: "千代田区外神田2-2-18 東信御茶ノ水ビル2階",
    tel: "03-3526-5420",
    lat: 35.699516, lng: 139.767456,
    age: "未就学〜",
    tags: ["個別", "小集団", "ABA", "ペアトレ"],
    summary: "行動分析に基づく支援計画で、個別（1〜3名）・小集団・集団の支援を組み合わせて提供。園・学校への訪問支援や保護者向けペアレントトレーニングも。",
    url: "https://junior.litalico.jp/school/tokyo/ochanomizu/"
  },
  {
    name: "ぴかいち",
    services: ["jihatsu", "houday"],
    address: "千代田区平河町2-12-4 2階・3階",
    tel: "03-3239-0686",
    lat: 35.680565, lng: 139.741577,
    age: "",
    tags: ["体験活動", "集団遊び"],
    summary: "遊びや生活力を身につけるプログラムが中心。外出・体験活動を通じて人間関係や自然、命の大切さなどを実体験で学ぶ。",
    url: "https://www.d-and-a-networks.jp/pikaichi/"
  },
  {
    name: "メルケア 発達支援センター",
    services: ["jihatsu"],
    address: "千代田区霞が関3-5-1 近鉄霞が関ビル",
    tel: "03-6550-8585",
    lat: 35.671429, lng: 139.745148,
    age: "未就学児",
    tags: ["個別療育", "言語聴覚", "家庭指導"],
    summary: "綿密なアセスメントに基づく個別の臨床療育と、家庭での療育方法の指導が中心。言語聴覚訓練にも対応。",
    url: "https://www.melcare.org/"
  },
  {
    name: "言語聴覚支援センター",
    services: ["jihatsu"],
    address: "千代田区霞が関3-5-1 近鉄霞が関ビル",
    tel: "03-6811-3261",
    lat: 35.671429, lng: 139.745148,
    age: "おおむね0〜3歳",
    tags: ["言語聴覚士", "作業療法士", "ことば・きこえ"],
    summary: "言語聴覚士・作業療法士らが、ことば・発声・きこえなどコミュニケーション面に課題のある子の検査・訓練・指導を行う。早期療育に注力。",
    url: "https://www.slht.jp/"
  },
  {
    name: "AIAI PLUS 麹町",
    services: ["jihatsu", "houday"],
    address: "千代田区麹町3-12-12 麹町Mビル2階",
    tel: "03-6265-4823",
    lat: 35.685204, lng: 139.738556,
    age: "未就学〜",
    tags: ["個別", "集団", "学習", "戸外活動"],
    summary: "児童発達支援・放課後等デイ・保育所等訪問支援の多機能型。個別支援・集団活動・学習活動・戸外活動を実施。",
    url: "https://plus.aiai-cc.co.jp/facility/koujimachi/"
  },
  {
    name: "ティーンズ御茶ノ水",
    services: ["houday"],
    address: "千代田区神田駿河台3-5-1 三五ビル1階",
    tel: "050-2018-2067",
    lat: 35.695889, lng: 139.763885,
    age: "就学児",
    tags: ["キャリア教育", "学習", "お仕事体験"],
    summary: "発達障害のある子向けのキャリアデザイン教育。「学習・生活・将来」を軸に、平日セッションと週末のお仕事体験で自己理解と進路選択を支援。",
    url: "https://www.teensmoon.com/"
  },
  {
    name: "monte-e-mare（モンテマーレ）",
    services: ["houday"],
    address: "千代田区神田佐久間町4-11-4",
    tel: "03-5823-4778",
    lat: 35.697647, lng: 139.779846,
    age: "就学児",
    tags: ["モンテッソーリ", "運動療育", "創作", "送迎あり"],
    summary: "モンテッソーリ教育をベースに「自分で考え、選ぶ力」を育てる。運動療育・創作活動を軸に個別に対応。送迎あり。",
    url: "https://montemare.jp/"
  },
  {
    name: "障害児訪問支援ナンシー",
    services: ["houmon"],
    address: "千代田区神田神保町1-14-1（事業所）",
    tel: "03-6811-0920",
    lat: 35.696732, lng: 139.758148,
    age: "",
    tags: ["自宅訪問", "医療的ケア", "看護師"],
    summary: "外出が難しい子の自宅に看護師が訪問。吸引・経管栄養などの医療的ケアをしながら遊びや学習を支援。※地図の位置は事業所の所在地。",
    url: "https://nancy.florence.or.jp/"
  },
  {
    name: "てらぴぁぽけっと 御茶ノ水教室",
    services: ["jihatsu"],
    address: "千代田区神田駿河台3-3-5 小林ビル2階",
    tel: "03-6285-1077",
    lat: 35.695885, lng: 139.764267,
    age: "未就学児",
    tags: ["少人数", "個別対応", "ステップ式"],
    summary: "825項目の発達ステップを基準に、専門指導員が一人ひとりに合わせたセラピーを組み立てる。少人数で個別対応。",
    url: "https://www.terapiapocket.com/"
  },
  {
    name: "発達支援スタジオ ちゃれんじキッズ千代田",
    services: ["jihatsu"],
    address: "千代田区九段南3-4-5 ビラ・アペックス市ヶ谷301",
    tel: "03-6380-8298",
    lat: 35.691933, lng: 139.741608,
    age: "未就学児",
    tags: ["感覚統合", "ABA", "SST"],
    summary: "感覚統合・ABA（応用行動分析）・SSTを組み合わせた3時間のプログラム。個別・マンツーマン座学・小集団活動を行う。",
    url: "https://challenge-kids.jp/"
  },
  {
    name: "First Classroom 千代田",
    services: ["jihatsu"],
    address: "千代田区東神田2-10-16 2階",
    tel: "080-7128-2840",
    lat: 35.69548, lng: 139.780991,
    age: "1歳後半〜6歳",
    tags: ["幼児専門", "個別", "集団"],
    summary: "幼児専門の療育施設。個別療育と集団療育で発達を支援。",
    url: "https://firstclassroom.jp/"
  },
  {
    name: "Lii sports studio 大手町",
    services: ["jihatsu"],
    address: "千代田区神田錦町2-5-4 第二亀谷ビル1階",
    tel: "070-9355-5232",
    lat: 35.692017, lng: 139.76268,
    age: "0〜5歳",
    tags: ["運動療育", "デジタル運動", "少人数集団"],
    summary: "デジタル運動プログラムで楽しく体を動かし、基本動作・認知・社会性を育てる運動療育。個別と5名前後の集団を組み合わせる。",
    url: "https://liistyle.co.jp/liisportsstudio/"
  }
];
