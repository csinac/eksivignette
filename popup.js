// 18 Kasim itibariyle siteyi bloke eden elemanlarin id baslangiclari:
const DEFAULT_IDS = "google_ads_iframe, gpt_unit_";

document.addEventListener("DOMContentLoaded", () => {
  const idListInput = document.getElementById("idList");
  const removeButton = document.getElementById("removeButton");
  const resetButton = document.getElementById("resetButton");

  // standart id'leri kullan ya da kaydedilenleri cek
  chrome.storage.sync.get("idList", (data) => {
    idListInput.value = data.idList || DEFAULT_IDS;
  });

  // sil butonuna basildiginda id listesini kaydet ve bulunan elemanlari sil
  removeButton.addEventListener("click", () => {
    const idList = idListInput.value.trim();
    chrome.storage.sync.set({ idList }); // Mevcut id'leri kaydet
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: removeOverlay,
          args: [idList]
        });
      }
    });
  });

  //sifirla butonuna basildiginda orijinal id listesine cevir
  resetButton.addEventListener("click", () => {
    idListInput.value = DEFAULT_IDS;
    chrome.storage.sync.set({ idList: DEFAULT_IDS });
  });
});

function removeOverlay(idList) {
  // id'leri ayir ve silinecek elemanlari sec
  const ids = idList.split(",").map(id => id.trim()).filter(id => id);
  const selector = ids.map(id => `[id^="${id}"]`).join(", ");
  if (!selector) return;

  // Find and remove matching elements
  const overlays = document.querySelectorAll(selector);
  overlays.forEach(overlay => {
    overlay.remove();
    console.log(`${overlay.id}, silindi hadi gecmi$ olsun`);
  });
}