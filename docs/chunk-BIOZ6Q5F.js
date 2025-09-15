var Ff = Object.defineProperty,
  jf = Object.defineProperties;
var Vf = Object.getOwnPropertyDescriptors;
var Jn = Object.getOwnPropertySymbols;
var ec = Object.prototype.hasOwnProperty,
  tc = Object.prototype.propertyIsEnumerable;
var Xa = (e, t, n) =>
    t in e
      ? Ff(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  q = (e, t) => {
    for (var n in (t ||= {})) ec.call(t, n) && Xa(e, n, t[n]);
    if (Jn) for (var n of Jn(t)) tc.call(t, n) && Xa(e, n, t[n]);
    return e;
  },
  G = (e, t) => jf(e, Vf(t));
var ME = (e, t) => {
  var n = {};
  for (var r in e) ec.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && Jn)
    for (var r of Jn(e)) t.indexOf(r) < 0 && tc.call(e, r) && (n[r] = e[r]);
  return n;
};
var qo;
function Xn() {
  return qo;
}
function ye(e) {
  let t = qo;
  return ((qo = e), t);
}
var nc = Symbol("NotFound");
function Dt(e) {
  return e === nc || e?.name === "\u0275NotFound";
}
function or(e, t) {
  return Object.is(e, t);
}
var W = null,
  er = !1,
  Go = 1,
  Hf = null,
  z = Symbol("SIGNAL");
function y(e) {
  let t = W;
  return ((W = e), t);
}
function ir() {
  return W;
}
var ze = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producers: void 0,
  producersTail: void 0,
  consumers: void 0,
  consumersTail: void 0,
  recomputing: !1,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  kind: "unknown",
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Ct(e) {
  if (er) throw new Error("");
  if (W === null) return;
  W.consumerOnSignalRead(e);
  let t = W.producersTail;
  if (t !== void 0 && t.producer === e) return;
  let n,
    r = W.recomputing;
  if (
    r &&
    ((n = t !== void 0 ? t.nextProducer : W.producers),
    n !== void 0 && n.producer === e)
  ) {
    ((W.producersTail = n), (n.lastReadVersion = e.version));
    return;
  }
  let o = e.consumersTail;
  if (o !== void 0 && o.consumer === W && (!r || $f(o, W))) return;
  let i = Tt(W),
    s = {
      producer: e,
      consumer: W,
      nextProducer: n,
      prevConsumer: o,
      lastReadVersion: e.version,
      nextConsumer: void 0,
    };
  ((W.producersTail = s),
    t !== void 0 ? (t.nextProducer = s) : (W.producers = s),
    i && oc(e, s));
}
function rc() {
  Go++;
}
function sr(e) {
  if (!(Tt(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Go)) {
    if (!e.producerMustRecompute(e) && !_t(e)) {
      rr(e);
      return;
    }
    (e.producerRecomputeValue(e), rr(e));
  }
}
function Wo(e) {
  if (e.consumers === void 0) return;
  let t = er;
  er = !0;
  try {
    for (let n = e.consumers; n !== void 0; n = n.nextConsumer) {
      let r = n.consumer;
      r.dirty || Bf(r);
    }
  } finally {
    er = t;
  }
}
function zo() {
  return W?.consumerAllowSignalWrites !== !1;
}
function Bf(e) {
  ((e.dirty = !0), Wo(e), e.consumerMarkedDirty?.(e));
}
function rr(e) {
  ((e.dirty = !1), (e.lastCleanEpoch = Go));
}
function Qe(e) {
  return (e && ((e.producersTail = void 0), (e.recomputing = !0)), y(e));
}
function wt(e, t) {
  if ((y(t), !e)) return;
  e.recomputing = !1;
  let n = e.producersTail,
    r = n !== void 0 ? n.nextProducer : e.producers;
  if (r !== void 0) {
    if (Tt(e))
      do r = Qo(r);
      while (r !== void 0);
    n !== void 0 ? (n.nextProducer = void 0) : (e.producers = void 0);
  }
}
function _t(e) {
  for (let t = e.producers; t !== void 0; t = t.nextProducer) {
    let n = t.producer,
      r = t.lastReadVersion;
    if (r !== n.version || (sr(n), r !== n.version)) return !0;
  }
  return !1;
}
function Ze(e) {
  if (Tt(e)) {
    let t = e.producers;
    for (; t !== void 0; ) t = Qo(t);
  }
  ((e.producers = void 0),
    (e.producersTail = void 0),
    (e.consumers = void 0),
    (e.consumersTail = void 0));
}
function oc(e, t) {
  let n = e.consumersTail,
    r = Tt(e);
  if (
    (n !== void 0
      ? ((t.nextConsumer = n.nextConsumer), (n.nextConsumer = t))
      : ((t.nextConsumer = void 0), (e.consumers = t)),
    (t.prevConsumer = n),
    (e.consumersTail = t),
    !r)
  )
    for (let o = e.producers; o !== void 0; o = o.nextProducer)
      oc(o.producer, o);
}
function Qo(e) {
  let t = e.producer,
    n = e.nextProducer,
    r = e.nextConsumer,
    o = e.prevConsumer;
  if (
    ((e.nextConsumer = void 0),
    (e.prevConsumer = void 0),
    r !== void 0 ? (r.prevConsumer = o) : (t.consumersTail = o),
    o !== void 0)
  )
    o.nextConsumer = r;
  else if (((t.consumers = r), !Tt(t))) {
    let i = t.producers;
    for (; i !== void 0; ) i = Qo(i);
  }
  return n;
}
function Tt(e) {
  return e.consumerIsAlwaysLive || e.consumers !== void 0;
}
function ar(e) {
  Hf?.(e);
}
function $f(e, t) {
  let n = t.producersTail;
  if (n !== void 0) {
    let r = t.producers;
    do {
      if (r === e) return !0;
      if (r === n) break;
      r = r.nextProducer;
    } while (r !== void 0);
  }
  return !1;
}
function cr(e, t) {
  let n = Object.create(Uf);
  ((n.computation = e), t !== void 0 && (n.equal = t));
  let r = () => {
    if ((sr(n), Ct(n), n.value === rn)) throw n.error;
    return n.value;
  };
  return ((r[z] = n), ar(n), r);
}
var tr = Symbol("UNSET"),
  nr = Symbol("COMPUTING"),
  rn = Symbol("ERRORED"),
  Uf = G(q({}, ze), {
    value: tr,
    dirty: !0,
    error: null,
    equal: or,
    kind: "computed",
    producerMustRecompute(e) {
      return e.value === tr || e.value === nr;
    },
    producerRecomputeValue(e) {
      if (e.value === nr) throw new Error("");
      let t = e.value;
      e.value = nr;
      let n = Qe(e),
        r,
        o = !1;
      try {
        ((r = e.computation()),
          y(null),
          (o = t !== tr && t !== rn && r !== rn && e.equal(t, r)));
      } catch (i) {
        ((r = rn), (e.error = i));
      } finally {
        wt(e, n);
      }
      if (o) {
        e.value = t;
        return;
      }
      ((e.value = r), e.version++);
    },
  });
function qf() {
  throw new Error();
}
var ic = qf;
function sc(e) {
  ic(e);
}
function Zo(e) {
  ic = e;
}
var Gf = null;
function Yo(e, t) {
  let n = Object.create(lr);
  ((n.value = e), t !== void 0 && (n.equal = t));
  let r = () => ac(n);
  return ((r[z] = n), ar(n), [r, (s) => bt(n, s), (s) => Ko(n, s)]);
}
function ac(e) {
  return (Ct(e), e.value);
}
function bt(e, t) {
  (zo() || sc(e), e.equal(e.value, t) || ((e.value = t), Wf(e)));
}
function Ko(e, t) {
  (zo() || sc(e), bt(e, t(e.value)));
}
var lr = G(q({}, ze), { equal: or, value: void 0, kind: "signal" });
function Wf(e) {
  (e.version++, rc(), Wo(e), Gf?.(e));
}
function I(e) {
  return typeof e == "function";
}
function Nt(e) {
  let n = e((r) => {
    (Error.call(r), (r.stack = new Error().stack));
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var ur = Nt(
  (e) =>
    function (n) {
      (e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = n));
    },
);
function on(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var H = class e {
  constructor(t) {
    ((this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null));
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let i of n) i.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (I(r))
        try {
          r();
        } catch (i) {
          t = i instanceof ur ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            cc(i);
          } catch (s) {
            ((t = t ?? []),
              s instanceof ur ? (t = [...t, ...s.errors]) : t.push(s));
          }
      }
      if (t) throw new ur(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) cc(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this;
    return n === t || (Array.isArray(n) && n.includes(t));
  }
  _addParent(t) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
  }
  _removeParent(t) {
    let { _parentage: n } = this;
    n === t ? (this._parentage = null) : Array.isArray(n) && on(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    (n && on(n, t), t instanceof e && t._removeParent(this));
  }
};
H.EMPTY = (() => {
  let e = new H();
  return ((e.closed = !0), e);
})();
var Jo = H.EMPTY;
function dr(e) {
  return (
    e instanceof H ||
    (e && "closed" in e && I(e.remove) && I(e.add) && I(e.unsubscribe))
  );
}
function cc(e) {
  I(e) ? e() : e.unsubscribe();
}
var ue = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Mt = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = Mt;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = Mt;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function fr(e) {
  Mt.setTimeout(() => {
    let { onUnhandledError: t } = ue;
    if (t) t(e);
    else throw e;
  });
}
function sn() {}
var lc = Xo("C", void 0, void 0);
function uc(e) {
  return Xo("E", void 0, e);
}
function dc(e) {
  return Xo("N", e, void 0);
}
function Xo(e, t, n) {
  return { kind: e, value: t, error: n };
}
var Ye = null;
function St(e) {
  if (ue.useDeprecatedSynchronousErrorHandling) {
    let t = !Ye;
    if ((t && (Ye = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = Ye;
      if (((Ye = null), n)) throw r;
    }
  } else e();
}
function fc(e) {
  ue.useDeprecatedSynchronousErrorHandling &&
    Ye &&
    ((Ye.errorThrown = !0), (Ye.error = e));
}
var Ke = class extends H {
    constructor(t) {
      (super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), dr(t) && t.add(this))
          : (this.destination = Zf));
    }
    static create(t, n, r) {
      return new xt(t, n, r);
    }
    next(t) {
      this.isStopped ? ti(dc(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? ti(uc(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? ti(lc, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(t) {
      this.destination.next(t);
    }
    _error(t) {
      try {
        this.destination.error(t);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  zf = Function.prototype.bind;
function ei(e, t) {
  return zf.call(e, t);
}
var ni = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          pr(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          pr(r);
        }
      else pr(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          pr(n);
        }
    }
  },
  xt = class extends Ke {
    constructor(t, n, r) {
      super();
      let o;
      if (I(t) || !t)
        o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && ue.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && ei(t.next, i),
              error: t.error && ei(t.error, i),
              complete: t.complete && ei(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new ni(o);
    }
  };
function pr(e) {
  ue.useDeprecatedSynchronousErrorHandling ? fc(e) : fr(e);
}
function Qf(e) {
  throw e;
}
function ti(e, t) {
  let { onStoppedNotification: n } = ue;
  n && Mt.setTimeout(() => n(e, t));
}
var Zf = { closed: !0, next: sn, error: Qf, complete: sn };
var Rt = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function ne(e) {
  return e;
}
function Yf(...e) {
  return ri(e);
}
function ri(e) {
  return e.length === 0
    ? ne
    : e.length === 1
      ? e[0]
      : function (n) {
          return e.reduce((r, o) => o(r), n);
        };
}
var N = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new e();
      return ((r.source = this), (r.operator = n), r);
    }
    subscribe(n, r, o) {
      let i = Jf(n) ? n : new xt(n, r, o);
      return (
        St(() => {
          let { operator: s, source: a } = this;
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i),
          );
        }),
        i
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = pc(r)),
        new r((o, i) => {
          let s = new xt({
            next: (a) => {
              try {
                n(a);
              } catch (c) {
                (i(c), s.unsubscribe());
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [Rt]() {
      return this;
    }
    pipe(...n) {
      return ri(n)(this);
    }
    toPromise(n) {
      return (
        (n = pc(n)),
        new n((r, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i),
          );
        })
      );
    }
  }
  return ((e.create = (t) => new e(t)), e);
})();
function pc(e) {
  var t;
  return (t = e ?? ue.Promise) !== null && t !== void 0 ? t : Promise;
}
function Kf(e) {
  return e && I(e.next) && I(e.error) && I(e.complete);
}
function Jf(e) {
  return (e && e instanceof Ke) || (Kf(e) && dr(e));
}
function oi(e) {
  return I(e?.lift);
}
function b(e) {
  return (t) => {
    if (oi(t))
      return t.lift(function (n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function T(e, t, n, r, o) {
  return new ii(e, t, n, r, o);
}
var ii = class extends Ke {
  constructor(t, n, r, o, i, s) {
    (super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (c) {
              t.error(c);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (c) {
              t.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete));
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      (super.unsubscribe(),
        !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this)));
    }
  }
};
function si() {
  return b((e, t) => {
    let n = null;
    e._refCount++;
    let r = T(t, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        n = null;
        return;
      }
      let o = e._connection,
        i = n;
      ((n = null), o && (!i || o === i) && o.unsubscribe(), t.unsubscribe());
    });
    (e.subscribe(r), r.closed || (n = e.connect()));
  });
}
var ai = class extends N {
  constructor(t, n) {
    (super(),
      (this.source = t),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      oi(t) && (this.lift = t.lift));
  }
  _subscribe(t) {
    return this.getSubject().subscribe(t);
  }
  getSubject() {
    let t = this._subject;
    return (
      (!t || t.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: t } = this;
    ((this._subject = this._connection = null), t?.unsubscribe());
  }
  connect() {
    let t = this._connection;
    if (!t) {
      t = this._connection = new H();
      let n = this.getSubject();
      (t.add(
        this.source.subscribe(
          T(
            n,
            void 0,
            () => {
              (this._teardown(), n.complete());
            },
            (r) => {
              (this._teardown(), n.error(r));
            },
            () => this._teardown(),
          ),
        ),
      ),
        t.closed && ((this._connection = null), (t = H.EMPTY)));
    }
    return t;
  }
  refCount() {
    return si()(this);
  }
};
var hc = Nt(
  (e) =>
    function () {
      (e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed"));
    },
);
var Pe = (() => {
    class e extends N {
      constructor() {
        (super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null));
      }
      lift(n) {
        let r = new hr(this, this);
        return ((r.operator = n), r);
      }
      _throwIfClosed() {
        if (this.closed) throw new hc();
      }
      next(n) {
        St(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        St(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            ((this.hasError = this.isStopped = !0), (this.thrownError = n));
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        St(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        ((this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null));
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return (this._throwIfClosed(), super._trySubscribe(n));
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: o, observers: i } = this;
        return r || o
          ? Jo
          : ((this.currentObservers = null),
            i.push(n),
            new H(() => {
              ((this.currentObservers = null), on(i, n));
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? n.error(o) : i && n.complete();
      }
      asObservable() {
        let n = new N();
        return ((n.source = this), n);
      }
    }
    return ((e.create = (t, n) => new hr(t, n)), e);
  })(),
  hr = class extends Pe {
    constructor(t, n) {
      (super(), (this.destination = t), (this.source = n));
    }
    next(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    error(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    complete() {
      var t, n;
      (n =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        n === void 0 ||
        n.call(t);
    }
    _subscribe(t) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(t)) !== null && r !== void 0
        ? r
        : Jo;
    }
  };
var an = class extends Pe {
  constructor(t) {
    (super(), (this._value = t));
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let n = super._subscribe(t);
    return (!n.closed && t.next(this._value), n);
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this;
    if (t) throw n;
    return (this._throwIfClosed(), r);
  }
  next(t) {
    super.next((this._value = t));
  }
};
var cn = new N((e) => e.complete());
function gc(e) {
  return e && I(e.schedule);
}
function mc(e) {
  return e[e.length - 1];
}
function gr(e) {
  return I(mc(e)) ? e.pop() : void 0;
}
function Le(e) {
  return gc(mc(e)) ? e.pop() : void 0;
}
function vc(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i);
        });
  }
  return new (n || (n = Promise))(function (i, s) {
    function a(u) {
      try {
        l(r.next(u));
      } catch (d) {
        s(d);
      }
    }
    function c(u) {
      try {
        l(r.throw(u));
      } catch (d) {
        s(d);
      }
    }
    function l(u) {
      u.done ? i(u.value) : o(u.value).then(a, c);
    }
    l((r = r.apply(e, t || [])).next());
  });
}
function yc(e) {
  var t = typeof Symbol == "function" && Symbol.iterator,
    n = t && e[t],
    r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function () {
        return (
          e && r >= e.length && (e = void 0),
          { value: e && e[r++], done: !e }
        );
      },
    };
  throw new TypeError(
    t ? "Object is not iterable." : "Symbol.iterator is not defined.",
  );
}
function Je(e) {
  return this instanceof Je ? ((this.v = e), this) : new Je(e);
}
function Ec(e, t, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(e, t || []),
    o,
    i = [];
  return (
    (o = Object.create(
      (typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype,
    )),
    a("next"),
    a("throw"),
    a("return", s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    return function (h) {
      return Promise.resolve(h).then(f, d);
    };
  }
  function a(f, h) {
    r[f] &&
      ((o[f] = function (E) {
        return new Promise(function (x, w) {
          i.push([f, E, x, w]) > 1 || c(f, E);
        });
      }),
      h && (o[f] = h(o[f])));
  }
  function c(f, h) {
    try {
      l(r[f](h));
    } catch (E) {
      p(i[0][3], E);
    }
  }
  function l(f) {
    f.value instanceof Je
      ? Promise.resolve(f.value.v).then(u, d)
      : p(i[0][2], f);
  }
  function u(f) {
    c("next", f);
  }
  function d(f) {
    c("throw", f);
  }
  function p(f, h) {
    (f(h), i.shift(), i.length && c(i[0][0], i[0][1]));
  }
}
function Ic(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof yc == "function" ? yc(e) : e[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(i) {
    n[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, c) {
          ((s = e[i](s)), o(a, c, s.done, s.value));
        });
      };
  }
  function o(i, s, a, c) {
    Promise.resolve(c).then(function (l) {
      i({ value: l, done: a });
    }, s);
  }
}
var mr = (e) => e && typeof e.length == "number" && typeof e != "function";
function yr(e) {
  return I(e?.then);
}
function vr(e) {
  return I(e[Rt]);
}
function Er(e) {
  return Symbol.asyncIterator && I(e?.[Symbol.asyncIterator]);
}
function Ir(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function Xf() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Dr = Xf();
function Cr(e) {
  return I(e?.[Dr]);
}
function wr(e) {
  return Ec(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield Je(n.read());
        if (o) return yield Je(void 0);
        yield yield Je(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function _r(e) {
  return I(e?.getReader);
}
function L(e) {
  if (e instanceof N) return e;
  if (e != null) {
    if (vr(e)) return ep(e);
    if (mr(e)) return tp(e);
    if (yr(e)) return np(e);
    if (Er(e)) return Dc(e);
    if (Cr(e)) return rp(e);
    if (_r(e)) return op(e);
  }
  throw Ir(e);
}
function ep(e) {
  return new N((t) => {
    let n = e[Rt]();
    if (I(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable",
    );
  });
}
function tp(e) {
  return new N((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function np(e) {
  return new N((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n),
    ).then(null, fr);
  });
}
function rp(e) {
  return new N((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function Dc(e) {
  return new N((t) => {
    ip(e, t).catch((n) => t.error(n));
  });
}
function op(e) {
  return Dc(wr(e));
}
function ip(e, t) {
  var n, r, o, i;
  return vc(this, void 0, void 0, function* () {
    try {
      for (n = Ic(e); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = n.return) && (yield i.call(n));
      } finally {
        if (o) throw o.error;
      }
    }
    t.complete();
  });
}
function ee(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    (n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe());
  }, r);
  if ((e.add(i), !o)) return i;
}
function Tr(e, t = 0) {
  return b((n, r) => {
    n.subscribe(
      T(
        r,
        (o) => ee(r, e, () => r.next(o), t),
        () => ee(r, e, () => r.complete(), t),
        (o) => ee(r, e, () => r.error(o), t),
      ),
    );
  });
}
function br(e, t = 0) {
  return b((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function Cc(e, t) {
  return L(e).pipe(br(t), Tr(t));
}
function wc(e, t) {
  return L(e).pipe(br(t), Tr(t));
}
function _c(e, t) {
  return new N((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function Tc(e, t) {
  return new N((n) => {
    let r;
    return (
      ee(n, t, () => {
        ((r = e[Dr]()),
          ee(
            n,
            t,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              i ? n.complete() : n.next(o);
            },
            0,
            !0,
          ));
      }),
      () => I(r?.return) && r.return()
    );
  });
}
function Nr(e, t) {
  if (!e) throw new Error("Iterable cannot be null");
  return new N((n) => {
    ee(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      ee(
        n,
        t,
        () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function bc(e, t) {
  return Nr(wr(e), t);
}
function Nc(e, t) {
  if (e != null) {
    if (vr(e)) return Cc(e, t);
    if (mr(e)) return _c(e, t);
    if (yr(e)) return wc(e, t);
    if (Er(e)) return Nr(e, t);
    if (Cr(e)) return Tc(e, t);
    if (_r(e)) return bc(e, t);
  }
  throw Ir(e);
}
function Fe(e, t) {
  return t ? Nc(e, t) : L(e);
}
function sp(...e) {
  let t = Le(e);
  return Fe(e, t);
}
function ap(e, t) {
  let n = I(e) ? e : () => e,
    r = (o) => o.error(n());
  return new N(t ? (o) => t.schedule(r, 0, o) : r);
}
function cp(e) {
  return !!e && (e instanceof N || (I(e.lift) && I(e.subscribe)));
}
var Xe = Nt(
  (e) =>
    function () {
      (e(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence"));
    },
);
function et(e, t) {
  return b((n, r) => {
    let o = 0;
    n.subscribe(
      T(r, (i) => {
        r.next(e.call(t, i, o++));
      }),
    );
  });
}
var { isArray: lp } = Array;
function up(e, t) {
  return lp(t) ? e(...t) : e(t);
}
function Mr(e) {
  return et((t) => up(e, t));
}
var { isArray: dp } = Array,
  { getPrototypeOf: fp, prototype: pp, keys: hp } = Object;
function Sr(e) {
  if (e.length === 1) {
    let t = e[0];
    if (dp(t)) return { args: t, keys: null };
    if (gp(t)) {
      let n = hp(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function gp(e) {
  return e && typeof e == "object" && fp(e) === pp;
}
function xr(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function mp(...e) {
  let t = Le(e),
    n = gr(e),
    { args: r, keys: o } = Sr(e);
  if (r.length === 0) return Fe([], t);
  let i = new N(yp(r, t, o ? (s) => xr(o, s) : ne));
  return n ? i.pipe(Mr(n)) : i;
}
function yp(e, t, n = ne) {
  return (r) => {
    Mc(
      t,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          a = o;
        for (let c = 0; c < o; c++)
          Mc(
            t,
            () => {
              let l = Fe(e[c], t),
                u = !1;
              l.subscribe(
                T(
                  r,
                  (d) => {
                    ((i[c] = d),
                      u || ((u = !0), a--),
                      a || r.next(n(i.slice())));
                  },
                  () => {
                    --s || r.complete();
                  },
                ),
              );
            },
            r,
          );
      },
      r,
    );
  };
}
function Mc(e, t, n) {
  e ? ee(n, e, t) : t();
}
function Sc(e, t, n, r, o, i, s, a) {
  let c = [],
    l = 0,
    u = 0,
    d = !1,
    p = () => {
      d && !c.length && !l && t.complete();
    },
    f = (E) => (l < r ? h(E) : c.push(E)),
    h = (E) => {
      (i && t.next(E), l++);
      let x = !1;
      L(n(E, u++)).subscribe(
        T(
          t,
          (w) => {
            (o?.(w), i ? f(w) : t.next(w));
          },
          () => {
            x = !0;
          },
          void 0,
          () => {
            if (x)
              try {
                for (l--; c.length && l < r; ) {
                  let w = c.shift();
                  s ? ee(t, s, () => h(w)) : h(w);
                }
                p();
              } catch (w) {
                t.error(w);
              }
          },
        ),
      );
    };
  return (
    e.subscribe(
      T(t, f, () => {
        ((d = !0), p());
      }),
    ),
    () => {
      a?.();
    }
  );
}
function tt(e, t, n = 1 / 0) {
  return I(t)
    ? tt((r, o) => et((i, s) => t(r, i, o, s))(L(e(r, o))), n)
    : (typeof t == "number" && (n = t), b((r, o) => Sc(r, o, e, n)));
}
function xc(e = 1 / 0) {
  return tt(ne, e);
}
function Rc() {
  return xc(1);
}
function Rr(...e) {
  return Rc()(Fe(e, Le(e)));
}
function vp(e) {
  return new N((t) => {
    L(e()).subscribe(t);
  });
}
function Ep(...e) {
  let t = gr(e),
    { args: n, keys: r } = Sr(e),
    o = new N((i) => {
      let { length: s } = n;
      if (!s) {
        i.complete();
        return;
      }
      let a = new Array(s),
        c = s,
        l = s;
      for (let u = 0; u < s; u++) {
        let d = !1;
        L(n[u]).subscribe(
          T(
            i,
            (p) => {
              (d || ((d = !0), l--), (a[u] = p));
            },
            () => c--,
            void 0,
            () => {
              (!c || !d) && (l || i.next(r ? xr(r, a) : a), i.complete());
            },
          ),
        );
      }
    });
  return t ? o.pipe(Mr(t)) : o;
}
function ln(e, t) {
  return b((n, r) => {
    let o = 0;
    n.subscribe(T(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function Ac(e) {
  return b((t, n) => {
    let r = null,
      o = !1,
      i;
    ((r = t.subscribe(
      T(n, void 0, void 0, (s) => {
        ((i = L(e(s, Ac(e)(t)))),
          r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0));
      }),
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(n)));
  });
}
function Oc(e, t, n, r, o) {
  return (i, s) => {
    let a = n,
      c = t,
      l = 0;
    i.subscribe(
      T(
        s,
        (u) => {
          let d = l++;
          ((c = a ? e(c, u, d) : ((a = !0), u)), r && s.next(c));
        },
        o &&
          (() => {
            (a && s.next(c), s.complete());
          }),
      ),
    );
  };
}
function Ip(e, t) {
  return I(t) ? tt(e, t, 1) : tt(e, 1);
}
function un(e) {
  return b((t, n) => {
    let r = !1;
    t.subscribe(
      T(
        n,
        (o) => {
          ((r = !0), n.next(o));
        },
        () => {
          (r || n.next(e), n.complete());
        },
      ),
    );
  });
}
function ci(e) {
  return e <= 0
    ? () => cn
    : b((t, n) => {
        let r = 0;
        t.subscribe(
          T(n, (o) => {
            ++r <= e && (n.next(o), e <= r && n.complete());
          }),
        );
      });
}
function Ar(e = Dp) {
  return b((t, n) => {
    let r = !1;
    t.subscribe(
      T(
        n,
        (o) => {
          ((r = !0), n.next(o));
        },
        () => (r ? n.complete() : n.error(e())),
      ),
    );
  });
}
function Dp() {
  return new Xe();
}
function Cp(e) {
  return b((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function wp(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? ln((o, i) => e(o, i, r)) : ne,
      ci(1),
      n ? un(t) : Ar(() => new Xe()),
    );
}
function li(e) {
  return e <= 0
    ? () => cn
    : b((t, n) => {
        let r = [];
        t.subscribe(
          T(
            n,
            (o) => {
              (r.push(o), e < r.length && r.shift());
            },
            () => {
              for (let o of r) n.next(o);
              n.complete();
            },
            void 0,
            () => {
              r = null;
            },
          ),
        );
      });
}
function _p(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? ln((o, i) => e(o, i, r)) : ne,
      li(1),
      n ? un(t) : Ar(() => new Xe()),
    );
}
function Tp(e, t) {
  return b(Oc(e, t, arguments.length >= 2, !0));
}
function bp(...e) {
  let t = Le(e);
  return b((n, r) => {
    (t ? Rr(e, n, t) : Rr(e, n)).subscribe(r);
  });
}
function Np(e, t) {
  return b((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    n.subscribe(
      T(
        r,
        (c) => {
          o?.unsubscribe();
          let l = 0,
            u = i++;
          L(e(c, u)).subscribe(
            (o = T(
              r,
              (d) => r.next(t ? t(c, d, u, l++) : d),
              () => {
                ((o = null), a());
              },
            )),
          );
        },
        () => {
          ((s = !0), a());
        },
      ),
    );
  });
}
function Mp(e) {
  return b((t, n) => {
    (L(e).subscribe(T(n, () => n.complete(), sn)), !n.closed && t.subscribe(n));
  });
}
function Sp(e, t, n) {
  let r = I(e) || t || n ? { next: e, error: t, complete: n } : e;
  return r
    ? b((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        o.subscribe(
          T(
            i,
            (c) => {
              var l;
              ((l = r.next) === null || l === void 0 || l.call(r, c),
                i.next(c));
            },
            () => {
              var c;
              ((a = !1),
                (c = r.complete) === null || c === void 0 || c.call(r),
                i.complete());
            },
            (c) => {
              var l;
              ((a = !1),
                (l = r.error) === null || l === void 0 || l.call(r, c),
                i.error(c));
            },
            () => {
              var c, l;
              (a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                (l = r.finalize) === null || l === void 0 || l.call(r));
            },
          ),
        );
      })
    : ne;
}
function kc(e) {
  let t = y(null);
  try {
    return e();
  } finally {
    y(t);
  }
}
var Pc = G(q({}, ze), {
  consumerIsAlwaysLive: !0,
  consumerAllowSignalWrites: !0,
  dirty: !0,
  hasRun: !1,
  kind: "effect",
});
function Lc(e) {
  if (((e.dirty = !1), e.hasRun && !_t(e))) return;
  e.hasRun = !0;
  let t = Qe(e);
  try {
    (e.cleanup(), e.fn());
  } finally {
    wt(e, t);
  }
}
var Ii =
    "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss",
  _ = class extends Error {
    code;
    constructor(t, n) {
      (super(mn(t, n)), (this.code = t));
    }
  };
function xp(e) {
  return `NG0${Math.abs(e)}`;
}
function mn(e, t) {
  return `${xp(e)}${t ? ": " + t : ""}`;
}
function S(e) {
  for (let t in e) if (e[t] === S) return t;
  throw Error("");
}
function Vc(e, t) {
  for (let n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
}
function Te(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return `[${e.map(Te).join(", ")}]`;
  if (e == null) return "" + e;
  let t = e.overriddenName || e.name;
  if (t) return `${t}`;
  let n = e.toString();
  if (n == null) return "" + n;
  let r = n.indexOf(`
`);
  return r >= 0 ? n.slice(0, r) : n;
}
function Fr(e, t) {
  return e ? (t ? `${e} ${t}` : e) : t || "";
}
var Rp = S({ __forward_ref__: S });
function jr(e) {
  return (
    (e.__forward_ref__ = jr),
    (e.toString = function () {
      return Te(this());
    }),
    e
  );
}
function F(e) {
  return Di(e) ? e() : e;
}
function Di(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(Rp) && e.__forward_ref__ === jr
  );
}
function Hc(e, t) {
  e == null && Ci(t, e, null, "!=");
}
function Ci(e, t, n, r) {
  throw new Error(
    `ASSERTION ERROR: ${e}` +
      (r == null ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`),
  );
}
function B(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function Bc(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function yn(e) {
  return Op(e, Vr);
}
function Ap(e) {
  return yn(e) !== null;
}
function Op(e, t) {
  return (e.hasOwnProperty(t) && e[t]) || null;
}
function kp(e) {
  let t = e?.[Vr] ?? null;
  return t || null;
}
function di(e) {
  return e && e.hasOwnProperty(kr) ? e[kr] : null;
}
var Vr = S({ ɵprov: S }),
  kr = S({ ɵinj: S }),
  M = class {
    _desc;
    ngMetadataName = "InjectionToken";
    ɵprov;
    constructor(t, n) {
      ((this._desc = t),
        (this.ɵprov = void 0),
        typeof n == "number"
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = B({
              token: this,
              providedIn: n.providedIn || "root",
              factory: n.factory,
            })));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function wi(e) {
  return e && !!e.ɵproviders;
}
var _i = S({ ɵcmp: S }),
  Ti = S({ ɵdir: S }),
  bi = S({ ɵpipe: S }),
  Ni = S({ ɵmod: S }),
  pn = S({ ɵfac: S }),
  st = S({ __NG_ELEMENT_ID__: S }),
  Fc = S({ __NG_ENV_ID__: S });
function Ot(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function Pr(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
      ? e.type.name || e.type.toString()
      : Ot(e);
}
var Mi = S({ ngErrorCode: S }),
  $c = S({ ngErrorMessage: S }),
  fn = S({ ngTokenPath: S });
function Si(e, t) {
  return Uc("", -200, t);
}
function Hr(e, t) {
  throw new _(-201, !1);
}
function Pp(e, t) {
  e[fn] ??= [];
  let n = e[fn],
    r;
  (typeof t == "object" && "multi" in t && t?.multi === !0
    ? (Hc(t.provide, "Token with multi: true should have a provide property"),
      (r = Pr(t.provide)))
    : (r = Pr(t)),
    n[0] !== r && e[fn].unshift(r));
}
function Lp(e, t) {
  let n = e[fn],
    r = e[Mi],
    o = e[$c] || e.message;
  return ((e.message = jp(o, r, n, t)), e);
}
function Uc(e, t, n) {
  let r = new _(t, e);
  return ((r[Mi] = t), (r[$c] = e), n && (r[fn] = n), r);
}
function Fp(e) {
  return e[Mi];
}
function jp(e, t, n = [], r = null) {
  let o = "";
  n && n.length > 1 && (o = ` Path: ${n.join(" -> ")}.`);
  let i = r ? ` Source: ${r}.` : "";
  return mn(t, `${e}${i}${o}`);
}
var fi;
function qc() {
  return fi;
}
function Z(e) {
  let t = fi;
  return ((fi = e), t);
}
function xi(e, t, n) {
  let r = yn(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & 8) return null;
  if (t !== void 0) return t;
  Hr(e, "Injector");
}
var Vp = {},
  nt = Vp,
  Hp = "__NG_DI_FLAG__",
  pi = class {
    injector;
    constructor(t) {
      this.injector = t;
    }
    retrieve(t, n) {
      let r = rt(n) || 0;
      try {
        return this.injector.get(t, r & 8 ? null : nt, r);
      } catch (o) {
        if (Dt(o)) return o;
        throw o;
      }
    }
  };
function Bp(e, t = 0) {
  let n = Xn();
  if (n === void 0) throw new _(-203, !1);
  if (n === null) return xi(e, void 0, t);
  {
    let r = $p(t),
      o = n.retrieve(e, r);
    if (Dt(o)) {
      if (r.optional) return null;
      throw o;
    }
    return o;
  }
}
function ve(e, t = 0) {
  return (qc() || Bp)(F(e), t);
}
function D(e, t) {
  return ve(e, rt(t));
}
function rt(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function $p(e) {
  return {
    optional: !!(e & 8),
    host: !!(e & 1),
    self: !!(e & 2),
    skipSelf: !!(e & 4),
  };
}
function hi(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = F(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new _(900, !1);
      let o,
        i = 0;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = Up(a);
        typeof c == "number" ? (c === -1 ? (o = a.token) : (i |= c)) : (o = a);
      }
      t.push(ve(o, i));
    } else t.push(ve(r));
  }
  return t;
}
function Up(e) {
  return e[Hp];
}
function je(e, t) {
  let n = e.hasOwnProperty(pn);
  return n ? e[pn] : null;
}
function Gc(e, t, n) {
  if (e.length !== t.length) return !1;
  for (let r = 0; r < e.length; r++) {
    let o = e[r],
      i = t[r];
    if ((n && ((o = n(o)), (i = n(i))), i !== o)) return !1;
  }
  return !0;
}
function Wc(e) {
  return e.flat(Number.POSITIVE_INFINITY);
}
function Br(e, t) {
  e.forEach((n) => (Array.isArray(n) ? Br(n, t) : t(n)));
}
function Ri(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function vn(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function zc(e, t) {
  let n = [];
  for (let r = 0; r < e; r++) n.push(t);
  return n;
}
function Qc(e, t, n, r) {
  let o = e.length;
  if (o == t) e.push(n, r);
  else if (o === 1) (e.push(r, e[0]), (e[0] = n));
  else {
    for (o--, e.push(e[o - 1], e[o]); o > t; ) {
      let i = o - 2;
      ((e[o] = e[i]), o--);
    }
    ((e[t] = n), (e[t + 1] = r));
  }
}
function En(e, t, n) {
  let r = kt(e, t);
  return (r >= 0 ? (e[r | 1] = n) : ((r = ~r), Qc(e, r, t, n)), r);
}
function $r(e, t) {
  let n = kt(e, t);
  if (n >= 0) return e[n | 1];
}
function kt(e, t) {
  return qp(e, t, 1);
}
function qp(e, t, n) {
  let r = 0,
    o = e.length >> n;
  for (; o !== r; ) {
    let i = r + ((o - r) >> 1),
      s = e[i << n];
    if (t === s) return i << n;
    s > t ? (o = i) : (r = i + 1);
  }
  return ~(o << n);
}
var de = {},
  Y = [],
  Be = new M(""),
  Ai = new M("", -1),
  Oi = new M(""),
  hn = class {
    get(t, n = nt) {
      if (n === nt) {
        let o = Uc("", -201);
        throw ((o.name = "\u0275NotFound"), o);
      }
      return n;
    }
  };
function ki(e) {
  return e[Ni] || null;
}
function $e(e) {
  return e[_i] || null;
}
function Ur(e) {
  return e[Ti] || null;
}
function Zc(e) {
  return e[bi] || null;
}
function Pt(e) {
  return { ɵproviders: e };
}
function Yc(e) {
  return Pt([{ provide: Be, multi: !0, useValue: e }]);
}
function Kc(...e) {
  return { ɵproviders: Pi(!0, e), ɵfromNgModule: !0 };
}
function Pi(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    Br(t, (s) => {
      let a = s;
      Lr(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && Jc(o, i),
    n
  );
}
function Jc(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    Li(o, (i) => {
      t(i, r);
    });
  }
}
function Lr(e, t, n, r) {
  if (((e = F(e)), !e)) return !1;
  let o = null,
    i = di(e),
    s = !i && $e(e);
  if (!i && !s) {
    let c = e.ngModule;
    if (((i = di(c)), i)) o = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return !1;
    if ((r.add(o), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let l of c) Lr(l, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let l;
      try {
        Br(i.imports, (u) => {
          Lr(u, t, n, r) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && Jc(l, t);
    }
    if (!a) {
      let l = je(o) || (() => new o());
      (t({ provide: o, useFactory: l, deps: Y }, o),
        t({ provide: Oi, useValue: o, multi: !0 }, o),
        t({ provide: Be, useValue: () => ve(o), multi: !0 }, o));
    }
    let c = i.providers;
    if (c != null && !a) {
      let l = e;
      Li(c, (u) => {
        t(u, l);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function Li(e, t) {
  for (let n of e)
    (wi(n) && (n = n.ɵproviders), Array.isArray(n) ? Li(n, t) : t(n));
}
var Gp = S({ provide: String, useValue: S });
function Xc(e) {
  return e !== null && typeof e == "object" && Gp in e;
}
function Wp(e) {
  return !!(e && e.useExisting);
}
function zp(e) {
  return !!(e && e.useFactory);
}
function ot(e) {
  return typeof e == "function";
}
function el(e) {
  return !!e.useClass;
}
var Fi = new M(""),
  Or = {},
  jc = {},
  ui;
function In() {
  return (ui === void 0 && (ui = new hn()), ui);
}
var oe = class {},
  it = class extends oe {
    parent;
    source;
    scopes;
    records = new Map();
    _ngOnDestroyHooks = new Set();
    _onDestroyHooks = [];
    get destroyed() {
      return this._destroyed;
    }
    _destroyed = !1;
    injectorDefTypes;
    constructor(t, n, r, o) {
      (super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = o),
        mi(t, (s) => this.processProvider(s)),
        this.records.set(Ai, At(void 0, this)),
        o.has("environment") && this.records.set(oe, At(void 0, this)));
      let i = this.records.get(Fi);
      (i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(Oi, Y, { self: !0 }))));
    }
    retrieve(t, n) {
      let r = rt(n) || 0;
      try {
        return this.get(t, nt, r);
      } catch (o) {
        if (Dt(o)) return o;
        throw o;
      }
    }
    destroy() {
      (dn(this), (this._destroyed = !0));
      let t = y(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        (this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          y(t));
      }
    }
    onDestroy(t) {
      return (
        dn(this),
        this._onDestroyHooks.push(t),
        () => this.removeOnDestroy(t)
      );
    }
    runInContext(t) {
      dn(this);
      let n = ye(this),
        r = Z(void 0),
        o;
      try {
        return t();
      } finally {
        (ye(n), Z(r));
      }
    }
    get(t, n = nt, r) {
      if ((dn(this), t.hasOwnProperty(Fc))) return t[Fc](this);
      let o = rt(r),
        i,
        s = ye(this),
        a = Z(void 0);
      try {
        if (!(o & 4)) {
          let l = this.records.get(t);
          if (l === void 0) {
            let u = Jp(t) && yn(t);
            (u && this.injectableDefInScope(u)
              ? (l = At(gi(t), Or))
              : (l = null),
              this.records.set(t, l));
          }
          if (l != null) return this.hydrate(t, l, o);
        }
        let c = o & 2 ? In() : this.parent;
        return ((n = o & 8 && n === nt ? null : n), c.get(t, n));
      } catch (c) {
        let l = Fp(c);
        throw l === -200 || l === -201 ? new _(l, null) : c;
      } finally {
        (Z(a), ye(s));
      }
    }
    resolveInjectorInitializers() {
      let t = y(null),
        n = ye(this),
        r = Z(void 0),
        o;
      try {
        let i = this.get(Be, Y, { self: !0 });
        for (let s of i) s();
      } finally {
        (ye(n), Z(r), y(t));
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(Te(r));
      return `R3Injector[${t.join(", ")}]`;
    }
    processProvider(t) {
      t = F(t);
      let n = ot(t) ? t : F(t && t.provide),
        r = Zp(t);
      if (!ot(t) && t.multi === !0) {
        let o = this.records.get(n);
        (o ||
          ((o = At(void 0, Or, !0)),
          (o.factory = () => hi(o.multi)),
          this.records.set(n, o)),
          (n = t),
          o.multi.push(t));
      }
      this.records.set(n, r);
    }
    hydrate(t, n, r) {
      let o = y(null);
      try {
        if (n.value === jc) throw Si(Te(t));
        return (
          n.value === Or && ((n.value = jc), (n.value = n.factory(void 0, r))),
          typeof n.value == "object" &&
            n.value &&
            Kp(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        y(o);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = F(t.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function gi(e) {
  let t = yn(e),
    n = t !== null ? t.factory : je(e);
  if (n !== null) return n;
  if (e instanceof M) throw new _(204, !1);
  if (e instanceof Function) return Qp(e);
  throw new _(204, !1);
}
function Qp(e) {
  if (e.length > 0) throw new _(204, !1);
  let n = kp(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function Zp(e) {
  if (Xc(e)) return At(void 0, e.useValue);
  {
    let t = ji(e);
    return At(t, Or);
  }
}
function ji(e, t, n) {
  let r;
  if (ot(e)) {
    let o = F(e);
    return je(o) || gi(o);
  } else if (Xc(e)) r = () => F(e.useValue);
  else if (zp(e)) r = () => e.useFactory(...hi(e.deps || []));
  else if (Wp(e))
    r = (o, i) => ve(F(e.useExisting), i !== void 0 && i & 8 ? 8 : void 0);
  else {
    let o = F(e && (e.useClass || e.provide));
    if (Yp(e)) r = () => new o(...hi(e.deps));
    else return je(o) || gi(o);
  }
  return r;
}
function dn(e) {
  if (e.destroyed) throw new _(205, !1);
}
function At(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function Yp(e) {
  return !!e.deps;
}
function Kp(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function Jp(e) {
  return (
    typeof e == "function" ||
    (typeof e == "object" && e.ngMetadataName === "InjectionToken")
  );
}
function mi(e, t) {
  for (let n of e)
    Array.isArray(n) ? mi(n, t) : n && wi(n) ? mi(n.ɵproviders, t) : t(n);
}
function qr(e, t) {
  let n;
  e instanceof it ? (dn(e), (n = e)) : (n = new pi(e));
  let r,
    o = ye(n),
    i = Z(void 0);
  try {
    return t();
  } finally {
    (ye(o), Z(i));
  }
}
function tl() {
  return qc() !== void 0 || Xn() != null;
}
var fe = 0,
  m = 1,
  v = 2,
  j = 3,
  ie = 4,
  K = 5,
  at = 6,
  Lt = 7,
  P = 8,
  ct = 9,
  Ne = 10,
  R = 11,
  Ft = 12,
  Vi = 13,
  lt = 14,
  J = 15,
  Ue = 16,
  ut = 17,
  Ie = 18,
  Dn = 19,
  Hi = 20,
  _e = 21,
  Gr = 22,
  Me = 23,
  re = 24,
  Wr = 25,
  k = 26,
  nl = 1,
  Bi = 6,
  qe = 7,
  Cn = 8,
  dt = 9,
  $ = 10;
function De(e) {
  return Array.isArray(e) && typeof e[nl] == "object";
}
function pe(e) {
  return Array.isArray(e) && e[nl] === !0;
}
function $i(e) {
  return (e.flags & 4) !== 0;
}
function Se(e) {
  return e.componentOffset > -1;
}
function jt(e) {
  return (e.flags & 1) === 1;
}
function he(e) {
  return !!e.template;
}
function Vt(e) {
  return (e[v] & 512) !== 0;
}
function ft(e) {
  return (e[v] & 256) === 256;
}
var Ui = "svg",
  rl = "math";
function se(e) {
  for (; Array.isArray(e); ) e = e[fe];
  return e;
}
function qi(e, t) {
  return se(t[e]);
}
function ae(e, t) {
  return se(t[e.index]);
}
function wn(e, t) {
  return e.data[t];
}
function Gi(e, t) {
  return e[t];
}
function Wi(e, t, n, r) {
  (n >= e.data.length && ((e.data[n] = null), (e.blueprint[n] = null)),
    (t[n] = r));
}
function ce(e, t) {
  let n = t[e];
  return De(n) ? n : n[fe];
}
function ol(e) {
  return (e[v] & 4) === 4;
}
function zr(e) {
  return (e[v] & 128) === 128;
}
function il(e) {
  return pe(e[j]);
}
function le(e, t) {
  return t == null ? null : e[t];
}
function zi(e) {
  e[ut] = 0;
}
function Qi(e) {
  e[v] & 1024 || ((e[v] |= 1024), zr(e) && pt(e));
}
function sl(e, t) {
  for (; e > 0; ) ((t = t[lt]), e--);
  return t;
}
function _n(e) {
  return !!(e[v] & 9216 || e[re]?.dirty);
}
function Qr(e) {
  (e[Ne].changeDetectionScheduler?.notify(8),
    e[v] & 64 && (e[v] |= 1024),
    _n(e) && pt(e));
}
function pt(e) {
  e[Ne].changeDetectionScheduler?.notify(0);
  let t = Ve(e);
  for (; t !== null && !(t[v] & 8192 || ((t[v] |= 8192), !zr(t))); ) t = Ve(t);
}
function Zi(e, t) {
  if (ft(e)) throw new _(911, !1);
  (e[_e] === null && (e[_e] = []), e[_e].push(t));
}
function al(e, t) {
  if (e[_e] === null) return;
  let n = e[_e].indexOf(t);
  n !== -1 && e[_e].splice(n, 1);
}
function Ve(e) {
  let t = e[j];
  return pe(t) ? t[j] : t;
}
function Yi(e) {
  return (e[Lt] ??= []);
}
function Ki(e) {
  return (e.cleanup ??= []);
}
function cl(e, t, n, r) {
  let o = Yi(t);
  (o.push(n), e.firstCreatePass && Ki(e).push(r, o.length - 1));
}
var C = { lFrame: Cl(null), bindingsEnabled: !0, skipHydrationRootTNode: null },
  Tn = (function (e) {
    return (
      (e[(e.Off = 0)] = "Off"),
      (e[(e.Exhaustive = 1)] = "Exhaustive"),
      (e[(e.OnlyDirtyViews = 2)] = "OnlyDirtyViews"),
      e
    );
  })(Tn || {}),
  Xp = 0,
  yi = !1;
function ll() {
  return C.lFrame.elementDepthCount;
}
function ul() {
  C.lFrame.elementDepthCount++;
}
function Ji() {
  C.lFrame.elementDepthCount--;
}
function Zr() {
  return C.bindingsEnabled;
}
function Xi() {
  return C.skipHydrationRootTNode !== null;
}
function es(e) {
  return C.skipHydrationRootTNode === e;
}
function ts() {
  C.skipHydrationRootTNode = null;
}
function g() {
  return C.lFrame.lView;
}
function O() {
  return C.lFrame.tView;
}
function dl(e) {
  return ((C.lFrame.contextLView = e), e[P]);
}
function fl(e) {
  return ((C.lFrame.contextLView = null), e);
}
function U() {
  let e = ns();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function ns() {
  return C.lFrame.currentTNode;
}
function pl() {
  let e = C.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function Ht(e, t) {
  let n = C.lFrame;
  ((n.currentTNode = e), (n.isParent = t));
}
function rs() {
  return C.lFrame.isParent;
}
function os() {
  C.lFrame.isParent = !1;
}
function hl() {
  return C.lFrame.contextLView;
}
function is(e) {
  (Ci("Must never be called in production mode"), (Xp = e));
}
function ss() {
  return yi;
}
function Bt(e) {
  let t = yi;
  return ((yi = e), t);
}
function ge() {
  let e = C.lFrame,
    t = e.bindingRootIndex;
  return (t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t);
}
function gl() {
  return C.lFrame.bindingIndex;
}
function ml(e) {
  return (C.lFrame.bindingIndex = e);
}
function xe() {
  return C.lFrame.bindingIndex++;
}
function Yr(e) {
  let t = C.lFrame,
    n = t.bindingIndex;
  return ((t.bindingIndex = t.bindingIndex + e), n);
}
function yl() {
  return C.lFrame.inI18n;
}
function vl(e, t) {
  let n = C.lFrame;
  ((n.bindingIndex = n.bindingRootIndex = e), Kr(t));
}
function El() {
  return C.lFrame.currentDirectiveIndex;
}
function Kr(e) {
  C.lFrame.currentDirectiveIndex = e;
}
function Il(e) {
  let t = C.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function as() {
  return C.lFrame.currentQueryIndex;
}
function Jr(e) {
  C.lFrame.currentQueryIndex = e;
}
function eh(e) {
  let t = e[m];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[K] : null;
}
function cs(e, t, n) {
  if (n & 4) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & 1); )
      if (((o = eh(i)), o === null || ((i = i[lt]), o.type & 10))) break;
    if (o === null) return !1;
    ((t = o), (e = i));
  }
  let r = (C.lFrame = Dl());
  return ((r.currentTNode = t), (r.lView = e), !0);
}
function Xr(e) {
  let t = Dl(),
    n = e[m];
  ((C.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1));
}
function Dl() {
  let e = C.lFrame,
    t = e === null ? null : e.child;
  return t === null ? Cl(e) : t;
}
function Cl(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return (e !== null && (e.child = t), t);
}
function wl() {
  let e = C.lFrame;
  return ((C.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e);
}
var ls = wl;
function eo() {
  let e = wl();
  ((e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0));
}
function _l(e) {
  return (C.lFrame.contextLView = sl(e, C.lFrame.contextLView))[P];
}
function Ce() {
  return C.lFrame.selectedIndex;
}
function Ge(e) {
  C.lFrame.selectedIndex = e;
}
function $t() {
  let e = C.lFrame;
  return wn(e.tView, e.selectedIndex);
}
function Tl() {
  C.lFrame.currentNamespace = Ui;
}
function bl() {
  return C.lFrame.currentNamespace;
}
var Nl = !0;
function to() {
  return Nl;
}
function bn(e) {
  Nl = e;
}
var th = { elements: void 0 };
function Ml() {
  return th;
}
function vi(e, t = null, n = null, r) {
  let o = us(e, t, n, r);
  return (o.resolveInjectorInitializers(), o);
}
function us(e, t = null, n = null, r, o = new Set()) {
  let i = [n || Y, Kc(e)];
  return (
    (r = r || (typeof e == "object" ? void 0 : Te(e))),
    new it(i, t || In(), r || null, o)
  );
}
var be = class e {
    static THROW_IF_NOT_FOUND = nt;
    static NULL = new hn();
    static create(t, n) {
      if (Array.isArray(t)) return vi({ name: "" }, n, t, "");
      {
        let r = t.name ?? "";
        return vi({ name: r }, t.parent, t.providers, r);
      }
    }
    static ɵprov = B({ token: e, providedIn: "any", factory: () => ve(Ai) });
    static __NG_ELEMENT_ID__ = -1;
  },
  Sl = new M(""),
  ht = (() => {
    class e {
      static __NG_ELEMENT_ID__ = nh;
      static __NG_ENV_ID__ = (n) => n;
    }
    return e;
  })(),
  gn = class extends ht {
    _lView;
    constructor(t) {
      (super(), (this._lView = t));
    }
    get destroyed() {
      return ft(this._lView);
    }
    onDestroy(t) {
      let n = this._lView;
      return (Zi(n, t), () => al(n, t));
    }
  };
function nh() {
  return new gn(g());
}
var He = class {
    _console = console;
    handleError(t) {
      this._console.error("ERROR", t);
    }
  },
  Re = new M("", {
    providedIn: "root",
    factory: () => {
      let e = D(oe),
        t;
      return (n) => {
        e.destroyed && !t
          ? setTimeout(() => {
              throw n;
            })
          : ((t ??= e.get(He)), t.handleError(n));
      };
    },
  }),
  xl = { provide: Be, useValue: () => void D(He), multi: !0 },
  rh = new M("", {
    providedIn: "root",
    factory: () => {
      let e = D(Sl).defaultView;
      if (!e) return;
      let t = D(Re),
        n = (i) => {
          (t(i.reason), i.preventDefault());
        },
        r = (i) => {
          (i.error ? t(i.error) : t(new Error(i.message, { cause: i })),
            i.preventDefault());
        },
        o = () => {
          (e.addEventListener("unhandledrejection", n),
            e.addEventListener("error", r));
        };
      (typeof Zone < "u" ? Zone.root.run(o) : o(),
        D(ht).onDestroy(() => {
          (e.removeEventListener("error", r),
            e.removeEventListener("unhandledrejection", n));
        }));
    },
  });
function oh() {
  return Pt([Yc(() => void D(rh))]);
}
function ds(e) {
  return typeof e == "function" && e[z] !== void 0;
}
function fs(e, t) {
  let [n, r, o] = Yo(e, t?.equal),
    i = n,
    s = i[z];
  return ((i.set = r), (i.update = o), (i.asReadonly = ps.bind(i)), i);
}
function ps() {
  let e = this[z];
  if (e.readonlyFn === void 0) {
    let t = () => this();
    ((t[z] = e), (e.readonlyFn = t));
  }
  return e.readonlyFn;
}
function hs(e) {
  return ds(e) && typeof e.set == "function";
}
var Ee = class {},
  Nn = new M("", { providedIn: "root", factory: () => !1 });
var gs = new M(""),
  no = new M("");
var Mn = (() => {
  class e {
    view;
    node;
    constructor(n, r) {
      ((this.view = n), (this.node = r));
    }
    static __NG_ELEMENT_ID__ = ih;
  }
  return e;
})();
function ih() {
  return new Mn(g(), U());
}
var gt = (() => {
  class e {
    taskId = 0;
    pendingTasks = new Set();
    destroyed = !1;
    pendingTask = new an(!1);
    get hasPendingTasks() {
      return this.destroyed ? !1 : this.pendingTask.value;
    }
    get hasPendingTasksObservable() {
      return this.destroyed
        ? new N((n) => {
            (n.next(!1), n.complete());
          })
        : this.pendingTask;
    }
    add() {
      !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0);
      let n = this.taskId++;
      return (this.pendingTasks.add(n), n);
    }
    has(n) {
      return this.pendingTasks.has(n);
    }
    remove(n) {
      (this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this.hasPendingTasks &&
          this.pendingTask.next(!1));
    }
    ngOnDestroy() {
      (this.pendingTasks.clear(),
        this.hasPendingTasks && this.pendingTask.next(!1),
        (this.destroyed = !0),
        this.pendingTask.unsubscribe());
    }
    static ɵprov = B({ token: e, providedIn: "root", factory: () => new e() });
  }
  return e;
})();
function mt(...e) {}
var Sn = (() => {
    class e {
      static ɵprov = B({
        token: e,
        providedIn: "root",
        factory: () => new Ei(),
      });
    }
    return e;
  })(),
  Ei = class {
    dirtyEffectCount = 0;
    queues = new Map();
    add(t) {
      (this.enqueue(t), this.schedule(t));
    }
    schedule(t) {
      t.dirty && this.dirtyEffectCount++;
    }
    remove(t) {
      let n = t.zone,
        r = this.queues.get(n);
      r.has(t) && (r.delete(t), t.dirty && this.dirtyEffectCount--);
    }
    enqueue(t) {
      let n = t.zone;
      this.queues.has(n) || this.queues.set(n, new Set());
      let r = this.queues.get(n);
      r.has(t) || r.add(t);
    }
    flush() {
      for (; this.dirtyEffectCount > 0; ) {
        let t = !1;
        for (let [n, r] of this.queues)
          n === null
            ? (t ||= this.flushQueue(r))
            : (t ||= n.run(() => this.flushQueue(r)));
        t || (this.dirtyEffectCount = 0);
      }
    }
    flushQueue(t) {
      let n = !1;
      for (let r of t) r.dirty && (this.dirtyEffectCount--, (n = !0), r.run());
      return n;
    }
  };
function Bn(e) {
  return { toString: e }.toString();
}
function hh(e) {
  return typeof e == "function";
}
var co = class {
  previousValue;
  currentValue;
  firstChange;
  constructor(t, n, r) {
    ((this.previousValue = t), (this.currentValue = n), (this.firstChange = r));
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function cu(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
var gh = (() => {
  let e = () => lu;
  return ((e.ngInherit = !0), e);
})();
function lu(e) {
  return (e.type.prototype.ngOnChanges && (e.setInput = yh), mh);
}
function mh() {
  let e = du(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === de) e.previous = t;
    else for (let r in t) n[r] = t[r];
    ((e.current = null), this.ngOnChanges(t));
  }
}
function yh(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = du(e) || vh(e, { previous: de, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    l = c[i];
  ((a[i] = new co(l && l.currentValue, n, c === de)), cu(e, t, o, n));
}
var uu = "__ngSimpleChanges__";
function du(e) {
  return e[uu] || null;
}
function vh(e, t) {
  return (e[uu] = t);
}
var Rl = [];
var A = function (e, t = null, n) {
  for (let r = 0; r < Rl.length; r++) {
    let o = Rl[r];
    o(e, t, n);
  }
};
function Eh(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = lu(t);
    ((n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s));
  }
  (o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i)));
}
function fu(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: l,
        ngOnDestroy: u,
      } = i;
    (s && (e.contentHooks ??= []).push(-n, s),
      a &&
        ((e.contentHooks ??= []).push(n, a),
        (e.contentCheckHooks ??= []).push(n, a)),
      c && (e.viewHooks ??= []).push(-n, c),
      l &&
        ((e.viewHooks ??= []).push(n, l), (e.viewCheckHooks ??= []).push(n, l)),
      u != null && (e.destroyHooks ??= []).push(n, u));
  }
}
function oo(e, t, n) {
  pu(e, t, 3, n);
}
function io(e, t, n, r) {
  (e[v] & 3) === n && pu(e, t, n, r);
}
function ms(e, t) {
  let n = e[v];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[v] = n));
}
function pu(e, t, n, r) {
  let o = r !== void 0 ? e[ut] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let c = o; c < s; c++)
    if (typeof t[c + 1] == "number") {
      if (((a = t[c]), r != null && a >= r)) break;
    } else
      (t[c] < 0 && (e[ut] += 65536),
        (a < i || i == -1) &&
          (Ih(e, n, t, c), (e[ut] = (e[ut] & 4294901760) + c + 2)),
        c++);
}
function Al(e, t) {
  A(4, e, t);
  let n = y(null);
  try {
    t.call(e);
  } finally {
    (y(n), A(5, e, t));
  }
}
function Ih(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s];
  o
    ? e[v] >> 14 < e[ut] >> 16 &&
      (e[v] & 3) === t &&
      ((e[v] += 16384), Al(a, i))
    : Al(a, i);
}
var qt = -1,
  vt = class {
    factory;
    name;
    injectImpl;
    resolving = !1;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(t, n, r, o) {
      ((this.factory = t),
        (this.name = o),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r));
    }
  };
function Dh(e) {
  return (e.flags & 8) !== 0;
}
function Ch(e) {
  return (e.flags & 16) !== 0;
}
function wh(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let o = n[r];
    if (typeof o == "number") {
      if (o !== 0) break;
      r++;
      let i = n[r++],
        s = n[r++],
        a = n[r++];
      e.setAttribute(t, s, a, i);
    } else {
      let i = o,
        s = n[++r];
      (Th(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++);
    }
  }
  return r;
}
function _h(e) {
  return e === 3 || e === 4 || e === 6;
}
function Th(e) {
  return e.charCodeAt(0) === 64;
}
function Gt(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == "number"
          ? (n = o)
          : n === 0 ||
            (n === -1 || n === 2
              ? Ol(e, n, o, null, t[++r])
              : Ol(e, n, o, null, null));
      }
    }
  return e;
}
function Ol(e, t, n, r, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == "number") {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == "number") break;
    if (a === n) {
      o !== null && (e[i + 1] = o);
      return;
    }
    (i++, o !== null && i++);
  }
  (s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    o !== null && e.splice(i++, 0, o));
}
function hu(e) {
  return e !== qt;
}
function lo(e) {
  return e & 32767;
}
function bh(e) {
  return e >> 16;
}
function uo(e, t) {
  let n = bh(e),
    r = t;
  for (; n > 0; ) ((r = r[lt]), n--);
  return r;
}
var Ms = !0;
function fo(e) {
  let t = Ms;
  return ((Ms = e), t);
}
var Nh = 256,
  gu = Nh - 1,
  mu = 5,
  Mh = 0,
  we = {};
function Sh(e, t, n) {
  let r;
  (typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(st) && (r = n[st]),
    r == null && (r = n[st] = Mh++));
  let o = r & gu,
    i = 1 << o;
  t.data[e + (o >> mu)] |= i;
}
function po(e, t) {
  let n = yu(e, t);
  if (n !== -1) return n;
  let r = t[m];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    ys(r.data, e),
    ys(t, null),
    ys(r.blueprint, null));
  let o = sa(e, t),
    i = e.injectorIndex;
  if (hu(o)) {
    let s = lo(o),
      a = uo(o, t),
      c = a[m].data;
    for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | c[s + l];
  }
  return ((t[i + 8] = o), i);
}
function ys(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function yu(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function sa(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = Cu(o)), r === null)) return qt;
    if ((n++, (o = o[lt]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return qt;
}
function Ss(e, t, n) {
  Sh(e, t, n);
}
function vu(e, t, n) {
  if (n & 8 || e !== void 0) return e;
  Hr(t, "NodeInjector");
}
function Eu(e, t, n, r) {
  if ((n & 8 && r === void 0 && (r = null), (n & 3) === 0)) {
    let o = e[ct],
      i = Z(void 0);
    try {
      return o ? o.get(t, r, n & 8) : xi(t, r, n & 8);
    } finally {
      Z(i);
    }
  }
  return vu(r, t, n);
}
function Iu(e, t, n, r = 0, o) {
  if (e !== null) {
    if (t[v] & 2048 && !(r & 2)) {
      let s = kh(e, t, n, r, we);
      if (s !== we) return s;
    }
    let i = Du(e, t, n, r, we);
    if (i !== we) return i;
  }
  return Eu(t, n, r, o);
}
function Du(e, t, n, r, o) {
  let i = Rh(n);
  if (typeof i == "function") {
    if (!cs(t, e, r)) return r & 1 ? vu(o, n, r) : Eu(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & 8))) Hr(n);
      else return s;
    } finally {
      ls();
    }
  } else if (typeof i == "number") {
    let s = null,
      a = yu(e, t),
      c = qt,
      l = r & 1 ? t[J][K] : null;
    for (
      (a === -1 || r & 4) &&
      ((c = a === -1 ? sa(e, t) : t[a + 8]),
      c === qt || !Pl(r, !1)
        ? (a = -1)
        : ((s = t[m]), (a = lo(c)), (t = uo(c, t))));
      a !== -1;

    ) {
      let u = t[m];
      if (kl(i, a, u.data)) {
        let d = xh(a, t, n, s, r, l);
        if (d !== we) return d;
      }
      ((c = t[a + 8]),
        c !== qt && Pl(r, t[m].data[a + 8] === l) && kl(i, a, t)
          ? ((s = u), (a = lo(c)), (t = uo(c, t)))
          : (a = -1));
    }
  }
  return o;
}
function xh(e, t, n, r, o, i) {
  let s = t[m],
    a = s.data[e + 8],
    c = r == null ? Se(a) && Ms : r != s && (a.type & 3) !== 0,
    l = o & 1 && i === a,
    u = so(a, s, n, c, l);
  return u !== null ? An(t, s, u, a, o) : we;
}
function so(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    c = e.directiveStart,
    l = e.directiveEnd,
    u = i >> 20,
    d = r ? a : a + u,
    p = o ? a + u : l;
  for (let f = d; f < p; f++) {
    let h = s[f];
    if ((f < c && n === h) || (f >= c && h.type === n)) return f;
  }
  if (o) {
    let f = s[c];
    if (f && he(f) && f.type === n) return c;
  }
  return null;
}
function An(e, t, n, r, o) {
  let i = e[n],
    s = t.data;
  if (i instanceof vt) {
    let a = i;
    if (a.resolving) {
      let f = Pr(s[n]);
      throw Si(f);
    }
    let c = fo(a.canSeeViewProviders);
    a.resolving = !0;
    let l = s[n].type || s[n],
      u,
      d = a.injectImpl ? Z(a.injectImpl) : null,
      p = cs(e, r, 0);
    try {
      ((i = e[n] = a.factory(void 0, o, s, e, r)),
        t.firstCreatePass && n >= r.directiveStart && Eh(n, s[n], t));
    } finally {
      (d !== null && Z(d), fo(c), (a.resolving = !1), ls());
    }
  }
  return i;
}
function Rh(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(st) ? e[st] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & gu : Ah) : t;
}
function kl(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> mu)] & r);
}
function Pl(e, t) {
  return !(e & 2) && !(e & 1 && t);
}
var yt = class {
  _tNode;
  _lView;
  constructor(t, n) {
    ((this._tNode = t), (this._lView = n));
  }
  get(t, n, r) {
    return Iu(this._tNode, this._lView, t, rt(r), n);
  }
};
function Ah() {
  return new yt(U(), g());
}
function Oh(e) {
  return Bn(() => {
    let t = e.prototype.constructor,
      n = t[pn] || xs(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[pn] || xs(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function xs(e) {
  return Di(e)
    ? () => {
        let t = xs(F(e));
        return t && t();
      }
    : je(e);
}
function kh(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[v] & 2048 && !Vt(s); ) {
    let a = Du(i, s, n, r | 2, we);
    if (a !== we) return a;
    let c = i.parent;
    if (!c) {
      let l = s[Hi];
      if (l) {
        let u = l.get(n, we, r);
        if (u !== we) return u;
      }
      ((c = Cu(s)), (s = s[lt]));
    }
    i = c;
  }
  return o;
}
function Cu(e) {
  let t = e[m],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[K] : null;
}
function Ph() {
  return en(U(), g());
}
function en(e, t) {
  return new $n(ae(e, t));
}
var $n = (() => {
  class e {
    nativeElement;
    constructor(n) {
      this.nativeElement = n;
    }
    static __NG_ELEMENT_ID__ = Ph;
  }
  return e;
})();
function Lh(e) {
  return e instanceof $n ? e.nativeElement : e;
}
function Fh() {
  return this._results[Symbol.iterator]();
}
var ho = class {
  _emitDistinctChangesOnly;
  dirty = !0;
  _onDirty = void 0;
  _results = [];
  _changesDetected = !1;
  _changes = void 0;
  length = 0;
  first = void 0;
  last = void 0;
  get changes() {
    return (this._changes ??= new Pe());
  }
  constructor(t = !1) {
    this._emitDistinctChangesOnly = t;
  }
  get(t) {
    return this._results[t];
  }
  map(t) {
    return this._results.map(t);
  }
  filter(t) {
    return this._results.filter(t);
  }
  find(t) {
    return this._results.find(t);
  }
  reduce(t, n) {
    return this._results.reduce(t, n);
  }
  forEach(t) {
    this._results.forEach(t);
  }
  some(t) {
    return this._results.some(t);
  }
  toArray() {
    return this._results.slice();
  }
  toString() {
    return this._results.toString();
  }
  reset(t, n) {
    this.dirty = !1;
    let r = Wc(t);
    (this._changesDetected = !Gc(this._results, r, n)) &&
      ((this._results = r),
      (this.length = r.length),
      (this.last = r[this.length - 1]),
      (this.first = r[0]));
  }
  notifyOnChanges() {
    this._changes !== void 0 &&
      (this._changesDetected || !this._emitDistinctChangesOnly) &&
      this._changes.next(this);
  }
  onDirty(t) {
    this._onDirty = t;
  }
  setDirty() {
    ((this.dirty = !0), this._onDirty?.());
  }
  destroy() {
    this._changes !== void 0 &&
      (this._changes.complete(), this._changes.unsubscribe());
  }
  [Symbol.iterator] = Fh;
};
function wu(e) {
  return (e.flags & 128) === 128;
}
var aa = (function (e) {
    return (
      (e[(e.OnPush = 0)] = "OnPush"),
      (e[(e.Default = 1)] = "Default"),
      e
    );
  })(aa || {}),
  _u = new Map(),
  jh = 0;
function Vh() {
  return jh++;
}
function Hh(e) {
  _u.set(e[Dn], e);
}
function Rs(e) {
  _u.delete(e[Dn]);
}
var Ll = "__ngContext__";
function Wt(e, t) {
  De(t) ? ((e[Ll] = t[Dn]), Hh(t)) : (e[Ll] = t);
}
function Tu(e) {
  return Nu(e[Ft]);
}
function bu(e) {
  return Nu(e[ie]);
}
function Nu(e) {
  for (; e !== null && !pe(e); ) e = e[ie];
  return e;
}
var As;
function Bh(e) {
  As = e;
}
function Mu() {
  if (As !== void 0) return As;
  if (typeof document < "u") return document;
  throw new _(210, !1);
}
var $h = new M("", { providedIn: "root", factory: () => Uh }),
  Uh = "ng",
  Su = new M(""),
  qh = new M("", { providedIn: "platform", factory: () => "unknown" });
var Gh = new M(""),
  Wh = new M("", {
    providedIn: "root",
    factory: () =>
      Mu().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
      null,
  });
var zh = "h",
  Qh = "b";
var xu = "r";
var Ru = "di";
var Au = !1,
  Ou = new M("", { providedIn: "root", factory: () => Au });
var Zh = (e, t, n, r) => {};
function Yh(e, t, n, r) {
  Zh(e, t, n, r);
}
function So(e) {
  return (e.flags & 32) === 32;
}
var Kh = () => null;
function ku(e, t, n = !1) {
  return Kh(e, t, n);
}
function Pu(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = y(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          (Jr(i), a.contentQueries(2, t[s], s));
        }
      }
    } finally {
      y(r);
    }
  }
}
function Os(e, t, n) {
  Jr(0);
  let r = y(null);
  try {
    t(e, n);
  } finally {
    y(r);
  }
}
function ca(e, t, n) {
  if ($i(t)) {
    let r = y(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let c = n[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      y(r);
    }
  }
}
var zt = (function (e) {
  return (
    (e[(e.Emulated = 0)] = "Emulated"),
    (e[(e.None = 2)] = "None"),
    (e[(e.ShadowDom = 3)] = "ShadowDom"),
    e
  );
})(zt || {});
var ks = class {
  changingThisBreaksApplicationSecurity;
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Ii})`;
  }
};
function xo(e) {
  return e instanceof ks ? e.changingThisBreaksApplicationSecurity : e;
}
var Jh = /^>|^->|<!--|-->|--!>|<!-$/g,
  Xh = /(<|>)/g,
  eg = "\u200B$1\u200B";
function tg(e) {
  return e.replace(Jh, (t) => t.replace(Xh, eg));
}
function Lu(e) {
  return e instanceof Function ? e() : e;
}
function ng(e, t, n) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(t, n);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    n = o + 1;
  }
}
var Fu = "ng-template";
function rg(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == "string"; o += 2)
      if (t[o] === "class" && ng(t[o + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (la(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == "string"; )
      if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function la(e) {
  return e.type === 4 && e.value !== Fu;
}
function og(e, t, n) {
  let r = e.type === 4 && !n ? Fu : e.value;
  return t === r;
}
function ig(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? cg(o) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == "number") {
      if (!s && !me(r) && !me(c)) return !1;
      if (s && me(c)) continue;
      ((s = !1), (r = c | (r & 1)));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== "" && !og(e, c, n)) || (c === "" && t.length === 1))
        ) {
          if (me(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !rg(e, o, c, n)) {
          if (me(r)) return !1;
          s = !0;
        }
      } else {
        let l = t[++a],
          u = sg(c, o, la(e), n);
        if (u === -1) {
          if (me(r)) return !1;
          s = !0;
          continue;
        }
        if (l !== "") {
          let d;
          if (
            (u > i ? (d = "") : (d = o[u + 1].toLowerCase()), r & 2 && l !== d)
          ) {
            if (me(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return me(r) || s;
}
function me(e) {
  return (e & 1) === 0;
}
function sg(e, t, n, r) {
  if (t === null) return -1;
  let o = 0;
  if (r || !n) {
    let i = !1;
    for (; o < t.length; ) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = t[++o];
        for (; typeof a == "string"; ) a = t[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return lg(t, e);
}
function ju(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (ig(e, t[r], n)) return !0;
  return !1;
}
function ag(e) {
  let t = e.attrs;
  if (t != null) {
    let n = t.indexOf(5);
    if ((n & 1) === 0) return t[n + 1];
  }
  return null;
}
function cg(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (_h(n)) return t;
  }
  return e.length;
}
function lg(e, t) {
  let n = e.indexOf(4);
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == "number") return -1;
      if (r === t) return n;
      n++;
    }
  return -1;
}
function ug(e, t) {
  e: for (let n = 0; n < t.length; n++) {
    let r = t[n];
    if (e.length === r.length) {
      for (let o = 0; o < e.length; o++) if (e[o] !== r[o]) continue e;
      return !0;
    }
  }
  return !1;
}
function Fl(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function dg(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = "",
    i = !1;
  for (; n < e.length; ) {
    let s = e[n];
    if (typeof s == "string")
      if (r & 2) {
        let a = e[++n];
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (o += "." + s) : r & 4 && (o += " " + s);
    else
      (o !== "" && !me(s) && ((t += Fl(i, o)), (o = "")),
        (r = s),
        (i = i || !me(r)));
    n++;
  }
  return (o !== "" && (t += Fl(i, o)), t);
}
function fg(e) {
  return e.map(dg).join(",");
}
function pg(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == "string")
      o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
    else {
      if (!me(o)) break;
      o = i;
    }
    r++;
  }
  return (n.length && t.push(1, ...n), t);
}
var X = {};
function hg(e, t) {
  return e.createText(t);
}
function gg(e, t, n) {
  e.setValue(t, n);
}
function mg(e, t) {
  return e.createComment(tg(t));
}
function Vu(e, t, n) {
  return e.createElement(t, n);
}
function go(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function Hu(e, t, n) {
  e.appendChild(t, n);
}
function jl(e, t, n, r, o) {
  r !== null ? go(e, t, n, r, o) : Hu(e, t, n);
}
function Bu(e, t, n) {
  e.removeChild(null, t, n);
}
function yg(e, t, n) {
  e.setAttribute(t, "style", n);
}
function vg(e, t, n) {
  n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function $u(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  (r !== null && wh(e, t, r),
    o !== null && vg(e, t, o),
    i !== null && yg(e, t, i));
}
function ua(e, t, n, r, o, i, s, a, c, l, u) {
  let d = k + r,
    p = d + o,
    f = Eg(d, p),
    h = typeof l == "function" ? l() : l;
  return (f[m] = {
    type: e,
    blueprint: f,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: p,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == "function" ? i() : i,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: h,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function Eg(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : X);
  return n;
}
function Ig(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = ua(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id,
      ))
    : t;
}
function da(e, t, n, r, o, i, s, a, c, l, u) {
  let d = t.blueprint.slice();
  return (
    (d[fe] = o),
    (d[v] = r | 4 | 128 | 8 | 64 | 1024),
    (l !== null || (e && e[v] & 2048)) && (d[v] |= 2048),
    zi(d),
    (d[j] = d[lt] = e),
    (d[P] = n),
    (d[Ne] = s || (e && e[Ne])),
    (d[R] = a || (e && e[R])),
    (d[ct] = c || (e && e[ct]) || null),
    (d[K] = i),
    (d[Dn] = Vh()),
    (d[at] = u),
    (d[Hi] = l),
    (d[J] = t.type == 2 ? e[J] : d),
    d
  );
}
function Dg(e, t, n) {
  let r = ae(t, e),
    o = Ig(n),
    i = e[Ne].rendererFactory,
    s = fa(
      e,
      da(
        e,
        o,
        null,
        Uu(n),
        r,
        t,
        null,
        i.createRenderer(r, n),
        null,
        null,
        null,
      ),
    );
  return (e[t.index] = s);
}
function Uu(e) {
  let t = 16;
  return (e.signals ? (t = 4096) : e.onPush && (t = 64), t);
}
function qu(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++)
    (t.push(r), e.blueprint.push(r), e.data.push(null));
  return o;
}
function fa(e, t) {
  return (e[Ft] ? (e[Vi][ie] = t) : (e[Ft] = t), (e[Vi] = t), t);
}
function Cg(e = 1) {
  Gu(O(), g(), Ce() + e, !1);
}
function Gu(e, t, n, r) {
  if (!r)
    if ((t[v] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && oo(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && io(t, i, 0, n);
    }
  Ge(n);
}
var Ro = (function (e) {
  return (
    (e[(e.None = 0)] = "None"),
    (e[(e.SignalBased = 1)] = "SignalBased"),
    (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
    e
  );
})(Ro || {});
function Ps(e, t, n, r) {
  let o = y(null);
  try {
    let [i, s, a] = e.inputs[n],
      c = null;
    ((s & Ro.SignalBased) !== 0 && (c = t[i][z]),
      c !== null && c.transformFn !== void 0
        ? (r = c.transformFn(r))
        : a !== null && (r = a.call(t, r)),
      e.setInput !== null ? e.setInput(t, c, r, n, i) : cu(t, c, i, r));
  } finally {
    y(o);
  }
}
var mo = (function (e) {
    return (
      (e[(e.Important = 1)] = "Important"),
      (e[(e.DashCase = 2)] = "DashCase"),
      e
    );
  })(mo || {}),
  wg;
function pa(e, t) {
  return wg(e, t);
}
function Ut(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    pe(r) ? (i = r) : De(r) && ((s = !0), (r = r[fe]));
    let a = se(r);
    (e === 0 && n !== null
      ? o == null
        ? Hu(t, n, a)
        : go(t, n, a, o || null, !0)
      : e === 1 && n !== null
        ? go(t, n, a, o || null, !0)
        : e === 2
          ? Bu(t, a, s)
          : e === 3 && t.destroyNode(a),
      i != null && Og(t, e, i, n, o));
  }
}
function _g(e, t) {
  (Wu(e, t), (t[fe] = null), (t[K] = null));
}
function Tg(e, t, n, r, o, i) {
  ((r[fe] = o), (r[K] = t), Oo(e, r, n, 1, o, i));
}
function Wu(e, t) {
  (t[Ne].changeDetectionScheduler?.notify(9), Oo(e, t, t[R], 2, null, null));
}
function bg(e) {
  let t = e[Ft];
  if (!t) return vs(e[m], e);
  for (; t; ) {
    let n = null;
    if (De(t)) n = t[Ft];
    else {
      let r = t[$];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[ie] && t !== e; ) (De(t) && vs(t[m], t), (t = t[j]));
      (t === null && (t = e), De(t) && vs(t[m], t), (n = t && t[ie]));
    }
    t = n;
  }
}
function ha(e, t) {
  let n = e[dt],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Ao(e, t) {
  if (ft(t)) return;
  let n = t[R];
  (n.destroyNode && Oo(e, t, n, 3, null, null), bg(t));
}
function vs(e, t) {
  if (ft(t)) return;
  let n = y(null);
  try {
    ((t[v] &= -129),
      (t[v] |= 256),
      t[re] && Ze(t[re]),
      Mg(e, t),
      Ng(e, t),
      t[m].type === 1 && t[R].destroy());
    let r = t[Ue];
    if (r !== null && pe(t[j])) {
      r !== t[j] && ha(r, t);
      let o = t[Ie];
      o !== null && o.detachView(e);
    }
    Rs(t);
  } finally {
    y(n);
  }
}
function Ng(e, t) {
  let n = e.cleanup,
    r = t[Lt];
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == "string") {
        let a = n[s + 3];
        (a >= 0 ? r[a]() : r[-a].unsubscribe(), (s += 2));
      } else {
        let a = r[n[s + 1]];
        n[s].call(a);
      }
  r !== null && (t[Lt] = null);
  let o = t[_e];
  if (o !== null) {
    t[_e] = null;
    for (let s = 0; s < o.length; s++) {
      let a = o[s];
      a();
    }
  }
  let i = t[Me];
  if (i !== null) {
    t[Me] = null;
    for (let s of i) s.destroy();
  }
}
function Mg(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof vt)) {
        let i = n[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              c = i[s + 1];
            A(4, a, c);
            try {
              c.call(a);
            } finally {
              A(5, a, c);
            }
          }
        else {
          A(4, o, i);
          try {
            i.call(o);
          } finally {
            A(5, o, i);
          }
        }
      }
    }
}
function zu(e, t, n) {
  return Sg(e, t.parent, n);
}
function Sg(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) ((t = r), (r = t.parent));
  if (r === null) return n[fe];
  if (Se(r)) {
    let { encapsulation: o } = e.data[r.directiveStart + r.componentOffset];
    if (o === zt.None || o === zt.Emulated) return null;
  }
  return ae(r, n);
}
function Qu(e, t, n) {
  return Rg(e, t, n);
}
function xg(e, t, n) {
  return e.type & 40 ? ae(e, n) : null;
}
var Rg = xg,
  Vl;
function ga(e, t, n, r) {
  let o = zu(e, r, t),
    i = t[R],
    s = r.parent || t[K],
    a = Qu(s, r, t);
  if (o != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) jl(i, o, n[c], a, !1);
    else jl(i, o, n, a, !1);
  Vl !== void 0 && Vl(i, r, t, n, o);
}
function xn(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return ae(t, e);
    if (n & 4) return Ls(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return xn(e, r);
      {
        let o = e[t.index];
        return pe(o) ? Ls(-1, o) : se(o);
      }
    } else {
      if (n & 128) return xn(e, t.next);
      if (n & 32) return pa(t, e)() || se(e[t.index]);
      {
        let r = Zu(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = Ve(e[J]);
          return xn(o, r);
        } else return xn(e, t.next);
      }
    }
  }
  return null;
}
function Zu(e, t) {
  if (t !== null) {
    let r = e[J][K],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function Ls(e, t) {
  let n = $ + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[m].firstChild;
    if (o !== null) return xn(r, o);
  }
  return t[qe];
}
function ma(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let a = r[n.index],
      c = n.type;
    if ((s && t === 0 && (a && Wt(se(a), r), (n.flags |= 2)), !So(n)))
      if (c & 8) (ma(e, t, n.child, r, o, i, !1), Ut(t, e, o, a, i));
      else if (c & 32) {
        let l = pa(n, r),
          u;
        for (; (u = l()); ) Ut(t, e, o, u, i);
        Ut(t, e, o, a, i);
      } else c & 16 ? Yu(e, t, r, n, o, i) : Ut(t, e, o, a, i);
    n = s ? n.projectionNext : n.next;
  }
}
function Oo(e, t, n, r, o, i) {
  ma(n, r, e.firstChild, t, o, i, !1);
}
function Ag(e, t, n) {
  let r = t[R],
    o = zu(e, n, t),
    i = n.parent || t[K],
    s = Qu(i, n, t);
  Yu(r, 0, t, n, o, s);
}
function Yu(e, t, n, r, o, i) {
  let s = n[J],
    c = s[K].projection[r.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      Ut(t, e, o, u, i);
    }
  else {
    let l = c,
      u = s[j];
    (wu(r) && (l.flags |= 128), ma(e, t, l, u, o, i, !0));
  }
}
function Og(e, t, n, r, o) {
  let i = n[qe],
    s = se(n);
  i !== s && Ut(t, e, r, i, o);
  for (let a = $; a < n.length; a++) {
    let c = n[a];
    Oo(c[m], c, e, t, r, i);
  }
}
function kg(e, t, n, r, o) {
  if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
  else {
    let i = r.indexOf("-") === -1 ? void 0 : mo.DashCase;
    o == null
      ? e.removeStyle(n, r, i)
      : (typeof o == "string" &&
          o.endsWith("!important") &&
          ((o = o.slice(0, -10)), (i |= mo.Important)),
        e.setStyle(n, r, o, i));
  }
}
function Ku(e, t, n, r, o) {
  let i = Ce(),
    s = r & 2;
  try {
    (Ge(-1), s && t.length > k && Gu(e, t, k, !1), A(s ? 2 : 0, o, n), n(r, o));
  } finally {
    (Ge(i), A(s ? 3 : 1, o, n));
  }
}
function ko(e, t, n) {
  (Vg(e, t, n), (n.flags & 64) === 64 && Hg(e, t, n));
}
function Un(e, t, n = ae) {
  let r = t.localNames;
  if (r !== null) {
    let o = t.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? n(t, e) : e[s];
      e[o++] = a;
    }
  }
}
function Pg(e, t, n, r) {
  let i = r.get(Ou, Au) || n === zt.ShadowDom,
    s = e.selectRootElement(t, i);
  return (Lg(s), s);
}
function Lg(e) {
  Fg(e);
}
var Fg = () => null;
function jg(e) {
  return e === "class"
    ? "className"
    : e === "for"
      ? "htmlFor"
      : e === "formaction"
        ? "formAction"
        : e === "innerHtml"
          ? "innerHTML"
          : e === "readonly"
            ? "readOnly"
            : e === "tabindex"
              ? "tabIndex"
              : e;
}
function Ju(e, t, n, r, o, i) {
  let s = t[m];
  if (Po(e, s, t, n, r)) {
    Se(e) && ed(t, e.index);
    return;
  }
  (e.type & 3 && (n = jg(n)), Xu(e, t, n, r, o, i));
}
function Xu(e, t, n, r, o, i) {
  if (e.type & 3) {
    let s = ae(e, t);
    ((r = i != null ? i(r, e.value || "", n) : r), o.setProperty(s, n, r));
  } else e.type & 12;
}
function ed(e, t) {
  let n = ce(t, e);
  n[v] & 16 || (n[v] |= 64);
}
function Vg(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd;
  (Se(n) && Dg(t, n, e.data[r + n.componentOffset]),
    e.firstCreatePass || po(n, t));
  let i = n.initialInputs;
  for (let s = r; s < o; s++) {
    let a = e.data[s],
      c = An(t, e, s, n);
    if ((Wt(c, t), i !== null && Ug(t, s - r, c, a, n, i), he(a))) {
      let l = ce(n.index, t);
      l[P] = An(t, e, s, n);
    }
  }
}
function Hg(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = El();
  try {
    Ge(i);
    for (let a = r; a < o; a++) {
      let c = e.data[a],
        l = t[a];
      (Kr(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          Bg(c, l));
    }
  } finally {
    (Ge(-1), Kr(s));
  }
}
function Bg(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function ya(e, t) {
  let n = e.directiveRegistry,
    r = null;
  if (n)
    for (let o = 0; o < n.length; o++) {
      let i = n[o];
      ju(t, i.selectors, !1) && ((r ??= []), he(i) ? r.unshift(i) : r.push(i));
    }
  return r;
}
function $g(e, t, n, r, o, i) {
  let s = ae(e, t);
  td(t[R], s, i, e.value, n, r, o);
}
function td(e, t, n, r, o, i, s) {
  if (i == null) e.removeAttribute(t, o, n);
  else {
    let a = s == null ? Ot(i) : s(i, r || "", o);
    e.setAttribute(t, o, a, n);
  }
}
function Ug(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; a += 2) {
      let c = s[a],
        l = s[a + 1];
      Ps(r, n, c, l);
    }
}
function va(e, t, n, r, o) {
  let i = k + n,
    s = t[m],
    a = o(s, t, e, r, n);
  ((t[i] = a), Ht(e, !0));
  let c = e.type === 2;
  return (
    c ? ($u(t[R], a, e), (ll() === 0 || jt(e)) && Wt(a, t), ul()) : Wt(a, t),
    to() && (!c || !So(e)) && ga(s, t, a, e),
    e
  );
}
function Ea(e) {
  let t = e;
  return (rs() ? os() : ((t = t.parent), Ht(t, !1)), t);
}
function qg(e, t) {
  let n = e[ct];
  if (!n) return;
  let r;
  try {
    r = n.get(Re, null);
  } catch {
    r = null;
  }
  r?.(t);
}
function Po(e, t, n, r, o) {
  let i = e.inputs?.[r],
    s = e.hostDirectiveInputs?.[r],
    a = !1;
  if (s)
    for (let c = 0; c < s.length; c += 2) {
      let l = s[c],
        u = s[c + 1],
        d = t.data[l];
      (Ps(d, n[l], u, o), (a = !0));
    }
  if (i)
    for (let c of i) {
      let l = n[c],
        u = t.data[c];
      (Ps(u, l, r, o), (a = !0));
    }
  return a;
}
function Gg(e, t) {
  let n = ce(t, e),
    r = n[m];
  Wg(r, n);
  let o = n[fe];
  (o !== null && n[at] === null && (n[at] = ku(o, n[ct])),
    A(18),
    Ia(r, n, n[P]),
    A(19, n[P]));
}
function Wg(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function Ia(e, t, n) {
  Xr(t);
  try {
    let r = e.viewQuery;
    r !== null && Os(1, r, n);
    let o = e.template;
    (o !== null && Ku(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[Ie]?.finishViewCreation(e),
      e.staticContentQueries && Pu(e, t),
      e.staticViewQueries && Os(2, e.viewQuery, n));
    let i = e.components;
    i !== null && zg(t, i);
  } catch (r) {
    throw (
      e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r
    );
  } finally {
    ((t[v] &= -5), eo());
  }
}
function zg(e, t) {
  for (let n = 0; n < t.length; n++) Gg(e, t[n]);
}
function qn(e, t, n, r) {
  let o = y(null);
  try {
    let i = t.tView,
      a = e[v] & 4096 ? 4096 : 16,
      c = da(
        e,
        i,
        n,
        a,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null,
      ),
      l = e[t.index];
    c[Ue] = l;
    let u = e[Ie];
    return (u !== null && (c[Ie] = u.createEmbeddedView(i)), Ia(i, c, n), c);
  } finally {
    y(o);
  }
}
function Qt(e, t) {
  return !t || t.firstChild === null || wu(e);
}
var Hl = !1,
  Qg = new M("");
function On(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = o ? n.projectionNext : n.next;
      continue;
    }
    let i = t[n.index];
    (i !== null && r.push(se(i)), pe(i) && nd(i, r));
    let s = n.type;
    if (s & 8) On(e, t, n.child, r);
    else if (s & 32) {
      let a = pa(n, t),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (s & 16) {
      let a = Zu(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = Ve(t[J]);
        On(c[m], c, a, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function nd(e, t) {
  for (let n = $; n < e.length; n++) {
    let r = e[n],
      o = r[m].firstChild;
    o !== null && On(r[m], r, o, t);
  }
  e[qe] !== e[fe] && t.push(e[qe]);
}
function rd(e) {
  if (e[Wr] !== null) {
    for (let t of e[Wr]) t.impl.addSequence(t);
    e[Wr].length = 0;
  }
}
var od = [];
function Zg(e) {
  return e[re] ?? Yg(e);
}
function Yg(e) {
  let t = od.pop() ?? Object.create(Jg);
  return ((t.lView = e), t);
}
function Kg(e) {
  e.lView[re] !== e && ((e.lView = null), od.push(e));
}
var Jg = G(q({}, ze), {
  consumerIsAlwaysLive: !0,
  kind: "template",
  consumerMarkedDirty: (e) => {
    pt(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[re] = this;
  },
});
function Xg(e) {
  let t = e[re] ?? Object.create(em);
  return ((t.lView = e), t);
}
var em = G(q({}, ze), {
  consumerIsAlwaysLive: !0,
  kind: "template",
  consumerMarkedDirty: (e) => {
    let t = Ve(e.lView);
    for (; t && !id(t[m]); ) t = Ve(t);
    t && Qi(t);
  },
  consumerOnSignalRead() {
    this.lView[re] = this;
  },
});
function id(e) {
  return e.type !== 2;
}
function sd(e) {
  if (e[Me] === null) return;
  let t = !0;
  for (; t; ) {
    let n = !1;
    for (let r of e[Me])
      r.dirty &&
        ((n = !0),
        r.zone === null || Zone.current === r.zone
          ? r.run()
          : r.zone.run(() => r.run()));
    t = n && !!(e[v] & 8192);
  }
}
var tm = 100;
function Da(e, t = 0) {
  let r = e[Ne].rendererFactory,
    o = !1;
  o || r.begin?.();
  try {
    nm(e, t);
  } finally {
    o || r.end?.();
  }
}
function nm(e, t) {
  let n = ss();
  try {
    (Bt(!0), Fs(e, t));
    let r = 0;
    for (; _n(e); ) {
      if (r === tm) throw new _(103, !1);
      (r++, Fs(e, 1));
    }
  } finally {
    Bt(n);
  }
}
function ad(e, t) {
  is(t ? Tn.Exhaustive : Tn.OnlyDirtyViews);
  try {
    Da(e);
  } finally {
    is(Tn.Off);
  }
}
function rm(e, t, n, r) {
  if (ft(t)) return;
  let o = t[v],
    i = !1,
    s = !1;
  Xr(t);
  let a = !0,
    c = null,
    l = null;
  i ||
    (id(e)
      ? ((l = Zg(t)), (c = Qe(l)))
      : ir() === null
        ? ((a = !1), (l = Xg(t)), (c = Qe(l)))
        : t[re] && (Ze(t[re]), (t[re] = null)));
  try {
    (zi(t), ml(e.bindingStartIndex), n !== null && Ku(e, t, n, 2, r));
    let u = (o & 3) === 3;
    if (!i)
      if (u) {
        let f = e.preOrderCheckHooks;
        f !== null && oo(t, f, null);
      } else {
        let f = e.preOrderHooks;
        (f !== null && io(t, f, 0, null), ms(t, 0));
      }
    if (
      (s || om(t), sd(t), cd(t, 0), e.contentQueries !== null && Pu(e, t), !i)
    )
      if (u) {
        let f = e.contentCheckHooks;
        f !== null && oo(t, f);
      } else {
        let f = e.contentHooks;
        (f !== null && io(t, f, 1), ms(t, 1));
      }
    sm(e, t);
    let d = e.components;
    d !== null && ud(t, d, 0);
    let p = e.viewQuery;
    if ((p !== null && Os(2, p, r), !i))
      if (u) {
        let f = e.viewCheckHooks;
        f !== null && oo(t, f);
      } else {
        let f = e.viewHooks;
        (f !== null && io(t, f, 2), ms(t, 2));
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Gr])) {
      for (let f of t[Gr]) f();
      t[Gr] = null;
    }
    i || (rd(t), (t[v] &= -73));
  } catch (u) {
    throw (i || pt(t), u);
  } finally {
    (l !== null && (wt(l, c), a && Kg(l)), eo());
  }
}
function cd(e, t) {
  for (let n = Tu(e); n !== null; n = bu(n))
    for (let r = $; r < n.length; r++) {
      let o = n[r];
      ld(o, t);
    }
}
function om(e) {
  for (let t = Tu(e); t !== null; t = bu(t)) {
    if (!(t[v] & 2)) continue;
    let n = t[dt];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      Qi(o);
    }
  }
}
function im(e, t, n) {
  A(18);
  let r = ce(t, e);
  (ld(r, n), A(19, r[P]));
}
function ld(e, t) {
  zr(e) && Fs(e, t);
}
function Fs(e, t) {
  let r = e[m],
    o = e[v],
    i = e[re],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && _t(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[v] &= -9217),
    s)
  )
    rm(r, e, r.template, e[P]);
  else if (o & 8192) {
    let a = y(null);
    try {
      (sd(e), cd(e, 1));
      let c = r.components;
      (c !== null && ud(e, c, 1), rd(e));
    } finally {
      y(a);
    }
  }
}
function ud(e, t, n) {
  for (let r = 0; r < t.length; r++) im(e, t[r], n);
}
function sm(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) Ge(~o);
        else {
          let i = o,
            s = n[++r],
            a = n[++r];
          vl(s, i);
          let c = t[i];
          (A(24, c), a(2, c), A(25, c));
        }
      }
    } finally {
      Ge(-1);
    }
}
function Ca(e, t) {
  let n = ss() ? 64 : 1088;
  for (e[Ne].changeDetectionScheduler?.notify(t); e; ) {
    e[v] |= n;
    let r = Ve(e);
    if (Vt(e) && !r) return e;
    e = r;
  }
  return null;
}
function dd(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function fd(e, t) {
  let n = $ + t;
  if (n < e.length) return e[n];
}
function Gn(e, t, n, r = !0) {
  let o = t[m];
  if ((am(o, t, e, n), r)) {
    let s = Ls(n, e),
      a = t[R],
      c = a.parentNode(e[qe]);
    c !== null && Tg(o, e[K], a, t, c, s);
  }
  let i = t[at];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function pd(e, t) {
  let n = kn(e, t);
  return (n !== void 0 && Ao(n[m], n), n);
}
function kn(e, t) {
  if (e.length <= $) return;
  let n = $ + t,
    r = e[n];
  if (r) {
    let o = r[Ue];
    (o !== null && o !== e && ha(o, r), t > 0 && (e[n - 1][ie] = r[ie]));
    let i = vn(e, $ + t);
    _g(r[m], r);
    let s = i[Ie];
    (s !== null && s.detachView(i[m]),
      (r[j] = null),
      (r[ie] = null),
      (r[v] &= -129));
  }
  return r;
}
function am(e, t, n, r) {
  let o = $ + r,
    i = n.length;
  (r > 0 && (n[o - 1][ie] = t),
    r < i - $ ? ((t[ie] = n[o]), Ri(n, $ + r, t)) : (n.push(t), (t[ie] = null)),
    (t[j] = n));
  let s = t[Ue];
  s !== null && n !== s && hd(s, t);
  let a = t[Ie];
  (a !== null && a.insertView(e), Qr(t), (t[v] |= 128));
}
function hd(e, t) {
  let n = e[dt],
    r = t[j];
  if (De(r)) e[v] |= 2;
  else {
    let o = r[j][J];
    t[J] !== o && (e[v] |= 2);
  }
  n === null ? (e[dt] = [t]) : n.push(t);
}
var We = class {
  _lView;
  _cdRefInjectingView;
  _appRef = null;
  _attachedToViewContainer = !1;
  exhaustive;
  get rootNodes() {
    let t = this._lView,
      n = t[m];
    return On(n, t, n.firstChild, []);
  }
  constructor(t, n) {
    ((this._lView = t), (this._cdRefInjectingView = n));
  }
  get context() {
    return this._lView[P];
  }
  set context(t) {
    this._lView[P] = t;
  }
  get destroyed() {
    return ft(this._lView);
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[j];
      if (pe(t)) {
        let n = t[Cn],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (kn(t, r), vn(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    Ao(this._lView[m], this._lView);
  }
  onDestroy(t) {
    Zi(this._lView, t);
  }
  markForCheck() {
    Ca(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[v] &= -129;
  }
  reattach() {
    (Qr(this._lView), (this._lView[v] |= 128));
  }
  detectChanges() {
    ((this._lView[v] |= 1024), Da(this._lView));
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new _(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = Vt(this._lView),
      n = this._lView[Ue];
    (n !== null && !t && ha(n, this._lView), Wu(this._lView[m], this._lView));
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new _(902, !1);
    this._appRef = t;
    let n = Vt(this._lView),
      r = this._lView[Ue];
    (r !== null && !n && hd(r, this._lView), Qr(this._lView));
  }
};
var Pn = (() => {
  class e {
    _declarationLView;
    _declarationTContainer;
    elementRef;
    static __NG_ELEMENT_ID__ = cm;
    constructor(n, r, o) {
      ((this._declarationLView = n),
        (this._declarationTContainer = r),
        (this.elementRef = o));
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(n, r) {
      return this.createEmbeddedViewImpl(n, r);
    }
    createEmbeddedViewImpl(n, r, o) {
      let i = qn(this._declarationLView, this._declarationTContainer, n, {
        embeddedViewInjector: r,
        dehydratedView: o,
      });
      return new We(i);
    }
  }
  return e;
})();
function cm() {
  return Lo(U(), g());
}
function Lo(e, t) {
  return e.type & 4 ? new Pn(t, e, en(e, t)) : null;
}
function tn(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) ((i = lm(e, t, n, r, o)), yl() && (i.flags |= 32));
  else if (i.type & 64) {
    ((i.type = n), (i.value = r), (i.attrs = o));
    let s = pl();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return (Ht(i, !0), i);
}
function lm(e, t, n, r, o) {
  let i = ns(),
    s = rs(),
    a = s ? i : i && i.parent,
    c = (e.data[t] = dm(e, a, n, t, r, o));
  return (um(e, c, i, s), c);
}
function um(e, t, n, r) {
  (e.firstChild === null && (e.firstChild = t),
    n !== null &&
      (r
        ? n.child == null && t.parent !== null && (n.child = t)
        : n.next === null && ((n.next = t), (t.prev = n))));
}
function dm(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    Xi() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: null,
      inputs: null,
      hostDirectiveInputs: null,
      outputs: null,
      hostDirectiveOutputs: null,
      directiveToIndex: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
var Hb = new RegExp(`^(\\d+)*(${Qh}|${zh})*(.*)`);
function fm(e) {
  let t = e[Bi] ?? [],
    r = e[j][R],
    o = [];
  for (let i of t) i.data[Ru] !== void 0 ? o.push(i) : pm(i, r);
  e[Bi] = o;
}
function pm(e, t) {
  let n = 0,
    r = e.firstChild;
  if (r) {
    let o = e.data[xu];
    for (; n < o; ) {
      let i = r.nextSibling;
      (Bu(t, r, !1), (r = i), n++);
    }
  }
}
var hm = () => null,
  gm = () => null;
function yo(e, t) {
  return hm(e, t);
}
function gd(e, t, n) {
  return gm(e, t, n);
}
var md = class {},
  Fo = class {},
  js = class {
    resolveComponentFactory(t) {
      throw new _(917, !1);
    }
  },
  Wn = class {
    static NULL = new js();
  },
  Ln = class {},
  mm = (() => {
    class e {
      destroyNode = null;
      static __NG_ELEMENT_ID__ = () => ym();
    }
    return e;
  })();
function ym() {
  let e = g(),
    t = U(),
    n = ce(t.index, e);
  return (De(n) ? n : e)[R];
}
var yd = (() => {
  class e {
    static ɵprov = B({ token: e, providedIn: "root", factory: () => null });
  }
  return e;
})();
var ao = {},
  Vs = class {
    injector;
    parentInjector;
    constructor(t, n) {
      ((this.injector = t), (this.parentInjector = n));
    }
    get(t, n, r) {
      let o = this.injector.get(t, ao, r);
      return o !== ao || n === ao ? o : this.parentInjector.get(t, n, r);
    }
  };
function vo(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = Fr(o, a);
      else if (i == 2) {
        let c = a,
          l = t[++s];
        r = Fr(r, c + ": " + l + ";");
      }
    }
  (n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o));
}
function zn(e, t = 0) {
  let n = g();
  if (n === null) return ve(e, t);
  let r = U();
  return Iu(r, n, F(e), t);
}
function vm() {
  let e = "invalid";
  throw new Error(e);
}
function vd(e, t, n, r, o) {
  let i = r === null ? null : { "": -1 },
    s = o(e, n);
  if (s !== null) {
    let a = s,
      c = null,
      l = null;
    for (let u of s)
      if (u.resolveHostDirectives !== null) {
        [a, c, l] = u.resolveHostDirectives(s);
        break;
      }
    Dm(e, t, n, a, i, c, l);
  }
  i !== null && r !== null && Em(n, r, i);
}
function Em(e, t, n) {
  let r = (e.localNames = []);
  for (let o = 0; o < t.length; o += 2) {
    let i = n[t[o + 1]];
    if (i == null) throw new _(-301, !1);
    r.push(t[o], i);
  }
}
function Im(e, t, n) {
  ((t.componentOffset = n), (e.components ??= []).push(t.index));
}
function Dm(e, t, n, r, o, i, s) {
  let a = r.length,
    c = !1;
  for (let p = 0; p < a; p++) {
    let f = r[p];
    (!c && he(f) && ((c = !0), Im(e, n, p)), Ss(po(n, t), e, f.type));
  }
  Nm(n, e.data.length, a);
  for (let p = 0; p < a; p++) {
    let f = r[p];
    f.providersResolver && f.providersResolver(f);
  }
  let l = !1,
    u = !1,
    d = qu(e, t, a, null);
  a > 0 && (n.directiveToIndex = new Map());
  for (let p = 0; p < a; p++) {
    let f = r[p];
    if (
      ((n.mergedAttrs = Gt(n.mergedAttrs, f.hostAttrs)),
      wm(e, n, t, d, f),
      bm(d, f, o),
      s !== null && s.has(f))
    ) {
      let [E, x] = s.get(f);
      n.directiveToIndex.set(f.type, [
        d,
        E + n.directiveStart,
        x + n.directiveStart,
      ]);
    } else (i === null || !i.has(f)) && n.directiveToIndex.set(f.type, d);
    (f.contentQueries !== null && (n.flags |= 4),
      (f.hostBindings !== null || f.hostAttrs !== null || f.hostVars !== 0) &&
        (n.flags |= 64));
    let h = f.type.prototype;
    (!l &&
      (h.ngOnChanges || h.ngOnInit || h.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (l = !0)),
      !u &&
        (h.ngOnChanges || h.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (u = !0)),
      d++);
  }
  Cm(e, n, i);
}
function Cm(e, t, n) {
  for (let r = t.directiveStart; r < t.directiveEnd; r++) {
    let o = e.data[r];
    if (n === null || !n.has(o)) (Bl(0, t, o, r), Bl(1, t, o, r), Ul(t, r, !1));
    else {
      let i = n.get(o);
      ($l(0, t, i, r), $l(1, t, i, r), Ul(t, r, !0));
    }
  }
}
function Bl(e, t, n, r) {
  let o = e === 0 ? n.inputs : n.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s;
      (e === 0 ? (s = t.inputs ??= {}) : (s = t.outputs ??= {}),
        (s[i] ??= []),
        s[i].push(r),
        Ed(t, i));
    }
}
function $l(e, t, n, r) {
  let o = e === 0 ? n.inputs : n.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s = o[i],
        a;
      (e === 0
        ? (a = t.hostDirectiveInputs ??= {})
        : (a = t.hostDirectiveOutputs ??= {}),
        (a[s] ??= []),
        a[s].push(r, i),
        Ed(t, s));
    }
}
function Ed(e, t) {
  t === "class" ? (e.flags |= 8) : t === "style" && (e.flags |= 16);
}
function Ul(e, t, n) {
  let { attrs: r, inputs: o, hostDirectiveInputs: i } = e;
  if (r === null || (!n && o === null) || (n && i === null) || la(e)) {
    ((e.initialInputs ??= []), e.initialInputs.push(null));
    return;
  }
  let s = null,
    a = 0;
  for (; a < r.length; ) {
    let c = r[a];
    if (c === 0) {
      a += 4;
      continue;
    } else if (c === 5) {
      a += 2;
      continue;
    } else if (typeof c == "number") break;
    if (!n && o.hasOwnProperty(c)) {
      let l = o[c];
      for (let u of l)
        if (u === t) {
          ((s ??= []), s.push(c, r[a + 1]));
          break;
        }
    } else if (n && i.hasOwnProperty(c)) {
      let l = i[c];
      for (let u = 0; u < l.length; u += 2)
        if (l[u] === t) {
          ((s ??= []), s.push(l[u + 1], r[a + 1]));
          break;
        }
    }
    a += 2;
  }
  ((e.initialInputs ??= []), e.initialInputs.push(s));
}
function wm(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = je(o.type, !0)),
    s = new vt(i, he(o), zn, null);
  ((e.blueprint[r] = s), (n[r] = s), _m(e, t, r, qu(e, n, o.hostVars, X), o));
}
function _m(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    (Tm(s) != a && s.push(a), s.push(n, r, i));
  }
}
function Tm(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function bm(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    he(t) && (n[""] = e);
  }
}
function Nm(e, t, n) {
  ((e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t));
}
function wa(e, t, n, r, o, i, s, a) {
  let c = t[m],
    l = c.consts,
    u = le(l, s),
    d = tn(c, e, n, r, u);
  return (
    i && vd(c, t, d, le(l, a), o),
    (d.mergedAttrs = Gt(d.mergedAttrs, d.attrs)),
    d.attrs !== null && vo(d, d.attrs, !1),
    d.mergedAttrs !== null && vo(d, d.mergedAttrs, !0),
    c.queries !== null && c.queries.elementStart(c, d),
    d
  );
}
function _a(e, t) {
  (fu(e, t), $i(t) && e.queries.elementEnd(t));
}
function Mm(e, t, n, r, o, i) {
  let s = t.consts,
    a = le(s, o),
    c = tn(t, e, n, r, a);
  if (((c.mergedAttrs = Gt(c.mergedAttrs, c.attrs)), i != null)) {
    let l = le(s, i);
    c.localNames = [];
    for (let u = 0; u < l.length; u += 2) c.localNames.push(l[u], -1);
  }
  return (
    c.attrs !== null && vo(c, c.attrs, !1),
    c.mergedAttrs !== null && vo(c, c.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, c),
    c
  );
}
function Ta(e) {
  return jo(e)
    ? Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e)
    : !1;
}
function Id(e, t) {
  if (Array.isArray(e)) for (let n = 0; n < e.length; n++) t(e[n]);
  else {
    let n = e[Symbol.iterator](),
      r;
    for (; !(r = n.next()).done; ) t(r.value);
  }
}
function jo(e) {
  return e !== null && (typeof e == "function" || typeof e == "object");
}
function Oe(e, t, n) {
  return (e[t] = n);
}
function Vo(e, t) {
  return e[t];
}
function Q(e, t, n) {
  if (n === X) return !1;
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function Zt(e, t, n, r) {
  let o = Q(e, t, n);
  return Q(e, t + 1, r) || o;
}
function Dd(e, t, n, r, o) {
  let i = Zt(e, t, n, r);
  return Q(e, t + 2, o) || i;
}
function Ho(e, t, n, r, o, i) {
  let s = Zt(e, t, n, r);
  return Zt(e, t + 2, o, i) || s;
}
function Es(e, t, n) {
  return function r(o) {
    let i = Se(e) ? ce(e.index, t) : t;
    Ca(i, 5);
    let s = t[P],
      a = ql(t, s, n, o),
      c = r.__ngNextListenerFn__;
    for (; c; ) ((a = ql(t, s, c, o) && a), (c = c.__ngNextListenerFn__));
    return a;
  };
}
function ql(e, t, n, r) {
  let o = y(null);
  try {
    return (A(6, t, n), n(r) !== !1);
  } catch (i) {
    return (qg(e, i), !1);
  } finally {
    (A(7, t, n), y(o));
  }
}
function Sm(e, t, n, r, o, i, s, a) {
  let c = jt(e),
    l = !1,
    u = null;
  if ((!r && c && (u = xm(t, n, i, e.index)), u !== null)) {
    let d = u.__ngLastListenerFn__ || u;
    ((d.__ngNextListenerFn__ = s), (u.__ngLastListenerFn__ = s), (l = !0));
  } else {
    let d = ae(e, n),
      p = r ? r(d) : d;
    Yh(n, p, i, a);
    let f = o.listen(p, i, a),
      h = r ? (E) => r(se(E[e.index])) : e.index;
    Cd(h, t, n, i, a, f, !1);
  }
  return l;
}
function xm(e, t, n, r) {
  let o = e.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === n && o[i + 1] === r) {
        let a = t[Lt],
          c = o[i + 2];
        return a && a.length > c ? a[c] : null;
      }
      typeof s == "string" && (i += 2);
    }
  return null;
}
function Cd(e, t, n, r, o, i, s) {
  let a = t.firstCreatePass ? Ki(t) : null,
    c = Yi(n),
    l = c.length;
  (c.push(o, i), a && a.push(r, e, l, (l + 1) * (s ? -1 : 1)));
}
function Gl(e, t, n, r, o, i) {
  let s = t[n],
    a = t[m],
    l = a.data[n].outputs[r],
    d = s[l].subscribe(i);
  Cd(e.index, a, t, o, i, d, !0);
}
var Hs = Symbol("BINDING");
var Eo = class extends Wn {
  ngModule;
  constructor(t) {
    (super(), (this.ngModule = t));
  }
  resolveComponentFactory(t) {
    let n = $e(t);
    return new Yt(n, this.ngModule);
  }
};
function Rm(e) {
  return Object.keys(e).map((t) => {
    let [n, r, o] = e[t],
      i = {
        propName: n,
        templateName: t,
        isSignal: (r & Ro.SignalBased) !== 0,
      };
    return (o && (i.transform = o), i);
  });
}
function Am(e) {
  return Object.keys(e).map((t) => ({ propName: e[t], templateName: t }));
}
function Om(e, t, n) {
  let r = t instanceof oe ? t : t?.injector;
  return (
    r &&
      e.getStandaloneInjector !== null &&
      (r = e.getStandaloneInjector(r) || r),
    r ? new Vs(n, r) : n
  );
}
function km(e) {
  let t = e.get(Ln, null);
  if (t === null) throw new _(407, !1);
  let n = e.get(yd, null),
    r = e.get(Ee, null);
  return {
    rendererFactory: t,
    sanitizer: n,
    changeDetectionScheduler: r,
    ngReflect: !1,
  };
}
function Pm(e, t) {
  let n = wd(e);
  return Vu(t, n, n === "svg" ? Ui : n === "math" ? rl : null);
}
function wd(e) {
  return (e.selectors[0][0] || "div").toLowerCase();
}
var Yt = class extends Fo {
  componentDef;
  ngModule;
  selector;
  componentType;
  ngContentSelectors;
  isBoundToModule;
  cachedInputs = null;
  cachedOutputs = null;
  get inputs() {
    return (
      (this.cachedInputs ??= Rm(this.componentDef.inputs)),
      this.cachedInputs
    );
  }
  get outputs() {
    return (
      (this.cachedOutputs ??= Am(this.componentDef.outputs)),
      this.cachedOutputs
    );
  }
  constructor(t, n) {
    (super(),
      (this.componentDef = t),
      (this.ngModule = n),
      (this.componentType = t.type),
      (this.selector = fg(t.selectors)),
      (this.ngContentSelectors = t.ngContentSelectors ?? []),
      (this.isBoundToModule = !!n));
  }
  create(t, n, r, o, i, s) {
    A(22);
    let a = y(null);
    try {
      let c = this.componentDef,
        l = Lm(r, c, s, i),
        u = Om(c, o || this.ngModule, t),
        d = km(u),
        p = d.rendererFactory.createRenderer(null, c),
        f = r ? Pg(p, r, c.encapsulation, u) : Pm(c, p),
        h =
          s?.some(Wl) ||
          i?.some((w) => typeof w != "function" && w.bindings.some(Wl)),
        E = da(
          null,
          l,
          null,
          512 | Uu(c),
          null,
          null,
          d,
          p,
          u,
          null,
          ku(f, u, !0),
        );
      ((E[k] = f), Xr(E));
      let x = null;
      try {
        let w = wa(k, E, 2, "#host", () => l.directiveRegistry, !0, 0);
        (f && ($u(p, f, w), Wt(f, E)),
          ko(l, E, w),
          ca(l, w, E),
          _a(l, w),
          n !== void 0 && jm(w, this.ngContentSelectors, n),
          (x = ce(w.index, E)),
          (E[P] = x[P]),
          Ia(l, E, null));
      } catch (w) {
        throw (x !== null && Rs(x), Rs(E), w);
      } finally {
        (A(23), eo());
      }
      return new Io(this.componentType, E, !!h);
    } finally {
      y(a);
    }
  }
};
function Lm(e, t, n, r) {
  let o = e ? ["ng-version", "20.3.0"] : pg(t.selectors[0]),
    i = null,
    s = null,
    a = 0;
  if (n)
    for (let u of n)
      ((a += u[Hs].requiredVars),
        u.create && ((u.targetIdx = 0), (i ??= []).push(u)),
        u.update && ((u.targetIdx = 0), (s ??= []).push(u)));
  if (r)
    for (let u = 0; u < r.length; u++) {
      let d = r[u];
      if (typeof d != "function")
        for (let p of d.bindings) {
          a += p[Hs].requiredVars;
          let f = u + 1;
          (p.create && ((p.targetIdx = f), (i ??= []).push(p)),
            p.update && ((p.targetIdx = f), (s ??= []).push(p)));
        }
    }
  let c = [t];
  if (r)
    for (let u of r) {
      let d = typeof u == "function" ? u : u.type,
        p = Ur(d);
      c.push(p);
    }
  return ua(0, null, Fm(i, s), 1, a, c, null, null, null, [o], null);
}
function Fm(e, t) {
  return !e && !t
    ? null
    : (n) => {
        if (n & 1 && e) for (let r of e) r.create();
        if (n & 2 && t) for (let r of t) r.update();
      };
}
function Wl(e) {
  let t = e[Hs].kind;
  return t === "input" || t === "twoWay";
}
var Io = class extends md {
  _rootLView;
  _hasInputBindings;
  instance;
  hostView;
  changeDetectorRef;
  componentType;
  location;
  previousInputValues = null;
  _tNode;
  constructor(t, n, r) {
    (super(),
      (this._rootLView = n),
      (this._hasInputBindings = r),
      (this._tNode = wn(n[m], k)),
      (this.location = en(this._tNode, n)),
      (this.instance = ce(this._tNode.index, n)[P]),
      (this.hostView = this.changeDetectorRef = new We(n, void 0)),
      (this.componentType = t));
  }
  setInput(t, n) {
    this._hasInputBindings;
    let r = this._tNode;
    if (
      ((this.previousInputValues ??= new Map()),
      this.previousInputValues.has(t) &&
        Object.is(this.previousInputValues.get(t), n))
    )
      return;
    let o = this._rootLView,
      i = Po(r, o[m], o, t, n);
    this.previousInputValues.set(t, n);
    let s = ce(r.index, o);
    Ca(s, 1);
  }
  get injector() {
    return new yt(this._tNode, this._rootLView);
  }
  destroy() {
    this.hostView.destroy();
  }
  onDestroy(t) {
    this.hostView.onDestroy(t);
  }
};
function jm(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null && i.length ? Array.from(i) : null);
  }
}
var Bo = (() => {
  class e {
    static __NG_ELEMENT_ID__ = Vm;
  }
  return e;
})();
function Vm() {
  let e = U();
  return Td(e, g());
}
var Hm = Bo,
  _d = class extends Hm {
    _lContainer;
    _hostTNode;
    _hostLView;
    constructor(t, n, r) {
      (super(),
        (this._lContainer = t),
        (this._hostTNode = n),
        (this._hostLView = r));
    }
    get element() {
      return en(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new yt(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let t = sa(this._hostTNode, this._hostLView);
      if (hu(t)) {
        let n = uo(t, this._hostLView),
          r = lo(t),
          o = n[m].data[r + 8];
        return new yt(o, n);
      } else return new yt(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(t) {
      let n = zl(this._lContainer);
      return (n !== null && n[t]) || null;
    }
    get length() {
      return this._lContainer.length - $;
    }
    createEmbeddedView(t, n, r) {
      let o, i;
      typeof r == "number"
        ? (o = r)
        : r != null && ((o = r.index), (i = r.injector));
      let s = yo(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(n || {}, i, s);
      return (this.insertImpl(a, o, Qt(this._hostTNode, s)), a);
    }
    createComponent(t, n, r, o, i, s, a) {
      let c = t && !hh(t),
        l;
      if (c) l = n;
      else {
        let x = n || {};
        ((l = x.index),
          (r = x.injector),
          (o = x.projectableNodes),
          (i = x.environmentInjector || x.ngModuleRef),
          (s = x.directives),
          (a = x.bindings));
      }
      let u = c ? t : new Yt($e(t)),
        d = r || this.parentInjector;
      if (!i && u.ngModule == null) {
        let w = (c ? d : this.parentInjector).get(oe, null);
        w && (i = w);
      }
      let p = $e(u.componentType ?? {}),
        f = yo(this._lContainer, p?.id ?? null),
        h = f?.firstChild ?? null,
        E = u.create(d, o, h, i, s, a);
      return (this.insertImpl(E.hostView, l, Qt(this._hostTNode, f)), E);
    }
    insert(t, n) {
      return this.insertImpl(t, n, !0);
    }
    insertImpl(t, n, r) {
      let o = t._lView;
      if (il(o)) {
        let a = this.indexOf(t);
        if (a !== -1) this.detach(a);
        else {
          let c = o[j],
            l = new _d(c, c[K], c[j]);
          l.detach(l.indexOf(t));
        }
      }
      let i = this._adjustIndex(n),
        s = this._lContainer;
      return (Gn(s, o, i, r), t.attachToViewContainerRef(), Ri(Is(s), i, t), t);
    }
    move(t, n) {
      return this.insert(t, n);
    }
    indexOf(t) {
      let n = zl(this._lContainer);
      return n !== null ? n.indexOf(t) : -1;
    }
    remove(t) {
      let n = this._adjustIndex(t, -1),
        r = kn(this._lContainer, n);
      r && (vn(Is(this._lContainer), n), Ao(r[m], r));
    }
    detach(t) {
      let n = this._adjustIndex(t, -1),
        r = kn(this._lContainer, n);
      return r && vn(Is(this._lContainer), n) != null ? new We(r) : null;
    }
    _adjustIndex(t, n = 0) {
      return t ?? this.length + n;
    }
  };
function zl(e) {
  return e[Cn];
}
function Is(e) {
  return e[Cn] || (e[Cn] = []);
}
function Td(e, t) {
  let n,
    r = t[e.index];
  return (
    pe(r) ? (n = r) : ((n = dd(r, t, null, e)), (t[e.index] = n), fa(t, n)),
    $m(n, t, e, r),
    new _d(n, e, t)
  );
}
function Bm(e, t) {
  let n = e[R],
    r = n.createComment(""),
    o = ae(t, e),
    i = n.parentNode(o);
  return (go(n, i, r, n.nextSibling(o), !1), r);
}
var $m = Gm,
  Um = () => !1;
function qm(e, t, n) {
  return Um(e, t, n);
}
function Gm(e, t, n, r) {
  if (e[qe]) return;
  let o;
  (n.type & 8 ? (o = se(r)) : (o = Bm(t, n)), (e[qe] = o));
}
var Bs = class e {
    queryList;
    matches = null;
    constructor(t) {
      this.queryList = t;
    }
    clone() {
      return new e(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  $s = class e {
    queries;
    constructor(t = []) {
      this.queries = t;
    }
    createEmbeddedView(t) {
      let n = t.queries;
      if (n !== null) {
        let r = t.contentQueries !== null ? t.contentQueries[0] : n.length,
          o = [];
        for (let i = 0; i < r; i++) {
          let s = n.getByIndex(i),
            a = this.queries[s.indexInDeclarationView];
          o.push(a.clone());
        }
        return new e(o);
      }
      return null;
    }
    insertView(t) {
      this.dirtyQueriesWithMatches(t);
    }
    detachView(t) {
      this.dirtyQueriesWithMatches(t);
    }
    finishViewCreation(t) {
      this.dirtyQueriesWithMatches(t);
    }
    dirtyQueriesWithMatches(t) {
      for (let n = 0; n < this.queries.length; n++)
        ba(t, n).matches !== null && this.queries[n].setDirty();
    }
  },
  Do = class {
    flags;
    read;
    predicate;
    constructor(t, n, r = null) {
      ((this.flags = n),
        (this.read = r),
        typeof t == "string" ? (this.predicate = Xm(t)) : (this.predicate = t));
    }
  },
  Us = class e {
    queries;
    constructor(t = []) {
      this.queries = t;
    }
    elementStart(t, n) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].elementStart(t, n);
    }
    elementEnd(t) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].elementEnd(t);
    }
    embeddedTView(t) {
      let n = null;
      for (let r = 0; r < this.length; r++) {
        let o = n !== null ? n.length : 0,
          i = this.getByIndex(r).embeddedTView(t, o);
        i &&
          ((i.indexInDeclarationView = r), n !== null ? n.push(i) : (n = [i]));
      }
      return n !== null ? new e(n) : null;
    }
    template(t, n) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].template(t, n);
    }
    getByIndex(t) {
      return this.queries[t];
    }
    get length() {
      return this.queries.length;
    }
    track(t) {
      this.queries.push(t);
    }
  },
  qs = class e {
    metadata;
    matches = null;
    indexInDeclarationView = -1;
    crossesNgTemplate = !1;
    _declarationNodeIndex;
    _appliesToNextNode = !0;
    constructor(t, n = -1) {
      ((this.metadata = t), (this._declarationNodeIndex = n));
    }
    elementStart(t, n) {
      this.isApplyingToNode(n) && this.matchTNode(t, n);
    }
    elementEnd(t) {
      this._declarationNodeIndex === t.index && (this._appliesToNextNode = !1);
    }
    template(t, n) {
      this.elementStart(t, n);
    }
    embeddedTView(t, n) {
      return this.isApplyingToNode(t)
        ? ((this.crossesNgTemplate = !0),
          this.addMatch(-t.index, n),
          new e(this.metadata))
        : null;
    }
    isApplyingToNode(t) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let n = this._declarationNodeIndex,
          r = t.parent;
        for (; r !== null && r.type & 8 && r.index !== n; ) r = r.parent;
        return n === (r !== null ? r.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(t, n) {
      let r = this.metadata.predicate;
      if (Array.isArray(r))
        for (let o = 0; o < r.length; o++) {
          let i = r[o];
          (this.matchTNodeWithReadOption(t, n, Wm(n, i)),
            this.matchTNodeWithReadOption(t, n, so(n, t, i, !1, !1)));
        }
      else
        r === Pn
          ? n.type & 4 && this.matchTNodeWithReadOption(t, n, -1)
          : this.matchTNodeWithReadOption(t, n, so(n, t, r, !1, !1));
    }
    matchTNodeWithReadOption(t, n, r) {
      if (r !== null) {
        let o = this.metadata.read;
        if (o !== null)
          if (o === $n || o === Bo || (o === Pn && n.type & 4))
            this.addMatch(n.index, -2);
          else {
            let i = so(n, t, o, !1, !1);
            i !== null && this.addMatch(n.index, i);
          }
        else this.addMatch(n.index, r);
      }
    }
    addMatch(t, n) {
      this.matches === null ? (this.matches = [t, n]) : this.matches.push(t, n);
    }
  };
function Wm(e, t) {
  let n = e.localNames;
  if (n !== null) {
    for (let r = 0; r < n.length; r += 2) if (n[r] === t) return n[r + 1];
  }
  return null;
}
function zm(e, t) {
  return e.type & 11 ? en(e, t) : e.type & 4 ? Lo(e, t) : null;
}
function Qm(e, t, n, r) {
  return n === -1 ? zm(t, e) : n === -2 ? Zm(e, t, r) : An(e, e[m], n, t);
}
function Zm(e, t, n) {
  if (n === $n) return en(t, e);
  if (n === Pn) return Lo(t, e);
  if (n === Bo) return Td(t, e);
}
function bd(e, t, n, r) {
  let o = t[Ie].queries[r];
  if (o.matches === null) {
    let i = e.data,
      s = n.matches,
      a = [];
    for (let c = 0; s !== null && c < s.length; c += 2) {
      let l = s[c];
      if (l < 0) a.push(null);
      else {
        let u = i[l];
        a.push(Qm(t, u, s[c + 1], n.metadata.read));
      }
    }
    o.matches = a;
  }
  return o.matches;
}
function Gs(e, t, n, r) {
  let o = e.queries.getByIndex(n),
    i = o.matches;
  if (i !== null) {
    let s = bd(e, t, o, n);
    for (let a = 0; a < i.length; a += 2) {
      let c = i[a];
      if (c > 0) r.push(s[a / 2]);
      else {
        let l = i[a + 1],
          u = t[-c];
        for (let d = $; d < u.length; d++) {
          let p = u[d];
          p[Ue] === p[j] && Gs(p[m], p, l, r);
        }
        if (u[dt] !== null) {
          let d = u[dt];
          for (let p = 0; p < d.length; p++) {
            let f = d[p];
            Gs(f[m], f, l, r);
          }
        }
      }
    }
  }
  return r;
}
function Ym(e, t) {
  return e[Ie].queries[t].queryList;
}
function Nd(e, t, n) {
  let r = new ho((n & 4) === 4);
  return (
    cl(e, t, r, r.destroy),
    (t[Ie] ??= new $s()).queries.push(new Bs(r)) - 1
  );
}
function Km(e, t, n) {
  let r = O();
  return (
    r.firstCreatePass &&
      (Md(r, new Do(e, t, n), -1), (t & 2) === 2 && (r.staticViewQueries = !0)),
    Nd(r, g(), t)
  );
}
function Jm(e, t, n, r) {
  let o = O();
  if (o.firstCreatePass) {
    let i = U();
    (Md(o, new Do(t, n, r), i.index),
      ey(o, e),
      (n & 2) === 2 && (o.staticContentQueries = !0));
  }
  return Nd(o, g(), n);
}
function Xm(e) {
  return e.split(",").map((t) => t.trim());
}
function Md(e, t, n) {
  (e.queries === null && (e.queries = new Us()), e.queries.track(new qs(t, n)));
}
function ey(e, t) {
  let n = e.contentQueries || (e.contentQueries = []),
    r = n.length ? n[n.length - 1] : -1;
  t !== r && n.push(e.queries.length - 1, t);
}
function ba(e, t) {
  return e.queries.getByIndex(t);
}
function ty(e, t) {
  let n = e[m],
    r = ba(n, t);
  return r.crossesNgTemplate ? Gs(n, e, t, []) : bd(n, e, r, t);
}
var Ql = new Set();
function It(e) {
  Ql.has(e) ||
    (Ql.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
var Kt = class {},
  Sd = class {};
var Co = class extends Kt {
    ngModuleType;
    _parent;
    _bootstrapComponents = [];
    _r3Injector;
    instance;
    destroyCbs = [];
    componentFactoryResolver = new Eo(this);
    constructor(t, n, r, o = !0) {
      (super(), (this.ngModuleType = t), (this._parent = n));
      let i = ki(t);
      ((this._bootstrapComponents = Lu(i.bootstrap)),
        (this._r3Injector = us(
          t,
          n,
          [
            { provide: Kt, useValue: this },
            { provide: Wn, useValue: this.componentFactoryResolver },
            ...r,
          ],
          Te(t),
          new Set(["environment"]),
        )),
        o && this.resolveInjectorInitializers());
    }
    resolveInjectorInitializers() {
      (this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(this.ngModuleType)));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let t = this._r3Injector;
      (!t.destroyed && t.destroy(),
        this.destroyCbs.forEach((n) => n()),
        (this.destroyCbs = null));
    }
    onDestroy(t) {
      this.destroyCbs.push(t);
    }
  },
  wo = class extends Sd {
    moduleType;
    constructor(t) {
      (super(), (this.moduleType = t));
    }
    create(t) {
      return new Co(this.moduleType, t, []);
    }
  };
var Fn = class extends Kt {
  injector;
  componentFactoryResolver = new Eo(this);
  instance = null;
  constructor(t) {
    super();
    let n = new it(
      [
        ...t.providers,
        { provide: Kt, useValue: this },
        { provide: Wn, useValue: this.componentFactoryResolver },
      ],
      t.parent || In(),
      t.debugName,
      new Set(["environment"]),
    );
    ((this.injector = n),
      t.runEnvironmentInitializers && n.resolveInjectorInitializers());
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function xd(e, t, n = null) {
  return new Fn({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
var ny = (() => {
  class e {
    _injector;
    cachedInjectors = new Map();
    constructor(n) {
      this._injector = n;
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = Pi(!1, n.type),
          o =
            r.length > 0
              ? xd([r], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static ɵprov = B({
      token: e,
      providedIn: "environment",
      factory: () => new e(ve(oe)),
    });
  }
  return e;
})();
function ry(e) {
  return Bn(() => {
    let t = Rd(e),
      n = G(q({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === aa.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: t.standalone
          ? (o) => o.get(ny).getOrCreateStandaloneInjector(n)
          : null,
        getExternalStyles: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || zt.Emulated,
        styles: e.styles || Y,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    (t.standalone && It("NgStandalone"), Ad(n));
    let r = e.dependencies;
    return (
      (n.directiveDefs = Zl(r, oy)),
      (n.pipeDefs = Zl(r, Zc)),
      (n.id = uy(n)),
      n
    );
  });
}
function oy(e) {
  return $e(e) || Ur(e);
}
function iy(e) {
  return Bn(() => ({
    type: e.type,
    bootstrap: e.bootstrap || Y,
    declarations: e.declarations || Y,
    imports: e.imports || Y,
    exports: e.exports || Y,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function sy(e, t) {
  if (e == null) return de;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a,
        c;
      (Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i), (c = o[3] || null))
        : ((i = o), (s = o), (a = Ro.None), (c = null)),
        (n[i] = [r, a, c]),
        (t[i] = s));
    }
  return n;
}
function ay(e) {
  if (e == null) return de;
  let t = {};
  for (let n in e) e.hasOwnProperty(n) && (t[e[n]] = n);
  return t;
}
function cy(e) {
  return Bn(() => {
    let t = Rd(e);
    return (Ad(t), t);
  });
}
function ly(e) {
  return {
    type: e.type,
    name: e.name,
    factory: null,
    pure: e.pure !== !1,
    standalone: e.standalone ?? !0,
    onDestroy: e.type.prototype.ngOnDestroy || null,
  };
}
function Rd(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputConfig: e.inputs || de,
    exportAs: e.exportAs || null,
    standalone: e.standalone ?? !0,
    signals: e.signals === !0,
    selectors: e.selectors || Y,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    resolveHostDirectives: null,
    hostDirectives: null,
    inputs: sy(e.inputs, t),
    outputs: ay(e.outputs),
    debugInfo: null,
  };
}
function Ad(e) {
  e.features?.forEach((t) => t(e));
}
function Zl(e, t) {
  return e
    ? () => {
        let n = typeof e == "function" ? e() : e,
          r = [];
        for (let o of n) {
          let i = t(o);
          i !== null && r.push(i);
        }
        return r;
      }
    : null;
}
function uy(e) {
  let t = 0,
    n = typeof e.consts == "function" ? "" : e.consts,
    r = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      n,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ];
  for (let i of r.join("|")) t = (Math.imul(31, t) + i.charCodeAt(0)) << 0;
  return ((t += 2147483648), "c" + t);
}
function dy(e) {
  return Object.getPrototypeOf(e.prototype).constructor;
}
function Od(e) {
  let t = dy(e.type),
    n = !0,
    r = [e];
  for (; t; ) {
    let o;
    if (he(e)) o = t.ɵcmp || t.ɵdir;
    else {
      if (t.ɵcmp) throw new _(903, !1);
      o = t.ɵdir;
    }
    if (o) {
      if (n) {
        r.push(o);
        let s = e;
        ((s.inputs = Ds(e.inputs)),
          (s.declaredInputs = Ds(e.declaredInputs)),
          (s.outputs = Ds(e.outputs)));
        let a = o.hostBindings;
        a && my(e, a);
        let c = o.viewQuery,
          l = o.contentQueries;
        if (
          (c && hy(e, c),
          l && gy(e, l),
          fy(e, o),
          Vc(e.outputs, o.outputs),
          he(o) && o.data.animation)
        ) {
          let u = e.data;
          u.animation = (u.animation || []).concat(o.data.animation);
        }
      }
      let i = o.features;
      if (i)
        for (let s = 0; s < i.length; s++) {
          let a = i[s];
          (a && a.ngInherit && a(e), a === Od && (n = !1));
        }
    }
    t = Object.getPrototypeOf(t);
  }
  py(r);
}
function fy(e, t) {
  for (let n in t.inputs) {
    if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n)) continue;
    let r = t.inputs[n];
    r !== void 0 &&
      ((e.inputs[n] = r), (e.declaredInputs[n] = t.declaredInputs[n]));
  }
}
function py(e) {
  let t = 0,
    n = null;
  for (let r = e.length - 1; r >= 0; r--) {
    let o = e[r];
    ((o.hostVars = t += o.hostVars),
      (o.hostAttrs = Gt(o.hostAttrs, (n = Gt(n, o.hostAttrs)))));
  }
}
function Ds(e) {
  return e === de ? {} : e === Y ? [] : e;
}
function hy(e, t) {
  let n = e.viewQuery;
  n
    ? (e.viewQuery = (r, o) => {
        (t(r, o), n(r, o));
      })
    : (e.viewQuery = t);
}
function gy(e, t) {
  let n = e.contentQueries;
  n
    ? (e.contentQueries = (r, o, i) => {
        (t(r, o, i), n(r, o, i));
      })
    : (e.contentQueries = t);
}
function my(e, t) {
  let n = e.hostBindings;
  n
    ? (e.hostBindings = (r, o) => {
        (t(r, o), n(r, o));
      })
    : (e.hostBindings = t);
}
function yy(e) {
  let t = (n) => {
    let r = Array.isArray(e);
    n.hostDirectives === null
      ? ((n.resolveHostDirectives = vy),
        (n.hostDirectives = r ? e.map(Ws) : [e]))
      : r
        ? n.hostDirectives.unshift(...e.map(Ws))
        : n.hostDirectives.unshift(e);
  };
  return ((t.ngInherit = !0), t);
}
function vy(e) {
  let t = [],
    n = !1,
    r = null,
    o = null;
  for (let i = 0; i < e.length; i++) {
    let s = e[i];
    if (s.hostDirectives !== null) {
      let a = t.length;
      ((r ??= new Map()),
        (o ??= new Map()),
        kd(s, t, r),
        o.set(s, [a, t.length - 1]));
    }
    i === 0 && he(s) && ((n = !0), t.push(s));
  }
  for (let i = n ? 1 : 0; i < e.length; i++) t.push(e[i]);
  return [t, r, o];
}
function kd(e, t, n) {
  if (e.hostDirectives !== null)
    for (let r of e.hostDirectives)
      if (typeof r == "function") {
        let o = r();
        for (let i of o) Yl(Ws(i), t, n);
      } else Yl(r, t, n);
}
function Yl(e, t, n) {
  let r = Ur(e.directive);
  (Ey(r.declaredInputs, e.inputs), kd(r, t, n), n.set(r, e), t.push(r));
}
function Ws(e) {
  return typeof e == "function"
    ? { directive: F(e), inputs: de, outputs: de }
    : {
        directive: F(e.directive),
        inputs: Kl(e.inputs),
        outputs: Kl(e.outputs),
      };
}
function Kl(e) {
  if (e === void 0 || e.length === 0) return de;
  let t = {};
  for (let n = 0; n < e.length; n += 2) t[e[n]] = e[n + 1];
  return t;
}
function Ey(e, t) {
  for (let n in t)
    if (t.hasOwnProperty(n)) {
      let r = t[n],
        o = e[n];
      e[r] = o;
    }
}
function Pd(e, t, n, r, o, i, s, a) {
  if (n.firstCreatePass) {
    e.mergedAttrs = Gt(e.mergedAttrs, e.attrs);
    let u = (e.tView = ua(
      2,
      e,
      o,
      i,
      s,
      n.directiveRegistry,
      n.pipeRegistry,
      null,
      n.schemas,
      n.consts,
      null,
    ));
    n.queries !== null &&
      (n.queries.template(n, e), (u.queries = n.queries.embeddedTView(e)));
  }
  (a && (e.flags |= a), Ht(e, !1));
  let c = Dy(n, t, e, r);
  (to() && ga(n, t, c, e), Wt(c, t));
  let l = dd(c, t, c, e);
  ((t[r + k] = l), fa(t, l), qm(l, e, t));
}
function Iy(e, t, n, r, o, i, s, a, c, l, u) {
  let d = n + k,
    p;
  return (
    t.firstCreatePass
      ? ((p = tn(t, d, 4, s || null, a || null)),
        Zr() && vd(t, e, p, le(t.consts, l), ya),
        fu(t, p))
      : (p = t.data[d]),
    Pd(p, e, t, n, r, o, i, c),
    jt(p) && ko(t, e, p),
    l != null && Un(e, p, u),
    p
  );
}
function jn(e, t, n, r, o, i, s, a, c, l, u) {
  let d = n + k,
    p;
  if (t.firstCreatePass) {
    if (((p = tn(t, d, 4, s || null, a || null)), l != null)) {
      let f = le(t.consts, l);
      p.localNames = [];
      for (let h = 0; h < f.length; h += 2) p.localNames.push(f[h], -1);
    }
  } else p = t.data[d];
  return (Pd(p, e, t, n, r, o, i, c), l != null && Un(e, p, u), p);
}
function Ld(e, t, n, r, o, i, s, a) {
  let c = g(),
    l = O(),
    u = le(l.consts, i);
  return (Iy(c, l, e, t, n, r, o, u, void 0, s, a), Ld);
}
var Dy = Cy;
function Cy(e, t, n, r) {
  return (bn(!0), t[R].createComment(""));
}
var Na = (function (e) {
    return (
      (e[(e.CHANGE_DETECTION = 0)] = "CHANGE_DETECTION"),
      (e[(e.AFTER_NEXT_RENDER = 1)] = "AFTER_NEXT_RENDER"),
      e
    );
  })(Na || {}),
  Ma = new M(""),
  Fd = !1,
  zs = class extends Pe {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(t = !1) {
      (super(),
        (this.__isAsync = t),
        tl() &&
          ((this.destroyRef = D(ht, { optional: !0 }) ?? void 0),
          (this.pendingTasks = D(gt, { optional: !0 }) ?? void 0)));
    }
    emit(t) {
      let n = y(null);
      try {
        super.next(t);
      } finally {
        y(n);
      }
    }
    subscribe(t, n, r) {
      let o = t,
        i = n || (() => null),
        s = r;
      if (t && typeof t == "object") {
        let c = t;
        ((o = c.next?.bind(c)),
          (i = c.error?.bind(c)),
          (s = c.complete?.bind(c)));
      }
      this.__isAsync &&
        ((i = this.wrapInTimeout(i)),
        o && (o = this.wrapInTimeout(o)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: o, error: i, complete: s });
      return (t instanceof H && t.add(a), a);
    }
    wrapInTimeout(t) {
      return (n) => {
        let r = this.pendingTasks?.add();
        setTimeout(() => {
          try {
            t(n);
          } finally {
            r !== void 0 && this.pendingTasks?.remove(r);
          }
        });
      };
    }
  },
  Ae = zs;
function jd(e) {
  let t, n;
  function r() {
    e = mt;
    try {
      (n !== void 0 &&
        typeof cancelAnimationFrame == "function" &&
        cancelAnimationFrame(n),
        t !== void 0 && clearTimeout(t));
    } catch {}
  }
  return (
    (t = setTimeout(() => {
      (e(), r());
    })),
    typeof requestAnimationFrame == "function" &&
      (n = requestAnimationFrame(() => {
        (e(), r());
      })),
    () => r()
  );
}
function Jl(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = mt;
    }
  );
}
var Sa = "isAngularZone",
  _o = Sa + "_ID",
  wy = 0,
  te = class e {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new Ae(!1);
    onMicrotaskEmpty = new Ae(!1);
    onStable = new Ae(!1);
    onError = new Ae(!1);
    constructor(t) {
      let {
        enableLongStackTrace: n = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: o = !1,
        scheduleInRootZone: i = Fd,
      } = t;
      if (typeof Zone > "u") throw new _(908, !1);
      Zone.assertZonePatched();
      let s = this;
      ((s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        n &&
          Zone.longStackTraceZoneSpec &&
          (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !o && r),
        (s.shouldCoalesceRunChangeDetection = o),
        (s.callbackScheduled = !1),
        (s.scheduleInRootZone = i),
        by(s));
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get(Sa) === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new _(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new _(909, !1);
    }
    run(t, n, r) {
      return this._inner.run(t, n, r);
    }
    runTask(t, n, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask("NgZoneEvent: " + o, t, _y, mt, mt);
      try {
        return i.runTask(s, n, r);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  _y = {};
function xa(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      (e._nesting++, e.onMicrotaskEmpty.emit(null));
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function Ty(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    jd(() => {
      ((e.callbackScheduled = !1),
        Qs(e),
        (e.isCheckStableRunning = !0),
        xa(e),
        (e.isCheckStableRunning = !1));
    });
  }
  (e.scheduleInRootZone
    ? Zone.root.run(() => {
        t();
      })
    : e._outer.run(() => {
        t();
      }),
    Qs(e));
}
function by(e) {
  let t = () => {
      Ty(e);
    },
    n = wy++;
  e._inner = e._inner.fork({
    name: "angular",
    properties: { [Sa]: !0, [_o]: n, [_o + n]: !0 },
    onInvokeTask: (r, o, i, s, a, c) => {
      if (Ny(c)) return r.invokeTask(i, s, a, c);
      try {
        return (Xl(e), r.invokeTask(i, s, a, c));
      } finally {
        (((e.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          eu(e));
      }
    },
    onInvoke: (r, o, i, s, a, c, l) => {
      try {
        return (Xl(e), r.invoke(i, s, a, c, l));
      } finally {
        (e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !My(c) &&
          t(),
          eu(e));
      }
    },
    onHasTask: (r, o, i, s) => {
      (r.hasTask(i, s),
        o === i &&
          (s.change == "microTask"
            ? ((e._hasPendingMicrotasks = s.microTask), Qs(e), xa(e))
            : s.change == "macroTask" &&
              (e.hasPendingMacrotasks = s.macroTask)));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s),
      e.runOutsideAngular(() => e.onError.emit(s)),
      !1
    ),
  });
}
function Qs(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function Xl(e) {
  (e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null)));
}
function eu(e) {
  (e._nesting--, xa(e));
}
var Vn = class {
  hasPendingMicrotasks = !1;
  hasPendingMacrotasks = !1;
  isStable = !0;
  onUnstable = new Ae();
  onMicrotaskEmpty = new Ae();
  onStable = new Ae();
  onError = new Ae();
  run(t, n, r) {
    return t.apply(n, r);
  }
  runGuarded(t, n, r) {
    return t.apply(n, r);
  }
  runOutsideAngular(t) {
    return t();
  }
  runTask(t, n, r, o) {
    return t.apply(n, r);
  }
};
function Ny(e) {
  return Vd(e, "__ignore_ng_zone__");
}
function My(e) {
  return Vd(e, "__scheduler_tick__");
}
function Vd(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
var Hd = (() => {
  class e {
    impl = null;
    execute() {
      this.impl?.execute();
    }
    static ɵprov = B({ token: e, providedIn: "root", factory: () => new e() });
  }
  return e;
})();
var Sy = (() => {
  class e {
    log(n) {
      console.log(n);
    }
    warn(n) {
      console.warn(n);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = B({ token: e, factory: e.ɵfac, providedIn: "platform" });
  }
  return e;
})();
var Bd = new M("");
function Ra(e) {
  return !!e && typeof e.then == "function";
}
function $d(e) {
  return !!e && typeof e.subscribe == "function";
}
var Aa = new M("");
function xy(e) {
  return Pt([{ provide: Aa, multi: !0, useValue: e }]);
}
var Oa = (() => {
    class e {
      resolve;
      reject;
      initialized = !1;
      done = !1;
      donePromise = new Promise((n, r) => {
        ((this.resolve = n), (this.reject = r));
      });
      appInits = D(Aa, { optional: !0 }) ?? [];
      injector = D(be);
      constructor() {}
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let i = qr(this.injector, o);
          if (Ra(i)) n.push(i);
          else if ($d(i)) {
            let s = new Promise((a, c) => {
              i.subscribe({ complete: a, error: c });
            });
            n.push(s);
          }
        }
        let r = () => {
          ((this.done = !0), this.resolve());
        };
        (Promise.all(n)
          .then(() => {
            r();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && r(),
          (this.initialized = !0));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = B({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  Ud = new M("");
function qd() {
  Zo(() => {
    let e = "";
    throw new _(600, e);
  });
}
function Gd(e) {
  return e.isBoundToModule;
}
var Ry = 10;
var Qn = (() => {
  class e {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = D(Re);
    afterRenderManager = D(Hd);
    zonelessEnabled = D(Nn);
    rootEffectScheduler = D(Sn);
    dirtyFlags = 0;
    tracingSnapshot = null;
    allTestViews = new Set();
    autoDetectTestViews = new Set();
    includeAllTestViews = !1;
    afterTick = new Pe();
    get allViews() {
      return [
        ...(this.includeAllTestViews
          ? this.allTestViews
          : this.autoDetectTestViews
        ).keys(),
        ...this._views,
      ];
    }
    get destroyed() {
      return this._destroyed;
    }
    componentTypes = [];
    components = [];
    internalPendingTask = D(gt);
    get isStable() {
      return this.internalPendingTask.hasPendingTasksObservable.pipe(
        et((n) => !n),
      );
    }
    constructor() {
      D(Ma, { optional: !0 });
    }
    whenStable() {
      let n;
      return new Promise((r) => {
        n = this.isStable.subscribe({
          next: (o) => {
            o && r();
          },
        });
      }).finally(() => {
        n.unsubscribe();
      });
    }
    _injector = D(oe);
    _rendererFactory = null;
    get injector() {
      return this._injector;
    }
    bootstrap(n, r) {
      return this.bootstrapImpl(n, r);
    }
    bootstrapImpl(n, r, o = be.NULL) {
      return this._injector.get(te).run(() => {
        A(10);
        let s = n instanceof Fo;
        if (!this._injector.get(Oa).done) {
          let h = "";
          throw new _(405, h);
        }
        let c;
        (s ? (c = n) : (c = this._injector.get(Wn).resolveComponentFactory(n)),
          this.componentTypes.push(c.componentType));
        let l = Gd(c) ? void 0 : this._injector.get(Kt),
          u = r || c.selector,
          d = c.create(o, [], u, l),
          p = d.location.nativeElement,
          f = d.injector.get(Bd, null);
        return (
          f?.registerApplication(p),
          d.onDestroy(() => {
            (this.detachView(d.hostView),
              Rn(this.components, d),
              f?.unregisterApplication(p));
          }),
          this._loadComponent(d),
          A(11, d),
          d
        );
      });
    }
    tick() {
      (this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick());
    }
    _tick() {
      (A(12),
        this.tracingSnapshot !== null
          ? this.tracingSnapshot.run(Na.CHANGE_DETECTION, this.tickImpl)
          : this.tickImpl());
    }
    tickImpl = () => {
      if (this._runningTick) throw new _(101, !1);
      let n = y(null);
      try {
        ((this._runningTick = !0), this.synchronize());
      } finally {
        ((this._runningTick = !1),
          this.tracingSnapshot?.dispose(),
          (this.tracingSnapshot = null),
          y(n),
          this.afterTick.next(),
          A(13));
      }
    };
    synchronize() {
      this._rendererFactory === null &&
        !this._injector.destroyed &&
        (this._rendererFactory = this._injector.get(Ln, null, {
          optional: !0,
        }));
      let n = 0;
      for (; this.dirtyFlags !== 0 && n++ < Ry; )
        (A(14), this.synchronizeOnce(), A(15));
    }
    synchronizeOnce() {
      this.dirtyFlags & 16 &&
        ((this.dirtyFlags &= -17), this.rootEffectScheduler.flush());
      let n = !1;
      if (this.dirtyFlags & 7) {
        let r = !!(this.dirtyFlags & 1);
        ((this.dirtyFlags &= -8), (this.dirtyFlags |= 8));
        for (let { _lView: o } of this.allViews) {
          if (!r && !_n(o)) continue;
          let i = r && !this.zonelessEnabled ? 0 : 1;
          (Da(o, i), (n = !0));
        }
        if (
          ((this.dirtyFlags &= -5),
          this.syncDirtyFlagsWithViews(),
          this.dirtyFlags & 23)
        )
          return;
      }
      (n || (this._rendererFactory?.begin?.(), this._rendererFactory?.end?.()),
        this.dirtyFlags & 8 &&
          ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews());
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: n }) => _n(n))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(n) {
      let r = n;
      (this._views.push(r), r.attachToAppRef(this));
    }
    detachView(n) {
      let r = n;
      (Rn(this._views, r), r.detachFromAppRef());
    }
    _loadComponent(n) {
      this.attachView(n.hostView);
      try {
        this.tick();
      } catch (o) {
        this.internalErrorHandler(o);
      }
      (this.components.push(n),
        this._injector.get(Ud, []).forEach((o) => o(n)));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          (this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy()));
        } finally {
          ((this._destroyed = !0),
            (this._views = []),
            (this._destroyListeners = []));
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n),
        () => Rn(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new _(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = B({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
function Rn(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
var Cs = "aria";
function Wd(e, t) {
  let n = g(),
    r = xe();
  if (Q(n, r, t)) {
    let o = O(),
      i = $t();
    if (Po(i, o, n, e, t)) Se(i) && ed(n, i.index);
    else {
      let a = ae(i, n),
        c = Ay(e);
      td(n[R], a, null, i.value, c, t, null);
    }
  }
  return Wd;
}
function Ay(e) {
  return e.charAt(Cs.length) !== "-"
    ? Cs + "-" + e.slice(Cs.length).toLowerCase()
    : e;
}
function zd(e, t, n, r) {
  let o = g(),
    i = xe();
  if (Q(o, i, t)) {
    let s = O(),
      a = $t();
    $g(a, o, e, t, n, r);
  }
  return zd;
}
var Oy = new M("", { providedIn: "root", factory: () => !1 }),
  ky = new M("", { providedIn: "root", factory: () => Py }),
  Py = 4e3;
var zb =
  typeof document < "u" &&
  typeof document?.documentElement?.getAnimations == "function";
var Zs = class {
  destroy(t) {}
  updateValue(t, n) {}
  swap(t, n) {
    let r = Math.min(t, n),
      o = Math.max(t, n),
      i = this.detach(o);
    if (o - r > 1) {
      let s = this.detach(r);
      (this.attach(r, i), this.attach(o, s));
    } else this.attach(r, i);
  }
  move(t, n) {
    this.attach(n, this.detach(t));
  }
};
function ws(e, t, n, r, o) {
  return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
}
function Ly(e, t, n) {
  let r,
    o,
    i = 0,
    s = e.length - 1,
    a = void 0;
  if (Array.isArray(t)) {
    let c = t.length - 1;
    for (; i <= s && i <= c; ) {
      let l = e.at(i),
        u = t[i],
        d = ws(i, l, i, u, n);
      if (d !== 0) {
        (d < 0 && e.updateValue(i, u), i++);
        continue;
      }
      let p = e.at(s),
        f = t[c],
        h = ws(s, p, c, f, n);
      if (h !== 0) {
        (h < 0 && e.updateValue(s, f), s--, c--);
        continue;
      }
      let E = n(i, l),
        x = n(s, p),
        w = n(i, u);
      if (Object.is(w, x)) {
        let nn = n(c, f);
        (Object.is(nn, E)
          ? (e.swap(i, s), e.updateValue(s, f), c--, s--)
          : e.move(s, i),
          e.updateValue(i, u),
          i++);
        continue;
      }
      if (((r ??= new To()), (o ??= nu(e, i, s, n)), Ys(e, r, i, w)))
        (e.updateValue(i, u), i++, s++);
      else if (o.has(w)) (r.set(E, e.detach(i)), s--);
      else {
        let nn = e.create(i, t[i]);
        (e.attach(i, nn), i++, s++);
      }
    }
    for (; i <= c; ) (tu(e, r, n, i, t[i]), i++);
  } else if (t != null) {
    let c = t[Symbol.iterator](),
      l = c.next();
    for (; !l.done && i <= s; ) {
      let u = e.at(i),
        d = l.value,
        p = ws(i, u, i, d, n);
      if (p !== 0) (p < 0 && e.updateValue(i, d), i++, (l = c.next()));
      else {
        ((r ??= new To()), (o ??= nu(e, i, s, n)));
        let f = n(i, d);
        if (Ys(e, r, i, f)) (e.updateValue(i, d), i++, s++, (l = c.next()));
        else if (!o.has(f))
          (e.attach(i, e.create(i, d)), i++, s++, (l = c.next()));
        else {
          let h = n(i, u);
          (r.set(h, e.detach(i)), s--);
        }
      }
    }
    for (; !l.done; ) (tu(e, r, n, e.length, l.value), (l = c.next()));
  }
  for (; i <= s; ) e.destroy(e.detach(s--));
  r?.forEach((c) => {
    e.destroy(c);
  });
}
function Ys(e, t, n, r) {
  return t !== void 0 && t.has(r)
    ? (e.attach(n, t.get(r)), t.delete(r), !0)
    : !1;
}
function tu(e, t, n, r, o) {
  if (Ys(e, t, r, n(r, o))) e.updateValue(r, o);
  else {
    let i = e.create(r, o);
    e.attach(r, i);
  }
}
function nu(e, t, n, r) {
  let o = new Set();
  for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
  return o;
}
var To = class {
  kvMap = new Map();
  _vMap = void 0;
  has(t) {
    return this.kvMap.has(t);
  }
  delete(t) {
    if (!this.has(t)) return !1;
    let n = this.kvMap.get(t);
    return (
      this._vMap !== void 0 && this._vMap.has(n)
        ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n))
        : this.kvMap.delete(t),
      !0
    );
  }
  get(t) {
    return this.kvMap.get(t);
  }
  set(t, n) {
    if (this.kvMap.has(t)) {
      let r = this.kvMap.get(t);
      this._vMap === void 0 && (this._vMap = new Map());
      let o = this._vMap;
      for (; o.has(r); ) r = o.get(r);
      o.set(r, n);
    } else this.kvMap.set(t, n);
  }
  forEach(t) {
    for (let [n, r] of this.kvMap)
      if ((t(r, n), this._vMap !== void 0)) {
        let o = this._vMap;
        for (; o.has(r); ) ((r = o.get(r)), t(r, n));
      }
  }
};
function Fy(e, t, n, r, o, i, s, a) {
  It("NgControlFlow");
  let c = g(),
    l = O(),
    u = le(l.consts, i);
  return (jn(c, l, e, t, n, r, o, u, 256, s, a), ka);
}
function ka(e, t, n, r, o, i, s, a) {
  It("NgControlFlow");
  let c = g(),
    l = O(),
    u = le(l.consts, i);
  return (jn(c, l, e, t, n, r, o, u, 512, s, a), ka);
}
function jy(e, t) {
  It("NgControlFlow");
  let n = g(),
    r = xe(),
    o = n[r] !== X ? n[r] : -1,
    i = o !== -1 ? bo(n, k + o) : void 0,
    s = 0;
  if (Q(n, r, e)) {
    let a = y(null);
    try {
      if ((i !== void 0 && pd(i, s), e !== -1)) {
        let c = k + e,
          l = bo(n, c),
          u = ea(n[m], c),
          d = gd(l, u, n),
          p = qn(n, u, t, { dehydratedView: d });
        Gn(l, p, s, Qt(u, d));
      }
    } finally {
      y(a);
    }
  } else if (i !== void 0) {
    let a = fd(i, s);
    a !== void 0 && (a[P] = t);
  }
}
var Ks = class {
  lContainer;
  $implicit;
  $index;
  constructor(t, n, r) {
    ((this.lContainer = t), (this.$implicit = n), (this.$index = r));
  }
  get $count() {
    return this.lContainer.length - $;
  }
};
var Js = class {
  hasEmptyBlock;
  trackByFn;
  liveCollection;
  constructor(t, n, r) {
    ((this.hasEmptyBlock = t), (this.trackByFn = n), (this.liveCollection = r));
  }
};
function Vy(e, t, n, r, o, i, s, a, c, l, u, d, p) {
  It("NgControlFlow");
  let f = g(),
    h = O(),
    E = c !== void 0,
    x = g(),
    w = a ? s.bind(x[J][P]) : s,
    nn = new Js(E, w);
  ((x[k + e] = nn),
    jn(f, h, e + 1, t, n, r, o, le(h.consts, i), 256),
    E && jn(f, h, e + 2, c, l, u, d, le(h.consts, p), 512));
}
var Xs = class extends Zs {
  lContainer;
  hostLView;
  templateTNode;
  operationsCounter = void 0;
  needsIndexUpdate = !1;
  constructor(t, n, r) {
    (super(),
      (this.lContainer = t),
      (this.hostLView = n),
      (this.templateTNode = r));
  }
  get length() {
    return this.lContainer.length - $;
  }
  at(t) {
    return this.getLView(t)[P].$implicit;
  }
  attach(t, n) {
    let r = n[at];
    ((this.needsIndexUpdate ||= t !== this.length),
      Gn(this.lContainer, n, t, Qt(this.templateTNode, r)));
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1),
      By(this.lContainer, t)
    );
  }
  create(t, n) {
    let r = yo(this.lContainer, this.templateTNode.tView.ssrId),
      o = qn(
        this.hostLView,
        this.templateTNode,
        new Ks(this.lContainer, n, t),
        { dehydratedView: r },
      );
    return (this.operationsCounter?.recordCreate(), o);
  }
  destroy(t) {
    (Ao(t[m], t), this.operationsCounter?.recordDestroy());
  }
  updateValue(t, n) {
    this.getLView(t)[P].$implicit = n;
  }
  reset() {
    ((this.needsIndexUpdate = !1), this.operationsCounter?.reset());
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[P].$index = t;
  }
  getLView(t) {
    return $y(this.lContainer, t);
  }
};
function Hy(e) {
  let t = y(null),
    n = Ce();
  try {
    let r = g(),
      o = r[m],
      i = r[n],
      s = n + 1,
      a = bo(r, s);
    if (i.liveCollection === void 0) {
      let l = ea(o, s);
      i.liveCollection = new Xs(a, r, l);
    } else i.liveCollection.reset();
    let c = i.liveCollection;
    if ((Ly(c, e, i.trackByFn), c.updateIndexes(), i.hasEmptyBlock)) {
      let l = xe(),
        u = c.length === 0;
      if (Q(r, l, u)) {
        let d = n + 2,
          p = bo(r, d);
        if (u) {
          let f = ea(o, d),
            h = gd(p, f, r),
            E = qn(r, f, void 0, { dehydratedView: h });
          Gn(p, E, 0, Qt(f, h));
        } else (o.firstUpdatePass && fm(p), pd(p, 0));
      }
    }
  } finally {
    y(t);
  }
}
function bo(e, t) {
  return e[t];
}
function By(e, t) {
  return kn(e, t);
}
function $y(e, t) {
  return fd(e, t);
}
function ea(e, t) {
  return wn(e, t);
}
function Qd(e, t, n) {
  let r = g(),
    o = xe();
  if (Q(r, o, t)) {
    let i = O(),
      s = $t();
    Ju(s, r, e, t, r[R], n);
  }
  return Qd;
}
function ta(e, t, n, r, o) {
  Po(t, e, n, o ? "class" : "style", r);
}
function Pa(e, t, n, r) {
  let o = g(),
    i = o[m],
    s = e + k,
    a = i.firstCreatePass ? wa(s, o, 2, t, ya, Zr(), n, r) : i.data[s];
  if ((va(a, o, e, t, Kd), jt(a))) {
    let c = o[m];
    (ko(c, o, a), ca(c, a, o));
  }
  return (r != null && Un(o, a), Pa);
}
function La() {
  let e = O(),
    t = U(),
    n = Ea(t);
  return (
    e.firstCreatePass && _a(e, n),
    es(n) && ts(),
    Ji(),
    n.classesWithoutHost != null &&
      Dh(n) &&
      ta(e, n, g(), n.classesWithoutHost, !0),
    n.stylesWithoutHost != null &&
      Ch(n) &&
      ta(e, n, g(), n.stylesWithoutHost, !1),
    La
  );
}
function Zd(e, t, n, r) {
  return (Pa(e, t, n, r), La(), Zd);
}
function Fa(e, t, n, r) {
  let o = g(),
    i = o[m],
    s = e + k,
    a = i.firstCreatePass ? Mm(s, i, 2, t, n, r) : i.data[s];
  return (va(a, o, e, t, Kd), r != null && Un(o, a), Fa);
}
function ja() {
  let e = U(),
    t = Ea(e);
  return (es(t) && ts(), Ji(), ja);
}
function Yd(e, t, n, r) {
  return (Fa(e, t, n, r), ja(), Yd);
}
var Kd = (e, t, n, r, o) => (bn(!0), Vu(t[R], r, bl()));
function Va(e, t, n) {
  let r = g(),
    o = r[m],
    i = e + k,
    s = o.firstCreatePass
      ? wa(i, r, 8, "ng-container", ya, Zr(), t, n)
      : o.data[i];
  if ((va(s, r, e, "ng-container", Uy), jt(s))) {
    let a = r[m];
    (ko(a, r, s), ca(a, s, r));
  }
  return (n != null && Un(r, s), Va);
}
function Ha() {
  let e = O(),
    t = U(),
    n = Ea(t);
  return (e.firstCreatePass && _a(e, n), Ha);
}
function Jd(e, t, n) {
  return (Va(e, t, n), Ha(), Jd);
}
var Uy = (e, t, n, r, o) => (bn(!0), mg(t[R], ""));
function qy() {
  return g();
}
function Xd(e, t, n) {
  let r = g(),
    o = xe();
  if (Q(r, o, t)) {
    let i = O(),
      s = $t();
    Xu(s, r, e, t, r[R], n);
  }
  return Xd;
}
var Zn = "en-US";
var Gy = Zn;
function ef(e) {
  typeof e == "string" && (Gy = e.toLowerCase().replace(/_/g, "-"));
}
function tf(e, t, n) {
  let r = g(),
    o = O(),
    i = U();
  return (nf(o, r, r[R], i, e, t, n), tf);
}
function nf(e, t, n, r, o, i, s) {
  let a = !0,
    c = null;
  if (
    ((r.type & 3 || s) &&
      ((c ??= Es(r, t, i)), Sm(r, e, t, s, n, o, i, c) && (a = !1)),
    a)
  ) {
    let l = r.outputs?.[o],
      u = r.hostDirectiveOutputs?.[o];
    if (u && u.length)
      for (let d = 0; d < u.length; d += 2) {
        let p = u[d],
          f = u[d + 1];
        ((c ??= Es(r, t, i)), Gl(r, t, p, f, o, c));
      }
    if (l && l.length)
      for (let d of l) ((c ??= Es(r, t, i)), Gl(r, t, d, o, o, c));
  }
}
function Wy(e = 1) {
  return _l(e);
}
function zy(e, t) {
  let n = null,
    r = ag(e);
  for (let o = 0; o < t.length; o++) {
    let i = t[o];
    if (i === "*") {
      n = o;
      continue;
    }
    if (r === null ? ju(e, i, !0) : ug(r, i)) return o;
  }
  return n;
}
function Qy(e) {
  let t = g()[J][K];
  if (!t.projection) {
    let n = e ? e.length : 1,
      r = (t.projection = zc(n, null)),
      o = r.slice(),
      i = t.child;
    for (; i !== null; ) {
      if (i.type !== 128) {
        let s = e ? zy(i, e) : 0;
        s !== null &&
          (o[s] ? (o[s].projectionNext = i) : (r[s] = i), (o[s] = i));
      }
      i = i.next;
    }
  }
}
function Zy(e, t = 0, n, r, o, i) {
  let s = g(),
    a = O(),
    c = r ? e + 1 : null;
  c !== null && jn(s, a, c, r, o, i, null, n);
  let l = tn(a, k + e, 16, null, n || null);
  (l.projection === null && (l.projection = t), os());
  let d = !s[at] || Xi();
  s[J][K].projection[l.projection] === null && c !== null
    ? Yy(s, a, c)
    : d && !So(l) && Ag(a, s, l);
}
function Yy(e, t, n) {
  let r = k + n,
    o = t.data[r],
    i = e[r],
    s = yo(i, o.tView.ssrId),
    a = qn(e, o, void 0, { dehydratedView: s });
  Gn(i, a, 0, Qt(o, s));
}
function Ky(e, t, n, r) {
  Jm(e, t, n, r);
}
function Jy(e, t, n) {
  Km(e, t, n);
}
function Xy(e) {
  let t = g(),
    n = O(),
    r = as();
  Jr(r + 1);
  let o = ba(n, r);
  if (e.dirty && ol(t) === ((o.metadata.flags & 2) === 2)) {
    if (o.matches === null) e.reset([]);
    else {
      let i = ty(t, r);
      (e.reset(i, Lh), e.notifyOnChanges());
    }
    return !0;
  }
  return !1;
}
function ev() {
  return Ym(g(), as());
}
function tv(e) {
  let t = hl();
  return Gi(t, k + e);
}
function ro(e, t) {
  return (e << 17) | (t << 2);
}
function Et(e) {
  return (e >> 17) & 32767;
}
function nv(e) {
  return (e & 2) == 2;
}
function rv(e, t) {
  return (e & 131071) | (t << 17);
}
function na(e) {
  return e | 2;
}
function Jt(e) {
  return (e & 131068) >> 2;
}
function _s(e, t) {
  return (e & -131069) | (t << 2);
}
function ov(e) {
  return (e & 1) === 1;
}
function ra(e) {
  return e | 1;
}
function iv(e, t, n, r, o, i) {
  let s = i ? t.classBindings : t.styleBindings,
    a = Et(s),
    c = Jt(s);
  e[r] = n;
  let l = !1,
    u;
  if (Array.isArray(n)) {
    let d = n;
    ((u = d[1]), (u === null || kt(d, u) > 0) && (l = !0));
  } else u = n;
  if (o)
    if (c !== 0) {
      let p = Et(e[a + 1]);
      ((e[r + 1] = ro(p, a)),
        p !== 0 && (e[p + 1] = _s(e[p + 1], r)),
        (e[a + 1] = rv(e[a + 1], r)));
    } else
      ((e[r + 1] = ro(a, 0)), a !== 0 && (e[a + 1] = _s(e[a + 1], r)), (a = r));
  else
    ((e[r + 1] = ro(c, 0)),
      a === 0 ? (a = r) : (e[c + 1] = _s(e[c + 1], r)),
      (c = r));
  (l && (e[r + 1] = na(e[r + 1])),
    ru(e, u, r, !0),
    ru(e, u, r, !1),
    sv(t, u, e, r, i),
    (s = ro(a, c)),
    i ? (t.classBindings = s) : (t.styleBindings = s));
}
function sv(e, t, n, r, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null &&
    typeof t == "string" &&
    kt(i, t) >= 0 &&
    (n[r + 1] = ra(n[r + 1]));
}
function ru(e, t, n, r) {
  let o = e[n + 1],
    i = t === null,
    s = r ? Et(o) : Jt(o),
    a = !1;
  for (; s !== 0 && (a === !1 || i); ) {
    let c = e[s],
      l = e[s + 1];
    (av(c, t) && ((a = !0), (e[s + 1] = r ? ra(l) : na(l))),
      (s = r ? Et(l) : Jt(l)));
  }
  a && (e[n + 1] = r ? na(o) : ra(o));
}
function av(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == "string"
      ? kt(e, t) >= 0
      : !1;
}
var V = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function rf(e) {
  return e.substring(V.key, V.keyEnd);
}
function cv(e) {
  return e.substring(V.value, V.valueEnd);
}
function lv(e) {
  return (af(e), of(e, Xt(e, 0, V.textEnd)));
}
function of(e, t) {
  let n = V.textEnd;
  return n === t ? -1 : ((t = V.keyEnd = dv(e, (V.key = t), n)), Xt(e, t, n));
}
function uv(e) {
  return (af(e), sf(e, Xt(e, 0, V.textEnd)));
}
function sf(e, t) {
  let n = V.textEnd,
    r = (V.key = Xt(e, t, n));
  return n === r
    ? -1
    : ((r = V.keyEnd = fv(e, r, n)),
      (r = ou(e, r, n, 58)),
      (r = V.value = Xt(e, r, n)),
      (r = V.valueEnd = pv(e, r, n)),
      ou(e, r, n, 59));
}
function af(e) {
  ((V.key = 0),
    (V.keyEnd = 0),
    (V.value = 0),
    (V.valueEnd = 0),
    (V.textEnd = e.length));
}
function Xt(e, t, n) {
  for (; t < n && e.charCodeAt(t) <= 32; ) t++;
  return t;
}
function dv(e, t, n) {
  for (; t < n && e.charCodeAt(t) > 32; ) t++;
  return t;
}
function fv(e, t, n) {
  let r;
  for (
    ;
    t < n &&
    ((r = e.charCodeAt(t)) === 45 ||
      r === 95 ||
      ((r & -33) >= 65 && (r & -33) <= 90) ||
      (r >= 48 && r <= 57));

  )
    t++;
  return t;
}
function ou(e, t, n, r) {
  return ((t = Xt(e, t, n)), t < n && t++, t);
}
function pv(e, t, n) {
  let r = -1,
    o = -1,
    i = -1,
    s = t,
    a = s;
  for (; s < n; ) {
    let c = e.charCodeAt(s++);
    if (c === 59) return a;
    (c === 34 || c === 39
      ? (a = s = iu(e, c, s, n))
      : t === s - 4 && i === 85 && o === 82 && r === 76 && c === 40
        ? (a = s = iu(e, 41, s, n))
        : c > 32 && (a = s),
      (i = o),
      (o = r),
      (r = c & -33));
  }
  return a;
}
function iu(e, t, n, r) {
  let o = -1,
    i = n;
  for (; i < r; ) {
    let s = e.charCodeAt(i++);
    if (s == t && o !== 92) return i;
    s == 92 && o === 92 ? (o = 0) : (o = s);
  }
  throw new Error();
}
function cf(e, t, n) {
  return (uf(e, t, n, !1), cf);
}
function lf(e, t) {
  return (uf(e, t, null, !0), lf);
}
function hv(e) {
  df(hf, gv, e, !1);
}
function gv(e, t) {
  for (let n = uv(t); n >= 0; n = sf(t, n)) hf(e, rf(t), cv(t));
}
function mv(e) {
  df(wv, yv, e, !0);
}
function yv(e, t) {
  for (let n = lv(t); n >= 0; n = of(t, n)) En(e, rf(t), !0);
}
function uf(e, t, n, r) {
  let o = g(),
    i = O(),
    s = Yr(2);
  if ((i.firstUpdatePass && pf(i, e, s, r), t !== X && Q(o, s, t))) {
    let a = i.data[Ce()];
    gf(i, a, o, o[R], e, (o[s + 1] = Tv(t, n)), r, s);
  }
}
function df(e, t, n, r) {
  let o = O(),
    i = Yr(2);
  o.firstUpdatePass && pf(o, null, i, r);
  let s = g();
  if (n !== X && Q(s, i, n)) {
    let a = o.data[Ce()];
    if (mf(a, r) && !ff(o, i)) {
      let c = r ? a.classesWithoutHost : a.stylesWithoutHost;
      (c !== null && (n = Fr(c, n || "")), ta(o, a, s, n, r));
    } else _v(o, a, s, s[R], s[i + 1], (s[i + 1] = Cv(e, t, n)), r, i);
  }
}
function ff(e, t) {
  return t >= e.expandoStartIndex;
}
function pf(e, t, n, r) {
  let o = e.data;
  if (o[n + 1] === null) {
    let i = o[Ce()],
      s = ff(e, n);
    (mf(i, r) && t === null && !s && (t = !1),
      (t = vv(o, i, t, r)),
      iv(o, i, t, n, s, r));
  }
}
function vv(e, t, n, r) {
  let o = Il(e),
    i = r ? t.residualClasses : t.residualStyles;
  if (o === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = Ts(null, e, t, n, r)), (n = Hn(n, t.attrs, r)), (i = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((n = Ts(o, e, t, n, r)), i === null)) {
        let c = Ev(e, t, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = Ts(null, e, t, c[1], r)),
          (c = Hn(c, t.attrs, r)),
          Iv(e, t, r, c));
      } else i = Dv(e, t, r);
  }
  return (
    i !== void 0 && (r ? (t.residualClasses = i) : (t.residualStyles = i)),
    n
  );
}
function Ev(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings;
  if (Jt(r) !== 0) return e[Et(r)];
}
function Iv(e, t, n, r) {
  let o = n ? t.classBindings : t.styleBindings;
  e[Et(o)] = r;
}
function Dv(e, t, n) {
  let r,
    o = t.directiveEnd;
  for (let i = 1 + t.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    r = Hn(r, s, n);
  }
  return Hn(r, t.attrs, n);
}
function Ts(e, t, n, r, o) {
  let i = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((i = t[a]), (r = Hn(r, i.hostAttrs, o)), i !== e);

  )
    a++;
  return (e !== null && (n.directiveStylingLast = a), r);
}
function Hn(e, t, n) {
  let r = n ? 1 : 2,
    o = -1;
  if (t !== null)
    for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == "number"
        ? (o = s)
        : o === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]),
          En(e, s, n ? !0 : t[++i]));
    }
  return e === void 0 ? null : e;
}
function Cv(e, t, n) {
  if (n == null || n === "") return Y;
  let r = [],
    o = xo(n);
  if (Array.isArray(o)) for (let i = 0; i < o.length; i++) e(r, o[i], !0);
  else if (typeof o == "object")
    for (let i in o) o.hasOwnProperty(i) && e(r, i, o[i]);
  else typeof o == "string" && t(r, o);
  return r;
}
function hf(e, t, n) {
  En(e, t, xo(n));
}
function wv(e, t, n) {
  let r = String(t);
  r !== "" && !r.includes(" ") && En(e, r, n);
}
function _v(e, t, n, r, o, i, s, a) {
  o === X && (o = Y);
  let c = 0,
    l = 0,
    u = 0 < o.length ? o[0] : null,
    d = 0 < i.length ? i[0] : null;
  for (; u !== null || d !== null; ) {
    let p = c < o.length ? o[c + 1] : void 0,
      f = l < i.length ? i[l + 1] : void 0,
      h = null,
      E;
    (u === d
      ? ((c += 2), (l += 2), p !== f && ((h = d), (E = f)))
      : d === null || (u !== null && u < d)
        ? ((c += 2), (h = u))
        : ((l += 2), (h = d), (E = f)),
      h !== null && gf(e, t, n, r, h, E, s, a),
      (u = c < o.length ? o[c] : null),
      (d = l < i.length ? i[l] : null));
  }
}
function gf(e, t, n, r, o, i, s, a) {
  if (!(t.type & 3)) return;
  let c = e.data,
    l = c[a + 1],
    u = ov(l) ? su(c, t, n, o, Jt(l), s) : void 0;
  if (!No(u)) {
    No(i) || (nv(l) && (i = su(c, null, n, o, a, s)));
    let d = qi(Ce(), n);
    kg(r, s, d, o, i);
  }
}
function su(e, t, n, r, o, i) {
  let s = t === null,
    a;
  for (; o > 0; ) {
    let c = e[o],
      l = Array.isArray(c),
      u = l ? c[1] : c,
      d = u === null,
      p = n[o + 1];
    p === X && (p = d ? Y : void 0);
    let f = d ? $r(p, r) : u === r ? p : void 0;
    if ((l && !No(f) && (f = $r(c, r)), No(f) && ((a = f), s))) return a;
    let h = e[o + 1];
    o = s ? Et(h) : Jt(h);
  }
  if (t !== null) {
    let c = i ? t.residualClasses : t.residualStyles;
    c != null && (a = $r(c, r));
  }
  return a;
}
function No(e) {
  return e !== void 0;
}
function Tv(e, t) {
  return (
    e == null ||
      e === "" ||
      (typeof t == "string"
        ? (e = e + t)
        : typeof e == "object" && (e = Te(xo(e)))),
    e
  );
}
function mf(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
function bv(e, t = "") {
  let n = g(),
    r = O(),
    o = e + k,
    i = r.firstCreatePass ? tn(r, o, 1, t, null) : r.data[o],
    s = Nv(r, n, i, t, e);
  ((n[o] = s), to() && ga(r, n, s, i), Ht(i, !1));
}
var Nv = (e, t, n, r, o) => (bn(!0), hg(t[R], r));
function Mv(e, t, n, r = "") {
  return Q(e, xe(), n) ? t + Ot(n) + r : X;
}
function yf(e, t, n, r, o, i = "") {
  let s = gl(),
    a = Zt(e, s, n, o);
  return (Yr(2), a ? t + Ot(n) + r + Ot(o) + i : X);
}
function vf(e) {
  return (Ba("", e), vf);
}
function Ba(e, t, n) {
  let r = g(),
    o = Mv(r, e, t, n);
  return (o !== X && If(r, Ce(), o), Ba);
}
function Ef(e, t, n, r, o) {
  let i = g(),
    s = yf(i, e, t, n, r, o);
  return (s !== X && If(i, Ce(), s), Ef);
}
function If(e, t, n) {
  let r = qi(t, e);
  gg(e[R], r, n);
}
function Df(e, t, n) {
  hs(t) && (t = t());
  let r = g(),
    o = xe();
  if (Q(r, o, t)) {
    let i = O(),
      s = $t();
    Ju(s, r, e, t, r[R], n);
  }
  return Df;
}
function Sv(e, t) {
  let n = hs(e);
  return (n && e.set(t), n);
}
function Cf(e, t) {
  let n = g(),
    r = O(),
    o = U();
  return (nf(r, n, n[R], o, e, t), Cf);
}
function xv(e, t, n, r, o = "") {
  return yf(g(), e, t, n, r, o);
}
function Rv(e, t, n) {
  let r = O();
  if (r.firstCreatePass) {
    let o = he(e);
    (oa(n, r.data, r.blueprint, o, !0), oa(t, r.data, r.blueprint, o, !1));
  }
}
function oa(e, t, n, r, o) {
  if (((e = F(e)), Array.isArray(e)))
    for (let i = 0; i < e.length; i++) oa(e[i], t, n, r, o);
  else {
    let i = O(),
      s = g(),
      a = U(),
      c = ot(e) ? e : F(e.provide),
      l = ji(e),
      u = a.providerIndexes & 1048575,
      d = a.directiveStart,
      p = a.providerIndexes >> 20;
    if (ot(e) || !e.multi) {
      let f = new vt(l, o, zn, null),
        h = Ns(c, t, o ? u : u + p, d);
      h === -1
        ? (Ss(po(a, s), i, c),
          bs(i, e, t.length),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(f),
          s.push(f))
        : ((n[h] = f), (s[h] = f));
    } else {
      let f = Ns(c, t, u + p, d),
        h = Ns(c, t, u, u + p),
        E = f >= 0 && n[f],
        x = h >= 0 && n[h];
      if ((o && !x) || (!o && !E)) {
        Ss(po(a, s), i, c);
        let w = kv(o ? Ov : Av, n.length, o, r, l, e);
        (!o && x && (n[h].providerFactory = w),
          bs(i, e, t.length, 0),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(w),
          s.push(w));
      } else {
        let w = wf(n[o ? h : f], l, !o && r);
        bs(i, e, f > -1 ? f : h, w);
      }
      !o && r && x && n[h].componentProviders++;
    }
  }
}
function bs(e, t, n, r) {
  let o = ot(t),
    i = el(t);
  if (o || i) {
    let c = (i ? F(t.useClass) : t).prototype.ngOnDestroy;
    if (c) {
      let l = e.destroyHooks || (e.destroyHooks = []);
      if (!o && t.multi) {
        let u = l.indexOf(n);
        u === -1 ? l.push(n, [r, c]) : l[u + 1].push(r, c);
      } else l.push(n, c);
    }
  }
}
function wf(e, t, n) {
  return (n && e.componentProviders++, e.multi.push(t) - 1);
}
function Ns(e, t, n, r) {
  for (let o = n; o < r; o++) if (t[o] === e) return o;
  return -1;
}
function Av(e, t, n, r, o) {
  return ia(this.multi, []);
}
function Ov(e, t, n, r, o) {
  let i = this.multi,
    s;
  if (this.providerFactory) {
    let a = this.providerFactory.componentProviders,
      c = An(r, r[m], this.providerFactory.index, o);
    ((s = c.slice(0, a)), ia(i, s));
    for (let l = a; l < c.length; l++) s.push(c[l]);
  } else ((s = []), ia(i, s));
  return s;
}
function ia(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    t.push(r());
  }
  return t;
}
function kv(e, t, n, r, o, i) {
  let s = new vt(e, n, zn, null);
  return (
    (s.multi = []),
    (s.index = t),
    (s.componentProviders = 0),
    wf(s, o, r && !n),
    s
  );
}
function Pv(e, t = []) {
  return (n) => {
    n.providersResolver = (r, o) => Rv(r, o ? o(e) : e, t);
  };
}
function Lv(e, t, n) {
  let r = ge() + e,
    o = g();
  return o[r] === X ? Oe(o, r, n ? t.call(n) : t()) : Vo(o, r);
}
function Fv(e, t, n, r) {
  return _f(g(), ge(), e, t, n, r);
}
function jv(e, t, n, r, o) {
  return Gv(g(), ge(), e, t, n, r, o);
}
function Vv(e, t, n, r, o, i) {
  return Wv(g(), ge(), e, t, n, r, o, i);
}
function Hv(e, t, n, r, o, i, s) {
  return zv(g(), ge(), e, t, n, r, o, i, s);
}
function Bv(e, t, n, r, o, i, s, a) {
  let c = ge() + e,
    l = g(),
    u = Ho(l, c, n, r, o, i);
  return Q(l, c + 4, s) || u
    ? Oe(l, c + 5, a ? t.call(a, n, r, o, i, s) : t(n, r, o, i, s))
    : Vo(l, c + 5);
}
function $v(e, t, n, r, o, i, s, a, c) {
  let l = ge() + e,
    u = g(),
    d = Ho(u, l, n, r, o, i);
  return Zt(u, l + 4, s, a) || d
    ? Oe(u, l + 6, c ? t.call(c, n, r, o, i, s, a) : t(n, r, o, i, s, a))
    : Vo(u, l + 6);
}
function Uv(e, t, n, r, o, i, s, a, c, l) {
  let u = ge() + e,
    d = g(),
    p = Ho(d, u, n, r, o, i);
  return Dd(d, u + 4, s, a, c) || p
    ? Oe(d, u + 7, l ? t.call(l, n, r, o, i, s, a, c) : t(n, r, o, i, s, a, c))
    : Vo(d, u + 7);
}
function qv(e, t, n, r) {
  return Qv(g(), ge(), e, t, n, r);
}
function Yn(e, t) {
  let n = e[t];
  return n === X ? void 0 : n;
}
function _f(e, t, n, r, o, i) {
  let s = t + n;
  return Q(e, s, o) ? Oe(e, s + 1, i ? r.call(i, o) : r(o)) : Yn(e, s + 1);
}
function Gv(e, t, n, r, o, i, s) {
  let a = t + n;
  return Zt(e, a, o, i)
    ? Oe(e, a + 2, s ? r.call(s, o, i) : r(o, i))
    : Yn(e, a + 2);
}
function Wv(e, t, n, r, o, i, s, a) {
  let c = t + n;
  return Dd(e, c, o, i, s)
    ? Oe(e, c + 3, a ? r.call(a, o, i, s) : r(o, i, s))
    : Yn(e, c + 3);
}
function zv(e, t, n, r, o, i, s, a, c) {
  let l = t + n;
  return Ho(e, l, o, i, s, a)
    ? Oe(e, l + 4, c ? r.call(c, o, i, s, a) : r(o, i, s, a))
    : Yn(e, l + 4);
}
function Qv(e, t, n, r, o, i) {
  let s = t + n,
    a = !1;
  for (let c = 0; c < o.length; c++) Q(e, s++, o[c]) && (a = !0);
  return a ? Oe(e, s, r.apply(i, o)) : Yn(e, s);
}
function Zv(e, t) {
  let n = O(),
    r,
    o = e + k;
  n.firstCreatePass
    ? ((r = Yv(t, n.pipeRegistry)),
      (n.data[o] = r),
      r.onDestroy && (n.destroyHooks ??= []).push(o, r.onDestroy))
    : (r = n.data[o]);
  let i = r.factory || (r.factory = je(r.type, !0)),
    s,
    a = Z(zn);
  try {
    let c = fo(!1),
      l = i();
    return (fo(c), Wi(n, g(), o, l), l);
  } finally {
    Z(a);
  }
}
function Yv(e, t) {
  if (t)
    for (let n = t.length - 1; n >= 0; n--) {
      let r = t[n];
      if (e === r.name) return r;
    }
}
function Kv(e, t, n) {
  let r = e + k,
    o = g(),
    i = Gi(o, r);
  return Jv(o, r) ? _f(o, ge(), t, i.transform, n, i) : i.transform(n);
}
function Jv(e, t) {
  return e[m].data[t].pure;
}
function Xv(e, t) {
  return Lo(e, t);
}
var Mo = class {
    ngModuleFactory;
    componentFactories;
    constructor(t, n) {
      ((this.ngModuleFactory = t), (this.componentFactories = n));
    }
  },
  eE = (() => {
    class e {
      compileModuleSync(n) {
        return new wo(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let r = this.compileModuleSync(n),
          o = ki(n),
          i = Lu(o.declarations).reduce((s, a) => {
            let c = $e(a);
            return (c && s.push(new Yt(c)), s);
          }, []);
        return new Mo(r, i);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = B({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
var tE = (() => {
  class e {
    zone = D(te);
    changeDetectionScheduler = D(Ee);
    applicationRef = D(Qn);
    applicationErrorHandler = D(Re);
    _onMicrotaskEmptySubscription;
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.changeDetectionScheduler.runningTick ||
                this.zone.run(() => {
                  try {
                    ((this.applicationRef.dirtyFlags |= 1),
                      this.applicationRef._tick());
                  } catch (n) {
                    this.applicationErrorHandler(n);
                  }
                });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = B({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
function Tf({
  ngZoneFactory: e,
  ignoreChangesOutsideZone: t,
  scheduleInRootZone: n,
}) {
  return (
    (e ??= () => new te(G(q({}, bf()), { scheduleInRootZone: n }))),
    [
      { provide: te, useFactory: e },
      {
        provide: Be,
        multi: !0,
        useFactory: () => {
          let r = D(tE, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: Be,
        multi: !0,
        useFactory: () => {
          let r = D(nE);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: gs, useValue: !0 } : [],
      { provide: no, useValue: n ?? Fd },
      {
        provide: Re,
        useFactory: () => {
          let r = D(te),
            o = D(oe),
            i;
          return (s) => {
            r.runOutsideAngular(() => {
              o.destroyed && !i
                ? setTimeout(() => {
                    throw s;
                  })
                : ((i ??= o.get(He)), i.handleError(s));
            });
          };
        },
      },
    ]
  );
}
function bf(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var nE = (() => {
  class e {
    subscription = new H();
    initialized = !1;
    zone = D(te);
    pendingTasks = D(gt);
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      (!this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              (te.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                }));
            }),
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            (te.assertInAngularZone(), (n ??= this.pendingTasks.add()));
          }),
        ));
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = B({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
var $a = (() => {
  class e {
    applicationErrorHandler = D(Re);
    appRef = D(Qn);
    taskService = D(gt);
    ngZone = D(te);
    zonelessEnabled = D(Nn);
    tracing = D(Ma, { optional: !0 });
    disableScheduling = D(gs, { optional: !0 }) ?? !1;
    zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new H();
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(_o) : null;
    scheduleInRootZone =
      !this.zonelessEnabled &&
      this.zoneIsDefined &&
      (D(no, { optional: !0 }) ?? !1);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = !1;
    runningTick = !1;
    pendingRenderTaskId = null;
    constructor() {
      (this.subscriptions.add(
        this.appRef.afterTick.subscribe(() => {
          this.runningTick || this.cleanup();
        }),
      ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled &&
          (this.ngZone instanceof Vn || !this.zoneIsDefined)));
    }
    notify(n) {
      if (!this.zonelessEnabled && n === 5) return;
      let r = !1;
      switch (n) {
        case 0: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 3:
        case 2:
        case 4:
        case 5:
        case 1: {
          this.appRef.dirtyFlags |= 4;
          break;
        }
        case 6: {
          ((this.appRef.dirtyFlags |= 2), (r = !0));
          break;
        }
        case 12: {
          ((this.appRef.dirtyFlags |= 16), (r = !0));
          break;
        }
        case 13: {
          ((this.appRef.dirtyFlags |= 2), (r = !0));
          break;
        }
        case 11: {
          r = !0;
          break;
        }
        case 9:
        case 8:
        case 7:
        case 10:
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (
        ((this.appRef.tracingSnapshot =
          this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null),
        !this.shouldScheduleTick(r))
      )
        return;
      let o = this.useMicrotaskScheduler ? Jl : jd;
      ((this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() =>
              o(() => this.tick()),
            ))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              o(() => this.tick()),
            )));
    }
    shouldScheduleTick(n) {
      return !(
        (this.disableScheduling && !n) ||
        this.appRef.destroyed ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled &&
          this.zoneIsDefined &&
          Zone.current.get(_o + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
      }
      !this.zonelessEnabled &&
        this.appRef.dirtyFlags & 7 &&
        (this.appRef.dirtyFlags |= 1);
      let n = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            ((this.runningTick = !0), this.appRef._tick());
          },
          void 0,
          this.schedulerTickApplyArgs,
        );
      } catch (r) {
        (this.taskService.remove(n), this.applicationErrorHandler(r));
      } finally {
        this.cleanup();
      }
      ((this.useMicrotaskScheduler = !0),
        Jl(() => {
          ((this.useMicrotaskScheduler = !1), this.taskService.remove(n));
        }));
    }
    ngOnDestroy() {
      (this.subscriptions.unsubscribe(), this.cleanup());
    }
    cleanup() {
      if (
        ((this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let n = this.pendingRenderTaskId;
        ((this.pendingRenderTaskId = null), this.taskService.remove(n));
      }
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = B({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
function rE() {
  return (
    It("NgZoneless"),
    Pt([
      { provide: Ee, useExisting: $a },
      { provide: te, useClass: Vn },
      { provide: Nn, useValue: !0 },
      { provide: no, useValue: !1 },
      [],
    ])
  );
}
function oE() {
  return (typeof $localize < "u" && $localize.locale) || Zn;
}
var Ua = new M("", {
  providedIn: "root",
  factory: () => D(Ua, { optional: !0, skipSelf: !0 }) || oE(),
});
function iE(e) {
  return kc(e);
}
function sE(e, t) {
  return cr(e, t?.equal);
}
var qa = class {
  [z];
  constructor(t) {
    this[z] = t;
  }
  destroy() {
    this[z].destroy();
  }
};
function aE(e, t) {
  let n = t?.injector ?? D(be),
    r = t?.manualCleanup !== !0 ? n.get(ht) : null,
    o,
    i = n.get(Mn, null, { optional: !0 }),
    s = n.get(Ee);
  return (
    i !== null
      ? ((o = uE(i.view, s, e)),
        r instanceof gn && r._lView === i.view && (r = null))
      : (o = dE(e, n.get(Sn), s)),
    (o.injector = n),
    r !== null && (o.onDestroyFn = r.onDestroy(() => o.destroy())),
    new qa(o)
  );
}
var Nf = G(q({}, Pc), {
    cleanupFns: void 0,
    zone: null,
    onDestroyFn: mt,
    run() {
      let e = Bt(!1);
      try {
        Lc(this);
      } finally {
        Bt(e);
      }
    },
    cleanup() {
      if (!this.cleanupFns?.length) return;
      let e = y(null);
      try {
        for (; this.cleanupFns.length; ) this.cleanupFns.pop()();
      } finally {
        ((this.cleanupFns = []), y(e));
      }
    },
  }),
  cE = G(q({}, Nf), {
    consumerMarkedDirty() {
      (this.scheduler.schedule(this), this.notifier.notify(12));
    },
    destroy() {
      (Ze(this),
        this.onDestroyFn(),
        this.cleanup(),
        this.scheduler.remove(this));
    },
  }),
  lE = G(q({}, Nf), {
    consumerMarkedDirty() {
      ((this.view[v] |= 8192), pt(this.view), this.notifier.notify(13));
    },
    destroy() {
      (Ze(this),
        this.onDestroyFn(),
        this.cleanup(),
        this.view[Me]?.delete(this));
    },
  });
function uE(e, t, n) {
  let r = Object.create(lE);
  return (
    (r.view = e),
    (r.zone = typeof Zone < "u" ? Zone.current : null),
    (r.notifier = t),
    (r.fn = Mf(r, n)),
    (e[Me] ??= new Set()),
    e[Me].add(r),
    r.consumerMarkedDirty(r),
    r
  );
}
function dE(e, t, n) {
  let r = Object.create(cE);
  return (
    (r.fn = Mf(r, e)),
    (r.scheduler = t),
    (r.notifier = n),
    (r.zone = typeof Zone < "u" ? Zone.current : null),
    r.scheduler.add(r),
    r.notifier.notify(12),
    r
  );
}
function Mf(e, t) {
  return () => {
    t((n) => (e.cleanupFns ??= []).push(n));
  };
}
var Of = Symbol("InputSignalNode#UNSET"),
  pE = G(q({}, lr), {
    transformFn: void 0,
    applyValueToInputSignal(e, t) {
      bt(e, t);
    },
  });
function kf(e, t) {
  let n = Object.create(pE);
  ((n.value = e), (n.transformFn = t?.transform));
  function r() {
    if ((Ct(n), n.value === Of)) {
      let o = null;
      throw new _(-950, o);
    }
    return n.value;
  }
  return ((r[z] = n), r);
}
var hE = new M("");
hE.__NG_ELEMENT_ID__ = (e) => {
  let t = U();
  if (t === null) throw new _(204, !1);
  if (t.type & 2) return t.value;
  if (e & 8) return null;
  throw new _(204, !1);
};
function Sf(e, t) {
  return kf(e, t);
}
function gE(e) {
  return kf(Of, e);
}
var dO = ((Sf.required = gE), Sf);
var Ga = new M(""),
  mE = new M("");
function Kn(e) {
  return !e.moduleRef;
}
function yE(e) {
  let t = Kn(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(te);
  return n.run(() => {
    Kn(e)
      ? e.r3Injector.resolveInjectorInitializers()
      : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(Re),
      o;
    if (
      (n.runOutsideAngular(() => {
        o = n.onError.subscribe({ next: r });
      }),
      Kn(e))
    ) {
      let i = () => t.destroy(),
        s = e.platformInjector.get(Ga);
      (s.add(i),
        t.onDestroy(() => {
          (o.unsubscribe(), s.delete(i));
        }));
    } else {
      let i = () => e.moduleRef.destroy(),
        s = e.platformInjector.get(Ga);
      (s.add(i),
        e.moduleRef.onDestroy(() => {
          (Rn(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i));
        }));
    }
    return EE(r, n, () => {
      let i = t.get(gt),
        s = i.add(),
        a = t.get(Oa);
      return (
        a.runInitializers(),
        a.donePromise
          .then(() => {
            let c = t.get(Ua, Zn);
            if ((ef(c || Zn), !t.get(mE, !0)))
              return Kn(e)
                ? t.get(Qn)
                : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
            if (Kn(e)) {
              let u = t.get(Qn);
              return (
                e.rootComponent !== void 0 && u.bootstrap(e.rootComponent),
                u
              );
            } else
              return (vE?.(e.moduleRef, e.allPlatformModules), e.moduleRef);
          })
          .finally(() => void i.remove(s))
      );
    });
  });
}
var vE;
function EE(e, t, n) {
  try {
    let r = n();
    return Ra(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e(r)), r);
  }
}
var $o = null;
function IE(e = [], t) {
  return be.create({
    name: t,
    providers: [
      { provide: Fi, useValue: "platform" },
      { provide: Ga, useValue: new Set([() => ($o = null)]) },
      ...e,
    ],
  });
}
function DE(e = []) {
  if ($o) return $o;
  let t = IE(e);
  return (($o = t), qd(), CE(t), t);
}
function CE(e) {
  let t = e.get(Su, null);
  qr(e, () => {
    t?.forEach((n) => n());
  });
}
var fO = (() => {
  class e {
    static __NG_ELEMENT_ID__ = wE;
  }
  return e;
})();
function wE(e) {
  return _E(U(), g(), (e & 16) === 16);
}
function _E(e, t, n) {
  if (Se(e) && !n) {
    let r = ce(e.index, t);
    return new We(r, r);
  } else if (e.type & 175) {
    let r = t[J];
    return new We(r, t);
  }
  return null;
}
var Wa = class {
    constructor() {}
    supports(t) {
      return Ta(t);
    }
    create(t) {
      return new za(t);
    }
  },
  TE = (e, t) => t,
  za = class {
    length = 0;
    collection;
    _linkedRecords = null;
    _unlinkedRecords = null;
    _previousItHead = null;
    _itHead = null;
    _itTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _movesHead = null;
    _movesTail = null;
    _removalsHead = null;
    _removalsTail = null;
    _identityChangesHead = null;
    _identityChangesTail = null;
    _trackByFn;
    constructor(t) {
      this._trackByFn = t || TE;
    }
    forEachItem(t) {
      let n;
      for (n = this._itHead; n !== null; n = n._next) t(n);
    }
    forEachOperation(t) {
      let n = this._itHead,
        r = this._removalsHead,
        o = 0,
        i = null;
      for (; n || r; ) {
        let s = !r || (n && n.currentIndex < xf(r, o, i)) ? n : r,
          a = xf(s, o, i),
          c = s.currentIndex;
        if (s === r) (o--, (r = r._nextRemoved));
        else if (((n = n._next), s.previousIndex == null)) o++;
        else {
          i || (i = []);
          let l = a - o,
            u = c - o;
          if (l != u) {
            for (let p = 0; p < l; p++) {
              let f = p < i.length ? i[p] : (i[p] = 0),
                h = f + p;
              u <= h && h < l && (i[p] = f + 1);
            }
            let d = s.previousIndex;
            i[d] = u - l;
          }
        }
        a !== c && t(s, a, c);
      }
    }
    forEachPreviousItem(t) {
      let n;
      for (n = this._previousItHead; n !== null; n = n._nextPrevious) t(n);
    }
    forEachAddedItem(t) {
      let n;
      for (n = this._additionsHead; n !== null; n = n._nextAdded) t(n);
    }
    forEachMovedItem(t) {
      let n;
      for (n = this._movesHead; n !== null; n = n._nextMoved) t(n);
    }
    forEachRemovedItem(t) {
      let n;
      for (n = this._removalsHead; n !== null; n = n._nextRemoved) t(n);
    }
    forEachIdentityChange(t) {
      let n;
      for (n = this._identityChangesHead; n !== null; n = n._nextIdentityChange)
        t(n);
    }
    diff(t) {
      if ((t == null && (t = []), !Ta(t))) throw new _(900, !1);
      return this.check(t) ? this : null;
    }
    onDestroy() {}
    check(t) {
      this._reset();
      let n = this._itHead,
        r = !1,
        o,
        i,
        s;
      if (Array.isArray(t)) {
        this.length = t.length;
        for (let a = 0; a < this.length; a++)
          ((i = t[a]),
            (s = this._trackByFn(a, i)),
            n === null || !Object.is(n.trackById, s)
              ? ((n = this._mismatch(n, i, s, a)), (r = !0))
              : (r && (n = this._verifyReinsertion(n, i, s, a)),
                Object.is(n.item, i) || this._addIdentityChange(n, i)),
            (n = n._next));
      } else
        ((o = 0),
          Id(t, (a) => {
            ((s = this._trackByFn(o, a)),
              n === null || !Object.is(n.trackById, s)
                ? ((n = this._mismatch(n, a, s, o)), (r = !0))
                : (r && (n = this._verifyReinsertion(n, a, s, o)),
                  Object.is(n.item, a) || this._addIdentityChange(n, a)),
              (n = n._next),
              o++);
          }),
          (this.length = o));
      return (this._truncate(n), (this.collection = t), this.isDirty);
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let t;
        for (t = this._previousItHead = this._itHead; t !== null; t = t._next)
          t._nextPrevious = t._next;
        for (t = this._additionsHead; t !== null; t = t._nextAdded)
          t.previousIndex = t.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, t = this._movesHead;
          t !== null;
          t = t._nextMoved
        )
          t.previousIndex = t.currentIndex;
        ((this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null));
      }
    }
    _mismatch(t, n, r, o) {
      let i;
      return (
        t === null ? (i = this._itTail) : ((i = t._prev), this._remove(t)),
        (t =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(r, null)),
        t !== null
          ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
            this._reinsertAfter(t, i, o))
          : ((t =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(r, o)),
            t !== null
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._moveAfter(t, i, o))
              : (t = this._addAfter(new Qa(n, r), i, o))),
        t
      );
    }
    _verifyReinsertion(t, n, r, o) {
      let i =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(r, null);
      return (
        i !== null
          ? (t = this._reinsertAfter(i, t._prev, o))
          : t.currentIndex != o &&
            ((t.currentIndex = o), this._addToMoves(t, o)),
        t
      );
    }
    _truncate(t) {
      for (; t !== null; ) {
        let n = t._next;
        (this._addToRemovals(this._unlink(t)), (t = n));
      }
      (this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null));
    }
    _reinsertAfter(t, n, r) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(t);
      let o = t._prevRemoved,
        i = t._nextRemoved;
      return (
        o === null ? (this._removalsHead = i) : (o._nextRemoved = i),
        i === null ? (this._removalsTail = o) : (i._prevRemoved = o),
        this._insertAfter(t, n, r),
        this._addToMoves(t, r),
        t
      );
    }
    _moveAfter(t, n, r) {
      return (
        this._unlink(t),
        this._insertAfter(t, n, r),
        this._addToMoves(t, r),
        t
      );
    }
    _addAfter(t, n, r) {
      return (
        this._insertAfter(t, n, r),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = t)
          : (this._additionsTail = this._additionsTail._nextAdded = t),
        t
      );
    }
    _insertAfter(t, n, r) {
      let o = n === null ? this._itHead : n._next;
      return (
        (t._next = o),
        (t._prev = n),
        o === null ? (this._itTail = t) : (o._prev = t),
        n === null ? (this._itHead = t) : (n._next = t),
        this._linkedRecords === null && (this._linkedRecords = new Uo()),
        this._linkedRecords.put(t),
        (t.currentIndex = r),
        t
      );
    }
    _remove(t) {
      return this._addToRemovals(this._unlink(t));
    }
    _unlink(t) {
      this._linkedRecords !== null && this._linkedRecords.remove(t);
      let n = t._prev,
        r = t._next;
      return (
        n === null ? (this._itHead = r) : (n._next = r),
        r === null ? (this._itTail = n) : (r._prev = n),
        t
      );
    }
    _addToMoves(t, n) {
      return (
        t.previousIndex === n ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = t)
            : (this._movesTail = this._movesTail._nextMoved = t)),
        t
      );
    }
    _addToRemovals(t) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new Uo()),
        this._unlinkedRecords.put(t),
        (t.currentIndex = null),
        (t._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = t),
            (t._prevRemoved = null))
          : ((t._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = t)),
        t
      );
    }
    _addIdentityChange(t, n) {
      return (
        (t.item = n),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = t)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                t),
        t
      );
    }
  },
  Qa = class {
    item;
    trackById;
    currentIndex = null;
    previousIndex = null;
    _nextPrevious = null;
    _prev = null;
    _next = null;
    _prevDup = null;
    _nextDup = null;
    _prevRemoved = null;
    _nextRemoved = null;
    _nextAdded = null;
    _nextMoved = null;
    _nextIdentityChange = null;
    constructor(t, n) {
      ((this.item = t), (this.trackById = n));
    }
  },
  Za = class {
    _head = null;
    _tail = null;
    add(t) {
      this._head === null
        ? ((this._head = this._tail = t),
          (t._nextDup = null),
          (t._prevDup = null))
        : ((this._tail._nextDup = t),
          (t._prevDup = this._tail),
          (t._nextDup = null),
          (this._tail = t));
    }
    get(t, n) {
      let r;
      for (r = this._head; r !== null; r = r._nextDup)
        if ((n === null || n <= r.currentIndex) && Object.is(r.trackById, t))
          return r;
      return null;
    }
    remove(t) {
      let n = t._prevDup,
        r = t._nextDup;
      return (
        n === null ? (this._head = r) : (n._nextDup = r),
        r === null ? (this._tail = n) : (r._prevDup = n),
        this._head === null
      );
    }
  },
  Uo = class {
    map = new Map();
    put(t) {
      let n = t.trackById,
        r = this.map.get(n);
      (r || ((r = new Za()), this.map.set(n, r)), r.add(t));
    }
    get(t, n) {
      let r = t,
        o = this.map.get(r);
      return o ? o.get(t, n) : null;
    }
    remove(t) {
      let n = t.trackById;
      return (this.map.get(n).remove(t) && this.map.delete(n), t);
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function xf(e, t, n) {
  let r = e.previousIndex;
  if (r === null) return r;
  let o = 0;
  return (n && r < n.length && (o = n[r]), r + t + o);
}
var Ya = class {
    constructor() {}
    supports(t) {
      return t instanceof Map || jo(t);
    }
    create() {
      return new Ka();
    }
  },
  Ka = class {
    _records = new Map();
    _mapHead = null;
    _appendAfter = null;
    _previousMapHead = null;
    _changesHead = null;
    _changesTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _removalsHead = null;
    _removalsTail = null;
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._changesHead !== null ||
        this._removalsHead !== null
      );
    }
    forEachItem(t) {
      let n;
      for (n = this._mapHead; n !== null; n = n._next) t(n);
    }
    forEachPreviousItem(t) {
      let n;
      for (n = this._previousMapHead; n !== null; n = n._nextPrevious) t(n);
    }
    forEachChangedItem(t) {
      let n;
      for (n = this._changesHead; n !== null; n = n._nextChanged) t(n);
    }
    forEachAddedItem(t) {
      let n;
      for (n = this._additionsHead; n !== null; n = n._nextAdded) t(n);
    }
    forEachRemovedItem(t) {
      let n;
      for (n = this._removalsHead; n !== null; n = n._nextRemoved) t(n);
    }
    diff(t) {
      if (!t) t = new Map();
      else if (!(t instanceof Map || jo(t))) throw new _(900, !1);
      return this.check(t) ? this : null;
    }
    onDestroy() {}
    check(t) {
      this._reset();
      let n = this._mapHead;
      if (
        ((this._appendAfter = null),
        this._forEach(t, (r, o) => {
          if (n && n.key === o)
            (this._maybeAddToChanges(n, r),
              (this._appendAfter = n),
              (n = n._next));
          else {
            let i = this._getOrCreateRecordForKey(o, r);
            n = this._insertBeforeOrAppend(n, i);
          }
        }),
        n)
      ) {
        (n._prev && (n._prev._next = null), (this._removalsHead = n));
        for (let r = n; r !== null; r = r._nextRemoved)
          (r === this._mapHead && (this._mapHead = null),
            this._records.delete(r.key),
            (r._nextRemoved = r._next),
            (r.previousValue = r.currentValue),
            (r.currentValue = null),
            (r._prev = null),
            (r._next = null));
      }
      return (
        this._changesTail && (this._changesTail._nextChanged = null),
        this._additionsTail && (this._additionsTail._nextAdded = null),
        this.isDirty
      );
    }
    _insertBeforeOrAppend(t, n) {
      if (t) {
        let r = t._prev;
        return (
          (n._next = t),
          (n._prev = r),
          (t._prev = n),
          r && (r._next = n),
          t === this._mapHead && (this._mapHead = n),
          (this._appendAfter = t),
          t
        );
      }
      return (
        this._appendAfter
          ? ((this._appendAfter._next = n), (n._prev = this._appendAfter))
          : (this._mapHead = n),
        (this._appendAfter = n),
        null
      );
    }
    _getOrCreateRecordForKey(t, n) {
      if (this._records.has(t)) {
        let o = this._records.get(t);
        this._maybeAddToChanges(o, n);
        let i = o._prev,
          s = o._next;
        return (
          i && (i._next = s),
          s && (s._prev = i),
          (o._next = null),
          (o._prev = null),
          o
        );
      }
      let r = new Ja(t);
      return (
        this._records.set(t, r),
        (r.currentValue = n),
        this._addToAdditions(r),
        r
      );
    }
    _reset() {
      if (this.isDirty) {
        let t;
        for (
          this._previousMapHead = this._mapHead, t = this._previousMapHead;
          t !== null;
          t = t._next
        )
          t._nextPrevious = t._next;
        for (t = this._changesHead; t !== null; t = t._nextChanged)
          t.previousValue = t.currentValue;
        for (t = this._additionsHead; t != null; t = t._nextAdded)
          t.previousValue = t.currentValue;
        ((this._changesHead = this._changesTail = null),
          (this._additionsHead = this._additionsTail = null),
          (this._removalsHead = null));
      }
    }
    _maybeAddToChanges(t, n) {
      Object.is(n, t.currentValue) ||
        ((t.previousValue = t.currentValue),
        (t.currentValue = n),
        this._addToChanges(t));
    }
    _addToAdditions(t) {
      this._additionsHead === null
        ? (this._additionsHead = this._additionsTail = t)
        : ((this._additionsTail._nextAdded = t), (this._additionsTail = t));
    }
    _addToChanges(t) {
      this._changesHead === null
        ? (this._changesHead = this._changesTail = t)
        : ((this._changesTail._nextChanged = t), (this._changesTail = t));
    }
    _forEach(t, n) {
      t instanceof Map
        ? t.forEach(n)
        : Object.keys(t).forEach((r) => n(t[r], r));
    }
  },
  Ja = class {
    key;
    previousValue = null;
    currentValue = null;
    _nextPrevious = null;
    _next = null;
    _prev = null;
    _nextAdded = null;
    _nextRemoved = null;
    _nextChanged = null;
    constructor(t) {
      this.key = t;
    }
  };
function Rf() {
  return new bE([new Wa()]);
}
var bE = (() => {
  class e {
    factories;
    static ɵprov = B({ token: e, providedIn: "root", factory: Rf });
    constructor(n) {
      this.factories = n;
    }
    static create(n, r) {
      if (r != null) {
        let o = r.factories.slice();
        n = n.concat(o);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: () => {
          let r = D(e, { optional: !0, skipSelf: !0 });
          return e.create(n, r || Rf());
        },
      };
    }
    find(n) {
      let r = this.factories.find((o) => o.supports(n));
      if (r != null) return r;
      throw new _(901, !1);
    }
  }
  return e;
})();
function Af() {
  return new NE([new Ya()]);
}
var NE = (() => {
  class e {
    static ɵprov = B({ token: e, providedIn: "root", factory: Af });
    factories;
    constructor(n) {
      this.factories = n;
    }
    static create(n, r) {
      if (r) {
        let o = r.factories.slice();
        n = n.concat(o);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: () => {
          let r = D(e, { optional: !0, skipSelf: !0 });
          return e.create(n, r || Af());
        },
      };
    }
    find(n) {
      let r = this.factories.find((o) => o.supports(n));
      if (r) return r;
      throw new _(901, !1);
    }
  }
  return e;
})();
function pO(e) {
  let {
    rootComponent: t,
    appProviders: n,
    platformProviders: r,
    platformRef: o,
  } = e;
  A(8);
  try {
    let i = o?.injector ?? DE(r),
      s = [Tf({}), { provide: Ee, useExisting: $a }, xl, ...(n || [])],
      a = new Fn({
        providers: s,
        parent: i,
        debugName: "",
        runEnvironmentInitializers: !1,
      });
    return yE({
      r3Injector: a.injector,
      platformInjector: i,
      rootComponent: t,
    });
  } catch (i) {
    return Promise.reject(i);
  } finally {
    A(9);
  }
}
function hO(e) {
  return typeof e == "boolean" ? e : e != null && e !== "false";
}
function gO(e, t = NaN) {
  return !isNaN(parseFloat(e)) && !isNaN(Number(e)) ? Number(e) : t;
}
var ke = (function (e) {
    return (
      (e[(e.State = 0)] = "State"),
      (e[(e.Transition = 1)] = "Transition"),
      (e[(e.Sequence = 2)] = "Sequence"),
      (e[(e.Group = 3)] = "Group"),
      (e[(e.Animate = 4)] = "Animate"),
      (e[(e.Keyframes = 5)] = "Keyframes"),
      (e[(e.Style = 6)] = "Style"),
      (e[(e.Trigger = 7)] = "Trigger"),
      (e[(e.Reference = 8)] = "Reference"),
      (e[(e.AnimateChild = 9)] = "AnimateChild"),
      (e[(e.AnimateRef = 10)] = "AnimateRef"),
      (e[(e.Query = 11)] = "Query"),
      (e[(e.Stagger = 12)] = "Stagger"),
      e
    );
  })(ke || {}),
  DO = "*";
function CO(e, t) {
  return { type: ke.Trigger, name: e, definitions: t, options: {} };
}
function wO(e, t = null) {
  return { type: ke.Animate, styles: t, timings: e };
}
function _O(e, t = null) {
  return { type: ke.Sequence, steps: e, options: t };
}
function TO(e) {
  return { type: ke.Style, styles: e, offset: null };
}
function bO(e, t, n) {
  return { type: ke.State, name: e, styles: t, options: n };
}
function NO(e, t, n = null) {
  return { type: ke.Transition, expr: e, animation: t, options: n };
}
function MO(e, t = null) {
  return { type: ke.Reference, animation: e, options: t };
}
function SO(e, t = null) {
  return { type: ke.AnimateRef, animation: e, options: t };
}
var Pf = class {
    _onDoneFns = [];
    _onStartFns = [];
    _onDestroyFns = [];
    _originalOnDoneFns = [];
    _originalOnStartFns = [];
    _started = !1;
    _destroyed = !1;
    _finished = !1;
    _position = 0;
    parentPlayer = null;
    totalTime;
    constructor(t = 0, n = 0) {
      this.totalTime = t + n;
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((t) => t()),
        (this._onDoneFns = []));
    }
    onStart(t) {
      (this._originalOnStartFns.push(t), this._onStartFns.push(t));
    }
    onDone(t) {
      (this._originalOnDoneFns.push(t), this._onDoneFns.push(t));
    }
    onDestroy(t) {
      this._onDestroyFns.push(t);
    }
    hasStarted() {
      return this._started;
    }
    init() {}
    play() {
      (this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
        (this._started = !0));
    }
    triggerMicrotask() {
      queueMicrotask(() => this._onFinish());
    }
    _onStart() {
      (this._onStartFns.forEach((t) => t()), (this._onStartFns = []));
    }
    pause() {}
    restart() {}
    finish() {
      this._onFinish();
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this.hasStarted() || this._onStart(),
        this.finish(),
        this._onDestroyFns.forEach((t) => t()),
        (this._onDestroyFns = []));
    }
    reset() {
      ((this._started = !1),
        (this._finished = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns));
    }
    setPosition(t) {
      this._position = this.totalTime ? t * this.totalTime : 1;
    }
    getPosition() {
      return this.totalTime ? this._position / this.totalTime : 1;
    }
    triggerCallback(t) {
      let n = t == "start" ? this._onStartFns : this._onDoneFns;
      (n.forEach((r) => r()), (n.length = 0));
    }
  },
  Lf = class {
    _onDoneFns = [];
    _onStartFns = [];
    _finished = !1;
    _started = !1;
    _destroyed = !1;
    _onDestroyFns = [];
    parentPlayer = null;
    totalTime = 0;
    players;
    constructor(t) {
      this.players = t;
      let n = 0,
        r = 0,
        o = 0,
        i = this.players.length;
      (i == 0
        ? queueMicrotask(() => this._onFinish())
        : this.players.forEach((s) => {
            (s.onDone(() => {
              ++n == i && this._onFinish();
            }),
              s.onDestroy(() => {
                ++r == i && this._onDestroy();
              }),
              s.onStart(() => {
                ++o == i && this._onStart();
              }));
          }),
        (this.totalTime = this.players.reduce(
          (s, a) => Math.max(s, a.totalTime),
          0,
        )));
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((t) => t()),
        (this._onDoneFns = []));
    }
    init() {
      this.players.forEach((t) => t.init());
    }
    onStart(t) {
      this._onStartFns.push(t);
    }
    _onStart() {
      this.hasStarted() ||
        ((this._started = !0),
        this._onStartFns.forEach((t) => t()),
        (this._onStartFns = []));
    }
    onDone(t) {
      this._onDoneFns.push(t);
    }
    onDestroy(t) {
      this._onDestroyFns.push(t);
    }
    hasStarted() {
      return this._started;
    }
    play() {
      (this.parentPlayer || this.init(),
        this._onStart(),
        this.players.forEach((t) => t.play()));
    }
    pause() {
      this.players.forEach((t) => t.pause());
    }
    restart() {
      this.players.forEach((t) => t.restart());
    }
    finish() {
      (this._onFinish(), this.players.forEach((t) => t.finish()));
    }
    destroy() {
      this._onDestroy();
    }
    _onDestroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._onFinish(),
        this.players.forEach((t) => t.destroy()),
        this._onDestroyFns.forEach((t) => t()),
        (this._onDestroyFns = []));
    }
    reset() {
      (this.players.forEach((t) => t.reset()),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1));
    }
    setPosition(t) {
      let n = t * this.totalTime;
      this.players.forEach((r) => {
        let o = r.totalTime ? Math.min(1, n / r.totalTime) : 1;
        r.setPosition(o);
      });
    }
    getPosition() {
      let t = this.players.reduce(
        (n, r) => (n === null || r.totalTime > n.totalTime ? r : n),
        null,
      );
      return t != null ? t.getPosition() : 0;
    }
    beforeDestroy() {
      this.players.forEach((t) => {
        t.beforeDestroy && t.beforeDestroy();
      });
    }
    triggerCallback(t) {
      let n = t == "start" ? this._onStartFns : this._onDoneFns;
      (n.forEach((r) => r()), (n.length = 0));
    }
  },
  xO = "!";
export {
  q as a,
  G as b,
  ME as c,
  H as d,
  Yf as e,
  N as f,
  si as g,
  ai as h,
  Pe as i,
  an as j,
  cn as k,
  Fe as l,
  sp as m,
  ap as n,
  cp as o,
  Xe as p,
  et as q,
  mp as r,
  tt as s,
  Rr as t,
  vp as u,
  Ep as v,
  ln as w,
  Ac as x,
  Ip as y,
  un as z,
  ci as A,
  Cp as B,
  wp as C,
  li as D,
  _p as E,
  Tp as F,
  bp as G,
  Np as H,
  Mp as I,
  Sp as J,
  _ as K,
  jr as L,
  B as M,
  Bc as N,
  Ap as O,
  M as P,
  ve as Q,
  D as R,
  Pt as S,
  Fi as T,
  oe as U,
  qr as V,
  dl as W,
  fl as X,
  Tl as Y,
  Ml as Z,
  be as _,
  Sl as $,
  ht as aa,
  He as ba,
  Re as ca,
  oh as da,
  fs as ea,
  Ee as fa,
  gt as ga,
  gh as ha,
  Oh as ia,
  $n as ja,
  Bh as ka,
  $h as la,
  Su as ma,
  qh as na,
  Gh as oa,
  Wh as pa,
  zt as qa,
  Cg as ra,
  mo as sa,
  Pn as ta,
  Ln as ua,
  mm as va,
  zn as wa,
  vm as xa,
  Bo as ya,
  It as za,
  Sd as Aa,
  xd as Ba,
  ry as Ca,
  iy as Da,
  cy as Ea,
  ly as Fa,
  Od as Ga,
  yy as Ha,
  Ld as Ia,
  Ma as Ja,
  Ae as Ka,
  te as La,
  Sy as Ma,
  Ra as Na,
  xy as Oa,
  Ud as Pa,
  Qn as Qa,
  Wd as Ra,
  zd as Sa,
  Oy as Ta,
  ky as Ua,
  Fy as Va,
  jy as Wa,
  Vy as Xa,
  Hy as Ya,
  Qd as Za,
  Pa as _a,
  La as $a,
  Zd as ab,
  Fa as bb,
  ja as cb,
  Yd as db,
  Va as eb,
  Ha as fb,
  Jd as gb,
  qy as hb,
  Xd as ib,
  tf as jb,
  Wy as kb,
  Qy as lb,
  Zy as mb,
  Ky as nb,
  Jy as ob,
  Xy as pb,
  ev as qb,
  tv as rb,
  cf as sb,
  lf as tb,
  hv as ub,
  mv as vb,
  bv as wb,
  vf as xb,
  Ba as yb,
  Ef as zb,
  Df as Ab,
  Sv as Bb,
  Cf as Cb,
  xv as Db,
  Pv as Eb,
  Lv as Fb,
  Fv as Gb,
  jv as Hb,
  Vv as Ib,
  Hv as Jb,
  Bv as Kb,
  $v as Lb,
  Uv as Mb,
  qv as Nb,
  Zv as Ob,
  Kv as Pb,
  Xv as Qb,
  eE as Rb,
  rE as Sb,
  iE as Tb,
  sE as Ub,
  aE as Vb,
  dO as Wb,
  fO as Xb,
  bE as Yb,
  NE as Zb,
  pO as _b,
  hO as $b,
  gO as ac,
  ke as bc,
  DO as cc,
  CO as dc,
  wO as ec,
  _O as fc,
  TO as gc,
  bO as hc,
  NO as ic,
  MO as jc,
  SO as kc,
  Pf as lc,
  Lf as mc,
  xO as nc,
};
