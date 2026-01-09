var I = Object.defineProperty;
var M = (r, e, t) => e in r ? I(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var a = (r, e, t) => M(r, typeof e != "symbol" ? e + "" : e, t);
function w(r) {
  return r.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function m(r, ...e) {
  let t = 0, s = "", i = {};
  function c(n, l) {
    n in i || (i[n] = []), i[n].push(l);
  }
  function f(n) {
    if (n != null) if (n instanceof Node) {
      var l = `_sam_frament_target_${t++}`;
      s += `<span ${l}=""></span>`, c(l, (o) => o.replaceWith(n));
    } else if (typeof n == "object" && "element" in n)
      f(n.element);
    else if (typeof n == "string") s += w(n);
    else if (typeof n[Symbol.iterator] == "function")
      for (const o of n) f(o);
    else typeof n == "function" ? f(n()) : s += w("" + n);
  }
  function g(n, l) {
    if (n != null) if (n instanceof Element)
      l.push((o) => {
        for (let h = 0; h < o.attributes.length; h++) {
          const u = o.attributes.item(h);
          n.attributes.setNamedItem(u.cloneNode());
        }
        for (; o.firstChild; ) n.appendChild(o.firstChild);
        o.before(n);
      });
    else if (typeof n == "object" && "element" in n && n.element instanceof Element) {
      const o = n, h = o.element;
      l.push((u) => {
        for (let y = 0; y < u.attributes.length; y++) {
          const _ = u.attributes.item(y);
          (!o.setTemplateAttr || !o.setTemplateAttr(_.name, _.value)) && h.attributes.setNamedItem(_.cloneNode());
        }
        for (; u.firstChild; ) h.appendChild(u.firstChild);
        u.before(h);
      });
    } else if (typeof n == "string") s += w(n);
    else if (typeof n[Symbol.iterator] == "function")
      for (const o of n) g(o, l);
    else if (typeof n == "function") g(n(), l);
    else throw new Error("Invalid type to be placed as an element: " + typeof n);
  }
  function v(n, l) {
    if (n != null) if (typeof n[Symbol.iterator] == "function")
      for (const o of n) v(o, l);
    else if (typeof n == "function") l.push(n);
    else if (typeof n == "object")
      l.push((o) => {
        for (const [h, u] of Object.entries(n))
          if (typeof u == "function")
            h == "init" ? l.push(u) : o.addEventListener(h, u);
          else throw new Error("Invalid event listener for @ placeholder: " + h);
      });
    else throw new Error("Invalid type to be placed as an element: " + typeof n);
  }
  function x(n) {
    return n.replace("</>", "</div>");
  }
  const O = {};
  try {
    for (let n = 0; n < e.length; n++)
      if (r[n].endsWith("<")) {
        const l = `_sam_frament_to_remove_${t++}`;
        s += r[n] + `div ${l} `;
        const o = [];
        O[l] = o, g(e[n], o);
      } else if (r[n].endsWith("@")) {
        s += r[n];
        const l = `_sam_frament_callback_${t++}`;
        s += ` ${l}="" `;
        const o = i[l] ?? [];
        i[l] = o, v(e[n], o);
      } else
        s += x(r[n]), f(e[n]);
    s += x(r[r.length - 1]);
  } catch (n) {
    const l = s.length < 20 ? s : s.slice(-20, -1);
    throw new Error(`[${l}...] : ${n != null && typeof n == "object" && "message" in n ? n.message : n}`);
  }
  const b = document.createRange().createContextualFragment(s);
  for (const [n, l] of Object.entries(O)) {
    const o = b.querySelector(`[${n}]`);
    o.removeAttribute(n);
    for (const h of l) h(o);
    o.remove();
  }
  for (const [n, l] of Object.entries(i)) {
    let o = b.querySelector(`[${n}]`);
    for (const h of l)
      o.parentNode || (o = b.getElementById(n)), h(o);
    o.removeAttribute(n);
  }
  return b;
}
m.opt = function(r, ...e) {
  if (!(e.includes(null) || e.includes(void 0)))
    return m(r, ...e);
};
m.not_empty = function(r, ...e) {
  if (!e.every((t) => t == null || (t == null ? void 0 : t.length) === 0))
    return m(r, ...e);
};
m.a = function(r, ...e) {
  return m(r, ...e).firstElementChild;
};
function F(...r) {
  const e = document.createDocumentFragment();
  for (const t of r) e.appendChild(t);
  return e;
}
function T(r, e = document) {
  return e.querySelector(r);
}
class p {
  constructor(e) {
    this.iterable = e;
  }
  [Symbol.iterator]() {
    return this.iterable[Symbol.iterator]();
  }
  /** Performs the specified action for each element in an array. */
  forEach(e) {
    let t = 0;
    for (let s of this.iterable)
      e(s, t), t++;
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
    for (let s of this.iterable) {
      if (e(s, t)) return s;
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
    for (let s of this.iterable) {
      if (e(s, t)) return t;
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
    return this.findIndex((t, s) => !e(t, s)) == -1;
  }
  /**
   * Returns a new iterator that contains the elements of the original iterator that satisfy the specified predicate.
   * @param mapper A function that accepts up to two arguments. filter calls the predicate function one time for each element of the iterator.
   */
  map(e) {
    const t = [];
    let s = 0;
    for (let i of this.iterable)
      t.push(e(i, s)), s++;
    return t;
  }
  /**
   * Applies a function against an accumulator and each element in the iterator (from left to right) to reduce it to a single value.
   * @param callbackfn A function that accepts up to three arguments. The reduce method calls the callbackfn function one time for each element in the iterator.
   */
  reduce(e) {
    let t = 0, s;
    for (let i of this.iterable)
      s == null ? s = i : s = e(s, i, t), t++;
    if (s == null) throw new Error("Reduce of empty iterator with no initial value");
    return s;
  }
  /**
   * Checks if the iterable contains the specified value.
   * @param value 
   */
  includes(e) {
    return this.some((t) => t === e);
  }
}
class $ {
  /**
   * Register multiple listeners and save them to be able to unregister them later.
   */
  constructor(e, t) {
    this.sources = e, this.listener = t;
    for (let s of e) s.register(this.listener);
  }
  /**
   * Unregister the listeners
   */
  free() {
    for (let e of this.sources) e.unregister(this.listener);
  }
}
function z(r, e) {
  return new $(r, e);
}
class E {
  /**
   * Register an observer and return a function to unregister it.
   * @param observer The function to call on notification.
   * @returns A function to call to unregister the observer.
   */
  add(e) {
    return this.register(e), () => this.unregister(e);
  }
}
class d extends E {
  constructor(t = void 0) {
    super();
    a(this, "observers", /* @__PURE__ */ new Set());
    a(this, "depth", 0);
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
      for (let s of this.observers) s(t);
      this.parent && this.parent.notify(t);
    }
    this.depth = 0;
  }
}
class A {
  constructor(e) {
    a(this, "on_add");
    a(this, "on_remove");
    this.on_add = new d(e == null ? void 0 : e.on_add), this.on_remove = new d(e == null ? void 0 : e.on_remove);
  }
}
class j {
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
    return new p(this.content);
  }
}
class N extends j {
  constructor(e, t) {
    super(), this.observable = new A(t), this.content = e ?? [];
  }
  /** Remove the given number of elements at the given index and add the given values at the same index */
  splice(e, t, ...s) {
    const i = this.content.splice(e, t, ...s);
    return i.forEach((c, f) => this.observable.on_remove.notify({ value: c, index: e + f })), s.forEach((c, f) => this.observable.on_add.notify({ value: c, index: e + f })), i;
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
class S {
  constructor(e) {
    a(this, "on_change");
    this.on_change = new d(e == null ? void 0 : e.on_change);
  }
}
class C {
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
    return new p(this.content.entries());
  }
  /** Get the entries */
  keys() {
    return new p(this.content.keys());
  }
  /** Get the values */
  values() {
    return new p(this.content.values());
  }
  /**
   * Create an observable array that is automatically updated when this observable map is updated.
   * It try to keep the same ordering through each update.
   * It need to be disposed when not used anymore.
   */
  observable_values() {
    let e = [], t = new N();
    for (let [s, i] of this.entries()) t.push(i);
    return t.dispose = this.observable.on_change.register(({ key: s, from: i, to: c }) => {
      if (i != null)
        if (c != null) {
          const f = e.indexOf(s);
          t.splice(f, 1, c);
        } else {
          const f = e.indexOf(s);
          e.splice(f, 1), t.splice(f, 1);
        }
      else c != null && (e.push(s), t.push(c));
    }), t;
  }
}
class L extends C {
  constructor(e, t) {
    super(), this.observable = new S(t), this.content = e ?? /* @__PURE__ */ new Map();
  }
  /**
   * Set or delete a value
   * @param value the value to set, or null to delete  
   */
  set_or_delete(e, t) {
    const s = this.content.get(e) ?? null;
    t === null ? this.content.delete(e) : this.content.set(e, t), this.observable.on_change.notify({ key: e, from: s, to: t });
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
class W {
  /** Get the value */
  get() {
    return this._value;
  }
  /** Get the value */
  get value() {
    return this.get();
  }
}
class R extends W {
  constructor(e, t) {
    super(), this.observable = new d(t), this._value = e;
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
class B extends C {
  constructor(t, s, i, c) {
    super();
    a(this, "observable");
    a(this, "content");
    this.key_factory = t, this.value_factory = s, this.observable = new S(c), this.content = i ?? /* @__PURE__ */ new Map();
  }
  /** Set or delete a value */
  set(t) {
    const s = this.key_factory(t), i = this.content.get(s) ?? null;
    this.content.set(s, t), this.observable.on_change.notify({ key: s, from: i, to: t });
  }
  /** Get a value or create it if it does not exist */
  get_or_create(t) {
    const s = this.value_factory;
    if (s) return this.or_compute(t, () => s(t));
    throw new Error("This auto map cannot auto create his values");
  }
  /** Get a value */
  or_compute(t, s) {
    let i = this.content.get(t);
    return i === void 0 && (i = s(), this.content.set(t, i), this.observable.on_change.notify({ key: t, from: null, to: i })), i;
  }
  /** Delete a value if it exists */
  delete(t) {
    const s = this.content.get(t) ?? null;
    this.content.delete(t), this.observable.on_change.notify({ key: t, from: s, to: null });
  }
}
class q extends E {
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
function D(r, e) {
  return new q(r, e);
}
class H {
  constructor() {
    a(this, "before", new d());
    a(this, "after", new d());
    a(this, "cancel", new d());
  }
  /**
   * Notify the observer and return false if the notification was cancelled
   * @param value 
   * @param action An action to perform if the notification is not cancelled and before the after event
   * @param postaction An action to perform after the after event
   */
  notify(e, t, s) {
    let i = { ...e, cancel: !1 };
    if (this.before.notify(i), i.cancel)
      return this.cancel.notify(e), !1;
    {
      let c = !1, f = t == null ? void 0 : t(() => c = !0);
      return c || (this.after.notify(e), s == null || s(f)), !0;
    }
  }
}
export {
  H as CancellableOSource,
  p as FriendlyIterable,
  N as MOArray,
  B as MOAutoMap,
  L as MOMap,
  R as MOValue,
  $ as MultiListener,
  j as OArray,
  A as OArrayObservable,
  C as OMap,
  S as OMapObservable,
  d as OSource,
  q as OStartWith,
  W as OValue,
  E as Observable,
  w as escapeHtml,
  F as fragment,
  T as get,
  m as html,
  z as listen_all,
  D as startWith
};
