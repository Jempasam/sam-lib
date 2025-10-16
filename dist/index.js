var y = Object.defineProperty;
var w = (r, e, t) => e in r ? y(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var h = (r, e, t) => w(r, typeof e != "symbol" ? e + "" : e, t);
function g(r) {
  return r.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function a(r, ...e) {
  let t = "", n = [], i = [];
  function o(s) {
    if (s != null) if (s instanceof Node)
      t += `<span id="_sam_frament_target_${n.length}"></span>`, n.push(s);
    else if (typeof s == "string") t += g(s);
    else if (typeof s[Symbol.iterator] == "function")
      for (const c of s) o(c);
    else typeof s == "function" ? o(s()) : t += g("" + s);
  }
  for (let s = 0; s < e.length; s++)
    r[s].endsWith("@") && (typeof e[s] == "function" || typeof e[s] == "object") ? (t += r[s].slice(0, -1), t += `_sam_fragment_to_call_${i.length}=sam`, i.push(e[s])) : (t += r[s], o(e[s]));
  t += r[r.length - 1];
  const l = document.createRange().createContextualFragment(t);
  for (let s = 0; s < n.length; s++) {
    const c = l.getElementById(`_sam_frament_target_${s}`);
    c == null || c.replaceWith(n[s]);
  }
  for (let s = 0; s < i.length; s++) {
    const c = l.querySelector(`[_sam_fragment_to_call_${s}]`);
    c == null || c.removeAttribute(`_sam_fragment_to_call_${s}`);
    const d = i[s];
    if (typeof d == "function") d();
    else for (const [_, b] of Object.entries(i[s]))
      _ == "init" ? b(c) : c == null || c.addEventListener(_, b);
  }
  return l;
}
a.opt = function(r, ...e) {
  if (!(e.includes(null) || e.includes(void 0)))
    return a(r, ...e);
};
a.not_empty = function(r, ...e) {
  if (!e.every((t) => t == null || t.length && t.length === 0))
    return a(r, ...e);
};
a.a = function(r, ...e) {
  return a(r, ...e).firstElementChild;
};
function $(...r) {
  const e = document.createDocumentFragment();
  for (const t of r) e.appendChild(t);
  return e;
}
function C(r, e = document) {
  return e.querySelector(r);
}
class f {
  constructor(e) {
    this.iterable = e;
  }
  [Symbol.iterator]() {
    return this.iterable[Symbol.iterator]();
  }
  /** Performs the specified action for each element in an array. */
  forEach(e) {
    let t = 0;
    for (let n of this.iterable)
      e(n, t), t++;
  }
  /**
   * Returns the value of the first element of the iterator where predicate is true, and undefined
   * otherwise.
   * @param predicate find calls predicate once for each element of the iterator, in ascending
   * order, until it finds one where predicate returns true. If such an element is found, find
   * immediately returns that element value. Otherwise, find returns undefined.
   */
  find(e) {
    let t = 0;
    for (let n of this.iterable) {
      if (e(n, t)) return n;
      t++;
    }
  }
  /**
   * Returns the index of the first element of the iterator where predicate is true, and -1
   * otherwise.
   * @param {} predicate find calls predicate once for each element of the iterator, in ascending
   * order, until it finds one where predicate returns true. If such an element is found, find
   * immediately returns that element index. Otherwise, find returns -1.
   */
  findIndex(e) {
    let t = 0;
    for (let n of this.iterable) {
      if (e(n, t)) return t;
      t++;
    }
    return -1;
  }
  /**
   * Returns the index of the first occurrence of a value in an iterator, or -1 if it is not present.
   * @param value The value to locate in the iterator.
   */
  indexOf(e) {
    return this.findIndex((t) => t === e);
  }
  /**
   * Determines whether the specified callback function returns true for any element of an iterator.
   * @param predicate A function that accepts up to two arguments. some calls the predicate function for each element of the iterator until the predicate returns true, or until the end of the iterator.
   */
  some(e) {
    return this.findIndex(e) != -1;
  }
  /**
   * Determines whether all the members of an iterator satisfy the specified test.
   * @param predicate A function that accepts up to two arguments. every calls the predicate function for each element of the iterator until the predicate returns false, or until the end of the iterator.
   */
  every(e) {
    return this.findIndex((t, n) => !e(t, n)) == -1;
  }
  /**
   * Returns a new iterator that contains the elements of the original iterator that satisfy the specified predicate.
   * @param mapper A function that accepts up to two arguments. filter calls the predicate function one time for each element of the iterator.
   */
  map(e) {
    const t = [];
    let n = 0;
    for (let i of this.iterable)
      t.push(e(i, n)), n++;
    return t;
  }
  /**
   * Applies a function against an accumulator and each element in the iterator (from left to right) to reduce it to a single value.
   * @param callbackfn A function that accepts up to three arguments. The reduce method calls the callbackfn function one time for each element in the iterator.
   */
  reduce(e) {
    let t = 0, n;
    for (let i of this.iterable)
      n == null ? n = i : n = e(n, i, t), t++;
    if (n == null) throw new Error("Reduce of empty iterator with no initial value");
    return n;
  }
  /**
   * Checks if the iterable contains the specified value.
   * @param value 
   */
  includes(e) {
    return this.some((t) => t === e);
  }
}
class x {
  /**
   * Register multiple listeners and save them to be able to unregister them later.
   */
  constructor(e, t) {
    this.sources = e, this.listener = t;
    for (let n of e) n.register(this.listener);
  }
  /**
   * Unregister the listeners
   */
  free() {
    for (let e of this.sources) e.unregister(this.listener);
  }
}
function V(r, e) {
  return new x(r, e);
}
class m {
  /**
   * Register an observer and return a function to unregister it.
   * @param observer The function to call on notification.
   * @returns A function to call to unregister the observer.
   */
  add(e) {
    return this.register(e), () => this.unregister(e);
  }
}
class u extends m {
  constructor(t = void 0) {
    super();
    h(this, "observers", /* @__PURE__ */ new Set());
    h(this, "depth", 0);
    this.parent = t;
  }
  /** Register an observer */
  register(t) {
    return this.observers.add(t), () => this.observers.delete(t);
  }
  /** Unregister an observer */
  unregister(t) {
    this.observers.delete(t);
  }
  /** Send a notification to the observers */
  notify(t) {
    if (this.depth++, this.depth == 1) {
      for (let n of this.observers) n(t);
      this.parent && this.parent.notify(t);
    }
    this.depth = 0;
  }
}
class O {
  constructor(e) {
    h(this, "on_add");
    h(this, "on_remove");
    this.on_add = new u(e == null ? void 0 : e.on_add), this.on_remove = new u(e == null ? void 0 : e.on_remove);
  }
}
class M {
  get length() {
    return this.content.length;
  }
  get(e) {
    return this.content[e];
  }
  [Symbol.iterator]() {
    return this.content[Symbol.iterator]();
  }
  values() {
    return new f(this.content);
  }
}
class S extends M {
  constructor(e, t) {
    super(), this.observable = new O(t), this.content = e ?? [];
  }
  /** Remove the given number of elements at the given index and add the given values at the same index */
  splice(e, t, ...n) {
    const i = this.content.splice(e, t, ...n);
    return i.forEach((o, l) => this.observable.on_remove.notify({ value: o, index: e + l })), n.forEach((o, l) => this.observable.on_add.notify({ value: o, index: e + l })), i;
  }
  /** Add the values at the end of the array */
  push(...e) {
    this.splice(this.length, 0, ...e);
  }
  /** Insert the value at the given index */
  insert(e, t) {
    this.splice(e, 0, t);
  }
  /** Remove the element at the given index */
  remove(e) {
    return this.splice(e, 1)[0];
  }
  /** Remove the last element */
  pop() {
    return this.remove(this.length - 1);
  }
}
class p {
  constructor(e) {
    h(this, "on_change");
    this.on_change = new u(e == null ? void 0 : e.on_change);
  }
}
class v {
  /** Test if a key exists */
  has(e) {
    return this.content.has(e);
  }
  /** Get a value */
  get(e) {
    return this.content.get(e) ?? null;
  }
  /** Get the entries */
  entries() {
    return new f(this.content.entries());
  }
  /** Get the entries */
  keys() {
    return new f(this.content.keys());
  }
  /** Get the values */
  values() {
    return new f(this.content.values());
  }
  /**
   * Create an observable array that is automatically updated when this observable map is updated.
   * It try to keep the same ordering through each update.
   * It need to be disposed when not used anymore.
   */
  observable_values() {
    let e = [], t = new S();
    for (let [n, i] of this.entries()) t.push(i);
    return t.dispose = this.observable.on_change.register(({ key: n, from: i, to: o }) => {
      if (i != null)
        if (o != null) {
          const l = e.indexOf(n);
          t.splice(l, 1, o);
        } else {
          const l = e.indexOf(n);
          e.splice(l, 1), t.splice(l, 1);
        }
      else o != null && (e.push(n), t.push(o));
    }), t;
  }
}
class W extends v {
  constructor(e, t) {
    super(), this.observable = new p(t), this.content = e ?? /* @__PURE__ */ new Map();
  }
  /**
   * Set or delete a value
   * @param value the value to set, or null to delete  
   */
  set_or_delete(e, t) {
    const n = this.content.get(e) ?? null;
    t === null ? this.content.delete(e) : this.content.set(e, t), this.observable.on_change.notify({ key: e, from: n, to: t });
  }
  /**
   * Set or delete a value
   */
  set(e, t) {
    this.set_or_delete(e, t);
  }
  /**
   * Delete a value if it exists
   */
  delete(e) {
    this.set_or_delete(e, null);
  }
}
class E {
  /** Get the value */
  get() {
    return this._value;
  }
  /** Get the value */
  get value() {
    return this.get();
  }
}
class q extends E {
  constructor(e, t) {
    super(), this.observable = new u(t), this._value = e;
  }
  /** Set the value */
  set(e) {
    let t = this._value;
    this._value = e, this.observable.notify({ from: t, to: e });
  }
  /** Set the value */
  set value(e) {
    this.set(e);
  }
  /** Get the value */
  get value() {
    return this.get();
  }
  /** Register a listener and call it immediately with the current value. */
  link(e) {
    return e({ from: this._value, to: this._value }), this.observable.add(e);
  }
}
class F extends v {
  constructor(t, n, i, o) {
    super();
    h(this, "observable");
    h(this, "content");
    this.key_factory = t, this.value_factory = n, this.observable = new p(o), this.content = i ?? /* @__PURE__ */ new Map();
  }
  /** Set or delete a value */
  set(t) {
    const n = this.key_factory(t), i = this.content.get(n) ?? null;
    this.content.set(n, t), this.observable.on_change.notify({ key: n, from: i, to: t });
  }
  /** Get a value or create it if it does not exist */
  get_or_create(t) {
    const n = this.value_factory;
    if (n) return this.or_compute(t, () => n(t));
    throw new Error("This auto map cannot auto create his values");
  }
  /** Get a value */
  or_compute(t, n) {
    let i = this.content.get(t);
    return i === void 0 && (i = n(), this.content.set(t, i), this.observable.on_change.notify({ key: t, from: null, to: i })), i;
  }
  /** Delete a value if it exists */
  delete(t) {
    const n = this.content.get(t) ?? null;
    this.content.delete(t), this.observable.on_change.notify({ key: t, from: n, to: null });
  }
}
class I extends m {
  constructor(e, t) {
    super(), this.decorated = e, this.initalizer = t, this.decorated = e, this.initalizer = t;
  }
  notify(e) {
    this.decorated.notify(e);
  }
  register(e) {
    this.decorated.register(e), this.initalizer(e);
  }
  unregister(e) {
    this.decorated.unregister(e);
  }
}
function j(r, e) {
  return new I(r, e);
}
class z {
  constructor() {
    h(this, "before", new u());
    h(this, "after", new u());
    h(this, "cancel", new u());
  }
  /**
   * Notify the observer and return false if the notification was cancelled
   * @param value 
   * @param action An action to perform if the notification is not cancelled and before the after event
   * @param postaction An action to perform after the after event
   */
  notify(e, t, n) {
    let i = { ...e, cancel: !1 };
    if (this.before.notify(i), i.cancel)
      return this.cancel.notify(e), !1;
    {
      let o = !1, l = t == null ? void 0 : t(() => o = !0);
      return o || (this.after.notify(e), n == null || n(l)), !0;
    }
  }
}
export {
  z as CancellableOSource,
  f as FriendlyIterable,
  S as MOArray,
  F as MOAutoMap,
  W as MOMap,
  q as MOValue,
  x as MultiListener,
  M as OArray,
  O as OArrayObservable,
  v as OMap,
  p as OMapObservable,
  u as OSource,
  I as OStartWith,
  E as OValue,
  m as Observable,
  g as escapeHtml,
  $ as fragment,
  C as get,
  a as html,
  V as listen_all,
  j as startWith
};
