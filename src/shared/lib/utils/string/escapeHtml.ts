/** Экранирование для безопасной вставки текста в HTML (не для атрибутов в кавычках). */
function escapeHtml(s: string): string {
  const d = document.createElement("div");

  d.textContent = s;

  return d.innerHTML;
}

export { escapeHtml };
