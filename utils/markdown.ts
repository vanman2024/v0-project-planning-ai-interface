export const parseMarkdown = (text: string): string => {
  if (!text) return ""

  // Process bold text
  let processed = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // Process italic text
  processed = processed.replace(/\*(.*?)\*/g, "<em>$1</em>")

  // Process inline code
  processed = processed.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

  // Process numbered lists (preserve the numbers)
  processed = processed.replace(
    /^\s*(\d+)\.\s+(.*?)$/gm,
    '<div class="list-item"><span class="list-number">$1.</span> $2</div>',
  )

  // Process bullet points
  processed = processed.replace(/^\s*-\s+(.*?)$/gm, '<div class="list-item">• $1</div>')

  // Add some basic styling
  processed = `<div class="markdown-content">${processed}</div>`

  return processed
}
