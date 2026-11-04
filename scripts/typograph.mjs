// Typography is applied only to text AST nodes, never to code or comments.
import ts from "typescript";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "../src");
const words = "а и но да или либо ни зато однако что чтобы будто словно если хотя пока когда поскольку потому также тоже притом причём как чем нежели раз дабы в во к ко на по о об обо от ото до из изо за с со у без безо для ради при про над надо под подо перед передо пред предо между меж через чрез сквозь вокруг около вблизи после прежде путём посредством вместо вопреки кроме среди согласно свыше насчёт вроде касательно относительно навстречу наперекор вслед благодаря ввиду вследствие несмотря".split(" ").sort((a,b)=>b.length-a.length).join("|");
const re = new RegExp(`(^|[^\\p{L}\\p{N}_])(${words})([ \\t\\u00a0]+)(?=[\\p{L}\\p{N}«„“\"(])`, "giu");
const endWord = new RegExp(`(?:^|[^\\p{L}\\p{N}_])(${words})$`, "iu");
function fix(text) {
  let previous;
  do { previous = text; text = text.replace(re, "$1$2\u00a0"); } while (text !== previous);
  return text;
}
let changed = 0;
function walk(dir) {
  for (const entry of readdirSync(dir, {withFileTypes:true})) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) { walk(path); continue; }
    if (!/\.tsx?$/.test(entry.name)) continue;
    const source = readFileSync(path, "utf8");
    const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, entry.name.endsWith("tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const edits = [];
    function visit(node) {
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
        const start = node.getStart(ast) + 1;
        const end = node.end - (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) ? 2 : 1);
        const raw = source.slice(start, end);
        let output = /[А-Яа-яЁё]/.test(raw) ? fix(raw) : raw;
        // JSX's explicit {" "} after a preposition must also be nonbreaking.
        if (raw === " " && ts.isJsxExpression(node.parent)) {
          const siblings = node.parent.parent.children;
          const index = siblings?.indexOf(node.parent);
          const before = index > 0 ? siblings[index - 1] : undefined;
          if (before && ts.isJsxText(before) && endWord.test(before.text.trimEnd())) output = "\u00a0";
        }
        if (output !== raw) edits.push({start,end,output});
      } else if (ts.isJsxText(node) && /[А-Яа-яЁё]/.test(node.text)) {
        const start = node.getFullStart(), end = node.end;
        const raw = source.slice(start, end);
        let output = fix(raw);
        const siblings = node.parent.children;
        const index = siblings?.indexOf(node);
        if (index >= 0 && index < siblings.length - 1 && endWord.test(raw.trimEnd()) && /[ \t]+$/.test(raw)) output = output.replace(/[ \t]+$/, "\u00a0");
        if (output !== raw) edits.push({start,end,output});
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
    if (edits.length) {
      let output = source;
      for (const edit of edits.sort((a,b)=>b.start-a.start)) output = output.slice(0,edit.start)+edit.output+output.slice(edit.end);
      writeFileSync(path, output); changed++;
    }
  }
}
walk(root);
console.log(`Typography updated in ${changed} files`);
