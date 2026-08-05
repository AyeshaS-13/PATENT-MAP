document.getElementById('classifyBtn').addEventListener('click', async () => {
  const text = document.getElementById('patentText').value;
  if (!text || !text.trim()) return;

  const resultsCard = document.getElementById('resultsCard');
  resultsCard.style.display = 'block';

  try {
    const res = await fetch('http://127.0.0.1:8000/recommend-cpc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const json = await res.json();
    if (json.data && json.data.length > 0) {
      const top = json.data[0];
      document.getElementById('cpcCode').innerText = top.cpc_code;
      document.getElementById('cpcConfidence').innerText = `${top.confidence}%`;
      document.getElementById('cpcDesc').innerText = top.description;
    }

    const domainRes = await fetch('http://127.0.0.1:8000/detect-domain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const domainJson = await domainRes.json();
    if (domainJson.data) {
      document.getElementById('dominantDomain').innerText = 
        `${domainJson.data.dominant_domain.name} (${domainJson.data.dominant_domain.percentage}%)`;
    }
  } catch (err) {
    document.getElementById('cpcDesc').innerText = 'Classification response error: Service active locally.';
  }
});
