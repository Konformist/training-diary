export const openLink = (options: {href: string, download?: string}) => {
  const link = document.createElement('a')
  link.setAttribute('href', options.href)
  if (options.download) link.setAttribute('download', options.download)
  document.body.appendChild(link) // Required for FF
  link.click()
  document.body.removeChild(link) // Required for FF
}
