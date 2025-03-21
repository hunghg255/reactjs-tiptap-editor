import { Selection, SelectionRange } from '@tiptap/pm/state';
import { NodeRange, ResolvedPos, Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Mapping, Mappable } from '@tiptap/pm/transform';

export function getSelectionRanges(state: ResolvedPos, range: ResolvedPos, depth?: number): SelectionRange[] {
  const ranges: SelectionRange[] = [];
  const root = state.node(0);
  depth =
    typeof depth === 'number' && depth >= 0
      ? depth
      : state.sameParent(range)
        ? Math.max(0, state.sharedDepth(range.pos) - 1)
        : state.sharedDepth(range.pos);
  const nodeRange = new NodeRange(state, range, depth);
  const startIndex = nodeRange.depth === 0 ? 0 : root.resolve(nodeRange.start).posAtIndex(0);

  nodeRange.parent.forEach((size, offset) => {
    const from = startIndex + offset;
    const to = from + size.nodeSize;
    if (from < nodeRange.start || from >= nodeRange.end) return;
    const selectionRange = new SelectionRange(root.resolve(from), root.resolve(to));
    ranges.push(selectionRange);
  });

  return ranges;
}

class NodeRangeBookmark {
  anchor: number;
  head: number;
  constructor(anchor: number, head: number) {
    this.anchor = anchor;
    this.head = head;
  }
  map(mapping: Mappable) {
    return new NodeRangeBookmark(mapping.map(this.anchor), mapping.map(this.head));
  }
  resolve(doc: ProseMirrorNode) {
    const e = doc.resolve(this.anchor);
    const o = doc.resolve(this.head);
    return new NodeRangeSelection(e, o);
  }
}

export class NodeRangeSelection extends Selection {
  depth: number | undefined;
  constructor(from: ResolvedPos, to: ResolvedPos, depth?: number, bias = 1) {
    const { doc } = from;
    const isSamePosition = from === to;
    const isAtDocEnd = from.pos === doc.content.size && to.pos === doc.content.size;
    const resolvedTo = isSamePosition && !isAtDocEnd ? doc.resolve(to.pos + (bias > 0 ? 1 : -1)) : to;
    const resolvedFrom = isSamePosition && isAtDocEnd ? doc.resolve(from.pos - (bias > 0 ? 1 : -1)) : from;
    const selectionRanges = getSelectionRanges(resolvedFrom.min(resolvedTo), resolvedFrom.max(resolvedTo), depth);
    super(
      resolvedTo.pos >= from.pos ? selectionRanges[0].$from : selectionRanges[selectionRanges.length - 1].$to,
      resolvedTo.pos >= from.pos ? selectionRanges[selectionRanges.length - 1].$to : selectionRanges[0].$from,
      selectionRanges
    );
    this.depth = depth;
  }
  get $to() {
    return this.ranges[this.ranges.length - 1].$to;
  }
  eq(other: Selection) {
    return other instanceof NodeRangeSelection && other.$from.pos === this.$from.pos && other.$to.pos === this.$to.pos;
  }
  map(doc: ProseMirrorNode, mapping: Mapping) {
    const newFrom = doc.resolve(mapping.map(this.anchor));
    const newTo = doc.resolve(mapping.map(this.head));
    return new NodeRangeSelection(newFrom, newTo);
  }
  toJSON() {
    return { type: 'nodeRange', anchor: this.anchor, head: this.head };
  }
  get isForwards() {
    return this.head >= this.anchor;
  }
  get isBackwards() {
    return !this.isForwards;
  }
  extendBackwards() {
    const { doc } = this.$from;
    if (this.isForwards && this.ranges.length > 1) {
      const remainingRanges = this.ranges.slice(0, -1);
      const newFrom = remainingRanges[0].$from;
      const newTo = remainingRanges[remainingRanges.length - 1].$to;
      return new NodeRangeSelection(newFrom, newTo, this.depth);
    }
    const currentRange = this.ranges[0];
    const newPosition = doc.resolve(Math.max(0, currentRange.$from.pos - 1));
    return new NodeRangeSelection(this.$anchor, newPosition, this.depth);
  }
  extendForwards() {
    const { doc } = this.$from;
    if (this.isBackwards && this.ranges.length > 1) {
      const remainingRanges = this.ranges.slice(1);
      const newFrom = remainingRanges[0].$from;
      const newTo = remainingRanges[remainingRanges.length - 1].$to;
      return new NodeRangeSelection(newTo, newFrom, this.depth);
    }
    const currentRange = this.ranges[this.ranges.length - 1];
    const newPosition = doc.resolve(Math.min(doc.content.size, currentRange.$to.pos + 1));
    return new NodeRangeSelection(this.$anchor, newPosition, this.depth);
  }
  static fromJSON(doc: ProseMirrorNode, json: any): NodeRangeSelection {
    return new NodeRangeSelection(doc.resolve(json.anchor), doc.resolve(json.head));
  }
  static create(doc: ProseMirrorNode, anchor: number, head: number, depth?: number, bias = 1) {
    return new this(doc.resolve(anchor), doc.resolve(head), depth, bias);
  }
  getBookmark() {
    return new NodeRangeBookmark(this.anchor, this.head);
  }
}
