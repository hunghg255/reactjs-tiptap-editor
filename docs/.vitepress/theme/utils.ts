export function renderMarkdown(markdownText = '') {
  const htmlText = markdownText
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*)\*/g, '<i>$1</i>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt=\'$1\' src=\'$2\' />')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href=\'$2\'>$1</a>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n$/gm, '<br />')

  return htmlText.trim()
}

export function renderCommitMessage(msg: string) {
  return renderMarkdown(msg).replace(
    /#(\d+)/g,
    '<a href=\'https://github.com/hunghg255/reactjs-tiptap-editor/issues/$1\'>#$1</a>',
  )
}

const mapAuthors = [
  {
    nameDipslay: 'Hung Hoang',
    username: 'hunghg255',
    mapByNameAliases: ['Hung Hoang', 'Hoang Hung'],
    mapByEmailAliases: ['giahunghust@gmail.com'],
  },
  {
    nameDipslay: 'Condor Hero',
    username: 'condorheroblog',
    mapByNameAliases: ['CondorHero', 'condorheroblog', 'Condor Hero'],
    mapByEmailAliases: ['love2xinwei@gmail.com'],
  },
]

export function generateGithubAvatar(nameCommit: string, hash: string) {
  const match = mapAuthors.find((author) => {
    return (
      author.mapByNameAliases.includes(nameCommit)
      || author.mapByEmailAliases.includes(nameCommit)
      || author.username === nameCommit
    )
  })

  if (match) {
    return `https://github.com/${match.username}.png`
  }

  return `https://gravatar.com/avatar/${hash}?d=retro`
}

export function generateUserName(nameCommit: string) {
  const match = mapAuthors.find((author) => {
    return (
      author.mapByNameAliases.includes(nameCommit)
      || author.mapByEmailAliases.includes(nameCommit)
      || author.username === nameCommit
    )
  })

  if (match) {
    return match.nameDipslay || nameCommit
  }

  return nameCommit
}

export function generateGithubLink(nameCommit: string) {
  const match = mapAuthors.find((author) => {
    return (
      author.mapByNameAliases.includes(nameCommit)
      || author.mapByEmailAliases.includes(nameCommit)
      || author.username === nameCommit
    )
  })

  if (match) {
    return `https://github.com/${match.username}`
  }

  return `https://github.com/${nameCommit}`
}
