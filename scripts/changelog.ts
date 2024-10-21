import fs from 'node:fs'
import md5 from 'md5'
import extensions from './extensions.json'

export interface CommitInfo {
  functions: string[]
  version?: string
  hash: string
  date: string
  message: string
  refs?: string
  body?: string
  author_name: string
  author_email: string
}

export interface ContributorInfo {
  name: string
  count: number
  hash: string
}

export function uniq<T extends any[]>(a: T) {
  return Array.from(new Set(a))
}

async function execCommand(cmd: string, args: string[]) {
  const { execa } = await import('execa')
  const res = await execa(cmd, args)
  return res.stdout.trim()
}

let cache: CommitInfo[] | undefined

export async function getChangeLog(count = 200) {
  if (cache)
    return cache
  const r = (await execCommand('git', ['log', '-n', `${count}`, `--pretty=format:%H|%ad|%s|%D|%b|%an|%ae`])).split('\n').map((v) => {
    const [hash, date, message, refs, body, author_name, author_email] = v.split('|')
    return {
      hash,
      date,
      message,
      refs,
      body,
      author_name,
      author_email,
    }
  })

  const logs = r.filter((i) => {
    return `${i.message}`.includes('chore: release')
      || `${i.message}`.includes('!')
      || `${i.message}`.startsWith('feat')
      || `${i.message}`.startsWith('fix')
      || `${i.message}`.startsWith('docs')
  }) as CommitInfo[]

  for (const log of logs) {
    if (log.message.includes('chore: release')) {
      log.version = log.message.split(' ')[2].trim()
      continue
    }
    const raw = await execCommand('git', ['diff-tree', '--no-commit-id', '--name-only', '-r', log.hash])

    delete log.body
    const files = raw.replace(/\\/g, '/').trim().split('\n')

    log.functions = uniq(
      files
        .filter(v => v?.includes('extensions'))
        .map((v: any) => {
          const name = v.split('/').pop()!.replace('.tsx', '').replace('.ts', '')

          return name
        }),
    )
  }

  const result = logs.filter(i => i.functions?.length || i.version)
  cache = result

  return result
}

export async function getContributorsAt(path: string) {
  try {
    const list = (await execCommand('git', ['log', '--pretty=format:%an|%ae', '--', path])).split('\n')
      .map(i => i.split('|') as [string, string])

    const map: Record<string, ContributorInfo> = {}

    list
      .filter(i => i[1])
      .forEach((i) => {
        if (!map[i[1]]) {
          map[i[1]] = {
            name: i[0],
            count: 0,
            hash: md5(i[1]),
          }
        }
        map[i[1]].count++
      })

    return Object.values(map).sort((a, b) => b.count - a.count)
  }
  catch (e) {
    console.error(e)
    return []
  }
}

export async function getFunctionContributors() {
  const result = await Promise.all(extensions.map(async (i) => {
    if (i?.name === 'BaseKit.ts')
      return [i.name, await getContributorsAt(`src/extensions/${i.name}`)] as const

    return [i.name, await getContributorsAt(`src/extensions/${i.package}/${i.name}`)] as const
  }))

  return Object.fromEntries(result)
}

(async () => {
  const [changeLog, contributions] = await Promise.all([
    getChangeLog(300),
    getFunctionContributors(),
  ])

  fs.writeFileSync('./scripts/changeLog.json', JSON.stringify(changeLog, null, 2))
  fs.writeFileSync('./scripts/contributions.json', JSON.stringify(contributions, null, 2))
})()
