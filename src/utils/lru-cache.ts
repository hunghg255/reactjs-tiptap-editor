/* eslint-disable @typescript-eslint/ban-ts-comment */
import { safeJSONStringify } from './json';
import { getStorage, setStorage } from './storage';

class Node {
  public key: string;
  public value: string | number;
  public prev: Node | null;
  public next: Node | null;

  constructor(key: any, value: any) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export class LRUCache {
  private capacity: number;
  private usedCapacity: number;
  private head: Node;
  private tail: Node;
  private store: Record<string, Node>;

  constructor(capacity: any) {
    this.capacity = capacity || 20;
    this.usedCapacity = 0;
    this.store = {};
    this.head = new Node('fakeHeadNode', 'fakeHeadNode');
    this.tail = new Node('fakeTailNode', 'fakeTailNode');

    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private removeNode(node: any) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  private addToHead(node: any) {
    node.prev = this.head;
    node.next = this.head.next;
    // @ts-expect-error
    this.head.next.prev = node;
    this.head.next = node;
  }

  private moveToHead(node: any) {
    this.removeNode(node);
    this.addToHead(node);
  }

  private removeTail() {
    const node = this.tail.prev;
    this.removeNode(node);
    return node;
  }

  get(key: any) {
    if (key in this.store) {
      const node = this.store[key];
      this.moveToHead(node);
      return node.value;
    }

    return -1;
  }

  put(key: any, value: any) {
    if (key in this.store) {
      const node = this.store[key];
      node.value = value;
      this.moveToHead(node);
    } else {
      const node = new Node(key, value);
      this.addToHead(node);
      this.store[key] = node;
      this.usedCapacity += 1;

      if (this.usedCapacity > this.capacity) {
        const tailNode = this.removeTail() as any;
        delete this.store[tailNode.key];
        this.usedCapacity -= 1;
      }
    }
  }

  keys() {
    const res = [];
    let node = this.head as any;

    while (node) {
      res.push(node.key);
      node = node.next;
    }

    return res.slice(1, -1);
  }

  values() {
    const res = [];
    let node = this.head as any;

    while (node) {
      res.push(node.value);
      node = node.next;
    }

    return res.slice(1, -1);
  }

  toJSON() {
    return this.store;
  }
}

export function createKeysLocalStorageLRUCache(storageKey: any, capacity: any) {
  const lruCache = new LRUCache(capacity);

  const manager = {
    syncFromStorage() {
      const data = getStorage(storageKey) || [];
      data
        .slice()
        .reverse()
        .forEach((key: any) => {
          lruCache.put(key, key);
        });
    },
    syncToStorage() {
      setStorage(storageKey, safeJSONStringify(lruCache.keys()));
    },
    put(key: any) {
      lruCache.put(key, key);
      this.syncToStorage();
    },
    get(key?: string) {
      return key ? lruCache.get(key) : lruCache.keys();
    },
  };

  return manager;
}
