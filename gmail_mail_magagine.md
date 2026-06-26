
function archiveUnreadNewsletters() {
  // 1. 検索条件：7日以上未読、かつ「配信停止」または「unsubscribe」が含まれるメール
  const searchQuery = 'is:unread older_than:7d ("配信停止" OR "unsubscribe"OR "登録解除")';
  
  // 2. 「解約候補」というラベルを用意（なければ自動作成）
  const labelName = '解約候補';
  let label = GmailApp.getUserLabelByName(labelName);
  if (!label) {
    label = GmailApp.createLabel(labelName);
  }
  
  // 3. 条件に合うメールスレッドを検索（安全のため一度に最大50件まで処理）
  const threads = GmailApp.search(searchQuery, 0, 50);
  
  if (threads.length === 0) {
    Logger.log('該当するメルマガは見つかりませんでした。');
    return;
  }
  Logger.log(threads.length + ' 件のメルマガが見つかりました。解約候補にラベルします。');
  
  // 4. 見つかったメールにラベルを貼り、受信トレイからアーカイブ
  for (let i = 0; i < threads.length; i++) {
    threads[i].addLabel(label);
    threads[i].moveToArchive(); // 受信トレイから非表示にする
  }
  
  Logger.log('すべてのラベル付けが完了しました。');

}
