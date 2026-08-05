chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "patentMapClassify",
    title: "Classify Selected Patent Text with PATENT MAP",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "patentMapClassify" && info.selectionText) {
    fetch('http://127.0.0.1:8000/recommend-cpc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: info.selectionText })
    })
    .then(res => res.json())
    .then(data => {
      console.log('PATENT MAP Context Classification Result:', data);
    })
    .catch(err => console.error('PATENT MAP Extension Error:', err));
  }
});
