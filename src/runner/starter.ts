import type { Param, Problem, Signature } from '../data/schema'

export type Lang = 'js' | 'ts'

const NULLABLE = new Set(['ListNode', 'TreeNode'])

function tsType(t: string): string {
  return NULLABLE.has(t) ? `${t} | null` : t
}

function usesType(sig: Signature, name: string): boolean {
  const all: string[] = []
  if (sig.kind === 'function') {
    all.push(sig.returns, ...sig.params.map((p) => p.type))
  } else {
    all.push(...sig.constructorParams.map((p) => p.type))
    for (const m of sig.methods) all.push(m.returns, ...m.params.map((p) => p.type))
  }
  return all.some((t) => t.includes(name))
}

function helperComment(sig: Signature, lang: Lang): string {
  const lines: string[] = []
  if (usesType(sig, 'ListNode')) {
    lines.push(
      lang === 'ts'
        ? '// ListNode is provided for you:\n// class ListNode { val: number; next: ListNode | null; constructor(val?, next?) }'
        : '// ListNode is provided for you:\n// class ListNode { constructor(val = 0, next = null) { this.val = val; this.next = next } }',
    )
  }
  if (usesType(sig, 'TreeNode')) {
    lines.push(
      lang === 'ts'
        ? '// TreeNode is provided for you:\n// class TreeNode { val: number; left: TreeNode | null; right: TreeNode | null; constructor(val?, left?, right?) }'
        : '// TreeNode is provided for you:\n// class TreeNode { constructor(val = 0, left = null, right = null) { ... } }',
    )
  }
  return lines.length ? lines.join('\n') + '\n\n' : ''
}

function jsDoc(params: Param[], returns: string, indent = ''): string {
  const lines = [`${indent}/**`]
  for (const p of params) lines.push(`${indent} * @param {${tsType(p.type)}} ${p.name}`)
  lines.push(`${indent} * @return {${tsType(returns)}}`)
  lines.push(`${indent} */`)
  return lines.join('\n')
}

function tsParams(params: Param[]): string {
  return params.map((p) => `${p.name}: ${tsType(p.type)}`).join(', ')
}

function jsParams(params: Param[]): string {
  return params.map((p) => p.name).join(', ')
}

export function generateStarter(sig: Signature, lang: Lang): string {
  const header = helperComment(sig, lang)
  if (sig.kind === 'function') {
    if (lang === 'ts') {
      return `${header}function ${sig.name}(${tsParams(sig.params)}): ${tsType(sig.returns)} {\n  \n}\n`
    }
    return `${header}${jsDoc(sig.params, sig.returns)}\nfunction ${sig.name}(${jsParams(sig.params)}) {\n  \n}\n`
  }
  const parts: string[] = []
  if (lang === 'ts') {
    parts.push(`  constructor(${tsParams(sig.constructorParams)}) {\n    \n  }`)
    for (const m of sig.methods) {
      parts.push(`  ${m.name}(${tsParams(m.params)}): ${tsType(m.returns)} {\n    \n  }`)
    }
  } else {
    parts.push(`  constructor(${jsParams(sig.constructorParams)}) {\n    \n  }`)
    for (const m of sig.methods) {
      parts.push(`${jsDoc(m.params, m.returns, '  ')}\n  ${m.name}(${jsParams(m.params)}) {\n    \n  }`)
    }
  }
  return `${header}class ${sig.className} {\n${parts.join('\n\n')}\n}\n`
}

export function starterFor(problem: Problem, lang: Lang): string {
  return problem.starter?.[lang] ?? generateStarter(problem.signature, lang)
}
